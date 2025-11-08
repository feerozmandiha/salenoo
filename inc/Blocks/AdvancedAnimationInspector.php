<?php
namespace Salnama_Theme\Inc\Blocks;

defined('ABSPATH') || exit;

class AnimationInspector {
    public function __construct() {
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_editor_assets']);
    }

    public function enqueue_editor_assets() {
        $file_path = get_template_directory() . '/assets/js/editor/animation-controls.js';
        $file_url = get_template_directory_uri() . '/assets/js/editor/animation-controls.js';

        if (!file_exists($file_path)) {
            error_log('Animation controls file missing: ' . $file_path);
            return;
        }

        wp_enqueue_script(
            'salmama-animation-controls',
            $file_url,
            ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n', 'wp-compose', 'jquery'],
            filemtime($file_path),
            true
        );

        wp_localize_script('salmama-animation-controls', 'salmamaAnimationPresets', [
            'animationTypes' => [
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
                ['value' => 'custom', 'label' => 'سفارشی'],
                ['value' => 'typeWriter', 'label' => 'تایپ رایتر'],
                ['value' => 'staggerGrid', 'label' => 'انیمیشن شبکه‌ای'],
                ['value' => 'textReveal', 'label' => 'آشکارسازی متن'],
                ['value' => 'parallaxScroll', 'label' => 'پارالاکس اسکرول'],
                ['value' => 'magneticButton', 'label' => 'دکمه مغناطیسی']
            ],
            'easingFunctions' => [
                ['value' => 'power1.inOut', 'label' => 'Power1 InOut'],
                ['value' => 'power2.out', 'label' => 'Power2 Out'],
                ['value' => 'power3.inOut', 'label' => 'Power3 InOut'],
                ['value' => 'back.out(1.7)', 'label' => 'Back Out'],
                ['value' => 'elastic.out(1, 0.8)', 'label' => 'Elastic'],
                ['value' => 'bounce.out', 'label' => 'Bounce'],
                ['value' => 'expoScale(0.5, 2, power2.inOut)', 'label' => 'Expo Scale']
            ],
            'triggerTypes' => [
                ['value' => 'scroll', 'label' => 'اسکرول'],
                ['value' => 'hover', 'label' => 'هاور'],
                ['value' => 'click', 'label' => 'کلیک'],
                ['value' => 'load', 'label' => 'بارگذاری صفحه'],
                ['value' => 'viewport', 'label' => 'ورود به ویوپورت']
            ],
            'hoverEffects' => [
                ['value' => '', 'label' => 'بدون افکت هاور'],
                ['value' => 'scale', 'label' => 'بزرگنمایی'],
                ['value' => 'lift', 'label' => 'بالا آمدن'],
                ['value' => 'tilt', 'label' => 'کج شدن'],
                ['value' => 'glow', 'label' => 'درخشش'],
                ['value' => 'shrink', 'label' => 'کوچک شدن']
            ]
        ]);
    }
}