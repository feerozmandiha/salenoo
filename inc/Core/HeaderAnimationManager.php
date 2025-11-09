<?php
/**
 * Header Animation Controller for Salnama Theme
 * 
 * @package Salnama_Theme
 * @since 1.0.0
 */

namespace Salnama_Theme\Inc\Core;

defined('ABSPATH') || exit;

class HeaderAnimationManager {
    public function __construct() {
        add_action('wp_enqueue_scripts', [$this, 'enqueue_header_animations']);
    }
    
    public function enqueue_header_animations() {
        // فقط در دسکتاپ و زمانی که هدر وجود دارد
            // اسکریپت انیمیشن‌های هدر
            wp_enqueue_script(
                'salnama-header-animations',
                get_template_directory_uri() . '/assets/js/header/VerticalHeaderAnimator.js', // ✅ مسیر صحیح
                ['gsap'], // ✅ وابستگی به GSAP
                filemtime(get_template_directory() . '/assets/js/header/VerticalHeaderAnimator.js'), // ✅ مسیر باید با مسیر بالا یکسان باشد
                true
            );

    }
    
    private function has_vertical_header() {
        global $post;
        if (!$post) return false;
        
        // بررسی وجود هدر عمودی در محتوا
        return strpos($post->post_content, 'minimal-vertical-header') !== false;
    }
}

new HeaderAnimationManager();