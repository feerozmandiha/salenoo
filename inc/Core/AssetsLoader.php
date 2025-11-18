<?php
/**
 * AssetsLoader.php - نسخه نهایی بدون GSAP
 */

namespace Salnama_Theme\Inc\Core;

class AssetsLoader {

    public function run(): void {
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
        add_action( 'after_setup_theme', [ $this, 'setup_theme_support' ] );
        add_action('wp_head', [ $this, 'inline_css_fouc' ] );
        add_filter('render_block',[ $this, 'css_classes_block_filter'], 10, 2);
        add_filter( 'upload_mimes',[ $this,  'salnama_allow_svg_uploads' ] );
        add_filter( 'wp_check_filetype_and_ext', [ $this, 'salnama_check_svg_upload_permission' ] , 10, 4 );
        add_action( 'init', [ $this, 'salnama_variations_block_style' ] );
    }

    public function setup_theme_support(): void {
        add_theme_support( 'html5', [
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        ] );

        add_theme_support( 'post-thumbnails' );
        add_theme_support( 'rtl' );

        if ( class_exists( 'WooCommerce' ) ) {
            add_theme_support( 'woocommerce' );
            add_theme_support( 'wc-product-gallery-zoom' );
            add_theme_support( 'wc-product-gallery-lightbox' );
            add_theme_support( 'wc-product-gallery-slider' );
        }
    }

    public function inline_css_fouc() {
        ?>
        <style id="salnama-preload-css">
            [data-salnama-animated="true"] {
                opacity: 0;
                visibility: visible !important;
            }
        </style>
        <?php
    }

    public function css_classes_block_filter($block_content, $block) {
        if ($block['blockName'] === 'core/post-title') {
            $block_content = str_replace(
                '<h1 class="wp-block-post-title"',
                '<h1 class="wp-block-post-title salnama-animated" data-animation-type="typeWriter"',
                $block_content
            );
        }
        return $block_content;
    }

    /**
     * بارگذاری فایل‌های CSS و JS (بدون GSAP)
     */
    public function enqueue_assets(): void {
        $this->enqueue_styles();
        $this->enqueue_scripts();
    }

    private function enqueue_styles(): void {
        // فایل‌های CSS با نام‌های منحصربفرد
        $styles = [
            'salnama-theme-main' => '/css/main.css',
            'salnama-theme-global' => '/css/global.css',
            'salnama-theme-menu' => '/css/full-screen-menu.css',
            'salnama-theme-404' => '/css/404.css',
        ];

        foreach ($styles as $handle => $path) {
            wp_enqueue_style(
                $handle,
                SALNAMA_ASSETS_URI . $path,
                [],
                SALNAMA_THEME_VERSION
            );
        }
    }

    private function enqueue_scripts(): void {

        // انتقال داده‌ها به جاوااسکریپت
        wp_localize_script( 'salnama-theme-main', 'salnama_theme', [
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'is_rtl'   => is_rtl(),
            'assets_uri' => SALNAMA_ASSETS_URI,
        ] );
    }

    // حذف کامل متد conditionally_enqueue_gsap و متدهای وابسته
    
    public function salnama_allow_svg_uploads( $mimes ) {
        $mimes['svg'] = 'image/svg+xml';
        return $mimes;
    }

    public function salnama_check_svg_upload_permission( $file ) {
        if ( isset( $file['type'] ) && $file['type'] === 'image/svg+xml' ) {
            if ( ! current_user_can( 'administrator' ) ) {
                $file['error'] = 'فقط مدیر سایت می‌تواند فایل SVG آپلود کند.';
            }
        }
        return $file;
    }

    public function salnama_variations_block_style() {
        register_block_style('core/group', [
            'name'  => 'card',
            'label' => __('Card', 'textdomain'),
        ]);

        register_block_style('core/group', [
            'name'  => 'product card',
            'label' => __('Product-Card', 'textdomain'),
        ]);

        register_block_style('core/image', [
            'name'  => 'card-image',
            'label' => __('Card Image', 'textdomain'),
        ]);
    }
}