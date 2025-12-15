<?php
/**
 * Title: Social share icon with modal
 * Slug: salnama/social-share-icon-modal
 * Description: Social sharing icon with modal popup for all pages.
 * Categories: salnama-features
 * Block Types: core/button
 *
 * @package WordPress
 * @subpackage salnama
 * @since salnama 1.0
 */

?>

<!-- wp:group {"align":"wide","style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide salnama-social-share-container" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--20)">
    
    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
    <div class="wp-block-buttons">
        <!-- wp:button {"backgroundColor":"transparent","textColor":"text-primary","className":"is-style-outline salnama-share-icon-button","style":{"border":{"radius":"50px"},"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"fontSize":"large"} -->
        <div class="wp-block-button is-style-outline salnama-share-icon-button">
            <a class="wp-block-button__link has-text-primary-color has-transparent-background-color has-text-color has-background has-large-font-size wp-element-button" 
               style="border-radius:50px;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30)" 
               title="اشتراک‌گذاری این صفحه">
                <span class="dashicons dashicons-share"></span>
            </a>
        </div>
        <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->
    
</div>
<!-- /wp:group -->

<!-- wp:html -->
<div class="salnama-social-modal" style="display:none;">
    <div class="salnama-social-modal-overlay"></div>
    <div class="salnama-social-modal-content">
        <div class="salnama-social-modal-header">
            <h3 class="has-text-primary-color has-large-font-size">اشتراک‌گذاری در شبکه‌های اجتماعی</h3>
            <button class="salnama-social-modal-close" aria-label="بستن">
                <span class="dashicons dashicons-no-alt"></span>
            </button>
        </div>
        <div class="salnama-social-modal-body">
            <div class="salnama-social-icons">
                <a href="#" 
                   target="_blank" 
                   class="salnama-social-icon salnama-telegram" 
                   title="اشتراک در تلگرام"
                   data-share-type="telegram">
                    <span class="dashicons dashicons-format-chat"></span>
                    <span>تلگرام</span>
                </a>
                
                <a href="#" 
                   target="_blank" 
                   class="salnama-social-icon salnama-whatsapp" 
                   title="اشتراک در واتس‌آپ"
                   data-share-type="whatsapp">
                    <span class="dashicons dashicons-whatsapp"></span>
                    <span>واتس‌آپ</span>
                </a>
                
                <a href="#" 
                   target="_blank" 
                   class="salnama-social-icon salnama-eitaa" 
                   title="اشتراک در ایتا"
                   data-share-type="eitaa">
                    <span class="dashicons dashicons-email-alt"></span>
                    <span>ایتا</span>
                </a>
                
                <a href="#" 
                   target="_blank" 
                   class="salnama-social-icon salnama-instagram" 
                   title="اشتراک در اینستاگرام"
                   data-share-type="instagram">
                    <span class="dashicons dashicons-instagram"></span>
                    <span>اینستاگرام</span>
                </a>
            </div>
        </div>
    </div>
</div>

<style>
/* استفاده از متغیرهای theme.json */
:root {
    --salnama-social-modal-bg: var(--wp--custom--socialShare--modal--backgroundColor, var(--wp--preset--color--card-bg));
    --salnama-social-modal-radius: var(--wp--custom--socialShare--modal--borderRadius, 12px);
    --salnama-social-modal-shadow: var(--wp--custom--socialShare--modal--boxShadow, var(--wp--preset--shadow--cardShadowLarge));
    --salnama-social-modal-zindex: var(--wp--custom--socialShare--modal--zIndex, 9999);
    --salnama-social-overlay-bg: var(--wp--custom--socialShare--modalOverlay--backgroundColor, rgba(0, 0, 0, 0.5));
    --salnama-social-icon-transform: var(--wp--custom--socialShare--icon--hoverTransform, translateY(-5px));
    --salnama-social-icon-transition: var(--wp--custom--socialShare--icon--transition, all 0.3s ease);
    --salnama-telegram-color: var(--wp--custom--socialShare--telegram--color, #0088cc);
    --salnama-whatsapp-color: var(--wp--custom--socialShare--whatsapp--color, #25d366);
    --salnama-eitaa-color: var(--wp--custom--socialShare--eitaa--color, #3b5998);
    --salnama-instagram-color: var(--wp--custom--socialShare--instagram--color, #e4405f);
}

/* استایل‌های مودال اشتراک‌گذاری */
.salnama-social-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: var(--salnama-social-modal-zindex);
    font-family: var(--wp--preset--font-family--iransansxfanum);
}

.salnama-social-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--salnama-social-overlay-bg);
    backdrop-filter: var(--wp--custom--socialShare--modalOverlay--backdropFilter, blur(3px));
}

.salnama-social-modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--salnama-social-modal-bg);
    border-radius: var(--salnama-social-modal-radius);
    padding: 0;
    width: 90%;
    max-width: 500px;
    box-shadow: var(--salnama-social-modal-shadow);
    animation: salnamaModalFadeIn 0.3s ease-out;
}

@keyframes salnamaModalFadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, -60%);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%);
    }
}

