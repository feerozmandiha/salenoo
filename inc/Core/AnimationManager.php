<?php
/**
 * AnimationManager.php
 *
 * مدیریت تنظیمات انیمیشن در پنل گوتنبرگ.
 * این کلاس به همهٔ بلوک‌های قابل انیمیشن، گزینه‌های شخصی‌سازی اضافه می‌کند.
 */

namespace Salnama_Theme\Inc\Core;

class AnimationManager {

    public function run(): void {
        // اضافه کردن تنظیمات انیمیشن به تمام بلوک‌ها
        add_filter( 'block_editor_settings_all', [ $this, 'add_animation_settings' ] );
        // اعمال کلاس و داده‌های انیمیشن به بلوک‌ها هنگام رندر
        add_filter( 'render_block', [ $this, 'apply_animation_attributes' ], 10, 2 );
    }

    /**
     * اضافه کردن تنظیمات انیمیشن به پنل گوتنبرگ
     *
     * @param array $settings
     * @return array
     */
    public function add_animation_settings( array $settings ): array {
        $settings['salnamaAnimationPresets'] = $this->get_animation_presets();
        return $settings;
    }

    /**
     * فهرست پیش‌فرض انیمیشن‌ها
     *
     * @return array
     */
    private function get_animation_presets(): array {
        return [
            '' => 'بدون انیمیشن',
            'fade-up' => 'نمایش از پایین',
            'fade-down' => 'نمایش از بالا',
            'fade-left' => 'نمایش از چپ',
            'fade-right' => 'نمایش از راست',
            'zoom-in' => 'بزرگ‌نمایی',
            'slide-up' => 'لغزش از پایین',
            'slide-left' => 'لغزش از چپ',
            'hover-scale' => 'بزرگ‌شدن در هاور',
            'hover-underline' => 'زیرخط در هاور'
        ];
    }

    /**
     * اعمال ویژگی‌های انیمیشن به بلوک هنگام رندر
     *
     * @param string $block_content
     * @param array  $block
     * @return string
     */
    public function apply_animation_attributes( string $block_content, array $block ): string {
        $animation = $block['attrs']['salnamaAnimation'] ?? '';

        if ( empty( $animation ) ) {
            return $block_content;
        }

        // پیدا کردن تگ اصلی بلوک (اولین تگ باز)
        $dom = new \DOMDocument();
        libxml_use_internal_errors( true );
        $dom->loadHTML( '<?xml encoding="UTF-8">' . $block_content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
        libxml_clear_errors();

        $root = $dom->documentElement;
        if ( $root && $root->firstChild ) {
            $element = $root->firstChild;
            if ( $element instanceof \DOMElement ) {
                // اضافه کردن کلاس و داده
                $existing_class = $element->getAttribute( 'class' );
                $element->setAttribute( 'class', trim( $existing_class . ' salnama-animate' ) );
                $element->setAttribute( 'data-animation', esc_attr( $animation ) );
                $element->setAttribute( 'data-aos-id', uniqid( 'aos_' ) ); // برای شناسایی یکتا
            }
        }

        return $dom->saveHTML();
    }
}