<?php
namespace Salnama_Theme\Inc\Core\Catalog;

class CatalogManager {

    public function run() {
        // ثبت شورت‌کد (روش مطمئن برای نمایش)
        add_shortcode( 'salnama_catalog', [ $this, 'render_shortcode' ] );
        
        // ثبت بلوک (اختیاری برای آینده)
        add_action( 'init', [ $this, 'register_catalog_block' ] );
        
        // فراخوانی استایل و اسکریپت
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
    }

    public function register_catalog_block() {
        register_block_type( 'salnama/product-catalog', [
            'api_version'     => 3,
            'render_callback' => [ new CatalogRender(), 'render' ],
        ]);
    }

    /**
     * متد مخصوص اجرای شورت‌کد
     */
    public function render_shortcode( $atts ) {
        $attributes = shortcode_atts( [
            'limit' => -1,
        ], $atts );

        $render = new CatalogRender();
        return $render->render( $attributes );
    }

    public function enqueue_assets() {
            // مسیرها را بررسی کنید
            $css_uri = get_template_directory_uri() . '/assets/css/catalog/style.css';
            
            // نکته مهم: اگر فایل را دستی کپی کردید، مطمئن شوید اسمش دقیقا همین است
            $js_lib  = get_template_directory_uri() . '/assets/js/catalog/page-flip.browser.js';
            $js_app  = get_template_directory_uri() . '/assets/js/catalog/script.js';

            // فقط در جایی که شورت‌کد هست لود شود
            global $post;
            if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'salnama_catalog' ) ) {
                
                wp_enqueue_style( 'salnama-catalog-style', $css_uri, [], '1.0.1' );

                // لود کتابخانه
                wp_enqueue_script( 'page-flip-lib', $js_lib, [], '2.0.0', true );

                // لود اسکریپت خودمان (وابسته به page-flip-lib)
                wp_enqueue_script( 'salnama-catalog-app', $js_app, ['page-flip-lib'], '1.0.1', true );
            }
    }
}