.salnama-social-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--wp--preset--spacing--20) var(--wp--preset--spacing--30);
    border-bottom: 1px solid var(--wp--preset--color--border-light);
}

.salnama-social-modal-header h3 {
    margin: 0;
    font-weight: 600;
    color: var(--wp--preset--color--text-primary);
}

.salnama-social-modal-close {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--wp--preset--color--text-secondary);
    line-height: 1;
    padding: var(--wp--preset--spacing--10);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: var(--salnama-social-icon-transition);
}

.salnama-social-modal-close:hover {
    background-color: var(--wp--preset--color--surface-bg);
    color: var(--wp--preset--color--text-primary);
}

.salnama-social-modal-close .dashicons {
    width: 20px;
    height: 20px;
    font-size: 20px;
}

.salnama-social-modal-body {
    padding: var(--wp--preset--spacing--30) var(--wp--preset--spacing--30);
}

.salnama-social-icons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--wp--preset--spacing--20);
}

@media (min-width: 768px) {
    .salnama-social-icons {
        grid-template-columns: repeat(4, 1fr);
    }
}

.salnama-social-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--wp--preset--spacing--20) var(--wp--preset--spacing--15);
    border-radius: var(--wp--preset--spacing--10);
    text-decoration: none;
    transition: var(--salnama-social-icon-transition);
    background-color: var(--wp--preset--color--surface-bg);
    border: 1px solid var(--wp--preset--color--border-light);
    text-align: center;
}

.salnama-social-icon:hover {
    transform: var(--salnama-social-icon-transform);
    box-shadow: var(--wp--preset--shadow--cardShadowMedium);
}

.salnama-social-icon .dashicons {
    width: 40px;
    height: 40px;
    font-size: 40px;
    margin-bottom: var(--wp--preset--spacing--10);
}

.salnama-social-icon span:not(.dashicons) {
    font-size: var(--wp--preset--font-size--small);
    font-weight: 500;
    color: var(--wp--preset--color--text-primary);
}

/* رنگ‌های شبکه‌های اجتماعی */
.salnama-telegram .dashicons {
    color: var(--salnama-telegram-color);
}

.salnama-whatsapp .dashicons {
    color: var(--salnama-whatsapp-color);
}

.salnama-eitaa .dashicons {
    color: var(--salnama-eitaa-color);
}

.salnama-instagram .dashicons {
    color: var(--salnama-instagram-color);
}

.salnama-telegram:hover {
    background-color: var(--salnama-telegram-color);
    border-color: var(--salnama-telegram-color);
}

.salnama-whatsapp:hover {
    background-color: var(--salnama-whatsapp-color);
    border-color: var(--salnama-whatsapp-color);
}

.salnama-eitaa:hover {
    background-color: var(--salnama-eitaa-color);
    border-color: var(--salnama-eitaa-color);
}

.salnama-instagram:hover {
    background-color: var(--salnama-instagram-color);
    border-color: var(--salnama-instagram-color);
}

.salnama-social-icon:hover .dashicons,
.salnama-social-icon:hover span:not(.dashicons) {
    color: var(--wp--preset--color--card-bg) !important;
}

/* استایل آیکون اشتراک‌گذاری */
.salnama-share-icon-button {
    position: relative;
    cursor: pointer;
    display: inline-block;
}

.salnama-share-icon-button .wp-block-button__link {
    position: relative;
    transition: var(--salnama-social-icon-transition);
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--wp--preset--color--brand-blue) !important;
    background-color: var(--wp--preset--color--transparent) !important;
    border-radius: var(--wp--preset--spacing--50) !important;
}

.salnama-share-icon-button .wp-block-button__link .dashicons {
    font-size: 28px;
    width: 28px;
    height: 28px;
}

.salnama-share-icon-button .wp-block-button__link:hover {
    background-color: var(--wp--preset--color--brand-blue) !important;
    color: var(--wp--preset--color--card-bg) !important;
    transform: scale(1.1) rotate(5deg);
    box-shadow: var(--wp--preset--shadow--buttonShadow);
}

.salnama-share-icon-button .wp-block-button__link:hover .dashicons {
    color: var(--wp--preset--color--card-bg) !important;
}

