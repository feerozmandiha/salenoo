<?php
/**
 * Patterns Manager for Salnama Theme
 * مدیریت مرکزی پترن‌های قالب سالنما
 */

namespace Salnama_Theme\Inc\Patterns;

class PatternsManager {

    private static $instance = null;
    private $patterns = [];
    private $categories = [];
    private $pattern_assets_loaded = false;

    public function run(): void {
        $this->setup_hooks();
        $this->define_categories();
    }

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function setup_hooks() {
        add_action('init', [$this, 'register_categories']);
        add_action('init', [$this, 'register_patterns'], 20);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_patterns_assets'], 20); // اولویت بالاتر
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_editor_assets']);
        
        // دیباگ
        if (defined('WP_DEBUG') && WP_DEBUG) {
            add_action('wp_footer', [$this, 'debug_patterns_info']);
        }
    }

    /**
     * تعریف دسته‌بندی‌های پترن
     */
    private function define_categories() {
        $this->categories = [
            'salenama-headers' => [
                'label' => __('هدرهای سالنما', 'salenama'),
                'description' => __('هدرهای اختصاصی قالب سالنما', 'salenama')
            ],
            'salenama-hero' => [
                'label' => __('بخش‌های هیرو', 'salenama'),
                'description' => __('بخش‌های اصلی و معرفی سالنما', 'salenama')
            ],
            'salenama-features' => [
                'label' => __('ویژگی‌ها', 'salenama'),
                'description' => __('بخش‌های ویژگی‌ها و خدمات', 'salenama')
            ],
            'salenama-cta' => [
                'label' => __('فراخوان اقدام', 'salenama'),
                'description' => __('بخش‌های دعوت به اقدام', 'salenama')
            ],
            'salenama-footers' => [
                'label' => __('فوترها', 'salenama'),
                'description' => __('فوترهای اختصاصی سالنما', 'salenama')
            ]
        ];
    }

    /**
     * ثبت دسته‌بندی‌های پترن
     */
    public function register_categories() {
        foreach ($this->categories as $slug => $category) {
            register_block_pattern_category($slug, $category);
        }
    }

    /**
     * ثبت پترن‌ها
     */
    public function register_patterns() {
        $patterns_dir = get_template_directory() . '/patterns/';
        
        if (!is_dir($patterns_dir)) {
            error_log('Salnama Patterns: Patterns directory not found: ' . $patterns_dir);
            return;
        }

        $pattern_files = glob($patterns_dir . '*.php');
        
        if (empty($pattern_files)) {
            error_log('Salnama Patterns: No pattern files found in: ' . $patterns_dir);
            return;
        }

        foreach ($pattern_files as $pattern_file) {
            $pattern_data = $this->get_pattern_data($pattern_file);
            
            if ($pattern_data && $this->validate_pattern_data($pattern_data)) {
                $this->register_single_pattern($pattern_data);
            }
        }
        
        error_log('Salnama Patterns: Registered ' . count($this->patterns) . ' patterns: ' . implode(', ', array_keys($this->patterns)));
    }

    /**
     * دریافت داده‌های پترن از فایل
     */
    private function get_pattern_data($file_path) {
        if (!file_exists($file_path)) {
            error_log('Salnama Patterns: Pattern file not found: ' . $file_path);
            return false;
        }

        // استفاده از روش استاندارد وردپرس برای خواندن metadata پترن
        $file_data = get_file_data($file_path, [
            'title' => 'Title',
            'slug' => 'Slug',
            'description' => 'Description',
            'categories' => 'Categories',
            'keywords' => 'Keywords',
            'viewport_width' => 'Viewport Width',
            'inserter' => 'Inserter',
            'block_types' => 'Block Types'
        ]);

        $pattern_slug = $file_data['slug'] ?: 'salenama-' . sanitize_title(basename($file_path, '.php'));

        $pattern_data = [
            'title' => $file_data['title'] ?: ucfirst(str_replace('-', ' ', basename($file_path, '.php'))),
            'slug' => $pattern_slug,
            'description' => $file_data['description'] ?: '',
            'categories' => $file_data['categories'] ? array_map('trim', explode(',', $file_data['categories'])) : ['salenama-general'],
            'keywords' => $file_data['keywords'] ? array_map('trim', explode(',', $file_data['keywords'])) : [],
            'viewportWidth' => $file_data['viewport_width'] ? intval($file_data['viewport_width']) : 1200,
            'inserter' => $file_data['inserter'] !== 'false',
            'blockTypes' => $file_data['block_types'] ? array_map('trim', explode(',', $file_data['block_types'])) : [],
            'content' => $this->get_pattern_content($file_path),
            'file_path' => $file_path
        ];

        return $pattern_data;
    }

