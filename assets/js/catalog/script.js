/**
 * Salnama Catalog Controller - Final Version
 * Path: assets/js/catalog/script.js
 * Dependencies: page-flip.browser.js (St.PageFlip)
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. انتخاب کانتینر اصلی
    const flipbookEl = document.getElementById('salnama-flipbook');
    
    // اگر المان در صفحه نبود، ادامه نده (جلوگیری از خطا در سایر صفحات)
    if (!flipbookEl) return;

    // 2. انتخاب دقیق صفحات (فقط فرزندان مستقیم کانتینر کاتالوگ)
    // نکته حیاتی: استفاده از flipbookEl به جای document برای جلوگیری از تداخل
    const pages = flipbookEl.querySelectorAll('.page');

    if (pages.length === 0) {
        console.warn('Salnama Catalog: هیچ صفحه‌ای (.page) داخل کانتینر یافت نشد.');
        return;
    }

    // نمایش لودینگ (کانتینر را نمایش می‌دهیم)
    flipbookEl.style.display = 'block';

    // 3. تنظیمات و راه‌اندازی کتابخانه
    try {
        // @ts-ignore
        const pageFlip = new St.PageFlip(flipbookEl, {
            width: 1000, // عرض پایه
            height: 1400, // ارتفاع پایه
            
            // تنظیمات ریسپانسیو
            size: "stretch",
            minWidth: 300,
            maxWidth: 3000,
            minHeight: 400,
            maxHeight: 3000,

            // تنظیمات ظاهری
            maxShadowOpacity: 0.3,
            showCover: true, // صفحه اول و آخر کاور هستند
            mobileScrollSupport: false, // جلوگیری از تداخل با اسکرول موبایل
            
            // تنظیمات فیزیکی
            flippingTime: 1200,
            usePortrait: true, // در موبایل تک صفحه شود
            startPage: 0,
            autoSize: true,    // تنظیم ارتفاع خودکار
            drawShadow: true,
            showPageCorners: true // نمایش گوشه برای ورق زدن
        });

        // 4. بارگذاری صفحات در کتابخانه
        pageFlip.loadFromHTML(pages);

        // 5. مدیریت شماره صفحات (فارسی سازی)
        const pageNumberElements = flipbookEl.querySelectorAll('.page-number');
        pageNumberElements.forEach((el, index) => {
            // ایندکس از 0 شروع می‌شود، ما +1 می‌کنیم
            el.innerText = (index + 1).toLocaleString('fa-IR'); 
        });

        // 6. مدیریت دکمه‌های کنترل (بعدی / قبلی)
        const prevBtn = document.getElementById('prev-page-btn');
        const nextBtn = document.getElementById('next-page-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                pageFlip.flipPrev(); // ورق زدن به عقب
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                pageFlip.flipNext(); // ورق زدن به جلو
            });
        }

        // 7. کنترل با کیبورد (جهت‌ها برعکس برای RTL)
        document.addEventListener('keydown', (e) => {
            // فقط زمانی که کاتالوگ در ویوپورت است عمل کند (اختیاری)
            if (e.key === 'ArrowRight') {
                pageFlip.flipPrev(); // راست = صفحه قبل
            }
            if (e.key === 'ArrowLeft') {
                pageFlip.flipNext(); // چپ = صفحه بعد
            }
        });

        // 8. ایونت‌ها (دیباگ یا لاجیک‌های اضافه)
        pageFlip.on('flip', (e) => {
            // console.log('Current page:', e.data);
            
            // مثال: غیرفعال کردن دکمه‌ها در صفحه اول یا آخر
            /*
            if (prevBtn) prevBtn.disabled = (e.data === 0);
            if (nextBtn) nextBtn.disabled = (e.data === pageFlip.getPageCount() - 1);
            */
        });

        // 9. افزودن کلاس Wrapper برای اطمینان از استایل‌دهی
        const wrapper = flipbookEl.parentElement;
        if(wrapper && !wrapper.classList.contains('salnama-flipbook-wrapper')) {
            wrapper.classList.add('salnama-flipbook-wrapper');
        }

        console.log('Salnama Catalog: با موفقیت لود شد.');

    } catch (err) {
        console.error('Salnama Catalog Error:', err);
        // در صورت خطا، نمایش ساده صفحات (Fallback)
        flipbookEl.style.display = 'flex';
        flipbookEl.style.flexWrap = 'wrap';
        flipbookEl.style.gap = '20px';
        flipbookEl.style.justifyContent = 'center';
    }
});