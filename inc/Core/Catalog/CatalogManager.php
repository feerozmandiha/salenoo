<?php
namespace Salnama_Theme\Inc\Core\Catalog;

/**
 * مدیریت کاتالوگ و ثبت بلوک داینامیک
 */
class CatalogManager {

    public function run() {
        // ثبت بلوک در هوک init
        add_action( 'init', [ $this, 'register_catalog_block' ] );
        
        // فراخوانی استایل و اسکریپت
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
    }

    /**
     * ثبت بلوک داینامیک سرور-ساید
     */
    public function register_catalog_block() {
        register_block_type( 'salnama/product-catalog', [
            'api_version'     => 3,
            'title'           => 'کاتالوگ محصولات',
            'category'        => 'widgets',
            'icon'            => 'book-alt',
            'render_callback' => [ new CatalogRender(), 'render' ], // ارجاع به کلاس رندر
            'attributes'      => [
                'limit' => [
                    'type'    => 'number',
                    'default' => 12, // تعداد محصولات پیش‌فرض
                ],
            ],
        ]);
    }

    /**
     * لود کردن فایل‌های CSS و JS فقط در صورت حضور بلوک
     */
    public function enqueue_assets() {
        // شرط: فقط اگر بلوک در صفحه وجود دارد یا صفحه کاتالوگ است بارگذاری شود
        // نکته: در FSE تشخیص has_block همیشه دقیق نیست، می‌توانیم بر اساس Slug چک کنیم
        global $post;
        
        // مسیر فایل‌ها طبق درخواست شما
        $css_path = get_template_directory_uri() . '/assets/css/catalog/style.css';
        $js_lib   = get_template_directory_uri() . '/assets/js/catalog/page-flip.browser.js';
        $js_app   = get_template_directory_uri() . '/assets/js/catalog/script.js';

        wp_enqueue_style( 'salnama-catalog-style', $css_path, [], '1.0.0' );
        
        // لود کتابخانه PageFlip
        wp_enqueue_script( 'page-flip-lib', $js_lib, [], '2.0.0', true );

        // لود اسکریپت اجرایی ما (وابسته به کتابخانه)
        wp_enqueue_script( 'salnama-catalog-app', $js_app, ['page-flip-lib'], '1.0.0', true );

        // ارسال داده‌ها به JS (برای تنظیمات داینامیک)
        wp_localize_script( 'salnama-catalog-app', 'SalnamaCatalogConfig', [
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'sounds'   => [
                'start' => get_template_directory_uri() . '/assets/sounds/page-flip-start.mp3', // اختیاری
                'end'   => get_template_directory_uri() . '/assets/sounds/page-flip-end.mp3',   // اختیاری
            ]
        ]);
    }
}