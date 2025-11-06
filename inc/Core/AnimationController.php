<?php
namespace Salnama_Theme\Inc\Core;

class AnimationController {
    public function __construct() {
        add_filter('render_block', [$this, 'add_animation_data_attributes'], 10, 2);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_gsap']);
    }
    
    public function enqueue_gsap() {
        if (!is_admin() && !wp_is_json_request()) {
            // GSAP CDN
            wp_enqueue_script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', [], '3.12.2', true);
            wp_enqueue_script('scroll-trigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', ['gsap'], '3.12.2', true);
            
            // فایل اصلی انیمیشن‌ها
            wp_enqueue_script('salmama-gsap-engine', 
                get_template_directory_uri() . '/assets/js/gsap/GSAPEngine.js',
                ['gsap', 'scroll-trigger'], 
                filemtime(get_template_directory() . '/assets/js/gsap/GSAPEngine.js'), 
                true
            );
        }
    }
    
    public function add_animation_data_attributes($block_content, $block) {
        // بررسی شرایط
        if (is_admin() || empty($block_content) || !is_string($block_content)) {
            return $block_content;
        }
        
        // فقط در frontend پردازش شود
        if (wp_is_json_request() || (defined('REST_REQUEST') && REST_REQUEST)) {
            return $block_content;
        }
        
        if (!empty($block['attrs']) && !empty($block['attrs']['animationType']) && $block['attrs']['animationType'] !== '') {
            $attrs = $block['attrs'];
            
            // روش ساده‌تر و مطمئن‌تر
            $block_content = $this->add_attributes_directly($block_content, $attrs);
        }
        
        return $block_content;
    }
    
    private function add_attributes_directly($content, $attrs) {
        $data_attrs = [];
        
        // افزودن attributes اصلی
        $data_attrs[] = 'data-salmama-animated="true"';
        $data_attrs[] = 'data-animation-type="' . esc_attr($attrs['animationType']) . '"';
        $data_attrs[] = 'data-animation-duration="' . esc_attr($attrs['animationDuration'] ?? 0.6) . '"';
        $data_attrs[] = 'data-animation-delay="' . esc_attr($attrs['animationDelay'] ?? 0) . '"';
        $data_attrs[] = 'data-animation-ease="' . esc_attr($attrs['animationEase'] ?? 'power2.out') . '"';
        $data_attrs[] = 'data-animation-trigger="' . esc_attr($attrs['animationTrigger'] ?? 'scroll') . '"';
        
        // داده‌های سفارشی
        if ($attrs['animationType'] === 'custom') {
            $data_attrs[] = 'data-animation-x="' . esc_attr($attrs['animationX'] ?? 0) . '"';
            $data_attrs[] = 'data-animation-y="' . esc_attr($attrs['animationY'] ?? 50) . '"';
            $data_attrs[] = 'data-animation-scale="' . esc_attr($attrs['animationScale'] ?? 1) . '"';
            $data_attrs[] = 'data-animation-rotation="' . esc_attr($attrs['animationRotation'] ?? 0) . '"';
            $data_attrs[] = 'data-animation-opacity="' . ($attrs['animationOpacity'] ? 'true' : 'false') . '"';
        }
        
        // هاور افکت‌ها
        if (!empty($attrs['hoverAnimation'])) {
            $data_attrs[] = 'data-hover-animation="' . esc_attr($attrs['hoverAnimation']) . '"';
            
            if ($attrs['hoverAnimation'] === 'scale' && isset($attrs['hoverScale'])) {
                $data_attrs[] = 'data-hover-scale="' . esc_attr($attrs['hoverScale']) . '"';
            }
            
            if ($attrs['hoverAnimation'] === 'lift' && isset($attrs['hoverLift'])) {
                $data_attrs[] = 'data-hover-lift="' . esc_attr($attrs['hoverLift']) . '"';
            }
        }
        
        $data_string = implode(' ', $data_attrs);
        
        // اضافه کردن به اولین تگ div
        if (strpos($content, '<div') !== false) {
            $content = preg_replace('/<div([^>]*)>/', '<div$1 ' . $data_string . '>', $content, 1);
        }
        // اگر div نبود، به اولین تگ اضافه کن
        else if (preg_match('/<([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/', $content, $matches)) {
            $content = preg_replace('/<' . $matches[1] . '([^>]*)>/', '<' . $matches[1] . '$1 ' . $data_string . '>', $content, 1);
        }
        
        return $content;
    }
}