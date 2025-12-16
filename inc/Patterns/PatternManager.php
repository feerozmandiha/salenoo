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
    
    public function __construct() {
        // تعریف نسخه تم
        if (defined('SALNAMA_THEME_VERSION')) {
            $this->theme_version = SALNAMA_THEME_VERSION;
        }
        
        $this->define_categories();
    }
    
    /**
     * متد run برای سازگاری با Init کلاس
     */
    public function run() {
        $this->init();
        return $this;
    }
    
    public function init() {
        // ثبت دسته‌بندی‌ها و پترن‌ها
        add_action('init', [$this, 'register_categories']);
        add_action('init', [$this, 'register_patterns'], 20);
        
        // مدیریت assets
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets'], 20);
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_editor_assets']);
        
        // دیباگ
        if (defined('WP_DEBUG') && WP_DEBUG) {
            add_action('wp_footer', [$this, 'debug_info']);
        }
        
        // برای اطمینان از ثبت پترن‌ها در ادیتور
        add_action('admin_init', [$this, 'force_register_patterns']);
    }
    
    /**
     * ثبت اجباری پترن‌ها در حالت ادیتور
     */
    public function force_register_patterns() {
        if (is_admin() && !did_action('init')) {
            $this->register_categories();
            $this->register_patterns();
        }
    }

    /**
     * تعریف دسته‌بندی‌های پترن
     */
    private function define_categories() {
        $this->categories = [
            'salnama-headers' => [
                'label' => __('هدرهای سالماما', 'salnama'),
                'description' => __('هدرهای اختصاصی قالب سالماما', 'salnama')
            ],
            'salnama-hero' => [
                'label' => __('بخش‌های اصلی', 'salnama'),
                'description' => __('بخش‌های اصلی و معرفی سالماما', 'salnama')
            ],
            'salnama-features' => [
                'label' => __('ویژگی‌ها و خدمات', 'salnama'),
                'description' => __('بخش‌های ویژگی‌ها و خدمات سالماما', 'salnama')
            ],
            'salnama-cta' => [
                'label' => __('فراخوان اقدام', 'salnama'),
                'description' => __('بخش‌های دعوت به اقدام', 'salnama')
            ],
            'salnama-testimonials' => [
                'label' => __('نظرات مشتریان', 'salnama'),
                'description' => __('بخش‌های نمایش نظرات مشتریان', 'salnama')
            ],
            'salnama-footers' => [
                'label' => __('فوترها', 'salnama'),
                'description' => __('فوترهای اختصاصی سالماما', 'salnama')
            ],
            'salnama-forms' => [
                'label' => __('فرم‌ها', 'salnama'),
                'description' => __('فرم‌های تماس و جستجو', 'salnama')
            ]
        ];
    }

    /**
     * ثبت دسته‌بندی‌های پترن
     */
    public function register_categories() {
        if (!function_exists('register_block_pattern_category')) {
            error_log('Salnama Patterns: Function register_block_pattern_category not available');
            return;
        }
        
        foreach ($this->categories as $slug => $category) {
            register_block_pattern_category($slug, $category);
            
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('Salnama Patterns: Registered category - ' . $slug);
            }
        }
        
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('Salnama Patterns: Registered ' . count($this->categories) . ' categories');
        }
    }

    /**
     * ثبت پترن‌ها
     */
    public function register_patterns() {
        if (!function_exists('register_block_pattern')) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('Salnama Patterns: Function register_block_pattern not available');
            }
            return;
        }

        // ابتدا پوشه patterns روت را چک کن
        $root_patterns_path = get_template_directory() . '/patterns/';
        
        if (file_exists($root_patterns_path)) {
            $root_files = glob($root_patterns_path . '*.php');
            if ($root_files) {
                foreach ($root_files as $file) {
                    $pattern_data = $this->parse_pattern_file($file);
                    if ($pattern_data && $this->validate_pattern($pattern_data)) {
                        $this->register_single_pattern($pattern_data);
                    }
                }
            }
        }
        
        // سپس پوشه‌های زیرمجموعه
        $pattern_dirs = [
            'headers',
            'hero', 
            'features',
            'cta',
            'testimonials',
            'footers',
            'forms'
        ];
        
        foreach ($pattern_dirs as $dir) {
            $this->load_patterns_from_directory($dir);
        }
        
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('Salnama Patterns: Total registered patterns: ' . count($this->patterns));
        }
    }

    /**
     * لود پترن‌ها از دایرکتوری
     */
    private function load_patterns_from_directory($directory) {
        $patterns_path = get_template_directory() . "/patterns/{$directory}/";
        
        if (!file_exists($patterns_path)) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log("Salnama Patterns: Directory not found - {$patterns_path}");
            }
            return;
        }

        $pattern_files = glob($patterns_path . '*.php');
        
        if (empty($pattern_files)) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log("Salnama Patterns: No pattern files in {$directory}");
            }
            return;
        }

        foreach ($pattern_files as $file) {
            $pattern_data = $this->parse_pattern_file($file);
            if ($pattern_data && $this->validate_pattern($pattern_data)) {
                $this->register_single_pattern($pattern_data);
            }
        }
    }

    /**
     * پارس فایل پترن
     */
    private function parse_pattern_file($file_path) {
        if (!file_exists($file_path)) {
            return false;
        }

        // استفاده از get_file_data برای خواندن metadata
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
        $directory = basename(dirname($file_path));
        
        // اگر دایرکتوری patterns باشد، آن را خالی در نظر بگیر
        if ($directory === 'patterns') {
            $directory = '';
        }
        
        $pattern_slug = $file_data['slug'] ?: 'salnama-' . ($directory ? $directory . '-' : '') . sanitize_title($filename);

        return [
            'title' => $file_data['title'] ?: $this->generate_title_from_filename($filename),
            'slug' => $pattern_slug,
            'description' => $file_data['description'] ?: '',
            'categories' => $file_data['categories'] ? array_map('trim', explode(',', $file_data['categories'])) : ['salnama-' . ($directory ?: 'general')],
            'keywords' => $file_data['keywords'] ? array_map('trim', explode(',', $file_data['keywords'])) : [],
            'viewportWidth' => $file_data['viewport_width'] ? intval($file_data['viewport_width']) : 1200,
            'inserter' => $file_data['inserter'] !== 'false',
            'content' => $this->get_pattern_content($file_path),
            'file_path' => $file_path,
            'directory' => $directory
        ];
    }

    /**
     * تولید عنوان از نام فایل
     */
    private function generate_title_from_filename($filename) {
        $title = str_replace(['-', '_'], ' ', $filename);
        $title = preg_replace('/^salnama\s*/i', '', $title);
        $title = preg_replace('/^pattern\s*/i', '', $title);
        return ucwords($title);
    }

    /**
     * دریافت محتوای پترن
     */
    private function get_pattern_content($file_path) {
        ob_start();
        include $file_path;
        $content = ob_get_clean();
        
        if (!$content) {
            return '';
        }
        
        // پاکسازی محتوا
        $content = preg_replace('/<\?php.*?\?>\s*/s', '', $content);
        return trim($content);
    }

    /**
     * اعتبارسنجی پترن
     */
    private function validate_pattern($pattern_data) {
        $required = ['title', 'slug', 'content'];
        
        foreach ($required as $field) {
            if (empty($pattern_data[$field])) {
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log("Salnama Pattern Error: Missing required field '{$field}' in " . $pattern_data['file_path']);
                }
                return false;
            }
        }

        if (!is_array($pattern_data['categories'])) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log("Salnama Pattern Error: Categories must be array in " . $pattern_data['file_path']);
            }
            return false;
        }

        return true;
    }

    /**
     * ثبت تک پترن
     */
    private function register_single_pattern($pattern_data) {
        if (!function_exists('register_block_pattern')) {
            return false;
        }

        $result = register_block_pattern($pattern_data['slug'], [
            'title' => $pattern_data['title'],
            'description' => $pattern_data['description'],
            'categories' => $pattern_data['categories'],
            'keywords' => $pattern_data['keywords'],
            'viewportWidth' => $pattern_data['viewportWidth'],
            'inserter' => $pattern_data['inserter'],
            'content' => $pattern_data['content'],
        ]);

        if ($result) {
            $this->patterns[$pattern_data['slug']] = [
                'assets' => $this->detect_assets($pattern_data),
                'title' => $pattern_data['title'],
                'directory' => $pattern_data['directory'],
                'categories' => $pattern_data['categories']
            ];
            
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('Salnama Patterns: Registered - ' . $pattern_data['slug']);
            }
            
            return true;
        } else {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('Salnama Patterns: Failed to register - ' . $pattern_data['slug']);
            }
            return false;
        }
    }

    /**
     * تشخیص assets پترن
     */
    private function detect_assets($pattern_data) {
        $pattern_name = str_replace('salnama-', '', $pattern_data['slug']);
        $assets = ['css' => [], 'js' => []];

        // CSS assets
        $css_files = [
            "/assets/css/patterns/{$pattern_data['directory']}/{$pattern_name}.css",
            "/assets/css/patterns/{$pattern_name}.css",
            "/patterns/{$pattern_data['directory']}/{$pattern_name}.css",
            "/patterns/{$pattern_name}.css"
        ];

        foreach ($css_files as $css_file) {
            if (file_exists(get_template_directory() . $css_file)) {
                $assets['css'][] = $css_file;
                break;
            }
        }

        // JS assets
        $js_files = [
            "/assets/js/patterns/{$pattern_data['directory']}/{$pattern_name}.js",
            "/assets/js/patterns/{$pattern_name}.js",
            "/patterns/{$pattern_data['directory']}/{$pattern_name}.js",
            "/patterns/{$pattern_name}.js"
        ];

        foreach ($js_files as $js_file) {
            if (file_exists(get_template_directory() . $js_file)) {
                $assets['js'][] = $js_file;
                break;
            }
        }

        return $assets;
    }

    /**
     * مدیریت assets
     */
    public function enqueue_assets() {
        if ($this->assets_loaded || empty($this->patterns)) {
            return;
        }

        $enqueued_patterns = [];
        
        foreach ($this->patterns as $pattern_slug => $pattern_info) {
            if ($this->is_pattern_used($pattern_slug)) {
                $this->enqueue_pattern_assets($pattern_slug, $pattern_info);
                $enqueued_patterns[] = $pattern_slug;
                
                // برای پترن social-share-icon-modal، Dashicons را هم بارگذاری کن
                if ($pattern_slug === 'salnama/social-share-icon-modal') {
                    wp_enqueue_style('dashicons');
                }
            }
        }

        if (!empty($enqueued_patterns)) {
            $this->assets_loaded = true;
            
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('Salnama Patterns: Enqueued assets for: ' . implode(', ', $enqueued_patterns));
            }
        }
    }

    /**
     * بارگذاری assets یک پترن
     */
    private function enqueue_pattern_assets($pattern_slug, $pattern_info) {
        $pattern_name = str_replace('salnama-', '', $pattern_slug);

        // CSS
        foreach ($pattern_info['assets']['css'] as $css_file) {
            $handle = "salnama-{$pattern_name}-css";
            if (!wp_style_is($handle, 'enqueued')) {
                wp_enqueue_style(
                    $handle,
                    get_template_directory_uri() . $css_file,
                    [],
                    $this->get_file_version($css_file)
                );
            }
        }

        // JS
        foreach ($pattern_info['assets']['js'] as $js_file) {
            $handle = "salnama-{$pattern_name}-js";
            if (!wp_script_is($handle, 'enqueued')) {
                wp_enqueue_script(
                    $handle,
                    get_template_directory_uri() . $js_file,
                    [], // وابستگی‌ها در فایل JS تعریف می‌شوند
                    $this->get_file_version($js_file),
                    true
                );
            }
        }
    }

    /**
     * بررسی استفاده از پترن
     */
    private function is_pattern_used($pattern_slug) {
        global $post;

        // بررسی در محتوای پست
        if ($post && isset($post->post_content)) {
            // چک کردن برای الگوی بلوک
            if (false !== strpos($post->post_content, 'wp:pattern')) {
                // استخراج slug از محتوا
                if (preg_match('/"slug":"([^"]+)"/', $post->post_content, $matches)) {
                    if ($matches[1] === $pattern_slug) {
                        return true;
                    }
                }
            }
            
            // چک کردن مستقیم slug
            if (false !== strpos($post->post_content, $pattern_slug)) {
                return true;
            }
        }

        // بررسی در template parts
        if ($this->check_template_parts($pattern_slug)) {
            return true;
        }

        return false;
    }

    /**
     * بررسی template parts
     */
    private function check_template_parts($pattern_slug) {
        $template_parts = ['header.php', 'footer.php', 'sidebar.php', 'index.php', 'single.php', 'page.php'];
        
        foreach ($template_parts as $part) {
            $part_path = get_template_directory() . '/' . $part;
            if (file_exists($part_path)) {
                $content = file_get_contents($part_path);
                if (false !== strpos($content, $pattern_slug)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * دریافت نسخه فایل
     */
    private function get_file_version($file_path) {
        $full_path = get_template_directory() . $file_path;
        if (file_exists($full_path)) {
            return filemtime($full_path);
        }
        return $this->theme_version;
    }

    /**
     * assets ادیتور
     */
    public function enqueue_editor_assets() {
        $editor_css_path = get_template_directory() . '/assets/css/patterns-editor.css';
        if (file_exists($editor_css_path)) {
            wp_enqueue_style(
                'salnama-patterns-editor',
                get_template_directory_uri() . '/assets/css/patterns-editor.css',
                ['wp-edit-blocks'],
                $this->get_file_version('/assets/css/patterns-editor.css')
            );
        }
    }

    /**
     * اطلاعات دیباگ
     */
    public function debug_info() {
        if (!current_user_can('manage_options')) return;
        
        echo "\n<!-- Salnama Patterns Debug -->\n";
        echo "<!-- Total Patterns: " . count($this->patterns) . " -->\n";
        
        if (empty($this->patterns)) {
            echo "<!-- No patterns registered -->\n";
        } else {
            foreach ($this->patterns as $slug => $info) {
                $in_use = $this->is_pattern_used($slug) ? 'YES' : 'NO';
                echo sprintf(
                    "<!-- Pattern: %s | Title: %s | In Use: %s -->\n",
                    $slug,
                    $info['title'],
                    $in_use
                );
            }
        }
        
        echo "<!-- End Debug -->\n";
    }

    /**
     * دریافت پترن‌های ثبت شده
     */
    public function get_patterns() {
        return $this->patterns;
    }

    /**
     * دریافت دسته‌بندی‌ها
     */
    public function get_categories() {
        return $this->categories;
    }
}