/**
 * مدیریت هوشمند لود و انیمیشن نوار شناور با Dashicons
 * نسخه بهینه‌شده با تشخیص خودکار
 */

(function() {
    'use strict';
    
    // تنظیمات
    const config = {
        selectors: {
            container: '.salnama-floating-animated',
            downloadIcon: '.dashicons-download',
            shareIcon: '.dashicons-share'
        },
        classes: {
            loaded: 'loaded',
            ready: 'ready',
            initialized: 'salnama-floating-initialized'
        },
        delays: {
            fast: 1000,
            medium: 800,
            slow: 400
        }
    };
    
    // وضعیت
    let state = {
        isInitialized: false,
        barElement: null,
        pageLoadTime: null
    };
    
    // تابع اصلی
    function init() {
        // جلوگیری از اجرای مجدد
        if (state.isInitialized) return;
        
        // علامت‌گذاری برای جلوگیری از اجرای مجدد
        state.isInitialized = true;
        
        // شروع زمان‌سنج
        state.pageLoadTime = performance.now();
        
        // صبر برای DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeBar);
        } else {
            setTimeout(initializeBar, 100);
        }
        
        // همچنین بعد از لود کامل
        window.addEventListener('load', handleWindowLoad);
    }
    
    // پیدا و فعال‌سازی نوار
    function initializeBar() {
        // جستجوی عنصر
        state.barElement = document.querySelector(config.selectors.container);
        
        if (!state.barElement) {
            console.debug('Salnama Floating Bar: Element not found in DOM');
            return;
        }
        
        // اگر قبلاً initial شده
        if (state.barElement.classList.contains(config.classes.initialized)) {
            return;
        }
        
        // علامت‌گذاری
        state.barElement.classList.add(config.classes.initialized);
        
        // محاسبه تاخیر
        const delay = calculateDelay();
        
        // فعال‌سازی با تاخیر
        setTimeout(() => {
            activateBar();
            setupEventListeners();
        }, delay);
        
        // فال‌بک: حداکثر 4 ثانیه
        setTimeout(() => {
            if (!state.barElement.classList.contains(config.classes.loaded)) {
                activateBar();
            }
        }, 4000);
        
        console.debug('Salnama Floating Bar: Initialized with delay', delay + 'ms');
    }
    
    // محاسبه تاخیر هوشمند
    function calculateDelay() {
        if (!state.pageLoadTime) return config.delays.medium;
        
        const loadTime = performance.now() - state.pageLoadTime;
        
        if (loadTime < 2000) return config.delays.fast;
        if (loadTime < 4000) return config.delays.medium;
        return config.delays.slow;
    }
    
    // فعال‌سازی نوار
    function activateBar() {
        if (!state.barElement) return;
        
        // اضافه کردن کلاس‌ها
        state.barElement.classList.add(config.classes.loaded);
        
        // کلاس ready بعد از 3 ثانیه
        setTimeout(() => {
            if (state.barElement) {
                state.barElement.classList.add(config.classes.ready);
            }
        }, 3000);
        
        // ردیابی
        trackEvent('floating_bar_activated');
    }
    
    // تنظیم event listeners
    function setupEventListeners() {
        if (!state.barElement) return;
        
        // Hover events
        state.barElement.addEventListener('mouseenter', handleMouseEnter);
        state.barElement.addEventListener('mouseleave', handleMouseLeave);
        
        // Icon clicks
        const icons = state.barElement.querySelectorAll('.dashicons');
        icons.forEach(icon => {
            icon.addEventListener('click', handleIconClick);
        });
        
        // Touch events برای موبایل
        if ('ontouchstart' in window) {
            setupTouchEvents();
        }
        
        // Responsive
        window.addEventListener('resize', debounce(handleResize, 250));
        window.addEventListener('scroll', throttle(handleScroll, 100));
    }
    
    // Handle mouse enter
    function handleMouseEnter() {
        this.style.transform = 'translateX(0) translateY(-50%)';
        this.style.animation = 'none';
    }
    
    // Handle mouse leave
    function handleMouseLeave() {
        if (this.classList.contains(config.classes.ready)) {
            this.style.transform = 'translateX(-92%) translateY(-50%)';
            this.style.animation = '';
        }
    }
    
    // Handle icon click
    function handleIconClick(e) {
        e.preventDefault();
        const icon = e.currentTarget;
        
        // افکت کلیک
        icon.style.transform = 'translateX(3px) scale(0.95)';
        setTimeout(() => {
            icon.style.transform = 'translateX(6px) scale(1.1)';
        }, 150);
        
        // تشخیص نوع آیکون
        if (icon.classList.contains('dashicons-download')) {
            handleDownload();
        } else if (icon.classList.contains('dashicons-share')) {
            handleShare();
        }
    }
    
    // Handle download
    function handleDownload() {
        // اینجا منطق دانلود خود را اضافه کنید
        console.log('Download clicked');
        
        // نمایش نوتیفیکیشن
        showNotification('در حال آماده‌سازی دانلود...');
        
        // ریدایرکت (مثال)
        // window.location.href = '#download-link';
    }
    
    // Handle share
    function handleShare() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'سالنمای نو - آلبوم جدید',
                url: window.location.href
            });
        } else {
            // فال‌بک
            window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                '_blank'
            );
        }
    }
    
    // Handle resize
    function handleResize() {
        if (!state.barElement) return;
        
        if (window.innerWidth < 768) {
            state.barElement.style.transform = 'translateX(-88%) translateY(-50%)';
        } else {
            state.barElement.style.transform = 'translateX(-92%) translateY(-50%)';
        }
    }
    
    // Handle scroll
    function handleScroll() {
        if (!state.barElement) return;
        
        const scrollTop = window.scrollY;
        if (scrollTop > 200 && !state.barElement.matches(':hover')) {
            state.barElement.style.opacity = '0.7';
        } else {
            state.barElement.style.opacity = '';
        }
    }
    
    // Setup touch events
    function setupTouchEvents() {
        let isOpen = false;
        
        state.barElement.addEventListener('touchstart', (e) => {
            if (!isOpen) {
                state.barElement.style.transform = 'translateX(0) translateY(-50%)';
                isOpen = true;
                
                // بستن با تپ خارج
                setTimeout(() => {
                    const closeListener = (event) => {
                        if (!state.barElement.contains(event.target)) {
                            state.barElement.style.transform = 'translateX(-92%) translateY(-50%)';
                            isOpen = false;
                            document.removeEventListener('touchstart', closeListener);
                        }
                    };
                    document.addEventListener('touchstart', closeListener);
                }, 10);
            }
        }, { passive: true });
    }
    
    // Handle window load
    function handleWindowLoad() {
        // اگر هنوز فعال نشده، فعالش کن
        if (state.barElement && !state.barElement.classList.contains(config.classes.loaded)) {
            setTimeout(activateBar, 500);
        }
    }
    
    // نمایش نوتیفیکیشن
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'salnama-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1000000;
            animation: salnamaFadeIn 0.3s ease;
        `;
        
        // اضافه کردن استایل انیمیشن
        if (!document.querySelector('#salnama-notification-style')) {
            const style = document.createElement('style');
            style.id = 'salnama-notification-style';
            style.textContent = `
                @keyframes salnamaFadeIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                @keyframes salnamaFadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // حذف بعد از 3 ثانیه
        setTimeout(() => {
            notification.style.animation = 'salnamaFadeOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // تابع ردیابی
    function trackEvent(eventName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'event_category': 'floating_bar'
            });
        }
    }
    
    // Utility: debounce
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Utility: throttle
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // API عمومی
    window.SalnamaFloatingBar = {
        init: init,
        show: function() {
            if (state.barElement) {
                activateBar();
            }
        },
        hide: function() {
            if (state.barElement) {
                state.barElement.classList.remove(config.classes.loaded, config.classes.ready);
            }
        }
    };
    
    // شروع خودکار
    // منتظر بمان تا wp.dom-ready صدا زده شود
    if (typeof wp !== 'undefined' && wp.domReady) {
        wp.domReady(init);
    } else {
        // فال‌بک
        document.addEventListener('DOMContentLoaded', init);
    }
    
})();