/* Tooltip برای آیکون */
.salnama-share-icon-tooltip {
    position: absolute;
    background: var(--wp--preset--color--text-primary);
    color: var(--wp--preset--color--surface-bg);
    padding: var(--wp--preset--spacing--10) var(--wp--preset--spacing--15);
    border-radius: var(--wp--preset--spacing--5);
    font-size: var(--wp--preset--font-size--small);
    white-space: nowrap;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: var(--salnama-social-icon-transition);
    pointer-events: none;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: var(--wp--preset--spacing--10);
    font-family: var(--wp--preset--font-family--iransansxfanum);
}

.salnama-share-icon-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: var(--wp--preset--color--text-primary) transparent transparent transparent;
}

.salnama-share-icon-button:hover .salnama-share-icon-tooltip {
    opacity: 1;
    visibility: visible;
}

/* انیمیشن پالس برای آیکون */
@keyframes shareIconPulse {
    0% {
        box-shadow: 0 0 0 0 rgba(0, 174, 239, 0.4);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(0, 174, 239, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(0, 174, 239, 0);
    }
}

.salnama-share-icon-button .wp-block-button__link {
    animation: shareIconPulse 2s infinite;
}
</style>

<script>
(function() {
    // بارگذاری فونت Dashicons اگر نیاز باشد
    if (!document.querySelector('link[href*="dashicons"]')) {
        const dashiconsLink = document.createElement('link');
        dashiconsLink.rel = 'stylesheet';
        dashiconsLink.href = '<?php echo includes_url("css/dashicons.css"); ?>';
        document.head.appendChild(dashiconsLink);
    }

    // صبر تا بارگذاری کامل DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSocialShare);
    } else {
        initSocialShare();
    }

    function initSocialShare() {
        // متغیرهای سراسری برای URL و عنوان
        const currentUrl = encodeURIComponent(window.location.href);
        const currentTitle = encodeURIComponent(document.title);
        const shareText = encodeURIComponent(document.title + ' - ' + window.location.href);

        // ایجاد tooltip و تنظیم رویدادها برای آیکون اشتراک
        const shareIconButtons = document.querySelectorAll('.salnama-share-icon-button a');
        
        shareIconButtons.forEach(button => {
            // ایجاد tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'salnama-share-icon-tooltip';
            tooltip.textContent = 'اشتراک‌گذاری این صفحه';
            
            const buttonParent = button.closest('.wp-block-button');
            buttonParent.appendChild(tooltip);

            // رویداد کلیک برای باز کردن مودال
            button.addEventListener('click', function(e) {
                e.preventDefault();
                openModal();
            });
        });

        // تنظیم لینک‌های اشتراک‌گذاری
        function setupShareLinks() {
            const shareIcons = document.querySelectorAll('.salnama-social-icon[data-share-type]');
            
            shareIcons.forEach(icon => {
                const shareType = icon.getAttribute('data-share-type');
                let shareUrl = '#';
                
                switch(shareType) {
                    case 'telegram':
                        shareUrl = `https://t.me/share/url?url=${currentUrl}&text=${currentTitle}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://api.whatsapp.com/send?text=${shareText}`;
                        break;
                    case 'eitaa':
                        shareUrl = `https://eitaa.com/share?url=${currentUrl}`;
                        break;
                    case 'instagram':
                        shareUrl = `https://www.instagram.com/share?url=${currentUrl}`;
                        break;
                }
                
                icon.setAttribute('href', shareUrl);
                
                // اضافه کردن رویداد کلیک برای باز کردن در تب جدید
                icon.addEventListener('click', function(e) {
                    // فقط اگر لینک معتبر باشد
                    if (shareUrl !== '#') {
                        window.open(shareUrl, '_blank', 'noopener,noreferrer');
                        closeModal(); // بستن مودال پس از کلیک
                    }
                });
            });
        }

        // تابع باز کردن مودال
        function openModal() {
            // اگر مودال وجود ندارد، ایجادش کن
            let modal = document.querySelector('.salnama-social-modal');
            if (!modal) {
                console.warn('Social share modal not found in DOM');
                return;
            }
            
            // تنظیم مجدد لینک‌ها با URL جاری
            setupShareLinks();
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscapeKey);
            
            // افزودن رویداد بستن
            setupModalEvents();
        }

        // تابع بستن مودال
        function closeModal() {
            const modal = document.querySelector('.salnama-social-modal');
            if (!modal) return;
            
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
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

        // تنظیم اولیه رویدادها
        setupModalEvents();
        
        // تنظیم اولیه لینک‌ها
        setupShareLinks();
    }
})();
</script>
<!-- /wp:html -->