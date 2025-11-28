<?php
/**
 * Pattern Manager for Salnama Theme
 * مدیریت مرکزی پترن‌های اختصاصی
 */

namespace Salnama_Theme\Inc\Patterns;

defined('ABSPATH') || exit;

class PatternManager {
    
    private static $instance = null;
    private $registry;
    private $categories;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->registry = new PatternRegistry();
        $this->categories = new PatternCategories();
        $this->init();
    }
    
    public function init() {
        // ثبت دسته‌بندی‌ها
        add_action('init', [$this->categories, 'register_categories']);
        
        // لود و ثبت پترن‌ها
        add_action('init', [$this, 'load_patterns']);
        
        // استایل‌ها و اسکریپت‌ها
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_editor_assets']);
        
        // فیلتر دسته‌بندی‌های بلوک
        add_filter('block_categories_all', [$this, 'add_block_categories'], 10, 2);
    }
    
    /**
     * لود و ثبت تمام پترن‌ها
     */
    public function load_patterns() {
        $pattern_dirs = [
            'headers',
            'hero', 
            'features',
            'cta',
            'testimonials',
            'footers'
        ];
        
        foreach ($pattern_dirs as $dir) {
            $this->load_patterns_from_directory($dir);
        }
        
        // ثبت پترن‌ها در وردپرس
        $this->registry->register_all_patterns();
    }
    
    /**
     * لود پترن‌ها از یک دایرکتوری
     */
    private function load_patterns_from_directory($directory) {
        $patterns_path = get_template_directory() . "/patterns/{$directory}/";
        
        if (!file_exists($patterns_path)) {
            return;
        }
        
        $pattern_files = glob($patterns_path . '*.php');
        
        foreach ($pattern_files as $file) {
            $pattern_data = include $file;
            if (is_array($pattern_data) && isset($pattern_data['name'])) {
                $this->registry->add_pattern($pattern_data);
            }
        }
    }
    
    /**
     * استایل‌ها و اسکریپت‌های frontend
     */
    public function enqueue_assets() {
        if (!$this->has_salmama_patterns()) {
            return;
        }
        
        wp_enqueue_style(
            'salmama-patterns',
            get_template_directory_uri() . '/assets/css/patterns.css',
            [],
            filemtime(get_template_directory() . '/assets/css/patterns.css')
        );
        
        wp_enqueue_script(
            'salmama-patterns',
            get_template_directory_uri() . '/assets/js/patterns.js',
            ['gsap'],
            filemtime(get_template_directory() . '/assets/js/patterns.js'),
            true
        );
    }
    
    /**
     * استایل‌های ادیتور
     */
    public function enqueue_editor_assets() {
        wp_enqueue_style(
            'salmama-patterns-editor',
            get_template_directory_uri() . '/assets/css/patterns-editor.css',
            ['wp-edit-blocks'],
            filemtime(get_template_directory() . '/assets/css/patterns-editor.css')
        );
    }
    
    /**
     * اضافه کردن دسته‌بندی بلوک‌های سالماما
     */
    public function add_block_categories($categories, $post) {
        return array_merge($categories, [
            [
                'slug' => 'salmama-blocks',
                'title' => 'بلوک‌های سالماما',
                'icon' => 'admin-customizer',
            ]
        ]);
    }
    
    /**
     * بررسی وجود پترن‌های سالماما در صفحه
     */
    private function has_salmama_patterns() {
        global $post;
        
        if (!$post) {
            return false;
        }
        
        $salmama_patterns = [
            'salmama/vertical-header',
            'salmama/split-hero',
            // اضافه کردن سایر پترن‌ها
        ];
        
        foreach ($salmama_patterns as $pattern) {
            if (strpos($post->post_content, $pattern) !== false) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * گرفتن registry برای استفاده خارجی
     */
    public function get_registry() {
        return $this->registry;
    }
    
    /**
     * گرفتن categories برای استفاده خارجی  
     */
    public function get_categories() {
        return $this->categories;
    }
}