/**
 * Salnama Theme - Animation Engine (GSAP Powered)
 * 
 * این موتور تمام عناصری که دارای ویژگی data-animation هستند را پیدا کرده
 * و انیمیشن مناسب را با GSAP اعمال می‌کند.
 * 
 * ویژگی‌ها:
 * - Scroll-triggered برای انیمیشن‌های ظهور
 * - Hover-triggered برای تعاملات
 * - کاملاً ماژولار — اضافه کردن انیمیشن جدید آسان است
 * - بدون تداخل با سایر اسکریپت‌ها
 */

( function( window, document ) {
    'use strict';

    // بارگذاری GSAP و ScrollTrigger به صورت ماژولار
    const { gsap } = window;
    const { ScrollTrigger } = window;

    if ( ! gsap || ! ScrollTrigger ) {
        console.warn( 'GSAP یا ScrollTrigger بارگذاری نشده است.' );
        return;
    }

    // تنظیمات پیش‌فرض انیمیشن
    const defaults = {
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.1
    };

    // رجیستر کردن انیمیشن‌ها
    const animations = {
        'fade-up': ( el, delay = 0 ) => {
            gsap.from( el, {
                y: 40,
                opacity: 0,
                duration: defaults.duration,
                ease: defaults.ease,
                delay: delay,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            } );
        },
        'fade-down': ( el, delay = 0 ) => {
            gsap.from( el, {
                y: -40,
                opacity: 0,
                duration: defaults.duration,
                ease: defaults.ease,
                delay: delay,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            } );
        },
        'fade-left': ( el, delay = 0 ) => {
            gsap.from( el, {
                x: -40,
                opacity: 0,
                duration: defaults.duration,
                ease: defaults.ease,
                delay: delay,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            } );
        },
        'fade-right': ( el, delay = 0 ) => {
            gsap.from( el, {
                x: 40,
                opacity: 0,
                duration: defaults.duration,
                ease: defaults.ease,
                delay: delay,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            } );
        },
        'zoom-in': ( el, delay = 0 ) => {
            gsap.from( el, {
                scale: 0.9,
                opacity: 0,
                duration: defaults.duration,
                ease: 'back.out(1.7)',
                delay: delay,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            } );
        },
        'slide-up': ( el, delay = 0 ) => {
            gsap.from( el, {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'expo.out',
                delay: delay,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            } );
        },
        'slide-left': ( el, delay = 0 ) => {
            gsap.from( el, {
                x: 100,
                opacity: 0,
                duration: 1,
                ease: 'expo.out',
                delay: delay,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            } );
        },
        'hover-scale': ( el ) => {
            el.addEventListener( 'mouseenter', () => {
                gsap.to( el, { scale: 1.03, duration: 0.3, ease: 'power2.out' } );
            } );
            el.addEventListener( 'mouseleave', () => {
                gsap.to( el, { scale: 1, duration: 0.3, ease: 'power2.out' } );
            } );
        },
        'hover-underline': ( el ) => {
            const link = el.querySelector( 'a' ) || el;
            if ( ! link.style.borderBottom ) {
                link.style.borderBottom = '2px solid transparent';
                link.style.transition = 'border-color 0.3s ease';
            }
            link.addEventListener( 'mouseenter', () => {
                link.style.borderColor = salnama_theme.is_rtl 
                    ? 'var(--wp--preset--color--brand-blue)' 
                    : 'var(--wp--preset--color--brand-blue)';
            } );
            link.addEventListener( 'mouseleave', () => {
                link.style.borderColor = 'transparent';
            } );
        }
    };

    // راه‌اندازی انیمیشن‌ها
    function initAnimations() {
        const animatedElements = document.querySelectorAll( '[data-animation]' );

        animatedElements.forEach( ( el, index ) => {
            const type = el.getAttribute( 'data-animation' );
            const delay = parseFloat( el.getAttribute( 'data-delay' ) ) || 0;

            if ( animations[ type ] ) {
                // برای انیمیشن‌های hover، scrollTrigger اعمال نشود
                if ( type.startsWith( 'hover-' ) ) {
                    animations[ type ]( el );
                } else {
                    // اعمال تأخیر متوالی (اختیاری)
                    const finalDelay = delay + ( index * 0.1 );
                    animations[ type ]( el, finalDelay );
                }
            }
        } );
    }

    // اجرای اولیه
    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', initAnimations );
    } else {
        initAnimations();
    }

    // پشتیبانی از بارگذاری دینامیک (مثلاً AJAX)
    document.addEventListener( 'salnama:refreshAnimations', initAnimations );

} )( window, document );