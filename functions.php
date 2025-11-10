<?php
/**
 * Salnama Theme - functions.php
 *
 * این فایل فقط شامل تعاریف شرطی ثابت‌ها و فراخوانی کلاس اصلی Init می‌شود.
 * تمام منطق از طریق سیستم شی‌گرا و ماژولار اجرا خواهد شد.
 */

defined( 'ABSPATH' ) || exit;

// تعریف ثابت‌ها به صورت شرطی
if ( ! defined( 'SALNAMA_THEME_VERSION' ) ) {
    define( 'SALNAMA_THEME_VERSION', '1.0.4' );
}

if ( ! defined( 'SALNAMA_THEME_PATH' ) ) {
    define( 'SALNAMA_THEME_PATH', get_template_directory() );
}

if ( ! defined( 'SALNAMA_THEME_URI' ) ) {
    define( 'SALNAMA_THEME_URI', get_template_directory_uri() );
}

if ( ! defined( 'SALNAMA_INC_PATH' ) ) {
    define( 'SALNAMA_INC_PATH', SALNAMA_THEME_PATH . '/inc' );
}

if ( ! defined( 'SALNAMA_ASSETS_URI' ) ) {
    define( 'SALNAMA_ASSETS_URI', SALNAMA_THEME_URI . '/assets' );
}

if ( ! defined( 'SALNAMA_ASSETS_PATH' ) ) {
    define( 'SALNAMA_ASSETS_PATH', SALNAMA_THEME_PATH . '/assets' );
}

// فراخوانی Autoloader
require_once SALNAMA_INC_PATH . '/Autoloader.php';

// ثبت autoloader برای فضای نام Salnama_Theme
spl_autoload_register( [ 'Salnama_Theme\Inc\Autoloader', 'autoload' ] );

// اجرای سیستم اصلی
// این خط باعث می‌شود Autoloader فراخوانی شود
if ( ! class_exists( 'Salnama_Theme\Inc\Core\Init' ) ) {
    wp_die( 'Autoloader نتوانست کلاس Init را پیدا کند.' );
}
new Salnama_Theme\Inc\Core\Init();