    /**
     * دریافت محتوای پترن
     */
    private function get_pattern_content($file_path) {
        ob_start();
        include $file_path;
        $content = ob_get_clean();
        
        // حذف کامنت‌های PHP از محتوا
        $content = preg_replace('/<\?php.*?\?>/s', '', $content);
        
        return trim($content);
    }

    /**
     * اعتبارسنجی داده‌های پترن
     */
    private function validate_pattern_data($pattern_data) {
        $required_fields = ['title', 'slug', 'content'];
        
        foreach ($required_fields as $field) {
            if (empty($pattern_data[$field])) {
                error_log("Salnama Pattern Error: Missing required field '{$field}' in pattern: " . $pattern_data['file_path']);
                return false;
            }
        }

        if (!is_array($pattern_data['categories'])) {
            error_log("Salnama Pattern Error: Categories must be an array in pattern: " . $pattern_data['file_path']);
            return false;
        }

        return true;
    }

    /**
     * ثبت تک پترن
     */
    private function register_single_pattern($pattern_data) {
        if (!function_exists('register_block_pattern')) {
            error_log('Salnama Patterns: register_block_pattern function not available');
            return;
        }

        $result = register_block_pattern($pattern_data['slug'], [
            'title' => $pattern_data['title'],
            'description' => $pattern_data['description'],
            'categories' => $pattern_data['categories'],
            'keywords' => $pattern_data['keywords'],
            'viewportWidth' => $pattern_data['viewportWidth'],
            'inserter' => $pattern_data['inserter'],
            'blockTypes' => $pattern_data['blockTypes'],
            'content' => $pattern_data['content'],
        ]);

        if ($result) {
            // ذخیره اطلاعات پترن برای مدیریت assets
            $this->patterns[$pattern_data['slug']] = [
                'assets' => $this->detect_pattern_assets($pattern_data),
                'file_path' => $pattern_data['file_path'],
                'title' => $pattern_data['title']
            ];
            
            error_log('Salnama Patterns: Successfully registered pattern: ' . $pattern_data['slug']);
        } else {
            error_log('Salnama Patterns: Failed to register pattern: ' . $pattern_data['slug']);
        }
    }

    /**
     * تشخیص assets مورد نیاز پترن
     */
    private function detect_pattern_assets($pattern_data) {
        $assets = [
            'css' => [],
            'js' => [],
            'inline_css' => false,
            'inline_js' => false
        ];

        $pattern_name = str_replace('salenama-', '', $pattern_data['slug']);
        
        // بررسی وجود فایل‌های CSS
        $css_file = get_template_directory() . '/assets/css/patterns/' . $pattern_name . '.css';
        if (file_exists($css_file)) {
            $assets['css'][] = $pattern_name;
            error_log('Salnama Patterns: CSS file found for ' . $pattern_data['slug'] . ': ' . $css_file);
        }

        // بررسی وجود فایل‌های JS
        $js_file = get_template_directory() . '/assets/js/patterns/' . $pattern_name . '.js';
        if (file_exists($js_file)) {
            $assets['js'][] = $pattern_name;
            error_log('Salnama Patterns: JS file found for ' . $pattern_data['slug'] . ': ' . $js_file);
        }

        return $assets;
    }

    /**
     * بارگذاری assets پترن‌ها
     */
    public function enqueue_patterns_assets() {
        if (empty($this->patterns)) {
            error_log('Salnama Patterns: No patterns registered for assets enqueue');
            return;
        }

        // اگر قبلاً بارگذاری شده، دوباره انجام نده
        if ($this->pattern_assets_loaded) {
            return;
        }

        $enqueued_patterns = [];
        
        foreach ($this->patterns as $pattern_slug => $pattern_info) {
            if ($this->is_pattern_in_use($pattern_slug)) {
                $this->enqueue_pattern_assets($pattern_slug, $pattern_info);
                $enqueued_patterns[] = $pattern_slug;
                $this->pattern_assets_loaded = true;
            }
        }
        
        if (!empty($enqueued_patterns)) {
            error_log('Salnama Patterns: Enqueued assets for patterns: ' . implode(', ', $enqueued_patterns));
        } else {
            error_log('Salnama Patterns: No patterns in use on this page');
        }
    }

