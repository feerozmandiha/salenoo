<?php
/**
 * Animation Controller for Salnama Theme
 * 
 * @package Salnama_Theme
 * @since 1.0.0
 */

namespace Salnama_Theme\Inc\Core;

defined('ABSPATH') || exit;

class AnimationController {
    
    /**
     * Animation files cache
     */
    private $animation_files = [];
    
    /**
     * Constructor
     */
    public function __construct() {
        add_filter('render_block', [$this, 'add_animation_data_attributes'], 10, 2);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_animation_assets']);
        add_action('wp_head', [$this, 'add_animation_performance_meta']);
        
        $this->init_animation_files();
    }
    
    /**
     * Initialize animation files cache
     */
    private function init_animation_files() {
        $this->animation_files = [
            'advanced-animations' => [
                'path' => SALNAMA_ASSETS_PATH . '/js/gsap/AdvancedAnimations.js',
                'url' => SALNAMA_ASSETS_URI . '/js/gsap/AdvancedAnimations.js',
                'deps' => ['gsap', 'scroll-trigger'],
                'handle' => 'salnama-advanced-animations'
            ],
            'conditional-animations' => [
                'path' => SALNAMA_ASSETS_PATH . '/js/gsap/ConditionalAnimations.js',
                'url' => SALNAMA_ASSETS_URI . '/js/gsap/ConditionalAnimations.js',
                'deps' => ['gsap', 'salnama-advanced-animations'],
                'handle' => 'salnama-conditional-animations'
            ],
            'responsive-manager' => [
                'path' => SALNAMA_ASSETS_PATH . '/js/gsap/ResponsiveManager.js',
                'url' => SALNAMA_ASSETS_URI . '/js/gsap/ResponsiveManager.js',
                'deps' => ['gsap', 'salnama-advanced-animations'],
                'handle' => 'salnama-responsive-manager'
            ],
            'animation-library' => [
                'path' => SALNAMA_ASSETS_PATH . '/js/gsap/AnimationLibrary.js',
                'url' => SALNAMA_ASSETS_URI . '/js/gsap/AnimationLibrary.js',
                'deps' => ['gsap', 'salnama-advanced-animations'],
                'handle' => 'salnama-animation-library'
            ],
            'gsap-engine' => [
                'path' => SALNAMA_ASSETS_PATH . '/js/gsap/GSAPEngine.js',
                'url' => SALNAMA_ASSETS_URI . '/js/gsap/GSAPEngine.js',
                'deps' => ['gsap', 'scroll-trigger', 'salnama-advanced-animations', 'salnama-animation-library'],
                'handle' => 'salnama-gsap-engine'
            ]
        ];
    }
    
    /**
     * Enqueue animation assets
     */
    public function enqueue_animation_assets() {
        if (is_admin() || wp_is_json_request() || !$this->has_animations_on_page()) {
            return;
        }
        
        $this->enqueue_gsap_core();
        $this->enqueue_animation_scripts();
        $this->enqueue_animation_styles();
        $this->localize_animation_data();
    }
    
    /**
     * Enqueue GSAP core libraries
     */
    private function enqueue_gsap_core() {
        if (!wp_script_is('gsap', 'registered')) {
            wp_enqueue_script(
                'gsap',
                'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js',
                [],
                '3.13.0',
                true
            );
        }

        if (!wp_script_is('scroll-trigger', 'registered')) {
            wp_enqueue_script(
                'scroll-trigger',
                'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js',
                ['gsap'],
                '3.13.0',
                true
            );
        }
    }
    
    /**
     * Enqueue custom animation scripts
     */
    private function enqueue_animation_scripts() {
        foreach ($this->animation_files as $file_info) {
            if (!file_exists($file_info['path'])) {
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log('❌ salnama animation file missing: ' . $file_info['path']);
                }
                continue;
            }
            
            wp_enqueue_script(
                $file_info['handle'],
                $file_info['url'],
                $file_info['deps'],
                filemtime($file_info['path']),
                true
            );
        }
        
