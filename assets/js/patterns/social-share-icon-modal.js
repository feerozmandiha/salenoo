/**
 * Social Share Icon Modal for Salnama Theme
 * Path: /assets/js/patterns/social-share-icon-modal.js
 */

(function() {
    'use strict';
    
    // صبر تا بارگذاری کامل DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSocialShare);
    } else {
        initSocialShare();
    }

    function initSocialShare() {
        // بررسی وجود المان‌های مورد نیاز
        const shareButtons = document.querySelectorAll('.salnama-share-icon-button a');
        
        if (shareButtons.length === 0) {
            console.log('Social share buttons not found');
            return;
        }

        // ایجاد tooltip و تنظیم رویدادها برای آیکون اشتراک
        shareButtons.forEach(button => {
            // ایجاد tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'salnama-share-icon-tooltip';
            tooltip.textContent = 'اشتراک‌گذاری این صفحه';
            
            const buttonParent = button.closest('.wp-block-button');
            if (buttonParent) {
                buttonParent.appendChild(tooltip);

                // رویداد کلیک برای باز کردن مودال
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    openModal();
                });
            }
        });

        // تنظیم رویدادهای کلیک برای دکمه‌های اشتراک در مودال
        setupModalShareLinks();
    }

    // تنظیم لینک‌های اشتراک‌گذاری
    function setupModalShareLinks() {
        const shareIcons = document.querySelectorAll('.salnama-social-icon[data-share-type]');
        
        shareIcons.forEach(icon => {
            const shareType = icon.getAttribute('data-share-type');
            
            // اضافه کردن رویداد کلیک برای باز کردن در تب جدید
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                const shareUrl = getShareUrl(shareType);
                
                if (shareUrl && shareUrl !== '#') {
                    window.open(shareUrl, '_blank', 'noopener,noreferrer');
                    closeModal(); // بستن مودال پس از کلیک
                }
            });
        });
    }

    // تولید URL اشتراک‌گذاری
    function getShareUrl(shareType) {
        const currentUrl = encodeURIComponent(window.location.href);
        const currentTitle = encodeURIComponent(document.title);
        const shareText = encodeURIComponent(document.title + ' - ' + window.location.href);
        
        switch(shareType) {
            case 'telegram':
                return `https://t.me/share/url?url=${currentUrl}&text=${currentTitle}`;
            case 'whatsapp':
                return `https://api.whatsapp.com/send?text=${shareText}`;
            case 'eitaa':
                return `https://eitaa.com/share?url=${currentUrl}`;
            case 'instagram':
                return `https://www.instagram.com/share?url=${currentUrl}`;
            default:
                return '#';
        }
    }

    // تابع باز کردن مودال
    function openModal() {
        // اگر مودال وجود ندارد، ایجادش کن
        let modal = document.querySelector('.salnama-social-modal');
        if (!modal) {
            console.warn('Social share modal not found in DOM');
            return;
        }
        
        // به‌روزرسانی لینک‌ها با URL جاری
        updateShareLinks();
        
        // نمایش مودال
        modal.style.display = 'block';
        document.body.classList.add('salnama-modal-open');
        document.addEventListener('keydown', handleEscapeKey);
        
        // افزودن رویداد بستن
        setupModalEvents();
    }

    // تابع بستن مودال
    function closeModal() {
        const modal = document.querySelector('.salnama-social-modal');
        if (!modal) return;
        
        modal.style.display = 'none';
        document.body.classList.remove('salnama-modal-open');
        document.removeEventListener('keydown', handleEscapeKey);
    }

    // تابع مدیریت کلید Escape
    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    }

    // تنظیم رویدادهای مودال
    function setupModalEvents() {
        const modal = document.querySelector('.salnama-social-modal');
        if (!modal) return;

        // دکمه بستن
        const closeButton = modal.querySelector('.salnama-social-modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }

        // کلیک روی overlay
        const overlay = modal.querySelector('.salnama-social-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }

        // جلوگیری از بسته شدن با کلیک روی محتوا
        const modalContent = modal.querySelector('.salnama-social-modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    // به‌روزرسانی لینک‌های اشتراک‌گذاری
    function updateShareLinks() {
        const shareIcons = document.querySelectorAll('.salnama-social-icon[data-share-type]');
        
        shareIcons.forEach(icon => {
            const shareType = icon.getAttribute('data-share-type');
            const shareUrl = getShareUrl(shareType);
            icon.setAttribute('href', shareUrl);
        });
    }

    // Global functions برای دسترسی از خارج
    window.salnamaSocialShare = {
        openModal: openModal,
        closeModal: closeModal,
        getShareUrl: getShareUrl
    };

})();