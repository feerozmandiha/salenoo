/**
 * Salnama Catalog Controller - With Sound
 * Path: assets/js/catalog/script.js
 */

document.addEventListener('DOMContentLoaded', function() {
    
    const flipbookEl = document.getElementById('salnama-flipbook');
    if (!flipbookEl) return;

    const pages = flipbookEl.querySelectorAll('.page');
    if (pages.length === 0) return;

    flipbookEl.style.display = 'block';

    // --- 1. آماده‌سازی صدا ---
    let flipSound = null;
    // @ts-ignore
    if (typeof SalnamaCatalogConfig !== 'undefined' && SalnamaCatalogConfig.sound_url) {
        // @ts-ignore
        flipSound = new Audio(SalnamaCatalogConfig.sound_url);
    }

    // --- تابعی برای پخش هوشمند صدا ---
    const playFlipSound = () => {
        if (flipSound) {
            // ریست کردن زمان به صفر تا اگر کاربر تند تند ورق زد، صدا قطع و دوباره پخش شود
            flipSound.currentTime = 0;
            // پرومیس برای جلوگیری از خطای مرورگرهایی که اتوپلی را بلاک می‌کنند
            var playPromise = flipSound.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // معمولاً تا وقتی کاربر اولین کلیک را روی صفحه نکند، مرورگر اجازه پخش صدا نمی‌دهد.
                    // این خطا طبیعی است و نیازی به لاگ کردن نیست.
                });
            }
        }
    };

    const containerWidth = flipbookEl.clientWidth;

    // @ts-ignore
    const pageFlip = new St.PageFlip(flipbookEl, {
        width: 1000,  
        height: 1400,
        size: "stretch", 
        minWidth: 300,
        maxWidth: 3000, 
        minHeight: 400,
        maxHeight: 3000,
        maxShadowOpacity: 0.3, 
        showCover: true,
        mobileScrollSupport: false,
        flippingTime: 1200, 
        usePortrait: true,
        startPage: 0,
        autoSize: true,
        drawShadow: true,
        showPageCorners: true
    });

    pageFlip.loadFromHTML(pages);

    const pageNumberElements = flipbookEl.querySelectorAll('.page-number');
    pageNumberElements.forEach((el, index) => {
        el.innerText = (index + 1).toLocaleString('fa-IR'); 
    });

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

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') pageFlip.flipPrev();
        if (e.key === 'ArrowLeft') pageFlip.flipNext();
    });

    // --- 2. پخش صدا هنگام ورق خوردن ---
    pageFlip.on('flip', (e) => {
        // پخش صدا
        playFlipSound();
    });

    // اضافه کردن wrapper class
    const wrapper = flipbookEl.parentElement;
    if(wrapper && !wrapper.classList.contains('salnama-flipbook-wrapper')) {
        wrapper.classList.add('salnama-flipbook-wrapper');
    }
});