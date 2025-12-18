<?php
/**
 * Pattern Manager for Salnama Theme
 * مدیریت مرکزی پترن‌های اختصاصی
 */

namespace Salnama_Theme\Inc\Patterns;

defined('ABSPATH') || exit;

class PatternManager {
    
    private static $instance = null;
    private $patterns = [];
    private $categories = [];
    private $assets_loaded = false;
    private $theme_version = '1.0.0';

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    // سازنده باید پابلیک باشد تا توسط Init نمونه‌سازی شود، اما منطق اصلی در run است
    public function __construct() {
        if (defined('SALNAMA_THEME_VERSION')) {
            $this->theme_version = SALNAMA_THEME_VERSION;
        }
    }
    
    public function run() {
        $this->define_categories();
        $this->init();
        return $this;
    }
    
    public function init() {
        add_action('init', [$this, 'register_categories']);
        add_action('init', [$this, 'register_patterns'], 20);
        
        // مدیریت assets
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets'], 20);
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_editor_assets']);
        
        // ثبت اجباری در ادمین
        add_action('admin_init', [$this, 'force_register_patterns']);
        
        // دیباگ
        if (defined('WP_DEBUG') && WP_DEBUG) {
            add_action('wp_footer', [$this, 'debug_info']);
        }
    }
    
    public function force_register_patterns() {
        if (is_admin() && !did_action('init')) {
            $this->register_categories();
            $this->register_patterns();
        }
    }

    private function define_categories() {
        $this->categories = [
            'salnama-headers' => ['label' => __('هدرهای سالماما', 'salnama')],
            'salnama-hero' => ['label' => __('بخش‌های اصلی', 'salnama')],
            'salnama-features' => ['label' => __('ویژگی‌ها و خدمات', 'salnama')],
            'salnama-cta' => ['label' => __('فراخوان اقدام', 'salnama')],
            'salnama-testimonials' => ['label' => __('نظرات مشتریان', 'salnama')],
            'salnama-footers' => ['label' => __('فوترها', 'salnama')],
            'salnama-forms' => ['label' => __('فرم‌ها', 'salnama')],
            'salnama-global' => ['label' => __('الگوهای جهانی', 'salnama')]
        ];
    }

    public function register_categories() {
        if (!function_exists('register_block_pattern_category')) return;
        foreach ($this->categories as $slug => $category) {
            register_block_pattern_category($slug, $category);
        }
    }

    public function register_patterns() {
        if (!function_exists('register_block_pattern')) return;

        // اسکن ریشه
        $this->scan_directory(get_template_directory() . '/patterns/', '');
        
        // اسکن زیر پوشه‌ها
        $subdirs = ['headers', 'hero', 'features', 'cta', 'testimonials', 'footers', 'forms'];
        foreach ($subdirs as $dir) {
            $this->scan_directory(get_template_directory() . "/patterns/{$dir}/", $dir);
        }
    }

    private function scan_directory($path, $directory_name) {
        if (!file_exists($path)) return;
        
        $files = glob($path . '*.php');
        if (!$files) return;

        foreach ($files as $file) {
            $pattern_data = $this->parse_pattern_file($file, $directory_name);
            if ($pattern_data && $this->validate_pattern($pattern_data)) {
                $this->register_single_pattern($pattern_data);
            }
        }
    }

    private function parse_pattern_file($file_path, $directory) {
        if (!file_exists($file_path)) return false;

        $file_data = get_file_data($file_path, [
            'title' => 'Title',
            'slug' => 'Slug',
            'description' => 'Description',
            'categories' => 'Categories',
            'keywords' => 'Keywords',
            'viewport_width' => 'Viewport Width',
            'inserter' => 'Inserter'
        ]);

        $filename = basename($file_path, '.php');
        $pattern_slug = $file_data['slug'] ?: 'salnama-' . ($directory ? $directory . '-' : '') . sanitize_title($filename);

        return [
            'title' => $file_data['title'] ?: ucwords(str_replace(['-', '_'], ' ', $filename)),
            'slug' => $pattern_slug,
            'description' => $file_data['description'] ?: '',
            'categories' => $file_data['categories'] ? array_map('trim', explode(',', $file_data['categories'])) : ['salnama-global'],
            'keywords' => $file_data['keywords'] ? array_map('trim', explode(',', $file_data['keywords'])) : [],
            'viewportWidth' => $file_data['viewport_width'] ? intval($file_data['viewport_width']) : 1200,
            'inserter' => $file_data['inserter'] !== 'false',
            'content' => $this->get_pattern_content($file_path),
            'file_path' => $file_path,
            'directory' => $directory
        ];
    }

    private function get_pattern_content($file_path) {
        ob_start();
        include $file_path;
        $content = ob_get_clean();
        return trim(preg_replace('/<\?php.*?\?>\s*/s', '', $content));
    }

    private function validate_pattern($data) {
        return !empty($data['title']) && !empty($data['slug']) && !empty($data['content']);
    }

