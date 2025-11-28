<?php
/**
 * GSAP Loader for Salnama Theme
 * بارگذاری قطعی و مطمئن GSAP
 */

namespace Salnama_Theme\Inc\Core;

class GSAPLoader {

    public function run(): void {
        add_action('wp_enqueue_scripts', [$this, 'load_gsap_assets'], 1);
        add_action('wp_head', [$this, 'add_gsap_preload'], 1);
        add_action('wp_footer', [$this, 'add_gsap_fallback'], 99); // Fallback در فوتر
    }

    /**
     * بارگذاری قطعی GSAP
     */
    public function load_gsap_assets(): void {
        if (is_admin() || wp_is_json_request()) {
            return;
        }

        error_log('🚀 GSAPLoader: Force loading GSAP assets...');

        // از CDN جایگزین استفاده کنید
        $gsap_url = 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js';
        $scroll_trigger_url = 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/ScrollTrigger.min.js';

        // بارگذاری GSAP با روش مطمئن
        wp_enqueue_script(
            'salnama-gsap-core',
            $gsap_url,
            [],
            '3.12.2',
            false // بارگذاری در header برای اطمینان بیشتر
        );

        // بارگذاری ScrollTrigger
        wp_enqueue_script(
            'salnama-scroll-trigger', 
            $scroll_trigger_url,
            ['salnama-gsap-core'],
            '3.12.2',
            false // بارگذاری در header
        );

        // اضافه کردن verification script
        $verification_script = "
            console.log('🚀 GSAPLoader: Starting verification...');
            
            // چندین روش برای بررسی GSAP
            function checkGSAP() {
                // روش ۱: بررسی gsap global
                if (typeof gsap !== 'undefined') {
                    console.log('✅ GSAPLoader: GSAP loaded as global variable - v' + (gsap.version || '3.12.2'));
                    return gsap;
                }
                
                // روش ۲: بررسی window.gsap
                if (window.gsap) {
                    console.log('✅ GSAPLoader: GSAP loaded as window.gsap - v' + (window.gsap.version || '3.12.2'));
                    return window.gsap;
                }
                
                // روش ۳: بررسی از طریق document
                if (window._gsap) {
                    console.log('✅ GSAPLoader: GSAP loaded as _gsap');
                    return window._gsap;
                }
                
                console.error('❌ GSAPLoader: GSAP not found in any scope');
                return null;
            }
            
            // بررسی اولیه
            const gsapInstance = checkGSAP();
            
            if (gsapInstance) {
                // ثبت ScrollTrigger
                if (typeof ScrollTrigger !== 'undefined') {
                    gsapInstance.registerPlugin(ScrollTrigger);
                    console.log('✅ GSAPLoader: ScrollTrigger registered successfully');
                }
                
                // علامت‌گذاری برای سایر اسکریپت‌ها
                window.salnamaGSAPLoaded = true;
                window.salnamaGSAP = gsapInstance;
                
                // رویداد برای اطلاع سایر اسکریپت‌ها
                window.dispatchEvent(new CustomEvent('salnama:gsap-loaded', {
                    detail: { gsap: gsapInstance }
                }));
                
            } else {
                console.error('❌ GSAPLoader: GSAP verification failed');
                window.salnamaGSAPLoaded = false;
                
                // تلاش مجدد بعد از تاخیر
                setTimeout(() => {
                    const retryGSAP = checkGSAP();
                    if (retryGSAP) {
                        console.log('✅ GSAPLoader: GSAP found on retry');
                        window.salnamaGSAPLoaded = true;
                        window.salnamaGSAP = retryGSAP;
                        window.dispatchEvent(new CustomEvent('salnama:gsap-loaded'));
                    }
                }, 1000);
            }
        ";

        wp_add_inline_script('salnama-scroll-trigger', $verification_script);
        
        error_log('🚀 GSAPLoader: GSAP assets loaded with verification');
    }

    /**
     * پیش‌بارگذاری GSAP
     */
    public function add_gsap_preload(): void {
        if (is_admin() || wp_is_json_request()) {
            return;
        }

        echo '<!-- GSAP Preload by Salnama -->' . "\n";
        echo '<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">' . "\n";
        echo '<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>' . "\n";
        
        error_log('🚀 GSAPLoader: Preload tags added');
    }

    /**
     * Fallback برای مواردی که CDN کار نمی‌کند
     */
    public function add_gsap_fallback(): void {
        if (is_admin() || wp_is_json_request()) {
            return;
        }

        echo '<!-- GSAP Fallback by Salnama -->' . "\n";
        echo '<script>';
        echo 'if (typeof gsap === "undefined" && !window.salnamaGSAPLoaded) {';
        echo '  console.warn("⚠️ GSAPLoader: Loading fallback from local...");';
        echo '  var script1 = document.createElement("script");';
        echo '  script1.src = "https://unpkg.com/gsap@3.12.2/dist/gsap.min.js";';
        echo '  script1.onload = function() {';
        echo '    var script2 = document.createElement("script");';
        echo '    script2.src = "https://unpkg.com/gsap@3.12.2/dist/ScrollTrigger.min.js";';
        echo '    script2.onload = function() {';
        echo '      console.log("✅ GSAPLoader: Fallback loaded successfully");';
        echo '      window.salnamaGSAPLoaded = true;';
        echo '      window.dispatchEvent(new CustomEvent("salnama:gsap-loaded"));';
        echo '    };';
        echo '    document.head.appendChild(script2);';
        echo '  };';
        echo '  document.head.appendChild(script1);';
        echo '}';
        echo '</script>' . "\n";
        
        error_log('🚀 GSAPLoader: Fallback script added');
    }
}