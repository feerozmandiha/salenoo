<?php
namespace Salnama_Theme\Inc\Core;

class LoginLogo {
    public function run() {
        add_action('login_enqueue_scripts', [$this, 'add_custom_logo_style']);
        add_filter('login_headerurl', [$this, 'change_logo_url']);
        add_filter('login_headertext', [$this, 'change_logo_title']);
    }

    /**
     * Injects custom CSS into the login page to replace the logo.
     */
    public function add_custom_logo_style() {
        $logo_url = $this->get_site_logo_url();

        if (!$logo_url) {
            return;
        }

        wp_add_inline_style(
            'login',
            sprintf(
                '.login h1 a {
                    background-image: url("%s");
                    background-size: contain;
                    background-repeat: no-repeat;
                    width: 100%%;
                    height: 100px;
                    display: block;
                }',
                esc_url($logo_url)
            )
        );
    } 

    /**
     * Returns the site logo URL from custom_logo setting.
     */
    private function get_site_logo_url(): ?string {
        // اول سعی کن لوگوی سایت را از طریق site_logo بگیر
        $site_logo_id = get_theme_mod('site_logo');
        
        // اگر site_logo وجود نداشت، از custom_logo استفاده کن
        if (!$site_logo_id) {
            $site_logo_id = get_theme_mod('custom_logo');
        }
        
        // اگر لوگوی سایت پیدا شد
        if ($site_logo_id) {
            $logo_data = wp_get_attachment_image_src($site_logo_id, 'full');
            if (!empty($logo_data[0])) {
                return $logo_data[0];
            }
        }

        // اگر لوگوی سایت وجود نداشت، از آیکون سایت استفاده کن
        $icon_url = get_site_icon_url();
        if ($icon_url) {
            return $icon_url;
        }

        // در نهایت تصویر پیش‌فرض
        return null; // بهتر است null برگردانی تا استایل اضافه نشود
    }



    public function change_logo_url() {
        return home_url();
    }

    public function change_logo_title() {
        return get_bloginfo('name');
    }
}