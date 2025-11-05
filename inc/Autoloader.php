<?php
/**
 * Autoloader.php
 *
 * بارگذار خودکار کلاس‌های پروژه با پشتیبانی از PSR-4.
 * فقط کلاس‌هایی که در فضای نام Salnama_Theme هستند را بارگذاری می‌کند.
 */

namespace Salnama_Theme\Inc;

class Autoloader {

    /**
     * متد بارگذاری خودکار کلاس‌ها
     *
     * @param string $class_name نام کامل کلاس همراه با namespace
     * @return void
     */
    public static function autoload( string $class_name ): void {
        if ( strpos( $class_name, 'Salnama_Theme\\' ) !== 0 ) {
            return;
        }

        $relative_class = substr( $class_name, strlen( 'Salnama_Theme\\' ) );
        $file_path = SALNAMA_THEME_PATH . '/' . str_replace( '\\', DIRECTORY_SEPARATOR, $relative_class ) . '.php';
        if ( file_exists( $file_path ) ) {
            require_once $file_path;
        }
    }
}