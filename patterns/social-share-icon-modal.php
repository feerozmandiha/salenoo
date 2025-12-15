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
            <h3 class="has-text-primary-color has-medium-font-size">اشتراک‌گذاری در شبکه‌های اجتماعی</h3>
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
                    <span class="dashicons">
                        <svg width="35px" height="35px" viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
                                <g>
                                        <path d="M128,0 C57.307,0 0,57.307 0,128 L0,128 C0,198.693 57.307,256 128,256 L128,256 C198.693,256 256,198.693 256,128 L256,128 C256,57.307 198.693,0 128,0 L128,0 Z" fill="#40B3E0">

                        </path>
                                        <path d="M190.2826,73.6308 L167.4206,188.8978 C167.4206,188.8978 164.2236,196.8918 155.4306,193.0548 L102.6726,152.6068 L83.4886,143.3348 L51.1946,132.4628 C51.1946,132.4628 46.2386,130.7048 45.7586,126.8678 C45.2796,123.0308 51.3546,120.9528 51.3546,120.9528 L179.7306,70.5928 C179.7306,70.5928 190.2826,65.9568 190.2826,73.6308" fill="#FFFFFF">

                        </path>
                                        <path d="M98.6178,187.6035 C98.6178,187.6035 97.0778,187.4595 95.1588,181.3835 C93.2408,175.3085 83.4888,143.3345 83.4888,143.3345 L161.0258,94.0945 C161.0258,94.0945 165.5028,91.3765 165.3428,94.0945 C165.3428,94.0945 166.1418,94.5735 163.7438,96.8115 C161.3458,99.0505 102.8328,151.6475 102.8328,151.6475" fill="#D2E5F1">

                        </path>
                                        <path d="M122.9015,168.1154 L102.0335,187.1414 C102.0335,187.1414 100.4025,188.3794 98.6175,187.6034 L102.6135,152.2624" fill="#B5CFE4">

                        </path>
                                </g>
                        </svg>
                    </span>
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
                    <span class="dashicons">
                        
                        <svg width="35px" height="35px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3584.55 3673.6">
                        <g id="Isolation_Mode" data-name="Isolation Mode">
                            <path d="M1071.43,2.75H2607.66C3171,2.75,3631.82,462.91,3631.82,1026.2v493.93c-505,227-1014.43,1348.12-1756.93,1104.51-61.16,43.46-202.11,222.55-212,358.43-257.11-34.24-553.52-328.88-517.95-646.62C717,2026.91,1070.39,1455.5,1409.74,1225.51c727.32-492.94,1737.05-69,1175.39,283.45-341.52,214.31-1071.84,355.88-995.91-170.24-200.34,57.78-328.58,431.34-87.37,626-223.45,219.53-180.49,623.07,58.36,755.57,241.56-625.87,1082.31-544.08,1422-1291.2,255.57-562-123.34-1202.37-880.91-1104C1529.56,399.34,993.64,881.63,725.62,1453.64,453.68,2034,494.15,2811.15,1052.55,3202.82c657.15,460.92,1356.78,34.13,1780.52-523.68,249.77-328.78,468-693,798.75-903.37v875.72c0,563.28-460.88,1024.86-1024.16,1024.86H1071.43c-563.29,0-1024.16-460.87-1024.16-1024.16V1026.9C47.27,463.61,508.14,2.74,1071.43,2.74Z" transform="translate(-47.27 -2.74)" fill="#ee7f22" fill-rule="evenodd"/>
                        </g>
                        </svg>
                    </span>
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
        width: 50px;
        height: 50px;
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