<?php
/**
 * SvgLoader.php
 *
 * کلاس مدیریت هوشمند فایل‌های SVG.
 * این کلاس امکان بارگذاری ایمن و کارآمد آیکون‌های SVG را فراهم می‌کند.
 * فایل‌های SVG باید در مسیر /assets/icons/ قرار بگیرند.
 */

namespace Salnama_Theme\Inc\Core;

class SvgLoader {

    /**
     * حافظهٔ نهان داخلی برای جلوگیری از خواندن مکرر فایل‌ها
     *
     * @var array
     */
    private static array $cache = [];

    /**
     * دریافت محتوای SVG از فایل
     *
     * @param string $name نام فایل بدون پسوند (مثلاً 'calendar' برای calendar.svg)
     * @param array  $attrs ویژگی‌های اضافه برای تگ <svg> (مثل class, width, height)
     * @return string محتوای SVG یا رشتهٔ خالی در صورت خطا
     */
    public static function get_svg( string $name, array $attrs = [] ): string {
        // بررسی وجود در کش
        $cache_key = $name . md5( serialize( $attrs ) );
        if ( isset( self::$cache[ $cache_key ] ) ) {
            return self::$cache[ $cache_key ];
        }

        $file_path = SALNAMA_THEME_PATH . '/assets/icons/' . sanitize_file_name( $name ) . '.svg';

        // بررسی وجود فایل
        if ( ! file_exists( $file_path ) ) {
            error_log( "SVG not found: {$file_path}" );
            self::$cache[ $cache_key ] = '';
            return '';
        }

        // خواندن محتوای فایل
        $svg_content = file_get_contents( $file_path );
        if ( false === $svg_content ) {
            self::$cache[ $cache_key ] = '';
            return '';
        }

        // اعمال ویژگی‌های اضافه به تگ <svg>
        if ( ! empty( $attrs ) ) {
            $svg_content = self::add_attributes_to_svg( $svg_content, $attrs );
        }

        // sanitize ایمن با مجوزهای SVG
        $allowed_html = self::get_allowed_svg_tags();
        $svg_content   = wp_kses( $svg_content, $allowed_html );

        // ذخیره در کش و بازگردانی
        self::$cache[ $cache_key ] = $svg_content;
        return $svg_content;
    }

    /**
     * اعمال ویژگی‌های اضافه به تگ <svg>
     *
     * @param string $svg_content محتوای SVG
     * @param array  $attrs ویژگی‌ها
     * @return string
     */
    private static function add_attributes_to_svg( string $svg_content, array $attrs ): string {
        // پیدا کردن تگ <svg
        $pos = strpos( $svg_content, '<svg' );
        if ( false === $pos ) {
            return $svg_content;
        }

        // تبدیل ویژگی‌ها به رشته
        $attr_string = '';
        foreach ( $attrs as $key => $value ) {
            $attr_string .= sprintf( ' %s="%s"', sanitize_html_class( $key ), esc_attr( $value ) );
        }

        // جایگذاری پس از <svg
        return substr_replace( $svg_content, '<svg' . $attr_string, $pos, 4 );
    }

    /**
     * تعریف تگ‌ها و ویژگی‌های مجاز برای sanitize ایمن SVG
     *
     * @return array
     */
    private static function get_allowed_svg_tags(): array {
        return [
            'svg'  => [
                'xmlns'       => true,
                'width'       => true,
                'height'      => true,
                'viewbox'     => true,
                'fill'        => true,
                'stroke'      => true,
                'stroke-width' => true,
                'class'       => true,
                'id'          => true,
                'role'        => true,
                'aria-hidden' => true,
                'focusable'   => true,
                'style'       => true,
            ],
            'g'    => [
                'fill'        => true,
                'stroke'      => true,
                'stroke-width' => true,
                'transform'   => true,
                'class'       => true,
            ],
            'path' => [
                'd'           => true,
                'fill'        => true,
                'stroke'      => true,
                'stroke-width' => true,
                'class'       => true,
            ],
            'circle' => [
                'cx'          => true,
                'cy'          => true,
                'r'           => true,
                'fill'        => true,
                'stroke'      => true,
                'stroke-width' => true,
            ],
            'rect' => [
                'x'           => true,
                'y'           => true,
                'width'       => true,
                'height'      => true,
                'fill'        => true,
                'stroke'      => true,
                'stroke-width' => true,
            ],
            'line' => [
                'x1'          => true,
                'y1'          => true,
                'x2'          => true,
                'y2'          => true,
                'stroke'      => true,
                'stroke-width' => true,
            ],
            'polygon' => [
                'points'      => true,
                'fill'        => true,
                'stroke'      => true,
                'stroke-width' => true,
            ],
            'polyline' => [
                'points'      => true,
                'fill'        => true,
                'stroke'      => true,
                'stroke-width' => true,
            ],
        ];
    }
}