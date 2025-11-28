<?php
/**
 * Advanced Animation Inspector for Gutenberg Blocks
 * 
 * @package Salnama_Theme
 * @since 1.0.0
 */

namespace Salnama_Theme\Inc\Blocks;

defined('ABSPATH') || exit;

class AdvancedAnimationInspector {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_advanced_editor_assets']);
    }
    
    /**
     * Enqueue advanced animation controls for block editor
     */
    public function enqueue_advanced_editor_assets() {
        
        // بررسی وجود وابستگی‌های ضروری وردپرس
        if (!function_exists('wp_enqueue_script') || !function_exists('get_template_directory') || !function_exists('get_template_directory_uri')) {
            error_log('❌ WordPress functions not available for advanced animation controls');
            return;
        }

        $file_path = SALNAMA_THEME_PATH . '/assets/js/editor/advanced-animation-controls.js';
        $file_url = SALNAMA_ASSETS_URI . '/js/editor/advanced-animation-controls.js';
        
        if (!file_exists($file_path)) {
            error_log('❌ Advanced animation controls file missing: ' . $file_path);
            return;
        }
        
        $file_version = filemtime($file_path);
        
        // وابستگی‌های ضروری
        $dependencies = [
            'wp-blocks',
            'wp-element',
            'wp-block-editor', 
            'wp-components',
            'wp-i18n',
            'wp-compose',
            'wp-data',
            'wp-hooks'
        ];
        
        wp_enqueue_script(
            'salnama-advanced-animation-controls',
            $file_url,
            $dependencies,
            $file_version,
            true
        );
        
        // لوکالایز کردن داده‌ها برای جاوااسکریپت
        $this->localize_animation_data();
        
        error_log('✅ Advanced animation controls enqueued successfully');
    }
    
    /**
     * Localize animation data for JavaScript
     */
    private function localize_animation_data() {
        $animation_data = [
            // انیمیشن‌های پیشرفته
            'advancedAnimationTypes' => $this->get_advanced_animation_types(),
            'animationConditions' => $this->get_animation_conditions(),
            'staggerDirections' => $this->get_stagger_directions(),
            'sequenceTypes' => $this->get_sequence_types(),
            'responsiveBreakpoints' => $this->get_responsive_breakpoints(),
            
            // انیمیشن‌های پایه (برای سازگاری)
            'animationTypes' => $this->get_basic_animation_types(),
            'triggerTypes' => $this->get_trigger_types(),
            'easingFunctions' => $this->get_easing_functions(),
            'hoverEffects' => $this->get_hover_effects(),
            
            // تنظیمات عمومی
            'settings' => [
                'themePath' => SALNAMA_THEME_URI,
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('salnama_animation_nonce'),
                'debugMode' => defined('WP_DEBUG') && WP_DEBUG
            ]
        ];
        
        wp_localize_script(
            'salnama-advanced-animation-controls', 
            'salnamaAdvancedAnimationPresets', 
            $animation_data
        );
        
        // برای سازگاری با اسکریپت‌های قدیمی
        wp_localize_script(
            'salnama-advanced-animation-controls',
            'salnamaAnimationPresets',
            $animation_data
        );
    }
    
    /**
     * Get advanced animation types
     */
    private function get_advanced_animation_types() {
        return [
            ['value' => '', 'label' => 'بدون انیمیشن پیشرفته'],
            ['value' => 'typeWriter', 'label' => 'تایپ رایتر'],
            ['value' => 'staggerGrid', 'label' => 'نمایش شبکه‌ای'],
            ['value' => 'parallaxScroll', 'label' => 'پارالاکس اسکرول'],
            ['value' => 'gradientShift', 'label' => 'تغییر گرادیان'],
            ['value' => 'magneticButton', 'label' => 'دکمه مغناطیسی'],
            ['value' => 'textReveal', 'label' => 'آشکارسازی متن'],
            ['value' => 'morphShape', 'label' => 'تغییر شکل'],
            ['value' => 'heroEntrance', 'label' => 'ورود قهرمانی'],
            ['value' => 'cardReveal', 'label' => 'نمایش کارت']
        ];
    }
    
    /**
     * Get basic animation types for compatibility
     */
    private function get_basic_animation_types() {
        return [
            ['value' => '', 'label' => 'بدون انیمیشن'],
            ['value' => 'fadeIn', 'label' => 'محو شدن'],
            ['value' => 'slideUp', 'label' => 'اسلاید بالا'],
            ['value' => 'slideDown', 'label' => 'اسلاید پایین'],
            ['value' => 'slideLeft', 'label' => 'اسلاید چپ'],
            ['value' => 'slideRight', 'label' => 'اسلاید راست'],
            ['value' => 'scaleIn', 'label' => 'بزرگ شو'],
            ['value' => 'scaleOut', 'label' => 'کوچک شو'],
            ['value' => 'bounceIn', 'label' => 'پرش'],
            ['value' => 'rotateIn', 'label' => 'چرخش'],
            ['value' => 'flipInX', 'label' => 'چرخش افقی'],
            ['value' => 'flipInY', 'label' => 'چرخش عمودی'],
            ['value' => 'custom', 'label' => 'سفارشی']
        ];
    }
    
    /**
     * Get animation conditions
     */
    private function get_animation_conditions() {
        return [
            ['value' => 'auto', 'label' => 'اتوماتیک (Scroll)'],
            ['value' => 'click', 'label' => 'روی کلیک'],
            ['value' => 'hover', 'label' => 'روی هاور'],
            ['value' => 'viewport', 'label' => 'ورود به ویوپورت'],
            ['value' => 'elementVisible', 'label' => 'مشاهده المان دیگر'],
            ['value' => 'customEvent', 'label' => 'رویداد سفارشی'],
            ['value' => 'sequence', 'label' => 'در توالی مشخص'],
            ['value' => 'load', 'label' => 'پس از لود صفحه']
        ];
    }
    
    /**
     * Get trigger types
     */
    private function get_trigger_types() {
        return [
            ['value' => 'scroll', 'label' => 'اسکرول'],
            ['value' => 'hover', 'label' => 'هاور'],
            ['value' => 'click', 'label' => 'کلیک'],
            ['value' => 'auto', 'label' => 'اتوماتیک']
        ];
    }
    
    /**
     * Get stagger directions
     */
    private function get_stagger_directions() {
        return [
            ['value' => 'normal', 'label' => 'طبیعی'],
            ['value' => 'reverse', 'label' => 'معکوس'],
            ['value' => 'random', 'label' => 'تصادفی'],
            ['value' => 'center', 'label' => 'از مرکز'],
            ['value' => 'edges', 'label' => 'از لبه‌ها']
        ];
    }
    
    /**
     * Get sequence types
     */
    private function get_sequence_types() {
        return [
            ['value' => 'sequential', 'label' => 'متوالی'],
            ['value' => 'simultaneous', 'label' => 'همزمان'],
            ['value' => 'overlap', 'label' => 'همپوشانی']
        ];
    }
    
    /**
     * Get responsive breakpoints
     */
    private function get_responsive_breakpoints() {
        return [
            ['value' => 'mobile', 'label' => 'موبایل (<768px)'],
            ['value' => 'tablet', 'label' => 'تبلت (768px - 1024px)'],
            ['value' => 'desktop', 'label' => 'دسکتاپ (>1024px)']
        ];
    }
    
    /**
     * Get easing functions
     */
    private function get_easing_functions() {
        return [
            ['value' => 'power1.out', 'label' => 'Power1 Out'],
            ['value' => 'power2.out', 'label' => 'Power2 Out'],
            ['value' => 'power3.out', 'label' => 'Power3 Out'],
            ['value' => 'back.out(1.7)', 'label' => 'Back Out'],
            ['value' => 'elastic.out(1, 0.5)', 'label' => 'Elastic Out'],
            ['value' => 'bounce.out', 'label' => 'Bounce Out'],
            ['value' => 'sine.out', 'label' => 'Sine Out']
        ];
    }
    
    /**
     * Get hover effects
     */
    private function get_hover_effects() {
        return [
            ['value' => '', 'label' => 'بدون افکت هاور'],
            ['value' => 'scale', 'label' => 'بزرگنمایی'],
            ['value' => 'lift', 'label' => 'بالا آمدن'],
            ['value' => 'tilt', 'label' => 'کج شدن'],
            ['value' => 'glow', 'label' => 'درخشش']
        ];
    }
}