    private function register_single_pattern($data) {
        $result = register_block_pattern($data['slug'], [
            'title' => $data['title'],
            'description' => $data['description'],
            'categories' => $data['categories'],
            'keywords' => $data['keywords'],
            'viewportWidth' => $data['viewportWidth'],
            'inserter' => $data['inserter'],
            'content' => $data['content'],
        ]);

        if ($result) {
            $this->patterns[$data['slug']] = [
                'assets' => $this->detect_assets($data),
                'title' => $data['title']
            ];
        }
    }

    /**
     * هوشمند سازی تشخیص فایل‌ها
     * هم slug کامل و هم نام فایل (بدون پیشوند salnama) را چک می‌کند
     */
    private function detect_assets($pattern_data) {
        // حذف پیشوند salnama- یا salnama/ برای تطبیق با نام فایل
        $clean_name = str_replace(['salnama-', 'salnama/'], '', $pattern_data['slug']); 
        $assets = ['css' => [], 'js' => []];

        // لیست مسیرهای احتمالی CSS
        $css_candidates = [
            "/assets/css/patterns/{$clean_name}.css", // حالت استاندارد: assets/css/patterns/floating-bar.css
            "/assets/css/patterns/{$pattern_data['directory']}/{$clean_name}.css",
        ];

        foreach ($css_candidates as $path) {
            if (file_exists(get_template_directory() . $path)) {
                $assets['css'][] = $path;
                break; // اگر پیدا شد، بعدی را نگرد
            }
        }

        // لیست مسیرهای احتمالی JS
        $js_candidates = [
            "/assets/js/patterns/{$clean_name}.js", // حالت استاندارد: assets/js/patterns/floating-bar.js
            "/assets/js/patterns/{$pattern_data['directory']}/{$clean_name}.js",
        ];

        foreach ($js_candidates as $path) {
            if (file_exists(get_template_directory() . $path)) {
                $assets['js'][] = $path;
                break;
            }
        }

        return $assets;
    }

    public function enqueue_assets() {
        if ($this->assets_loaded) return;

        // 1. بارگذاری فایل‌های سراسری (Global Floating Bar)
        // چون کاربر خواسته این همیشه در فوتر باشد، دستی لود می‌کنیم تا مطمئن شویم
        $this->enqueue_global_floating_bar();

        // 2. بارگذاری هوشمند بقیه پترن‌ها
        foreach ($this->patterns as $slug => $info) {
            if ($this->is_pattern_used($slug)) {
                $this->enqueue_pattern_assets($slug, $info);
            }
        }

        $this->assets_loaded = true;
    }

    /**
     * متد اختصاصی برای نوار شناور
     */
    private function enqueue_global_floating_bar() {
        // فقط در فرانت‌اند
        if (is_admin()) return;

        // بارگذاری استایل
        if (file_exists(get_template_directory() . '/assets/css/patterns/floating-bar.css')) {
            wp_enqueue_style(
                'salnama-floating-bar-css',
                get_template_directory_uri() . '/assets/css/patterns/floating-bar.css',
                ['dashicons'], // وابستگی به dashicons
                $this->theme_version
            );
        }

        // بارگذاری اسکریپت
        if (file_exists(get_template_directory() . '/assets/js/patterns/floating-bar.js')) {
            wp_enqueue_script(
                'salnama-floating-bar-js',
                get_template_directory_uri() . '/assets/js/patterns/floating-bar.js',
                [], 
                $this->theme_version,
                true
            );
        }
    }

    private function enqueue_pattern_assets($slug, $info) {
        $clean_name = str_replace(['salnama-', 'salnama/'], '', $slug);

        foreach ($info['assets']['css'] as $file) {
            wp_enqueue_style("salnama-{$clean_name}-css", get_template_directory_uri() . $file, [], $this->theme_version);
        }

        foreach ($info['assets']['js'] as $file) {
            wp_enqueue_script("salnama-{$clean_name}-js", get_template_directory_uri() . $file, [], $this->theme_version, true);
        }
    }

    private function is_pattern_used($slug) {
        global $post;
        if (!$post) return false;
        
        // چک کردن محتوا
        if (has_block('core/block') || strpos($post->post_content, $slug) !== false) {
            return true;
        }
        
        // چک کردن هدر و فوتر (ساده سازی شده)
        // در تم‌های FSE معمولا پترن‌ها در تمپلیت پارت‌ها هستند که وردپرس خودش هندل می‌کند
        // اما برای اطمینان این متد وجود دارد
        return false;
    }

    public function enqueue_editor_assets() {
        if (file_exists(get_template_directory() . '/assets/css/patterns-editor.css')) {
            wp_enqueue_style('salnama-patterns-editor', get_template_directory_uri() . '/assets/css/patterns-editor.css', ['wp-edit-blocks'], $this->theme_version);
        }
    }

    // متد دیباگ حفظ شود...
    public function debug_info() {
        if (!current_user_can('manage_options')) return;
        // کد دیباگ قبلی شما...
    }
}