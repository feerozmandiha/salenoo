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
            $css_uri = get_template_directory_uri() . '/assets/css/catalog/style.css';
            $js_lib  = get_template_directory_uri() . '/assets/js/catalog/page-flip.browser.js';
            $js_app  = get_template_directory_uri() . '/assets/js/catalog/script.js';
            
            // آدرس فایل صدا
            $sound_uri = get_template_directory_uri() . '/assets/sounds/page-flip.mp3';

            global $post;
            // بررسی وجود شورت‌کد یا صفحه کاتالوگ
            if ( ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'salnama_catalog' ) ) || is_page('catalog') ) {
                
                wp_enqueue_style( 'salnama-catalog-style', $css_uri, [], '1.0.2' );
                wp_enqueue_script( 'page-flip-lib', $js_lib, [], '2.0.0', true );
                wp_enqueue_script( 'salnama-catalog-app', $js_app, ['page-flip-lib'], '1.0.2', true );

                // ارسال تنظیمات و آدرس صدا به JS
                wp_localize_script( 'salnama-catalog-app', 'SalnamaCatalogConfig', [
                    'root_url'  => get_template_directory_uri(),
                    'sound_url' => $sound_uri, // ✅ آدرس صدا ارسال شد
                ]);
            }
    }
}