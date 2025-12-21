<?php
namespace Salnama_Theme\Inc\Core\Catalog;

class CatalogRender {

    /**
     * خروجی HTML بلوک
     */
    public function render( $attributes ) {
        // بررسی نصب بودن ووکامرس
        if ( ! class_exists( 'WooCommerce' ) ) {
            return '<div class="salnama-alert" style="text-align:center; padding:20px;">لطفاً افزونه ووکامرس را نصب کنید.</div>';
        }

        // دریافت تنظیمات
        $limit = isset( $attributes['limit'] ) ? intval( $attributes['limit'] ) : -1;
        $args = [ 'status' => 'publish', 'limit' => $limit ];
        $products = wc_get_products( $args );

        if ( empty( $products ) ) {
            return '<div class="salnama-alert" style="text-align:center; padding:20px;">هیچ محصولی یافت نشد.</div>';
        }

        // --- تنظیمات تصاویر جلد (اینجا را ویرایش کنید) ---
        // فرض بر این است که تصاویر را در پوشه assets/images/catalog/ قالب آپلود می‌کنید
        $front_cover_url = get_template_directory_uri() . '/assets/images/catalog/front-cover.jpg';
        $back_cover_url  = get_template_directory_uri() . '/assets/images/catalog/back-cover.jpg';
        
        // اگر هنوز تصویری آپلود نکرده‌اید، می‌توانید موقتا از تصاویر پیش‌فرض استفاده کنید (اختیاری)
        // $front_cover_url = 'https://placehold.co/1000x1400/00AEEF/ffffff?text=Front+Cover';
        // $back_cover_url  = 'https://placehold.co/1000x1400/003366/ffffff?text=Back+Cover';

        // محاسبات صفحه بندی
        $total_pages_so_far = count($products) + 2;
        $needs_filler = ($total_pages_so_far % 2 !== 0);

        ob_start();
        ?>
        
        <a href="<?php echo home_url(); ?>" class="salnama-exit-btn" title="بازگشت به خانه">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        </a>

        <div class="salnama-flipbook-container" id="salnama-flipbook">
            
            <div class="page page-cover page-cover-top" data-density="hard">
                <div class="page-content page-cover-full">
                    <img src="<?php echo esc_url( $front_cover_url ); ?>" alt="کاتالوگ محصولات سالنمای نو" class="cover-full-img">
                </div>
            </div>

            <?php foreach ( $products as $product ) : 
                $image_url = wp_get_attachment_image_url( $product->get_image_id(), 'large' );
                if ( ! $image_url ) $image_url = wc_placeholder_img_src();
            ?>
                <div class="page page-product">
                    <div class="page-content">
                        
                        <div class="product-image-wrapper">
                            <img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $product->get_name() ); ?>" loading="lazy">
                        </div>

                        <div class="product-info">
                            <div class="product-details-group">
                                <h3 class="product-title"><?php echo esc_html( $product->get_name() ); ?></h3>
                                <div class="product-price">
                                    <?php echo $product->get_price_html(); ?>
                                </div>
                            </div>
                            
                            <a href="<?php echo get_permalink( $product->get_id() ); ?>" class="btn-view-product">
                                مشاهده
                            </a>
                        </div>

                        <div class="page-footer">
                            <span class="page-number"></span>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>

            <?php if ( $needs_filler ) : ?>
                <div class="page page-empty">
                    <div class="page-content"></div>
                </div>
            <?php endif; ?>

            <div class="page page-cover page-cover-bottom" data-density="hard">
                <div class="page-content page-cover-full">
                     <img src="<?php echo esc_url( $back_cover_url ); ?>" alt="سالنمای نو" class="cover-full-img">
                </div>
            </div>

        </div>
        
        <div class="salnama-book-controls">
            <button type="button" id="prev-page-btn" class="book-control-btn prev" aria-label="صفحه قبل">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <button type="button" id="next-page-btn" class="book-control-btn next" aria-label="صفحه بعد">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
        </div>

        <?php
        return ob_get_clean();
    }
}