    /**
     * بارگذاری assets یک پترن خاص
     */
    private function enqueue_pattern_assets($pattern_slug, $pattern_info) {
        $pattern_name = str_replace('salenama-', '', $pattern_slug);

        // بارگذاری CSS
        foreach ($pattern_info['assets']['css'] as $css_asset) {
            $handle = "salenama-{$css_asset}-css";
            
            if (!wp_style_is($handle, 'enqueued')) {
                wp_enqueue_style(
                    $handle,
                    SALNAMA_ASSETS_URI . "/css/patterns/{$css_asset}.css",
                    [],
                    $this->get_file_version("/css/patterns/{$css_asset}.css")
                );
                error_log("Salnama Patterns: Enqueued CSS: {$handle}");
            }
        }

        // بارگذاری JS - بدون وابستگی به GSAP چون در AnimationController بارگذاری می‌شود
        foreach ($pattern_info['assets']['js'] as $js_asset) {
            $handle = "salenama-{$js_asset}-js";
            
            if (!wp_script_is($handle, 'enqueued')) {
                $dependencies = [];
                
                // بررسی نیاز به GSAP - اما وابستگی اضافه نکن چون قبلاً بارگذاری شده
                $js_file_path = get_template_directory() . "/assets/js/patterns/{$js_asset}.js";
                if (file_exists($js_file_path)) {
                    $js_content = file_get_contents($js_file_path);
                    
                    // فقط لاگ بزن که نیاز به GSAP دارد اما وابستگی اضافه نکن
                    if (strpos($js_content, 'gsap') !== false || strpos($js_content, 'GSAP') !== false) {
                        error_log("Salnama Patterns: Pattern {$pattern_slug} requires GSAP (already loaded by AnimationController)");
                    }
                }
                
                wp_enqueue_script(
                    $handle,
                    SALNAMA_ASSETS_URI . "/js/patterns/{$js_asset}.js",
                    $dependencies, // وابستگی خالی - GSAP قبلاً بارگذاری شده
                    $this->get_file_version("/js/patterns/{$js_asset}.js"),
                    true
                );
                error_log("Salnama Patterns: Enqueued JS: {$handle}");
            }
        }
    }

    /**
     * دریافت نسخه فایل بر اساس timestamp
     */
    private function get_file_version($file_path) {
        $full_path = get_template_directory() . $file_path;
        return file_exists($full_path) ? filemtime($full_path) : SALNAMA_THEME_VERSION;
    }

    /**
     * بررسی استفاده از پترن در صفحه جاری
     */
    private function is_pattern_in_use($pattern_slug) {
        global $post;
        
        // روش ۱: بررسی در محتوای پست
        if ($this->check_post_content($pattern_slug)) {
            return true;
        }

        // روش ۲: بررسی در template parts برای FSE
        if ($this->check_fse_template_usage($pattern_slug)) {
            return true;
        }

        // روش ۳: بررسی در template parts معمولی
        if ($this->check_template_parts_usage($pattern_slug)) {
            return true;
        }

        // روش ۴: بررسی در هدر و فوتر
        if ($this->check_header_footer_usage($pattern_slug)) {
            return true;
        }

        return false;
    }

    /**
     * بررسی در محتوای پست
     */
    private function check_post_content($pattern_slug) {
        global $post;
        
        // بررسی وجود پست و محتوای آن
        if ($post && isset($post->post_content) && is_string($post->post_content)) {
            if (false !== strpos($post->post_content, $pattern_slug)) {
                error_log("Salnama Patterns: Pattern {$pattern_slug} found in post content");
                return true;
            }
        }
        
        return false;
    }

