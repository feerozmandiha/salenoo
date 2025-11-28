<?php
/**
 * Product Gallery Pattern – سالنمای نو
 * نمایش گالری نمونه‌کارهای چاپ‌شده با CTA مستقیم به واتساپ
 * سازگار با FSE، Gutenberg و ساختار شیءگرای salnama-theme
 */

return [
    'name'        => 'salnama/product-gallery',
    'title'       => 'گالری محصولات — سالنمای نو',
    'description' => 'الگوی گالری نمونه‌کارهای واقعی با دکمه مشاوره از طریق واتساپ و ناوبری بین دسته‌ها',
    'categories'  => ['salnama-gallery'],
    'keywords'    => ['گالری', 'سررسید', 'تقویم', 'هدیه تبلیغاتی', 'چاپ اختصاصی'],
    'viewportWidth' => 1200,
    'content'     => '
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","right":"var:preset|spacing|40","bottom":"var:preset|spacing|60","left":"var:preset|spacing|40"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--40)">

	<!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"2.2rem"}}} -->
	<h2 class="wp-block-heading has-text-align-center" style="font-size:2.2rem">گالری محصولات</h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.1rem"}}} -->
	<p class="has-text-align-center" style="font-size:1.1rem">طرح‌های زیر قابل سفارش با لوگوی اختصاصی شما هستند. برای دریافت مشاوره رایگان، همین حالا پیام دهید.</p>
	<!-- /wp:paragraph -->

	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
	<div class="wp-block-buttons">
		<!-- wp:button {"backgroundColor":"primary","textColor":"white","style":{"typography":{"fontSize":"1.1rem"}}} -->
		<div class="wp-block-button has-custom-font-size" style="font-size:1.1rem">
			<a class="wp-block-button__link has-white-color has-primary-background-color has-text-color has-background wp-element-button" href="https://wa.me/message/IAP7KGPJ32HWP1?text=سلام،%20در%20مورد%20گالری%20محصولات%20اطلاعات%20بیشتری%20می‌خواهم." target="_blank" rel="noopener">
				💬 درخواست مشاوره از طریق واتساپ
			</a>
		</div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->

	<!-- wp:spacer {"height":"var:preset|spacing|50"} -->
	<div style="height:var(--wp--preset--spacing--50)" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->

	<!-- wp:gallery {"imageSizeSlug":"large","linkTo":"none","align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|40"}}} -->
	<figure class="wp-block-gallery alignwide has-nested-images columns-default is-cropped">
		<!-- تصاویر را در ویرایشگر جایگزین کنید -->
	</figure>
	<!-- /wp:gallery -->

	<!-- wp:spacer {"height":"var:preset|spacing|50"} -->
	<div style="height:var(--wp--preset--spacing--50)" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->

	<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.5rem"}}} -->
	<h3 class="wp-block-heading" style="font-size:1.5rem">دسته‌بندی محصولات</h3>
	<!-- /wp:heading -->

	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center","flexWrap":"wrap","verticalAlignment":"center"},"style":{"spacing":{"blockGap":"10px"}}} -->
	<div class="wp-block-buttons">
		<!-- wp:button {"style":{"typography":{"fontSize":"0.95rem"},"spacing":{"padding":{"top":"0.5rem","bottom":"0.5rem","left":"1rem","right":"1rem"}}}} -->
		<div class="wp-block-button has-custom-font-size" style="font-size:0.95rem">
			<a class="wp-block-button__link wp-element-button" href="/sarresid_galery/sarresid-selfoni-gallery/">سررسید سلفونی</a>
		</div>
		<!-- /wp:button -->

		<!-- wp:button {"style":{"typography":{"fontSize":"0.95rem"},"spacing":{"padding":{"top":"0.5rem","bottom":"0.5rem","left":"1rem","right":"1rem"}}}} -->
		<div class="wp-block-button has-custom-font-size" style="font-size:0.95rem">
			<a class="wp-block-button__link wp-element-button" href="/sarresid_galery/sarresid-jeld-chermi-gallery/">سررسید جلد چرمی</a>
		</div>
		<!-- /wp:button -->

		<!-- wp:button {"style":{"typography":{"fontSize":"0.95rem"},"spacing":{"padding":{"top":"0.5rem","bottom":"0.5rem","left":"1rem","right":"1rem"}}}} -->
		<div class="wp-block-button has-custom-font-size" style="font-size:0.95rem">
			<a class="wp-block-button__link wp-element-button" href="/sarresid_galery/takvim-romizi-gallery/">تقویم رومیزی</a>
		</div>
		<!-- /wp:button -->

		<!-- wp:button {"style":{"typography":{"fontSize":"0.95rem"},"spacing":{"padding":{"top":"0.5rem","bottom":"0.5rem","left":"1rem","right":"1rem"}}}} -->
		<div class="wp-block-button has-custom-font-size" style="font-size:0.95rem">
			<a class="wp-block-button__link wp-element-button" href="/sarresid_galery/takvim-divari-gallery/">تقویم دیواری</a>
		</div>
		<!-- /wp:button -->

		<!-- wp:button {"style":{"typography":{"fontSize":"0.95rem"},"spacing":{"padding":{"top":"0.5rem","bottom":"0.5rem","left":"1rem","right":"1rem"}}}} -->
		<div class="wp-block-button has-custom-font-size" style="font-size:0.95rem">
			<a class="wp-block-button__link wp-element-button" href="/sarresid_galery/hedayat-tablighati-gallery/">هدایای تبلیغاتی</a>
		</div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->

</div>
<!-- /wp:group -->
',
];