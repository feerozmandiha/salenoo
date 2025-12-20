/**
 * Salnama Catalog Controller - Final Version
 * Path: assets/js/catalog/script.js
 * Features: Sound, High-Res, Button Safety, RTL Support
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. انتخاب کانتینر اصلی
    const flipbookEl = document.getElementById('salnama-flipbook');
    
    // اگر المان در صفحه نبود، ادامه نده
    if (!flipbookEl) return;

    // انتخاب دقیق صفحات داخل کانتینر
    const pages = flipbookEl.querySelectorAll('.page');
    if (pages.length === 0) return;

    // نمایش کانتینر
    flipbookEl.style.display = 'block';

    // --- 2. تنظیمات و راه‌اندازی صدا ---
    let flipSound = null;
    // @ts-ignore
    if (typeof SalnamaCatalogConfig !== 'undefined' && SalnamaCatalogConfig.sound_url) {
        // @ts-ignore
        flipSound = new Audio(SalnamaCatalogConfig.sound_url);
    }

    const playFlipSound = () => {
        if (flipSound) {
            flipSound.currentTime = 0;
            var playPromise = flipSound.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // جلوگیری از خطای Autoplay در مرورگرها قبل از تعامل کاربر
                });
            }
        }
    };

    // --- 3. راه‌اندازی کتابخانه PageFlip ---
    // @ts-ignore
    const pageFlip = new St.PageFlip(flipbookEl, {
        // ابعاد با کیفیت بالا (کانتینر واقعی توسط CSS کنترل می‌شود)
        width: 1000,
        height: 1400,
        
        // تنظیمات ریسپانسیو
        size: "stretch",
        minWidth: 300,
        maxWidth: 3000,
        minHeight: 400,
        maxHeight: 3000,

        // ظاهر و فیزیک
        maxShadowOpacity: 0.2, // سایه ملایم‌تر برای زیبایی
        showCover: true,
        mobileScrollSupport: false,
        flippingTime: 1100, // سرعت ورق زدن طبیعی
        usePortrait: true,
        startPage: 0,
        autoSize: true,
        drawShadow: true,
        showPageCorners: true
    });

    // بارگذاری صفحات
    pageFlip.loadFromHTML(pages);

    // --- 4. شماره‌گذاری فارسی صفحات ---
    const pageNumberElements = flipbookEl.querySelectorAll('.page-number');
    pageNumberElements.forEach((el, index) => {
        el.innerText = (index + 1).toLocaleString('fa-IR'); 
    });

    // --- 5. دکمه‌های کنترلی (بعدی/قبلی) ---
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            pageFlip.flipPrev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            pageFlip.flipNext();
        });
    }

    // کنترل با کیبورد (جهت‌ها برعکس برای RTL)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') pageFlip.flipPrev();
        if (e.key === 'ArrowLeft') pageFlip.flipNext();
    });

    // --- 6. رویداد ورق زدن (پخش صدا) ---
    pageFlip.on('flip', (e) => {
        playFlipSound();
    });

    // --- 7. اطمینان از کلاس Wrapper ---
    const wrapper = flipbookEl.parentElement;
    if(wrapper && !wrapper.classList.contains('salnama-flipbook-wrapper')) {
        wrapper.classList.add('salnama-flipbook-wrapper');
    }

    // --- 8. جلوگیری از ورق خوردن هنگام کلیک روی دکمه‌های محصول ---
    const productButtons = document.querySelectorAll('.btn-view-product');
    
    productButtons.forEach(btn => {
        // جلوگیری از انتشار رویداد موس
        btn.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
        
        // جلوگیری از انتشار رویداد تاچ (موبایل)
        btn.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        }, { passive: true });

        // اطمینان از کارکردن کلیک لینک
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
    
    console.log('Salnama Catalog: Ready with Sound & High-Res UI');
});