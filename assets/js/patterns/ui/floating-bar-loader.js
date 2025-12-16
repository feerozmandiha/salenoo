/**
 * مدیریت هوشمند لود و انیمیشن نوار شناور
 * با تاخیر متناسب با سرعت لود صفحه
 */

(function() {
    'use strict';
    
    // تابع اصلی
    function initFloatingBar() {
        const floatingBar = document.querySelector('.salnama-floating-animated');
        
        if (!floatingBar) return;
        
        // زمان‌سنج برای اندازه‌گیری سرعت لود
        const pageStartTime = performance.now();
        
        // محاسبه تاخیر هوشمند
        function calculateSmartDelay() {
            // زمان لود فعلی
            const loadTime = performance.now() - pageStartTime;
            
            // اگر صفحه سریع لود شده (زیر 2 ثانیه)
            if (loadTime < 2000) {
                return 1500; // تاخیر 1.5 ثانیه
            }
            // اگر صفحه متوسط لود شده (2-4 ثانیه)
            else if (loadTime < 4000) {
                return 1000; // تاخیر 1 ثانیه
            }
            // اگر صفحه کند لود شده
            else {
                return 500; // تاخیر کم
            }
        }
        
        // اجرای انیمیشن با تاخیر هوشمند
        const smartDelay = calculateSmartDelay();
        
        setTimeout(function() {
            // اضافه کردن کلاس loaded
            floatingBar.classList.add('loaded');
            
            // تاخیر بیشتر برای انیمیشن تنفس
            setTimeout(function() {
                floatingBar.classList.add('ready');
                
                // ردیابی تعامل کاربر
                setupUserInteraction(floatingBar);
            }, 3000);
            
        }, smartDelay);
        
        // مدیریت responsive
        setupResponsiveBehavior(floatingBar);
    }
    
    // تنظیم تعامل کاربر
    function setupUserInteraction(bar) {
        let interactionTimeout;
        let isTemporarilyHidden = false;
        
        // مخفی کردن موقت هنگام اسکرول سریع
        window.addEventListener('scroll', function() {
            if (!isTemporarilyHidden) {
                bar.style.opacity = '0.6';
                bar.style.transition = 'opacity 0.3s ease';
                isTemporarilyHidden = true;
                
                clearTimeout(interactionTimeout);
                interactionTimeout = setTimeout(function() {
                    bar.style.opacity = '';
                    isTemporarilyHidden = false;
                }, 500);
            }
        });
        
        // نمایش کامل با hover
        bar.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(0) translateY(-50%)';
            this.style.animation = 'none';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.animation = '';
        });
        
        // برای موبایل (تاپ)
        if ('ontouchstart' in window) {
            let isOpen = false;
            let touchStartTime = 0;
            
            bar.addEventListener('touchstart', function(e) {
                touchStartTime = Date.now();
                e.preventDefault();
            });
            
            bar.addEventListener('touchend', function(e) {
                const touchDuration = Date.now() - touchStartTime;
                
                if (touchDuration < 300) { // تپ کوتاه
                    if (!isOpen) {
                        this.style.transform = 'translateX(0) translateY(-50%)';
                        this.style.animation = 'none';
                        isOpen = true;
                        
                        // بستن با تپ خارج
                        setTimeout(() => {
                            document.addEventListener('touchstart', function closeBar(event) {
                                if (!bar.contains(event.target)) {
                                    bar.style.transform = '';
                                    bar.style.animation = '';
                                    isOpen = false;
                                    document.removeEventListener('touchstart', closeBar);
                                }
                            });
                        }, 10);
                    }
                }
                e.preventDefault();
            });
        }
    }
    
    // تنظیم رفتار ریسپانسیو
    function setupResponsiveBehavior(bar) {
        function updateForScreenSize() {
            if (window.innerWidth < 768) {
                // موبایل: بیشتر نمایش داده شود
                if (!bar.classList.contains('loaded')) {
                    bar.style.transform = 'translateX(-85%) translateY(-50%)';
                }
                bar.style.width = '55px';
            } else {
                // دسکتاپ
                bar.style.width = '65px';
            }
        }
        
        // اجرای اولیه
        updateForScreenSize();
        
        // بروزرسانی هنگام تغییر سایز
        window.addEventListener('resize', updateForScreenSize);
    }
    
    // راه‌اندازی
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFloatingBar);
    } else {
        initFloatingBar();
    }
    
    // همچنین صبر کن تا همه منابع لود شوند
    window.addEventListener('load', function() {
        const floatingBar = document.querySelector('.salnama-floating-animated');
        if (floatingBar && !floatingBar.classList.contains('loaded')) {
            // اگر هنوز لود نشده، با تاخیر کمتر اجرا کن
            setTimeout(() => {
                floatingBar.classList.add('loaded');
                setTimeout(() => floatingBar.classList.add('ready'), 2000);
            }, 800);
        }
    });
    
})();