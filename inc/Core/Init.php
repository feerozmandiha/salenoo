<?php
namespace Salnama_Theme\Inc\Core;

class Init {
    public function __construct() {
        // تست ساده: فقط یک echo برای بررسی بارگذاری
        add_action( 'wp_head', function() {
            // echo "<!-- Init class loaded successfully -->";
        });
    }
}