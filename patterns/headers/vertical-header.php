<?php
/**
 * Vertical Header Pattern - برای تست عملکرد
 */

return [
    'name' => 'salmama/vertical-header',
    'title' => 'هدِر عمودی سالماما',
    'description' => 'هدِر عمودی مدرن با انیمیشن‌های پیشرفته و طراحی مینیمال',
    'categories' => ['salmama-headers'],
    'keywords' => ['header', 'vertical', 'navigation', 'menu', 'minimal'],
    'viewportWidth' => 1200,
    'content' => '<!-- wp:group {"tagName":"header","align":"full","className":"minimal-vertical-header","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"0","left":"0","right":"0"}},"border":{"radius":{"topLeft":"8px","topRight":"8px","bottomLeft":"8px","bottomRight":"8px"}},"shadow":"var:preset|shadow|hard"}} -->
    <header class="wp-block-group alignfull minimal-vertical-header" style="border-top-left-radius:8px;border-top-right-radius:8px;border-bottom-left-radius:8px;border-bottom-right-radius:8px;padding-top:var(--wp--preset--spacing--20);padding-right:0;padding-bottom:0;padding-left:0;box-shadow:var(--wp--preset--shadow--hard)"><!-- wp:group {"style":{"spacing":{"padding":{"left":"0","right":"0","top":"0","bottom":"0"},"margin":{"top":"0","bottom":"0"},"blockGap":"0"}},"backgroundColor":"transparent","layout":{"type":"constrained","justifyContent":"right"}} -->
    <div class="wp-block-group has-transparent-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:group {"className":"p-2 menu-toggle-area cursor-pointer","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"var:preset|spacing|20"},"margin":{"top":"0","bottom":"0"},"blockGap":"0"}},"backgroundColor":"transparent","layout":{"type":"flex","flexWrap":"nowrap"}} -->
    <div class="wp-block-group p-2 menu-toggle-area cursor-pointer has-transparent-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:0;padding-right:var(--wp--preset--spacing--20);padding-bottom:0;padding-left:0"><!-- wp:html -->
    <div class="menu-icon">  
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73.7 73.7" class="svg-menu-icon">
        <line class="st0" x1="59.53" y1="48.85" x2="14.17" y2="48.85"/>
        <line class="st0" x1="59.53" y1="58.85" x2="14.17" y2="58.85"/>
        <line class="st0" x1="59.53" y1="38.85" x2="14.17" y2="38.85"/>
        <polyline class="st1 arrow-path" points="12.5 15.15 36.82 37.17 61.2 15.11"/>
        <circle class="st0 circle-path" cx="36.85" cy="36.85" r="35.42"/>
    </svg>
    </div>
    <!-- /wp:html --></div>
    <!-- /wp:group --></div>
    <!-- /wp:group -->

    <!-- wp:group {"className":"logo-container","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"backgroundColor":"transparent","layout":{"type":"constrained"}} -->
    <div class="wp-block-group logo-container has-transparent-background-color has-background" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:site-logo {"shouldSyncIcon":true,"className":"salnama-logo"} /-->

    <!-- wp:site-title {"textAlign":"center","textColor":"text-secondary","fontSize":"small"} /--></div>
    <!-- /wp:group -->

    <!-- wp:group {"className":"action-buttons-container","style":{"spacing":{"blockGap":"0","padding":{"top":"0","bottom":"0","left":"0","right":"0"},"margin":{"top":"0","bottom":"0"}},"layout":{"selfStretch":"fit","flexSize":null}},"backgroundColor":"transparent","layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch","verticalAlignment":"center","flexWrap":"nowrap"}} -->
    <div class="wp-block-group action-buttons-container has-transparent-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:group {"className":"action-icons","style":{"shadow":"var:preset|shadow|none","border":{"bottom":{"color":"var:preset|color|primary","width":"1px"}},"spacing":{"blockGap":"var:preset|spacing|20","padding":{"top":"0","bottom":"0","left":"0","right":"0"},"margin":{"top":"0","bottom":"0"}}}} -->
    <div class="wp-block-group action-icons has-background-color has-transparent-background-color has-text-color has-background has-link-color" style="border-bottom-color:var(--wp--preset--color--primary);border-bottom-width:1px;margin-top:0;margin-bottom:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;box-shadow:var(--wp--preset--shadow--none)"><!-- wp:woocommerce/customer-account {"displayStyle":"icon_only","iconStyle":"line","iconClass":"wc-block-customer-account__account-icon","backgroundColor":"transparent"} /-->

    <!-- wp:woocommerce/mini-cart /--></div>
    <!-- /wp:group -->

    <!-- wp:group {"className":"cta-button-wrapper","style":{"spacing":{"padding":{"right":"var:preset|spacing|20","left":"var:preset|spacing|20","top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}},"backgroundColor":"transparent","layout":{"type":"constrained"}} -->
    <div class="wp-block-group cta-button-wrapper has-transparent-background-color has-background" style="padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--20);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--20)"><!-- wp:html -->
    <div class="header-cta-container">
        <a class="cta-button" href="#">
            دریافت مشاوره رایگان
        </a>
    </div>
    <!-- /wp:html --></div>
    <!-- /wp:group --></div>
    <!-- /wp:group --></header>
    <!-- /wp:group -->'
];