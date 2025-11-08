<?php
/**
 * AssetsLoader.php
 *
 * کلاس بارگذار هوشمند دارایی‌های قالب.
 * فونت‌ها از طریق theme.json مدیریت می‌شوند.
 * این کلاس فقط فایل‌های CSS/JS عمومی و پشتیبانی RTL را مدیریت می‌کند.
 */

namespace Salnama_Theme\Inc\Core;

class AssetsLoader {

    /**
     * شروع به بارگذاری دارایی‌ها و فعال‌سازی پشتیبانی‌ها می‌کند
     *
     * @return void
     */
    public function run(): void {
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
        add_action( 'after_setup_theme', [ $this, 'setup_theme_support' ] );
        add_action('wp_head', [ $this, 'inline_css_fouc' ] );
        add_filter('render_block',[ $this, 'css_classes_block_filter'], 10, 2);
        add_filter( 'upload_mimes',[ $this,  'salnama_allow_svg_uploads' ] );
        add_filter( 'wp_check_filetype_and_ext', [ $this, 'salnama_check_svg_upload_permission' ] , 10, 4 );


    }

    


    /**
     * فعال‌سازی پشتیبانی‌های لازم برای تم
     *
     * @return void
     */
    public function setup_theme_support(): void {
        // فعال‌سازی پشتیبانی HTML5
        add_theme_support( 'html5', [
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        ] );

        // فعال‌سازی تصاویر برجسته
        add_theme_support( 'post-thumbnails' );

        // فعال‌سازی پشتیبانی از راست‌به‌چپ (RTL)
        add_theme_support( 'rtl' );

        // پشتیبانی از ووکامرس (در صورت نصب)
        if ( class_exists( 'WooCommerce' ) ) {
            add_theme_support( 'woocommerce' );
            add_theme_support( 'wc-product-gallery-zoom' );
            add_theme_support( 'wc-product-gallery-lightbox' );
            add_theme_support( 'wc-product-gallery-slider' );
        }
    }


        // در functions.php یا در header قالب اضافه کنید
    public function inline_css_fouc() {
        ?>
        <style id="salnama-preload-css">
            /* جلوگیری از FOUC و اطمینان از نمایش المان‌ها */
            [data-salnama-animated="true"] {
                opacity: 0;
                visibility: visible !important;
            }
        </style>
        <?php
    }

    // در functions.php یا block filter
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
     * بارگذاری فایل‌های CSS و JS
     *
     * @return void
     */
    public function enqueue_assets(): void {
        $this->enqueue_styles();
        $this->enqueue_scripts();
    }

    /**
     * بارگذاری فایل‌های سبک (CSS)
     *
     * @return void
     */
    private function enqueue_styles(): void {
        // فایل سبک اصلی (برای override یا اصلاحات جزئی)
        wp_enqueue_style(
            'salnama-theme-main',
            SALNAMA_ASSETS_URI . '/css/main.css',
            [],
            SALNAMA_THEME_VERSION
        );

        wp_enqueue_style(
            'salnama-theme-menu',
            SALNAMA_ASSETS_URI . '/css/global.css',
            [],
            SALNAMA_THEME_VERSION
        );

    }

    /**
     * بارگذاری اسکریپت‌ها
     *
     * @return void
     */
    private function enqueue_scripts(): void {

            // The core GSAP library
        wp_enqueue_script( 
            'gsap-core', 
            'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js', 
            array(), 
            '3.13.0', 
            true 
        );

        // ScrollTrigger - with gsap.js passed as a dependency
        wp_enqueue_script( 
            'gsap-scrolltrigger', 
            'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js', 
            array('gsap-core'), 
            '3.13.0', 
            true 
        );

        // Your animation code file - with gsap.js passed as a dependency
        wp_enqueue_script( 'gsap-js2', get_template_directory_uri() . 'js/app.js', array('gsap-js'), false, true );

        // فایل اصلی جاوااسکریپت (برای موتور GSAP و ماژول‌های آینده)
        wp_enqueue_script(
            'salnama-theme-main',
            SALNAMA_ASSETS_URI . '/js/main.js',
            [ 'gsap-core', 'gsap-scrolltrigger' ],
            SALNAMA_THEME_VERSION,
            true
        );

        wp_localize_script( 'salnama-theme-main', 'salnama_theme', [
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'is_rtl'   => is_rtl(),
        ] );
        }

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

    }