<?php
/**
 * Pattern Categories
 * مدیریت دسته‌بندی‌های پترن
 */

namespace Salnama_Theme\Inc\Patterns;

class PatternCategories {
    
    private $categories = [];
    
    public function __construct() {
        $this->setup_categories();
    }
    
    /**
     * تنظیم دسته‌بندی‌های پیش‌فرض
     */
    private function setup_categories() {
        $this->categories = [
            'salmama-headers' => [
                'label' => 'هدِر های سالماما',
                'description' => 'پترن‌های هدر اختصاصی سالماما'
            ],
            'salmama-hero' => [
                'label' => 'بخش‌های قهرمانی',
                'description' => 'پترن‌های بخش اصلی و هیرو'
            ],
            'salmama-features' => [
                'label' => 'ویژگی‌ها و خدمات', 
                'description' => 'پترن‌های نمایش ویژگی‌ها و خدمات'
            ],
            'salmama-cta' => [
                'label' => 'دعوت به اقدام',
                'description' => 'پترن‌های CTA و دکمه‌های فراخوان'
            ],
            'salmama-testimonials' => [
                'label' => 'نظرات مشتریان',
                'description' => 'پترن‌های نمایش نظرات و testimonials'
            ],
            'salmama-footers' => [
                'label' => 'فوتر های سالماما',
                'description' => 'پترن‌های فوتر اختصاصی'
            ]
        ];
    }
    
    /**
     * ثبت دسته‌بندی‌ها در وردپرس
     */
    public function register_categories() {
        foreach ($this->categories as $slug => $category) {
            register_block_pattern_category($slug, $category);
        }
    }
    
    /**
     * اضافه کردن دسته‌بندی جدید
     */
    public function add_category($slug, $label, $description = '') {
        $this->categories[$slug] = [
            'label' => $label,
            'description' => $description
        ];
    }
    
    /**
     * گرفتن لیست دسته‌بندی‌ها
     */
    public function get_categories() {
        return $this->categories;
    }
}