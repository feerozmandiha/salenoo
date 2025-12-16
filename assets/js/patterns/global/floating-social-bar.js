/**
 * مدیریت هوشمند لود و انیمیشن نوار شناور با Dashicons
 * با تاخیر متناسب با سرعت لود صفحه
 * 
 * @package Salnama Theme
 * @version 1.0.0
 */

(function() {
    'use strict';
    
    // تنظیمات قابل تغییر
    const config = {
        // تاخیرهای مختلف بر اساس سرعت لود
        delays: {
            fast: 1200,     // صفحه سریع (زیر 2 ثانیه)
            medium: 800,    // صفحه متوسط (2-4 ثانیه)
            slow: 400       // صفحه کند (بالای 4 ثانیه)
        },
        // کلاس‌های مختلف
        classes: {
            loaded: 'loaded',
            ready: 'ready',
            touchActive: 'touch-active',
            mobile: 'mobile-mode',
            pulse: 'pulse',
            loading: 'loading'
        },
        // زمان‌های انیمیشن
        animations: {
            entranceDelay: 0.5,
            breathingDelay: 3
        }
    };
    
    // متغیرهای سراسری
    let pageStartTime;
    let floatingBar = null;
    let isInitialized = false;
    let resizeTimeout;
    let dashicons = [];
    
    // تابع اصلی برای شروع
    function initFloatingBar() {
        if (isInitialized) return;
        
        floatingBar = document.querySelector('.salnama-floating-animated');
        
        if (!floatingBar) {
            if (window.location.search.includes('debug=floating-bar')) {
                console.warn('Salnama Floating Bar: Element not found');
            }
            return;
        }
        
        // پیدا کردن Dashicons
        dashicons = floatingBar.querySelectorAll('.dashicons');
        
        // شروع زمان‌سنج
        pageStartTime = performance.now();
        
        // محاسبه تاخیر هوشمند
        const smartDelay = calculateSmartDelay();
        
        // اعمال کلاس mobile اگر نیاز باشد
        if (window.innerWidth < 768) {
            floatingBar.classList.add(config.classes.mobile);
        }
        
        // اضافه کردن کلاس loading برای افکت اولیه
        floatingBar.classList.add(config.classes.loading);
        
        // تنظیم تایمر برای لود
        const loadTimer = setTimeout(() => {
            activateFloatingBar();
            clearTimeout(loadTimer);
        }, smartDelay);
        
        // حداکثر زمان انتظار (فال‌بک)
        const maxTimer = setTimeout(() => {
            if (!floatingBar.classList.contains(config.classes.loaded)) {
                activateFloatingBar();
            }
            clearTimeout(maxTimer);
        }, 4000);
        
        // تنظیم event listeners
        setupEventListeners();
        
        isInitialized = true;
        
        // لاگ برای دیباگ
        if (window.location.search.includes('debug=floating-bar')) {
            console.log('Salnama Floating Bar initialized with delay:', smartDelay + 'ms');
        }
    }
    
    // محاسبه تاخیر هوشمند
    function calculateSmartDelay() {
        if (!pageStartTime) return config.delays.medium;
        
        const loadTime = performance.now() - pageStartTime;
        
        if (loadTime < 2000) {
            return config.delays.fast;
        } else if (loadTime < 4000) {
            return config.delays.medium;
        } else {
            return config.delays.slow;
        }
    }
    
    // فعال‌سازی نوار
    function activateFloatingBar() {
        if (!floatingBar) return;
        
        // حذف کلاس loading
        floatingBar.classList.remove(config.classes.loading);
        
        // اضافه کردن کلاس loaded
        floatingBar.classList.add(config.classes.loaded);
        
        // اضافه کردن افکت پالس برای جلب توجه
        floatingBar.classList.add(config.classes.pulse);
        
        // حذف پالس بعد از 3 ثانیه
        setTimeout(() => {
            floatingBar.classList.remove(config.classes.pulse);
        }, 3000);
        
        // تاخیر برای انیمیشن تنفس
        setTimeout(() => {
            floatingBar.classList.add(config.classes.ready);
        }, config.animations.breathingDelay * 1000);
        
        // ردیابی رویداد
        trackEvent('floating_bar_loaded');
    }
    
    // تنظیم event listeners
    function setupEventListeners() {
        if (!floatingBar) return;
        
        // مدیریت hover
        floatingBar.addEventListener('mouseenter', handleMouseEnter);
        floatingBar.addEventListener('mouseleave', handleMouseLeave);
        
        // مدیریت ریسایز
        window.addEventListener('resize', handleResize);
        
        // مدیریت اسکرول
        window.addEventListener('scroll', handleScroll);
        
        // مدیریت کلیک روی Dashicons
        dashicons.forEach(icon => {
            icon.addEventListener('click', handleIconClick);
        });
        
        // مدیریت تاچ برای موبایل
        if ('ontouchstart' in window) {
            setupTouchEvents();
        }
    }
    
    // مدیریت hover
    function handleMouseEnter() {
        this.style.transform = 'translateX(0) translateY(-50%)';
        this.style.animation = 'none';
        this.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        // افکت اضافی روی آیکون‌ها
        dashicons.forEach((icon, index) => {
            setTimeout(() => {
                icon.style.transform = 'translateX(4px) scale(1.05)';
            }, index * 50);
        });
    }
    
    function handleMouseLeave() {
        if (this.classList.contains(config.classes.ready)) {
            this.style.transform = 'translateX(-92%) translateY(-50%)';
            this.style.animation = '';
            this.style.transition = 'transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)';
            
            // بازگشت آیکون‌ها به حالت عادی
            dashicons.forEach(icon => {
                icon.style.transform = '';
            });
        }
    }
    
    // مدیریت کلیک آیکون
    function handleIconClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const icon = e.currentTarget;
        const iconType = icon.classList.contains('dashicons-download') ? 'download' : 'share';
        
        // افکت کلیک
        icon.style.transform = 'translateX(3px) scale(0.95)';
        setTimeout(() => {
            icon.style.transform = 'translateX(6px) scale(1.1)';
        }, 150);
        
        // ردیابی رویداد
        trackEvent(`${iconType}_icon_clicked`);
        
        // اجرای اکشن بر اساس نوع آیکون
        if (iconType === 'download') {
            handleDownloadAction();
        } else {
            handleShareAction();
        }
    }
    
    // اکشن دانلود
    function handleDownloadAction() {
        // پیدا کردن لینک دانلود یا ایجاد modal
        const downloadUrl = '#download-album'; // می‌توانید این را تغییر دهید
        
        // نمایش notification
        showNotification('در حال آماده‌سازی دانلود...');
        
        // ریدایرکت یا باز کردن لینک
        setTimeout(() => {
            window.location.href = downloadUrl;
        }, 500);
    }
    
    // اکشن اشتراک
    function handleShareAction() {
        // بررسی پشتیبانی از Web Share API
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'آلبوم جدید سالنمای نو',
                url: window.location.href
            })
            .then(() => trackEvent('share_successful'))
            .catch(error => {
                console.log('اشتراک گذاری لغو شد:', error);
                openShareFallback();
            });
        } else {
            openShareFallback();
        }
    }
    
    // فال‌بک برای اشتراک
    function openShareFallback() {
        const shareUrl = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('آلبوم جدید سالنمای نو را ببینید');
        
        // باز کردن یک modal یا صفحه اشتراک
        const shareWindow = window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
            'share',
            'width=600,height=400'
        );
        
        if (shareWindow) {
            trackEvent('share_fallback_opened');
        }
    }
    
    // نمایش notification
    function showNotification(message) {
        // ایجاد عنصر notification
        const notification = document.createElement('div');
        notification.className = 'salnama-floating-notification';
        notification.innerHTML = `
            <span>${message}</span>
        `;
        
        // استایل‌های notification
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999999;
            animation: fadeInUp 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // حذف بعد از 3 ثانیه
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // مدیریت ریسایز
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth < 768) {
                floatingBar.classList.add(config.classes.mobile);
                if (floatingBar.classList.contains(config.classes.loaded)) {
                    floatingBar.style.transform = 'translateX(-88%) translateY(-50%)';
                }
            } else {
                floatingBar.classList.remove(config.classes.mobile);
                if (floatingBar.classList.contains(config.classes.loaded) && 
                    !floatingBar.classList.contains(config.classes.touchActive)) {
                    floatingBar.style.transform = 'translateX(-92%) translateY(-50%)';
                }
            }
        }, 200);
    }
    
    // مدیریت اسکرول
    let scrollTimeout;
    let lastScrollTop = 0;
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // فقط اگر اسکرول به پایین باشد و فاصله داشته باشد
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            if (floatingBar && !floatingBar.matches(':hover')) {
                floatingBar.style.opacity = '0.7';
                floatingBar.style.transform = 'translateX(-95%) translateY(-50%)';
            }
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (floatingBar && !floatingBar.matches(':hover')) {
                floatingBar.style.opacity = '';
                if (floatingBar.classList.contains(config.classes.loaded)) {
                    floatingBar.style.transform = floatingBar.classList.contains(config.classes.mobile) 
                        ? 'translateX(-88%) translateY(-50%)' 
                        : 'translateX(-92%) translateY(-50%)';
                }
            }
        }, 300);
        
        lastScrollTop = scrollTop;
    }
    
    // تنظیم events برای تاچ
    function setupTouchEvents() {
        if (!floatingBar) return;
        
        let touchStartTime = 0;
        let touchStartY = 0;
        let isOpen = false;
        
        floatingBar.addEventListener('touchstart', function(e) {
            touchStartTime = Date.now();
            touchStartY = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: false });
        
        floatingBar.addEventListener('touchend', function(e) {
            const touchDuration = Date.now() - touchStartTime;
            const touchEndY = e.changedTouches[0].clientY;
            const touchDistance = Math.abs(touchEndY - touchStartY);
            
            // فقط اگر تپ کوتاه و بدون کشیدن باشد
            if (touchDuration < 300 && touchDistance < 10) {
                if (!isOpen) {
                    this.classList.add(config.classes.touchActive);
                    this.style.transform = 'translateX(0) translateY(-50%)';
                    this.style.animation = 'none';
                    isOpen = true;
                    
                    // بستن با تپ خارج
                    setTimeout(() => {
                        const closeListener = function(event) {
                            if (!floatingBar.contains(event.target)) {
                                floatingBar.classList.remove(config.classes.touchActive);
                                floatingBar.style.transform = floatingBar.classList.contains(config.classes.mobile) 
                                    ? 'translateX(-88%) translateY(-50%)' 
                                    : 'translateX(-92%) translateY(-50%)';
                                floatingBar.style.animation = '';
                                isOpen = false;
                                document.removeEventListener('touchstart', closeListener);
                            }
                        };
                        document.addEventListener('touchstart', closeListener);
                    }, 10);
                }
            }
            e.preventDefault();
        }, { passive: false });
    }
    
    // تابع کمکی برای ردیابی رویدادها
    function trackEvent(eventName) {
        // برای دیباگ
        if (window.location.search.includes('debug=floating-bar')) {
            console.log('Salnama Floating Bar Event:', eventName);
        }
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'event_category': 'floating_bar',
                'event_label': 'dashicons'
            });
        }
        
        // یا هر tracking code دیگر
    }
    
    // اضافه کردن استایل‌های اضافی برای notification
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
        
        .salnama-floating-notification {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
    `;
    document.head.appendChild(style);
    
    // راه‌اندازی اولیه
    document.addEventListener('DOMContentLoaded', function() {
        // اطمینان از لود Dashicons
        if (typeof wp !== 'undefined' && wp.domReady) {
            wp.domReady(initFloatingBar);
        } else {
            setTimeout(initFloatingBar, 100);
        }
    });
    
    // همچنین بعد از لود کامل صفحه
    window.addEventListener('load', function() {
        // اگر هنوز لود نشده، با تاخیر کمتر فعال کن
        if (floatingBar && !floatingBar.classList.contains(config.classes.loaded)) {
            setTimeout(() => {
                activateFloatingBar();
            }, 600);
        }
    });
    
    // برای دسترسی از خارج
    window.SalnamaFloatingBar = {
        init: initFloatingBar,
        show: function() {
            if (floatingBar) {
                floatingBar.classList.add(config.classes.loaded);
                floatingBar.classList.add(config.classes.ready);
            }
        },
        hide: function() {
            if (floatingBar) {
                floatingBar.classList.remove(config.classes.loaded);
                floatingBar.classList.remove(config.classes.ready);
            }
        },
        toggle: function() {
            if (floatingBar) {
                if (floatingBar.classList.contains(config.classes.loaded)) {
                    this.hide();
                } else {
                    this.show();
                }
            }
        },
        download: handleDownloadAction,
        share: handleShareAction
    };
    
})();