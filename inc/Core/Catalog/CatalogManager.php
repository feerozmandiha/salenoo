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
            'limit' => 12,
        ], $atts );

        $render = new CatalogRender();
        return $render->render( $attributes );
    }

    public function enqueue_assets() {
        // بررسی دقیق مسیرها برای رفع خطای JS
        $css_uri = get_template_directory_uri() . '/assets/css/catalog/style.css';
        $js_lib  = get_template_directory_uri() . '/assets/js/catalog/page-flip.browser.js';
        $js_app  = get_template_directory_uri() . '/assets/js/catalog/script.js';

        // همیشه لود شود (یا شرطی کنید اگر فقط در برگه خاصی است)
        if ( is_page( 'catalog' ) || has_shortcode( get_the_content(), 'salnama_catalog' ) ) {
            
            wp_enqueue_style( 'salnama-catalog-style', $css_uri, [], '1.0.0' );

            // اطمینان از وجود فایل JS قبل از لود
            wp_enqueue_script( 'page-flip-lib', $js_lib, [], '2.0.0', true );
            wp_enqueue_script( 'salnama-catalog-app', $js_app, ['page-flip-lib'], '1.0.0', true );

            wp_localize_script( 'salnama-catalog-app', 'SalnamaCatalogConfig', [
                'root_url' => get_template_directory_uri(),
            ]);
        }
    }
}