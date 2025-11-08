<?php
/**
 * Advanced Animation Attributes for Gutenberg Blocks
 * 
 * @package Salnama_Theme
 * @since 1.0.0
 */

namespace Salnama_Theme\Inc\Blocks;

defined('ABSPATH') || exit;

class AdvancedAnimationAttributes {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', [$this, 'register_advanced_animation_attributes']);
    }
    
    /**
     * Register advanced animation attributes for all blocks
     */
    public function register_advanced_animation_attributes() {
        // ثبت attributes برای تمام بلوک‌ها
        add_filter('register_block_type_args', [$this, 'add_advanced_animation_attributes_to_blocks'], 10, 2);
    }
    
    /**
     * Add advanced animation attributes to all blocks
     *
     * @param array $args Block type arguments
     * @param string $block_type Block type name
     * @return array
     */
    public function add_advanced_animation_attributes_to_blocks($args, $block_type) {
        
        // بررسی اینکه بلوک از attributes پشتیبانی می‌کند
        if (!isset($args['attributes'])) {
            $args['attributes'] = [];
        }
        
        // اضافه کردن attributes انیمیشن پیشرفته
        $args['attributes'] = array_merge(
            $args['attributes'],
            $this->get_advanced_animation_attributes()
        );
        return $args;
    }
    
    /**
     * Get all advanced animation attributes
     *
     * @return array
     */
    private function get_advanced_animation_attributes() {
        return [
            // === انیمیشن‌های پیشرفته ===
            'advancedAnimationType' => [
                'type' => 'string',
                'default' => ''
            ],
            
            // === سیستم شرطی ===
            'animationCondition' => [
                'type' => 'string',
                'default' => 'auto'
            ],
            'animationTriggerElement' => [
                'type' => 'string',
                'default' => ''
            ],
            'animationOnClick' => [
                'type' => 'boolean',
                'default' => false
            ],
            'animationOnHover' => [
                'type' => 'boolean',
                'default' => false
            ],
            'animationTriggerOnce' => [
                'type' => 'boolean',
                'default' => true
            ],
            'animationThreshold' => [
                'type' => 'number',
                'default' => 0.5
            ],
            
            // === تنظیمات ریسپانسیو ===
            'animationMobileDisable' => [
                'type' => 'boolean',
                'default' => false
            ],
            'animationTabletDisable' => [
                'type' => 'boolean',
                'default' => false
            ],
            'animationTabletSettings' => [
                'type' => 'object',
                'default' => [
                    'duration' => 0.8,
                    'stagger' => 0.1,
                    'disable' => false
                ]
            ],
            'animationDesktopSettings' => [
                'type' => 'object',
                'default' => [
                    'duration' => 0.6,
                    'stagger' => 0.15,
                    'enableAdvanced' => true
                ]
            ],
            
            // === تنظیمات پیشرفته timing ===
            'animationStaggerDirection' => [
                'type' => 'string',
                'default' => 'normal'
            ],
            'animationSequence' => [
                'type' => 'string',
                'default' => 'sequential'
            ],
            'animationOverwrite' => [
                'type' => 'string',
                'default' => 'auto'
            ],
            'animationStagger' => [
                'type' => 'number',
                'default' => 0.1
            ],
            
            // === انیمیشن‌های چرخه‌ای ===
            'animationLoop' => [
                'type' => 'boolean',
                'default' => false
            ],
            'animationLoopDelay' => [
                'type' => 'number',
                'default' => 1
            ],
            'animationLoopRepeat' => [
                'type' => 'number',
                'default' => -1
            ],
            'animationYoyo' => [
                'type' => 'boolean',
                'default' => false
            ],
            
            // === تنظیمات performance ===
            'animationWillChange' => [
                'type' => 'boolean',
                'default' => true
            ],
            'animationGPUAcceleration' => [
                'type' => 'boolean',
                'default' => true
            ],
            'animationReduceMotion' => [
                'type' => 'boolean',
                'default' => true
            ],
            'animationForce3D' => [
                'type' => 'boolean',
                'default' => true
            ],
            
            // === انیمیشن‌های خاص ===
            'animationScrollLinked' => [
                'type' => 'boolean',
                'default' => false
            ],
            'animationScrollScrub' => [
                'type' => 'boolean',
                'default' => false
            ],
            'animationPathFollow' => [
                'type' => 'string',
                'default' => ''
            ],
            'animation3DEnabled' => [
                'type' => 'boolean',
                'default' => false
            ],
            'animationTransformOrigin' => [
                'type' => 'string',
                'default' => 'center center'
            ],
            
            // === تنظیمات پیشرفته GSAP ===
            'animationEase' => [
                'type' => 'string',
                'default' => 'power2.out'
            ],
            'animationDuration' => [
                'type' => 'number',
                'default' => 0.6
            ],
            'animationDelay' => [
                'type' => 'number',
                'default' => 0
            ],
            
            // === انیمیشن‌های پایه (برای سازگاری) ===
            'animationType' => [
                'type' => 'string',
                'default' => ''
            ],
            'animationTrigger' => [
                'type' => 'string',
                'default' => 'scroll'
            ],
            'animationX' => [
                'type' => 'number',
                'default' => 0
            ],
            'animationY' => [
                'type' => 'number',
                'default' => 50
            ],
            'animationOpacity' => [
                'type' => 'boolean',
                'default' => true
            ],
            'animationScale' => [
                'type' => 'number',
                'default' => 1
            ],
            'animationRotation' => [
                'type' => 'number',
                'default' => 0
            ],
            
            // === افکت‌های هاور ===
            'hoverAnimation' => [
                'type' => 'string',
                'default' => ''
            ],
            'hoverScale' => [
                'type' => 'number',
                'default' => 1.05
            ],
            'hoverLift' => [
                'type' => 'number',
                'default' => 0
            ],
            'hoverDuration' => [
                'type' => 'number',
                'default' => 0.3
            ],
            
            // === تنظیمات دیباگ ===
            'animationDebug' => [
                'type' => 'boolean',
                'default' => false
            ],
            'animationMarkers' => [
                'type' => 'boolean',
                'default' => false
            ]
        ];
    }
    
    /**
     * Get animation attributes for specific block types only
     * 
     * @param array $block_types Array of block types to add attributes to
     * @return void
     */
    public function register_attributes_for_specific_blocks($block_types = []) {
        $default_blocks = [
            'core/paragraph',
            'core/heading',
            'core/image',
            'core/button',
            'core/group',
            'core/columns',
            'core/cover',
            'core/media-text'
        ];

        $target_blocks = empty($block_types) ? $default_blocks : $block_types;
        
        foreach ($target_blocks as $block_type) {
            add_filter("register_block_type_args_{$block_type}", function($args) {
                if (!isset($args['attributes'])) {
                    $args['attributes'] = [];
                }
                
                $args['attributes'] = array_merge(
                    $args['attributes'],
                    $this->get_advanced_animation_attributes()
                );
                
                return $args;
            });
        }
    }
    
    /**
     * Add animation attributes via block_type_metadata for compatibility
     * 
     * @param array $metadata Block metadata
     * @return array
     */
    public function add_advanced_animation_attributes_compatibility($metadata) {
        // فقط برای وردپرس 5.8 به بالا
        if (version_compare(get_bloginfo('version'), '5.8', '<')) {
            return $metadata;
        }
        
        if (!isset($metadata['attributes'])) {
            $metadata['attributes'] = [];
        }
        
        $metadata['attributes'] = array_merge(
            $metadata['attributes'],
            $this->get_advanced_animation_attributes()
        );
        
        return $metadata;
    }
    
    /**
     * Generate data attributes for frontend display
     *
     * @param array $attributes Block attributes
     * @return string
     */
    public static function generate_animation_data_attributes($attributes) {
        if (empty($attributes)) {
            return '';
        }
        
        $data_attributes = [];
        
        // انیمیشن‌های پیشرفته
        if (!empty($attributes['advancedAnimationType'])) {
            $data_attributes['data-salnama-animated'] = 'true';
            $data_attributes['data-animation-type'] = esc_attr($attributes['advancedAnimationType']);
        }
        
        // انیمیشن‌های پایه
        if (!empty($attributes['animationType']) && empty($attributes['advancedAnimationType'])) {
            $data_attributes['data-salnama-animated'] = 'true';
            $data_attributes['data-animation-type'] = esc_attr($attributes['animationType']);
        }
        
        // تنظیمات عمومی
        $general_settings = [
            'animationDuration' => 'data-animation-duration',
            'animationDelay' => 'data-animation-delay',
            'animationEase' => 'data-animation-ease',
            'animationTrigger' => 'data-animation-trigger',
            'animationStagger' => 'data-animation-stagger',
            'animationLoop' => 'data-animation-loop',
            'animationYoyo' => 'data-animation-yoyo'
        ];
        
        foreach ($general_settings as $attr => $data_attr) {
            if (isset($attributes[$attr]) && $attributes[$attr] !== '') {
                $data_attributes[$data_attr] = esc_attr($attributes[$attr]);
            }
        }
        
        // تنظیمات شرطی
        if (!empty($attributes['animationCondition'])) {
            $data_attributes['data-animation-condition'] = esc_attr($attributes['animationCondition']);
        }
        
        if (!empty($attributes['animationTriggerElement'])) {
            $data_attributes['data-animation-trigger-element'] = esc_attr($attributes['animationTriggerElement']);
        }
        
        // تنظیمات ریسپانسیو
        if (!empty($attributes['animationMobileDisable'])) {
            $data_attributes['data-animation-mobile-disable'] = 'true';
        }
        
        // افکت‌های هاور
        if (!empty($attributes['hoverAnimation'])) {
            $data_attributes['data-hover-animation'] = esc_attr($attributes['hoverAnimation']);
        }
        
        if (!empty($attributes['hoverScale'])) {
            $data_attributes['data-hover-scale'] = esc_attr($attributes['hoverScale']);
        }
        
        if (!empty($attributes['hoverLift'])) {
            $data_attributes['data-hover-lift'] = esc_attr($attributes['hoverLift']);
        }
        
        // ساخت رشته data attributes
        $output = '';
        foreach ($data_attributes as $key => $value) {
            $output .= ' ' . $key . '="' . $value . '"';
        }
        
        return $output;
    }
    
    /**
     * Check if block has animation attributes
     *
     * @param array $attributes Block attributes
     * @return bool
     */
    public static function has_animation_attributes($attributes) {
        if (empty($attributes)) {
            return false;
        }
        
        $animation_keys = [
            'advancedAnimationType',
            'animationType',
            'animationCondition',
            'hoverAnimation'
        ];
        
        foreach ($animation_keys as $key) {
            if (!empty($attributes[$key])) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Get animation configuration for frontend
     *
     * @param array $attributes Block attributes
     * @return array
     */
    public static function get_animation_config($attributes) {
        if (!self::has_animation_attributes($attributes)) {
            return [];
        }
        
        return [
            'type' => $attributes['advancedAnimationType'] ?? $attributes['animationType'] ?? '',
            'duration' => $attributes['animationDuration'] ?? 0.6,
            'delay' => $attributes['animationDelay'] ?? 0,
            'ease' => $attributes['animationEase'] ?? 'power2.out',
            'trigger' => $attributes['animationTrigger'] ?? 'scroll',
            'condition' => $attributes['animationCondition'] ?? 'auto',
            'stagger' => $attributes['animationStagger'] ?? 0.1,
            'loop' => $attributes['animationLoop'] ?? false,
            'mobileDisable' => $attributes['animationMobileDisable'] ?? false,
            'hoverAnimation' => $attributes['hoverAnimation'] ?? '',
            'hoverScale' => $attributes['hoverScale'] ?? 1.05,
            'hoverLift' => $attributes['hoverLift'] ?? 0
        ];
    }
}
