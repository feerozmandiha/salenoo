<?php
/**
 * Simple Autoloader.php
 */

namespace Salnama_Theme\Inc;

class Autoloader {
    
    public static function autoload( $class_name ): void {
        // فقط کلاس‌های مربوط به تم ما
        if ( strpos( $class_name, 'Salnama_Theme\\' ) !== 0 ) {
            return;
        }

        // حذف namespace اصلی
        $class_name = str_replace( 'Salnama_Theme\\', '', $class_name );
        
        // تبدیل به مسیر فایل
        $file_path = SALNAMA_INC_PATH . '/' . str_replace( '\\', '/', $class_name ) . '.php';

        // چندین مسیر ممکن را چک کن
        $possible_paths = [
            $file_path,
            SALNAMA_THEME_PATH . '/' . str_replace( '\\', '/', $class_name ) . '.php',
            str_replace( 'Inc/', '', $file_path ), // اگر Inc تکراری باشد
        ];

        foreach ( $possible_paths as $path ) {
            if ( file_exists( $path ) ) {
                require_once $path;
                return;
            }
        }
        
        // دیباگ
        error_log( 'Salnama Autoloader: Cannot find file for class: ' . $class_name );
        error_log( 'Searched paths: ' . implode( ', ', $possible_paths ) );
    }
}