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

<!-- wp:group {"align":"wide","className":"salnama-social-share-container","style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}},"layout":{"type":"constrained"}} -->
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
<!-- /wp:html -->