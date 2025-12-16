/**
 * مدیریت نوار شناور با قابلیت‌های جلب توجه
 */

(function() {
    'use strict';
    
    const config = {
        selectors: {
            container: '.salnama-floating-animated',
            downloadIcon: '.dashicons-download',
            shareIcon: '.dashicons-share'
        },
        classes: {
            loaded: 'loaded',
            ready: 'ready',
            attention: 'attention',
            scrolled: 'scrolled',
            visible: 'salnama-visible'
        },
        timings: {
            initialDelay: 800,
            breathingDelay: 2000,
            attentionDelay: 5000,
            hideOnScrollDelay: 300
        },
        thresholds: {
            scrollHide: 100,
            attentionTrigger: 15000 // 15 ثانیه
        }
    };
    
    let state = {
        bar: null,
        icons: [],
        hasInteracted: false,
        lastAttentionTime: 0,
        scrollTimer: null
    };
    
    // تابع اصلی
    function init() {
        // جستجوی عنصر
        state.bar = document.querySelector(config.selectors.container);
        
        if (!state.bar) {
            console.debug('Salnama Floating Bar: Element not found');
            return;
        }
        
        // تنظیم tooltip برای آیکون‌ها
        setupIcons();
        
        // شروع انیمیشن‌ها
        startAnimations();
        
        // تنظیم event listeners
        setupEventListeners();
        
        // جلب توجه اولیه
        setTimeout(triggerAttention, config.timings.attentionDelay);
        
        // جلب توجه دوره‌ای
        setInterval(() => {
            if (!state.hasInteracted) {
                triggerAttention();
            }
        }, config.thresholds.attentionTrigger);
        
        console.log('Salnama Floating Bar: Initialized successfully');
    }
    
    // تنظیم آیکون‌ها
    function setupIcons() {
        state.icons = state.bar.querySelectorAll('.dashicons');
        
        state.icons.forEach((icon, index) => {
            // تنظیم order برای انیمیشن‌های مرحله‌ای
            icon.style.setProperty('--icon-order', index);
            
            // تنظیم tooltip
            if (icon.classList.contains('dashicons-download')) {
                icon.setAttribute('data-tooltip', 'دانلود آلبوم');
            } else if (icon.classList.contains('dashicons-share')) {
                icon.setAttribute('data-tooltip', 'اشتراک گذاری');
            }
            
            // کلیک آیکون
            icon.addEventListener('click', handleIconClick);
            
            // ثبت interaction
            icon.addEventListener('mouseenter', () => {
                state.hasInteracted = true;
            });
        });
    }
    
    // شروع انیمیشن‌ها
    function startAnimations() {
        // تاخیر اولیه
        setTimeout(() => {
            state.bar.classList.add(config.classes.loaded);
            
            // انیمیشن تنفس
            setTimeout(() => {
                state.bar.classList.add(config.classes.ready);
                
                // اضافه کردن کلاس visible برای نمایش
                state.bar.classList.add(config.classes.visible);
                
                // اضافه کردن نور هاله‌ای برای 3 ثانیه
                state.bar.style.animation = 'haloPulse 2s ease-in-out 3';
                setTimeout(() => {
                    state.bar.style.animation = '';
                }, 6000);
                
            }, config.timings.breathingDelay);
            
        }, config.timings.initialDelay);
    }
    
    // جلب توجه
    function triggerAttention() {
        if (!state.bar || state.hasInteracted) return;
        
        const now = Date.now();
        if (now - state.lastAttentionTime < 10000) return; // هر 10 ثانیه
        
        state.bar.classList.add(config.classes.attention);
        state.lastAttentionTime = now;
        
        // حذف کلاس بعد از انیمیشن
        setTimeout(() => {
            state.bar.classList.remove(config.classes.attention);
        }, 2400); // 3 بار * 0.8 ثانیه
    }
    
    // تنظیم event listeners
    function setupEventListeners() {
        if (!state.bar) return;
        
        // Hover
        state.bar.addEventListener('mouseenter', handleMouseEnter);
        state.bar.addEventListener('mouseleave', handleMouseLeave);
        
        // Scroll
        window.addEventListener('scroll', handleScroll);
        
        // Touch برای موبایل
        if ('ontouchstart' in window) {
            setupTouchEvents();
        }
        
        // ثبت interaction با نوار
        state.bar.addEventListener('mouseenter', () => {
            state.hasInteracted = true;
            state.bar.classList.remove(config.classes.attention);
        });
    }
    
    // Handle mouse enter
    function handleMouseEnter() {
        this.style.transform = 'translateX(0) translateY(-50%)';
        this.style.animation = 'none';
        this.classList.remove(config.classes.scrolled);
    }
    
    // Handle mouse leave
    function handleMouseLeave() {
        if (this.classList.contains(config.classes.ready)) {
            this.style.transform = 'translateX(-85%) translateY(-50%)';
            this.style.animation = '';
        }
    }
    
    // Handle icon click
    function handleIconClick(e) {
        e.preventDefault();
        const icon = e.currentTarget;
        
        // افکت کلیک
        icon.style.transform = 'translateX(5px) scale(0.9)';
        setTimeout(() => {
            icon.style.transform = 'translateX(8px) scale(1.15)';
        }, 150);
        
        // ثبت interaction
        state.hasInteracted = true;
        
        // اجرای اکشن
        if (icon.classList.contains('dashicons-download')) {
            handleDownload();
        } else {
            handleShare();
        }
        
        // پخش sound effect (اختیاری)
        playClickSound();
    }
    
    // Handle download
    function handleDownload() {
        showNotification('📥 در حال آماده‌سازی دانلود...');
        
        // می‌توانید اینجا لینک دانلود را اضافه کنید
        // window.location.href = 'your-download-link';
        
        // یا باز کردن modal
        // openDownloadModal();
    }
    
    // Handle share
    function handleShare() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'آلبوم جدید سالنمای نو را ببینید',
                url: window.location.href
            });
        } else {
            showNotification('🔗 لینک کپی شد!');
            // یا باز کردن modal اشتراک
            // openShareModal();
        }
    }
    
    // Handle scroll
    function handleScroll() {
        if (!state.bar || state.bar.matches(':hover')) return;
        
        clearTimeout(state.scrollTimer);
        
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollTop > config.thresholds.scrollHide) {
            state.bar.classList.add(config.classes.scrolled);
        } else {
            state.bar.classList.remove(config.classes.scrolled);
        }
        
        // مخفی شدن کامل در اسکرول زیاد
        state.scrollTimer = setTimeout(() => {
            if (scrollTop > 300 && !state.bar.matches(':hover')) {
                state.bar.style.opacity = '0.5';
            }
        }, config.timings.hideOnScrollDelay);
    }
    
    // Setup touch events
    function setupTouchEvents() {
        let touchStartX = 0;
        let isOpen = false;
        
        state.bar.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        state.bar.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const deltaX = touchEndX - touchStartX;
            
            // اگر کشیدن به راست
            if (deltaX > 30 && !isOpen) {
                state.bar.style.transform = 'translateX(0) translateY(-50%)';
                isOpen = true;
                
                // بستن اتوماتیک بعد از 5 ثانیه
                setTimeout(() => {
                    if (isOpen && !state.bar.matches(':hover')) {
                        state.bar.style.transform = 'translateX(-85%) translateY(-50%)';
                        isOpen = false;
                    }
                }, 5000);
            }
            // اگر کشیدن به چپ و باز است
            else if (deltaX < -30 && isOpen) {
                state.bar.style.transform = 'translateX(-85%) translateY(-50%)';
                isOpen = false;
            }
        }, { passive: true });
    }
    
    // نمایش نوتیفیکیشن
    function showNotification(message) {
        // حذف نوتیفیکیشن قبلی
        const oldNotification = document.querySelector('.salnama-notification');
        if (oldNotification) oldNotification.remove();
        
        const notification = document.createElement('div');
        notification.className = 'salnama-notification';
        notification.textContent = message;
        
        // استایل‌های نوتیفیکیشن
        const style = document.createElement('style');
        style.textContent = `
            .salnama-notification {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%) translateY(20px);
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 12px 24px;
                border-radius: 12px;
                font-size: 14px;
                font-family: system-ui, -apple-system, sans-serif;
                z-index: 1000000;
                opacity: 0;
                animation: salnamaNotificationIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            @keyframes salnamaNotificationIn {
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            @keyframes salnamaNotificationOut {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }
        `;
        
        if (!document.querySelector('#salnama-notification-style')) {
            style.id = 'salnama-notification-style';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // حذف بعد از 3 ثانیه
        setTimeout(() => {
            notification.style.animation = 'salnamaNotificationOut 0.4s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }
    
    // پخش صدای کلیک (اختیاری)
    function playClickSound() {
        // می‌توانید یک sound effect اضافه کنید
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // اگر AudioContext پشتیبانی نشد
            console.debug('AudioContext not supported');
        }
    }
    
    // راه‌اندازی
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
    
    // API عمومی
    window.SalnamaFloatingBar = {
        init: init,
        show: function() {
            if (state.bar) {
                state.bar.classList.add(config.classes.loaded, config.classes.ready, config.classes.visible);
            }
        },
        hide: function() {
            if (state.bar) {
                state.bar.classList.remove(config.classes.loaded, config.classes.ready, config.classes.visible);
                state.bar.style.transform = 'translateX(-100%) translateY(-50%)';
            }
        },
        getAttention: triggerAttention,
        download: handleDownload,
        share: handleShare
    };
    
})();