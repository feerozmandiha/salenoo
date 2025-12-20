<?php
namespace Salnama_Theme\Inc\Core\Catalog;

class CatalogRender {

    /**
     * خروجی HTML بلوک
     * * @param array $attributes ویژگی‌های بلوک
     * @return string خروجی HTML
     */
    public function render( $attributes ) {
        if ( ! class_exists( 'WooCommerce' ) ) {
            return '<div class="salnama-alert">لطفاً ووکامرس را نصب کنید.</div>';
        }

        $limit = isset( $attributes['limit'] ) ? $attributes['limit'] : 10;
        
        // کوئری محصولات
        $args = [
            'status' => 'publish',
            'limit'  => $limit,
            // 'featured' => true, // اگر فقط محصولات ویژه را می‌خواهید
        ];
        
        $products = wc_get_products( $args );

        if ( empty( $products ) ) {
            return '<div class="salnama-alert">محصولی یافت نشد.</div>';
        }

        ob_start();
        ?>
        <div class="salnama-flipbook-container" id="salnama-flipbook">
            
            <div class="page page-cover page-cover-top" data-density="hard">
                <div class="page-content">
                    <h2 class="cover-title">کاتالوگ محصولات سالنمای نو</h2>
                    <p class="cover-subtitle">کلکسیون ۱۴۰۴</p>
                </div>
            </div>

            <?php foreach ( $products as $product ) : 
                $image_url = wp_get_attachment_image_url( $product->get_image_id(), 'large' );
                if ( ! $image_url ) {
                    $image_url = wc_placeholder_img_src();
                }
            ?>
                <div class="page page-product">
                    <div class="page-content">
                        <div class="product-image-wrapper">
                            <img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $product->get_name() ); ?>" loading="lazy">
                        </div>
                        <div class="product-info">
                            <h3 class="product-title has-text-primary-color"><?php echo esc_html( $product->get_name() ); ?></h3>
                            <div class="product-price has-brand-blue-color">
                                <?php echo $product->get_price_html(); ?>
                            </div>
                            <a href="<?php echo get_permalink( $product->get_id() ); ?>" class="btn-view-product has-brand-teal-background-color">
                                مشاهده جزئیات
                            </a>
                        </div>
                        <div class="page-footer">
                            <span class="page-number"></span>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>

            <div class="page page-cover page-cover-bottom" data-density="hard">
                <div class="page-content">
                    <div class="brand-info">
                        <h3>سالنمای نو</h3>
                        <p>www.salenoo.ir</p>
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
        </div>

        <?php
        return ob_get_clean();
    }
}