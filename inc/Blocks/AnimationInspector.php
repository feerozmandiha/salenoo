<?php
namespace Salnama_Theme\Inc\Blocks;

class AnimationInspector {
    public function __construct() {
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_editor_assets']);
    }
    
    public function enqueue_editor_assets() {
        $file_path = get_template_directory() . '/assets/js/editor/animation-controls.js';
        $file_url = get_template_directory_uri() . '/assets/js/editor/animation-controls.js';
        
        // بررسی وجود فایل
        if (!file_exists($file_path)) {
            error_log('Animation controls file missing: ' . $file_path);
            return;
        }
        
        // وابستگی‌های به‌روز شده
        $dependencies = [
            'wp-blocks',
            'wp-element', 
            'wp-block-editor',
            'wp-components',
            'wp-i18n',
            'wp-compose',
            'jquery'
        ];
        
        wp_enqueue_script(
            'salmama-animation-controls',
            $file_url,
            $dependencies,
            filemtime($file_path),
            true
        );
        
        // Localize animation presets
        wp_localize_script('salmama-animation-controls', 'salmamaAnimationPresets', [
            'animationTypes' => $this->get_animation_types(),
            'easingFunctions' => $this->get_easing_functions(),
            'triggerTypes' => $this->get_trigger_types(),
            'hoverEffects' => $this->get_hover_effects()
        ]);
        
        error_log('Salmama animation controls script enqueued: ' . $file_url);
    }
    
    private function get_animation_types() {
        return [
            ['value' => '', 'label' => 'بدون انیمیشن'],
            ['value' => 'fadeIn', 'label' => 'Fade In'],
            ['value' => 'slideUp', 'label' => 'Slide Up'],
            ['value' => 'slideDown', 'label' => 'Slide Down'],
            ['value' => 'slideLeft', 'label' => 'Slide Left'],
            ['value' => 'slideRight', 'label' => 'Slide Right'],
            ['value' => 'scaleIn', 'label' => 'Scale In'],
            ['value' => 'scaleOut', 'label' => 'Scale Out'],
            ['value' => 'bounceIn', 'label' => 'Bounce In'],
            ['value' => 'rotateIn', 'label' => 'Rotate In'],
            ['value' => 'flipInX', 'label' => 'Flip X'],
            ['value' => 'flipInY', 'label' => 'Flip Y'],
            ['value' => 'custom', 'label' => 'سفارشی']
        ];
    }
    
    private function get_easing_functions() {
        return [
            ['value' => 'power1.inOut', 'label' => 'Power1 InOut'],
            ['value' => 'power2.out', 'label' => 'Power2 Out'],
            ['value' => 'power3.inOut', 'label' => 'Power3 InOut'],
            ['value' => 'back.out(1.7)', 'label' => 'Back Out'],
            ['value' => 'elastic.out(1, 0.8)', 'label' => 'Elastic'],
            ['value' => 'bounce.out', 'label' => 'Bounce'],
            ['value' => 'expoScale(0.5, 2, power2.inOut)', 'label' => 'Expo Scale']
        ];
    }
    
    private function get_trigger_types() {
        return [
            ['value' => 'scroll', 'label' => 'On Scroll'],
            ['value' => 'hover', 'label' => 'On Hover'],
            ['value' => 'click', 'label' => 'On Click'],
            ['value' => 'load', 'label' => 'On Page Load'],
            ['value' => 'viewport', 'label' => 'On Viewport Enter']
        ];
    }
    
    private function get_hover_effects() {
        return [
            ['value' => '', 'label' => 'بدون افکت هاور'],
            ['value' => 'scale', 'label' => 'Scale Up'],
            ['value' => 'lift', 'label' => 'Lift Up'],
            ['value' => 'tilt', 'label' => '3D Tilt'],
            ['value' => 'glow', 'label' => 'Glow Effect'],
            ['value' => 'shrink', 'label' => 'Shrink']
        ];
    }
}