    /**
     * بررسی در template parts برای FSE
     */
    private function check_fse_template_usage($pattern_slug) {
        // فقط برای قالب‌های بلوکی
        if (!function_exists('wp_is_block_theme') || !wp_is_block_theme()) {
            return false;
        }

        $templates = ['header', 'footer', 'home', 'page', 'single', 'index'];
        
        foreach ($templates as $template) {
            $template_obj = get_block_template(get_stylesheet() . '//' . $template);
            
            if ($template_obj && !empty($template_obj->content) && false !== strpos($template_obj->content, $pattern_slug)) {
                error_log("Salnama Patterns: Pattern {$pattern_slug} found in FSE template: {$template}");
                return true;
            }
        }

        return false;
    }

    /**
     * بررسی در template parts معمولی
     */
    private function check_template_parts_usage($pattern_slug) {
        // بررسی در template parts موجود
        $template_parts = [
            'header.php',
            'footer.php',
            'sidebar.php'
        ];

        foreach ($template_parts as $part) {
            $part_path = get_template_directory() . '/' . $part;
            if (file_exists($part_path)) {
                $content = file_get_contents($part_path);
                if (false !== strpos($content, $pattern_slug)) {
                    error_log("Salnama Patterns: Pattern {$pattern_slug} found in template part: {$part}");
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * بررسی در هدر و فوتر
     */
    private function check_header_footer_usage($pattern_slug) {
        // بررسی در هدر
        ob_start();
        get_header();
        $header_content = ob_get_clean();
        if (false !== strpos($header_content, $pattern_slug)) {
            error_log("Salnama Patterns: Pattern {$pattern_slug} found in header");
            return true;
        }

        // بررسی در فوتر
        ob_start();
        get_footer();
        $footer_content = ob_get_clean();
        if (false !== strpos($footer_content, $pattern_slug)) {
            error_log("Salnama Patterns: Pattern {$pattern_slug} found in footer");
            return true;
        }

        return false;
    }

    /**
     * بارگذاری assets ادیتور
     */
    public function enqueue_editor_assets() {
        // اسکریپت ادیتور
        $editor_js_path = '/js/patterns/patterns-editor.js';
        if (file_exists(get_template_directory() . $editor_js_path)) {
            wp_enqueue_script(
                'salenama-patterns-editor',
                SALNAMA_ASSETS_URI . $editor_js_path,
                ['wp-blocks', 'wp-dom-ready', 'wp-edit-post'],
                $this->get_file_version($editor_js_path),
                true
            );

            // انتقال داده‌ها به جاوااسکریپت ادیتور
            wp_localize_script('salenama-patterns-editor', 'salenamaPatterns', [
                'patterns' => array_keys($this->patterns),
                'categories' => $this->categories,
                'assetsUri' => SALNAMA_ASSETS_URI,
                'debug' => true
            ]);
            
            error_log('Salnama Patterns: Enqueued editor assets');
        }

        // استایل ادیتور
        $editor_css_path = '/css/patterns/patterns-editor.css';
        if (file_exists(get_template_directory() . $editor_css_path)) {
            wp_enqueue_style(
                'salenama-patterns-editor-css',
                SALNAMA_ASSETS_URI . $editor_css_path,
                ['wp-edit-blocks'],
                $this->get_file_version($editor_css_path)
            );
        }
    }

    /**
     * دیباگ - نمایش اطلاعات پترن‌ها
     */
    public function debug_patterns_info() {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        echo '<!-- Salnama Patterns Debug -->';
        echo '<!-- Registered Patterns: ' . implode(', ', array_keys($this->patterns)) . ' -->';
        
        foreach ($this->patterns as $slug => $info) {
            $in_use = $this->is_pattern_in_use($slug) ? 'YES' : 'NO';
            echo "<!-- Pattern: {$slug} - In Use: {$in_use} -->";
            
            // نمایش اطلاعات assets
            $css_files = implode(', ', $info['assets']['css']);
            $js_files = implode(', ', $info['assets']['js']);
            echo "<!-- Pattern Assets - CSS: {$css_files}, JS: {$js_files} -->";
        }
        echo '<!-- End Salnama Patterns Debug -->';
    }

    /**
     * دریافت لیست پترن‌های ثبت شده
     */
    public function get_registered_patterns() {
        return array_keys($this->patterns);
    }

    /**
     * دریافت لیست دسته‌بندی‌ها
     */
    public function get_registered_categories() {
        return $this->categories;
    }
}