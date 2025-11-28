<?php
/**
 * Pattern Registry
 * مدیریت ثبت پترن‌ها در وردپرس
 */

namespace Salnama_Theme\Inc\Patterns;

class PatternRegistry {
    
    private $patterns = [];
    
    /**
     * اضافه کردن پترن جدید
     */
    public function add_pattern($pattern_config) {
        $default_config = [
            'title' => '',
            'categories' => [],
            'description' => '',
            'keywords' => [],
            'viewportWidth' => 1200,
            'blockTypes' => [],
            'inserter' => true,
            'templateLock' => false
        ];
        
        $this->patterns[] = wp_parse_args($pattern_config, $default_config);
    }
    
    /**
     * ثبت تمام پترن‌ها در وردپرس
     */
    public function register_all_patterns() {
        foreach ($this->patterns as $pattern) {
            if ($this->is_valid_pattern($pattern)) {
                register_block_pattern($pattern['name'], $pattern);
            }
        }
    }
    
    /**
     * بررسی معتبر بودن پترن
     */
    private function is_valid_pattern($pattern) {
        $required = ['name', 'title', 'content'];
        
        foreach ($required as $key) {
            if (empty($pattern[$key])) {
                error_log("Salmama Pattern Error: Missing required key '{$key}'");
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * گرفتن لیست پترن‌های ثبت شده
     */
    public function get_registered_patterns() {
        return $this->patterns;
    }
    
    /**
     * پاک کردن تمام پترن‌ها
     */
    public function clear_patterns() {
        $this->patterns = [];
    }
}