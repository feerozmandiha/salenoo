<?php
/**
 * Product Gallery Block Pattern
 * الگوی نمایش گالری محصولات برای دسته‌های مختلف سالنمای نو
 * سازگار با FSE – بدون نیاز به افزونه – بهینه برای موبایل
 */
?>

<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","right":"var:preset|spacing|40","bottom":"var:preset|spacing|60","left":"var:preset|spacing|40"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--40)">

	<!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"2.2rem"}}} -->
	<h2 class="wp-block-heading has-text-align-center" style="font-size:2.2rem"><?php echo esc_html( get_the_title() ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.1rem"}}} -->
	<p class="has-text-align-center" style="font-size:1.1rem">طرح‌های زیر قابل سفارش با لوگوی اختصاصی شما هستند. برای دریافت مشاوره رایگان، همین حالا پیام دهید.</p>
	<!-- /wp:paragraph -->

	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
	<div class="wp-block-buttons">
		<!-- wp:button {"backgroundColor":"primary","textColor":"white","style":{"typography":{"fontSize":"1.1rem"}}} -->
		<div class="wp-block-button has-custom-font-size" style="font-size:1.1rem">
			<a class="wp-block-button__link has-white-color has-primary-background-color has-text-color has-background wp-element-button" href="https://wa.me/message/IAP7KGPJ32HWP1?text=سلام،%20در%20مورد%20<?php echo rawurlencode( get_the_title() ); ?>%20اطلاعات%20بیشتری%20می‌خواهم." target="_blank" rel="noopener">
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
		<!-- 
		💡 راهنمای استفاده:
		- در ویرایشگر گوتنبرگ، این الگو را درج کنید
		- سپس تصاویر مورد نظر را در بلوک گالری جایگزین کنید
		- تصاویر باید ابعاد یکنواخت داشته باشند (پیشنهاد: 800×1100 پیکسل)
		-->
	</figure>
	<!-- /wp:gallery -->

	<!-- wp:spacer {"height":"var:preset|spacing|50"} -->
	<div style="height:var(--wp--preset--spacing--50)" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->

	<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.5rem"}}} -->
	<h3 class="wp-block-heading" style="font-size:1.5rem">دسته‌بندی محصولات</h3>
	<!-- /wp:heading -->

	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center","flexWrap":"wrap"}} -->
	<div class="wp-block-buttons">
		<!-- wp:button {"style":{"typography":{"fontSize":"1rem"},"spacing":{"padding":{"top":"0.6rem","bottom":"0.6rem","left":"1.2rem","right":"1.2rem"}}}} -->
		<div class="wp-block-button has-custom-font-size" style="font-size:1rem">
			<a class="wp-block-button__link wp-element-button" href="/sarresid_galery/sarresid-selfoni-gallery/" style="padding-top:0.6rem;padding-bottom:0.6rem;padding-left:1.2rem;padding-right:1.2rem">سررسید سلفونی</a>
		</div>
		<!-- /wp:button -->

		<!-- wp:button {"style":{"typography":{"fontSize":"1rem"},"spacing":{"padding":{"top":"0.6rem","bottom":"0.6rem","left":"1.2rem","right":"1.2rem"}}}} -->
		<div class="wp-block-button has-custom-font-size" style="font-size:1rem">
			<a class="wp-block-button__link wp-element-button" href="/sarresid_galery/sarresid-jeld-chermi-gallery/" style="padding-top:0.6rem;padding-bottom:0.6rem;padding-left:1.2rem;padding-right:1.2rem">سررسید جلد چرمی</a>
		</div>
		<!-- /wp:button -->

		<!-- wp:button {"style":{"typography":{"fontSize":"1rem"},"spacing":{"padding":{"top":"0.6rem","bottom":"0.6rem","left":"1.2rem","right":"1.2rem"}}}} -->
		<div class="wp-block-button has-custom-font-size" style="font-size:1rem">
			<a class="wp-block-button__link wp-element-button" href="/sarresid_galery/takvim-romizi-gallery/" style="padding-top:0.6rem;padding-bottom:0.6rem;padding-left:1.2rem;padding-right:1.2rem">تقویم رومیزی</a>
		</div>
		<!-- /wp:button -->

		<!-- wp:button {"style":{"typography":{"fontSize":"1rem"},"spacing":{"padding":{"top":"0.6rem","bottom":"0.6rem","left":"1.2rem","right":"1.2rem"}}}} -->
		<div class="wp-block-button has-custom-font-size" style="font-size:1rem">
			<a class="wp-block-button__link wp-element-button" href="/sarresid_galery/takvim-divari-gallery/" style="padding-top:0.6rem;padding-bottom:0.6rem;padding-left:1.2rem;padding-right:1.2rem">تقویم دیواری</a>
		</div>
		<!-- /wp:button -->

		<!-- wp:button {"style":{"typography":{"fontSize":"1rem"},"spacing":{"padding":{"top":"0.6rem","bottom":"0.6rem","left":"1.2rem","right":"1.2rem"}}}} -->
		<div class="wp-block-button has-custom-font-size" style="font-size:1rem">
			<a class="wp-block-button__link wp-element-button" href="/sarresid_galery/hedayat-tablighati-gallery/" style="padding-top:0.6rem;padding-bottom:0.6rem;padding-left:1.2rem;padding-right:1.2rem">هدایای تبلیغاتی</a>
		</div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->

</div>
<!-- /wp:group -->