        // اضافه کردن initializer
        $this->enqueue_main_initializer();
    }

    /**
     * Enqueue main animation initializer
     */
    private function enqueue_main_initializer() {
        $initializer_script = '
            if (typeof window.salnamaAnimationSystem === "undefined") {
                window.salnamaAnimationSystem = {
                    initialized: false,
                    init: function() {
                        if (this.initialized || typeof GSAPEngine === "undefined") {
                            return;
                        }
                        
                        new GSAPEngine();
                        this.initialized = true;
                        console.log("✅ salnama Animation System Initialized");
                    }
                };
                
                // راه‌اندازی فقط یک بار
                if (document.readyState === "loading") {
                    document.addEventListener("DOMContentLoaded", function() {
                        setTimeout(() => window.salnamaAnimationSystem.init(), 100);
                    });
                } else {
                    setTimeout(() => window.salnamaAnimationSystem.init(), 100);
                }
            }
        ';
        
        wp_add_inline_script('salnama-gsap-engine', $initializer_script);
    }
    
    /**
     * Enqueue animation styles
     */
    private function enqueue_animation_styles() {
        $css_path = SALNAMA_ASSETS_PATH . '/css/animations.css';
        if (file_exists($css_path)) {
            wp_enqueue_style(
                'salnama-animations',
                SALNAMA_ASSETS_URI . '/css/animations.css',
                [],
                filemtime($css_path)
            );
        }
    }
    
    /**
     * Localize animation data for JavaScript
     */
    private function localize_animation_data() {
        $animation_data = [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('salnama_animation_nonce'),
            'themePath' => get_template_directory_uri(),
            'isRTL' => is_rtl(),
            'reduceMotion' => $this->should_reduce_motion(),
            'debugMode' => defined('WP_DEBUG') && WP_DEBUG,
            'breakpoints' => [
                'mobile' => 768,
                'tablet' => 1024,
                'desktop' => 1200
            ],
            'animationStats' => self::get_animation_stats()
        ];
        
        // انتقال داده به اولین اسکریپت موجود
        $first_script = reset($this->animation_files);
        if ($first_script) {
            wp_localize_script(
                $first_script['handle'],
                'salnamaAnimationConfig',
                $animation_data
            );
        }
    }
    
    /**
     * Add animation data attributes to blocks
     */
    public function add_animation_data_attributes($block_content, $block) {
        // شرایط خروج سریع
        if (is_admin() || wp_is_json_request() || empty($block_content) || !is_string($block_content)) {
            return $block_content;
        }

        if (empty($block['attrs']) || !$this->has_animation_attributes($block['attrs'])) {
            return $block_content;
        }

        $attrs = $block['attrs'];
        
        // دیباگ لاگ فقط در حالت توسعه
        if (defined('WP_DEBUG') && WP_DEBUG) {
            $animation_type = $attrs['advancedAnimationType'] ?? $attrs['animationType'] ?? 'unknown';
            error_log('🎯 Processing animation for block: ' . $animation_type);
        }

        // تولید data attributes
        $data_attributes = $this->generate_data_attributes($attrs);

        if (empty($data_attributes)) {
            return $block_content;
        }

        // اضافه کردن attributes به بلوک با روش مطمئن
        return $this->inject_data_attributes_safely($block_content, $data_attributes);
    }


    /**
     * Inject data attributes safely - نسخه بهبود یافته
     */

    private function inject_data_attributes_safely($content, $data_attributes) {
        if (empty($data_attributes) || !is_string($content)) {
            return $content;
        }

        $data_string = '';
        foreach ($data_attributes as $key => $value) {
            $data_string .= ' ' . $key . '="' . esc_attr($value) . '"';
        }

        // روش ساده و مطمئن برای تزریق
        return preg_replace_callback('/<([a-zA-Z][a-zA-Z0-9]*)(\s[^>]*)?>/', 
            function($matches) use ($data_string) {
                // اگر قبلاً data attributes داشته باشد
                if (isset($matches[2]) && strpos($matches[2], 'data-salnama-animated') !== false) {
                    return $matches[0]; // تغییر نده
                }
                
                return '<' . $matches[1] . $data_string . ($matches[2] ?? '') . '>';
            }, 
            $content, 
            1 // فقط اولین تگ
        );
    }
    
    /**
     * Check if block has animation attributes
     */
    private function has_animation_attributes($attrs) {
        if (empty($attrs)) {
            return false;
        }
        
        $animation_keys = [
            'advancedAnimationType',
            'animationType',
            'animationCondition',
            'hoverAnimation'
        ];
        
        foreach ($animation_keys as $key) {
            if (!empty($attrs[$key])) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Generate data attributes from block attributes
     */
    private function generate_data_attributes($attrs) {
        $data_attrs = [];
        
        // انیمیشن اصلی
        $animation_type = $attrs['advancedAnimationType'] ?? $attrs['animationType'] ?? '';
        if (empty($animation_type)) {
            return [];
        }
        
        $data_attrs['data-salnama-animated'] = 'true';
        $data_attrs['data-animation-type'] = $animation_type;
        
        // تنظیمات عمومی
        $general_settings = [
            'animationDuration' => 'data-animation-duration',
            'animationDelay' => 'data-animation-delay', 
            'animationEase' => 'data-animation-ease',
            'animationTrigger' => 'data-animation-trigger',
            'animationStagger' => 'data-animation-stagger',
            'animationCondition' => 'data-animation-condition'
        ];
        
        foreach ($general_settings as $attr => $data_attr) {
            if (isset($attrs[$attr]) && $attrs[$attr] !== '') {
                $data_attrs[$data_attr] = $attrs[$attr];
            }
        }
        
        // تنظیمات پیشرفته
        if (isset($attrs['animationLoop'])) {
            $data_attrs['data-animation-loop'] = $attrs['animationLoop'] ? 'true' : 'false';
        }
        
        if (isset($attrs['animationYoyo'])) {
            $data_attrs['data-animation-yoyo'] = $attrs['animationYoyo'] ? 'true' : 'false';
        }
        
        if (isset($attrs['animationRepeat'])) {
            $data_attrs['data-animation-repeat'] = $attrs['animationRepeat'];
        }
        
        // سیستم شرطی
        if (!empty($attrs['animationTriggerElement'])) {
            $data_attrs['data-animation-trigger-element'] = $attrs['animationTriggerElement'];
        }
        
        // تنظیمات ریسپانسیو
        if (isset($attrs['animationMobileDisable'])) {
            $data_attrs['data-animation-mobile-disable'] = $attrs['animationMobileDisable'] ? 'true' : 'false';
        }
        
        // افکت‌های هاور
        if (!empty($attrs['hoverAnimation'])) {
            $data_attrs['data-hover-animation'] = $attrs['hoverAnimation'];
            
            if ($attrs['hoverAnimation'] === 'scale' && isset($attrs['hoverScale'])) {
                $data_attrs['data-hover-scale'] = $attrs['hoverScale'];
            }
            
            if ($attrs['hoverAnimation'] === 'lift' && isset($attrs['hoverLift'])) {
                $data_attrs['data-hover-lift'] = $attrs['hoverLift'];
            }
        }
        
        // تنظیمات سفارشی
        if ($animation_type === 'custom') {
            $custom_settings = [
                'animationX' => 'data-animation-x',
                'animationY' => 'data-animation-y',
                'animationScale' => 'data-animation-scale',
                'animationRotation' => 'data-animation-rotation'
            ];
            
            foreach ($custom_settings as $attr => $data_attr) {
                if (isset($attrs[$attr])) {
                    $data_attrs[$data_attr] = $attrs[$attr];
                }
            }
            
            if (isset($attrs['animationOpacity'])) {
                $data_attrs['data-animation-opacity'] = $attrs['animationOpacity'] ? 'true' : 'false';
            }
        }
        
        // انیمیشن‌های پیشرفته
        if (!empty($attrs['advancedAnimationType'])) {
            $advanced_settings = [
                'animationStaggerDirection' => 'data-animation-stagger-direction',
                'animationSequence' => 'data-animation-sequence',
                'animationScrollLinked' => 'data-animation-scroll-linked',
                'animation3DEnabled' => 'data-animation-3d-enabled'
            ];
            
            foreach ($advanced_settings as $attr => $data_attr) {
                if (isset($attrs[$attr])) {
                    $data_attrs[$data_attr] = is_bool($attrs[$attr]) ? ($attrs[$attr] ? 'true' : 'false') : $attrs[$attr];
                }
            }
        }
        
        // Escape all values
        foreach ($data_attrs as $key => $value) {
            $data_attrs[$key] = esc_attr($value);
        }
        
        return $data_attrs;
    }
    
    /**
     * Inject data attributes into block content
     */
    private function inject_data_attributes($content, $data_attributes) {
        if (empty($data_attributes) || !is_string($content)) {
            return $content;
        }
        
        $data_string = '';
        foreach ($data_attributes as $key => $value) {
            $data_string .= ' ' . $key . '="' . $value . '"';
        }
        
        // استفاده از DOMDocument برای اطمینان از صحت
        if (extension_loaded('dom') && class_exists('DOMDocument')) {
            return $this->inject_using_dom($content, $data_string);
        }
        
        // fallback به regex بهبود یافته
        return $this->inject_using_regex($content, $data_string);
    }
    
    /**
     * Inject using DOMDocument (more reliable)
     */
    private function inject_using_dom($content, $data_string) {
        $dom = new \DOMDocument();
        libxml_use_internal_errors(true);

        // Wrap content in a div for parsing
        $wrapped_content = '<div>' . $content . '</div>';

        if ($dom->loadHTML(mb_convert_encoding($wrapped_content, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD)) {
            $xpath = new \DOMXPath($dom);
            $first_element = $xpath->query('//div/*[1]')->item(0);

            if ($first_element && $first_element instanceof \DOMElement) {
                // Parse data attributes and add them to the element
                preg_match_all('/([a-zA-Z0-9\-]+)="([^"]*)"/', $data_string, $matches, PREG_SET_ORDER);

                foreach ($matches as $match) {
                    $attr_name = $match[1];
                    $attr_value = $match[2];

                    // Validate attribute name to ensure it's safe to set
                    if (preg_match('/^[a-zA-Z0-9\-_:]+$/', $attr_name)) {
                        // اطمینان از اینکه عنصر معتبر است
                        if (is_callable([$first_element, 'setAttribute'])) {
                            $first_element->setAttribute($attr_name, $attr_value);
                        }
                    }
                }

                // Get the modified content
                $content = $dom->saveHTML($first_element);
            }
        }

        libxml_clear_errors();
        return $content;
    }
        
    /**
     * Inject using regex (fallback)
     */
    private function inject_using_regex($content, $data_string) {
        // پیدا کردن اولین تگ HTML
        if (preg_match('/<([a-zA-Z][a-zA-Z0-9]*)(\s[^>]*)?>/', $content, $matches, PREG_OFFSET_CAPTURE)) {
            $tag = $matches[1][0];
            $full_match = $matches[0][0];
            $position = $matches[0][1];
            
            // جایگزینی تگ اول
            $new_tag = str_replace('<' . $tag, '<' . $tag . $data_string, $full_match);
            $content = substr_replace($content, $new_tag, $position, strlen($full_match));
        }
        
        return $content;
    }
    
    /**
     * Check if page has animations
     */
    private function has_animations_on_page() {
        global $post, $wp_query;
        
        if (is_admin() || wp_is_json_request()) {
            return false;
        }
        
        // همیشه در صفحات خاص انیمیشن داشته باشیم
        if (is_front_page() || is_page() || is_singular()) {
            return true;
        }
        
        // بررسی پست فعلی
        if ($post && is_singular()) {
            $content = $post->post_content;
            if (strpos($content, 'advancedAnimationType') !== false || 
                strpos($content, 'animationType') !== false) {
                return true;
            }
        }
        
        // بررسی archive pages
        if ($wp_query && $wp_query->posts) {
            foreach ($wp_query->posts as $post_item) {
                if (strpos($post_item->post_content, 'advancedAnimationType') !== false ||
                    strpos($post_item->post_content, 'animationType') !== false) {
                    return true;
                }
            }
        }
        
        return false;
    }

    
    /**
     * Check if reduce motion should be applied
     */
    private function should_reduce_motion() {
        // بررسی media query یا کوکی کاربر
        if (isset($_COOKIE['reduce-motion']) && $_COOKIE['reduce-motion'] === 'true') {
            return true;
        }
        
        return false;
    }
    
    /**
     * Add performance meta tags
     */
    public function add_animation_performance_meta() {
        if (!$this->has_animations_on_page()) {
            return;
        }
        
        echo '<meta name="salnama-animations" content="enabled" />' . "\n";
        echo '<meta name="gsap-version" content="3.12.2" />' . "\n";
        
        // اضافه کردن inline style برای جلوگیری از FOUC
        echo '<style id="salnama-animation-fouc">';
        echo '[data-salnama-animated="true"] { visibility: hidden; }';
        echo '[data-salnama-animated="true"].salnama-animated-element { visibility: visible; }';
        echo '</style>' . "\n";
    }
    
    /**
     * Get animation statistics for current page
     */
    public static function get_animation_stats() {
        global $post, $wp_query;
        
        $stats = [
            'total_animated_blocks' => 0,
            'animation_types' => [],
            'advanced_animations' => 0,
            'basic_animations' => 0
        ];
        
        if (!$post && !$wp_query->posts) {
            return $stats;
        }
        
        $posts_to_check = $post ? [$post] : $wp_query->posts;
        
        foreach ($posts_to_check as $post_item) {
            // بررسی انیمیشن‌ها در محتوا
            if (preg_match_all('/"advancedAnimationType":"([^"]*)"/', $post_item->post_content, $matches)) {
                $stats['advanced_animations'] += count($matches[1]);
                $stats['animation_types'] = array_merge($stats['animation_types'], $matches[1]);
            }
            
            if (preg_match_all('/"animationType":"([^"]*)"/', $post_item->post_content, $matches)) {
                $stats['basic_animations'] += count($matches[1]);
                $stats['animation_types'] = array_merge($stats['animation_types'], $matches[1]);
            }
        }
        
        $stats['total_animated_blocks'] = $stats['advanced_animations'] + $stats['basic_animations'];
        $stats['animation_types'] = array_unique($stats['animation_types']);
        
        return $stats;
    }
}