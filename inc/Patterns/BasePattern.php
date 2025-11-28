<?php
/**
 * Base Pattern Class
 * کلاس پایه برای ساخت پترن‌های سالماما
 */

namespace Salnama_Theme\Inc\Patterns;

abstract class BasePattern {
    
    protected $config = [];
    
    /**
     * ساخت پترن - باید در کلاس فرزند پیاده‌سازی شود
     */
    abstract protected function build();
    
    public function __construct() {
        $this->build();
    }
    
    /**
     * تنظیم نام پترن
     */
    protected function set_name($name) {
        $this->config['name'] = 'salmama/' . $name;
        return $this;
    }
    
    /**
     * تنظیم عنوان پترن
     */
    protected function set_title($title) {
        $this->config['title'] = $title;
        return $this;
    }
    
    /**
     * تنظیم توضیحات
     */
    protected function set_description($description) {
        $this->config['description'] = $description;
        return $this;
    }
    
    /**
     * تنظیم دسته‌بندی‌ها
     */
    protected function set_categories($categories) {
        $this->config['categories'] = (array) $categories;
        return $this;
    }
    
    /**
     * تنظیم کلمات کلیدی
     */
    protected function set_keywords($keywords) {
        $this->config['keywords'] = (array) $keywords;
        return $this;
    }
    
    /**
     * تنظیم محتوای پترن
     */
    protected function set_content($content) {
        $this->config['content'] = $content;
        return $this;
    }
    
    /**
     * تنظیم عرض viewport
     */
    protected function set_viewport_width($width) {
        $this->config['viewportWidth'] = $width;
        return $this;
    }
    
    /**
     * تنظیم block types
     */
    protected function set_block_types($types) {
        $this->config['blockTypes'] = (array) $types;
        return $this;
    }
    
    /**
     * لود محتوا از فایل
     */
    protected function load_template($template_path) {
        $full_path = get_template_directory() . '/patterns/' . $template_path;
        
        if (file_exists($full_path)) {
            ob_start();
            include $full_path;
            return ob_get_clean();
        }
        
        error_log("Salmama Pattern Error: Template not found - {$full_path}");
        return '';
    }
    
    /**
     * گرفتن کانفیگ نهایی
     */
    public function get_config() {
        return $this->config;
    }
}