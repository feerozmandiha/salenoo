/**
 * Salnama Catalog Controller
 * Path: assets/js/catalog/script.js
 * Dependencies: page-flip.browser.js
 */

document.addEventListener('DOMContentLoaded', function() {
    
    const flipbookEl = document.getElementById('salnama-flipbook');
    
    // اگر المان در صفحه نبود، اجرا نکن
    if (!flipbookEl) return;

    // نمایش لودینگ (اختیاری: می‌توان در CSS هندل کرد)
    flipbookEl.style.display = 'block';

    // تنظیمات پایه بر اساس سایز صفحه
    // نسبت ابعاد A4 تقریباً 210x297 است (0.7)
    // ما عرض هر صفحه را 400 و ارتفاع را 550 در نظر می‌گیریم
    const width = flipbookEl.clientWidth;
    
    // استفاده از کلاس جهانی PageFlip (که توسط کتابخانه لود شده است)
    // @ts-ignore
    const pageFlip = new St.PageFlip(flipbookEl, {
        width: 400, // عرض پایه هر صفحه
        height: 550, // ارتفاع پایه هر صفحه
        
        size: "stretch", // حالت ریسپانسیو
        minWidth: 300,
        maxWidth: 1000,
        minHeight: 400,
        maxHeight: 1400,

        maxShadowOpacity: 0.5, // شدت سایه هنگام ورق زدن
        showCover: true, // صفحه اول و آخر به عنوان جلد رفتار کنند
        mobileScrollSupport: false, // جلوگیری از تداخل با اسکرول موبایل
        
        // تنظیمات فیزیکی ورق زدن
        flippingTime: 1000,
        usePortrait: true, // اجازه حالت تک صفحه در موبایل
        startPage: 0,
        autoSize: true,
        drawShadow: true
    });

    // بارگذاری صفحات
    // این متد تمام فرزندان مستقیم المان کانتینر را به عنوان صفحه می‌شناسد
    const pages = document.querySelectorAll('.page');
    pageFlip.loadFromHTML(pages);

    // افزودن شماره صفحه به صورت خودکار
    const pageNumberElements = document.querySelectorAll('.page-number');
    pageNumberElements.forEach((el, index) => {
        // +1 چون ایندکس از 0 شروع می‌شود و صفحه اول کاور است
        // اما معمولا در کاتالوگ کاور شماره ندارد. 
        // فرمول زیر شماره‌گذاری را از اولین محصول شروع می‌کند
        el.innerText = (index + 1).toLocaleString('fa-IR'); 
    });

    // مدیریت ایونت‌ها (اختیاری: برای افزودن صدا یا آنالیتیکس)
    pageFlip.on('flip', (e) => {
        // مثال: پخش صدا اگر در آبجکت تنظیمات موجود باشد
        /*
        if (typeof SalnamaCatalogConfig !== 'undefined' && SalnamaCatalogConfig.sounds) {
            const audio = new Audio(SalnamaCatalogConfig.sounds.start);
            audio.play();
        }
        */
        console.log('صفحه فعلی:', e.data);
    });

    // حل مشکل احتمالی z-index در برخی قالب‌ها
    // اضافه کردن کلاس wrapper برای استایل دهی بهتر
    const wrapper = flipbookEl.parentElement;
    if(wrapper) {
        wrapper.classList.add('salnama-flipbook-wrapper');
    }

    // کنترل دکمه‌های کیبورد
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            pageFlip.flipPrev(); // چون RTL هستیم، راست یعنی قبلی
        }
        if (e.key === 'ArrowLeft') {
            pageFlip.flipNext(); // چپ یعنی بعدی
        }
    });
});