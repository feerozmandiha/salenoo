/**
 * VerticalHeaderAnimator
 * کلاس مدیریت هدر عمودی — با انیمیشن‌های ملایم و طبیعی (سبک bras.fr)
 * تبدیل شده از کلاس ES6 به کلاس کلاسیک جاوااسکریپت برای سازگاری با وردپرس
 */

// تابع کمکی برای تشخیص دسکتاپ (بر اساس breakpoint)
function isDesktop() {
    return window.innerWidth >= 1024;
}

// تابع کمکی برای تشخیص موبایل
function isMobile() {
    return window.innerWidth < 1024;
}

// تعریف کلاس
class VerticalHeaderAnimator {

    constructor() {
        this.header = document.querySelector('.minimal-vertical-header');
        if (!this.header) {
            console.warn('⚠️ VerticalHeaderAnimator: .minimal-vertical-header یافت نشد.');
            return;
        }

        this.toggleArea = this.header.querySelector('.menu-toggle-area');
        this.menuIcon = this.header.querySelector('.menu-icon');
        this.overlay = document.querySelector('.full-screen-menu-overlay');
        this.logoContainer = this.header.querySelector('.logo-container');
        this.ctaButton = this.header.querySelector('.cta-button-wrapper');
        this.arrowPath = this.header.querySelector('.arrow-path');

        if (!this.toggleArea || !this.overlay) {
            console.warn('⚠️ VerticalHeaderAnimator: عناصر ضروری یافت نشدند.');
            return;
        }

        this.isMenuOpen = false;
        this.lastScrollTop = 0;
        this.leaveTimeout = null;
        this.isOverHeaderOrOverlay = false;
        this.isHoverExpanded = false;

        this.init();
    }

    get fullHeight() {
        return window.innerHeight;
    }

    remToPx(rem) {
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    init() {
        this.isDesktop = isDesktop;
        this.isMobile = isMobile;
        this.initHoverEvents();
        this.initClickEvents();
        this.setArrowLoop('initial');
        this.initializeElements();

        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
    }

    initializeElements() {
        // مقداردهی اولیه وضعیت المان‌ها بر اساس دستگاه
        if (this.isDesktop()) {
            // در دسکتاپ: لوگو و CTA ابتدا مخفی هستند
            if (this.logoContainer) {
                this.logoContainer.style.display = 'none';
                this.logoContainer.style.opacity = '0';
                this.logoContainer.style.visibility = 'hidden';
            }
            if (this.ctaButton) {
                this.ctaButton.style.display = 'none';
                this.ctaButton.style.opacity = '0';
                this.ctaButton.style.visibility = 'hidden';
            }
        } else {
            // در موبایل: لوگو و CTA همیشه نمایش داده می‌شوند
            if (this.logoContainer) {
                this.logoContainer.style.display = 'flex';
                this.logoContainer.style.opacity = '1';
                this.logoContainer.style.visibility = 'visible';
            }
            if (this.ctaButton) {
                this.ctaButton.style.display = 'block';
                this.ctaButton.style.opacity = '1';
                this.ctaButton.style.visibility = 'visible';
            }
        }
    }

    setArrowLoop(state) {
        if (!this.arrowPath || this.isMenuOpen) return;
        
        // در موبایل فقط انیمیشن vertical فعال باشد
        if (this.isMobile()) {
            this.arrowPath.classList.remove('animate-loop-initial', 'animate-loop-hovered', 'animate-loop-mobile');
            
            if (state === 'initial' || state === 'mobile') {
                this.arrowPath.classList.add('animate-loop-mobile');
            }
        } else {
                    // در دسکتاپ

            this.arrowPath.classList.remove('animate-loop-initial', 'animate-loop-hovered');
            
            if (state === 'initial') {
                this.arrowPath.classList.add('animate-loop-initial');
            } else if (state === 'hovered') {
                this.arrowPath.classList.add('animate-loop-hovered');
            }
        }
    }

    initHoverEvents() {
        if (!this.toggleArea) return;

        // فقط در دسکتاپ events هاور فعال می‌شوند
        if (this.isDesktop()) {
            this.initDesktopHoverEvents();
        }
    }

    initDesktopHoverEvents() {
        // کنترل ورود موس به overlay
        if (this.overlay) {
            this.overlay.addEventListener('mouseenter', () => {
                this.isOverHeaderOrOverlay = true;
                this.clearLeaveTimeout();
            });

            this.overlay.addEventListener('mouseleave', () => {
                this.isOverHeaderOrOverlay = false;
                this.scheduleHeaderClose();
            });
        }

        this.toggleArea.addEventListener('mouseenter', () => {
            if (this.isMenuOpen) return;

            this.isOverHeaderOrOverlay = true;
            this.isHoverExpanded = true;
            this.clearLeaveTimeout();
            this.expandHeaderOnHover();
        });

        this.header.addEventListener('mouseenter', () => {
            this.isOverHeaderOrOverlay = true;
            this.clearLeaveTimeout();
        });

        this.header.addEventListener('mouseleave', () => {
            this.isOverHeaderOrOverlay = false;
            this.scheduleHeaderClose();
        });
    }

    clearLeaveTimeout() {
        if (this.leaveTimeout) {
            clearTimeout(this.leaveTimeout);
            this.leaveTimeout = null;
        }
    }

    scheduleHeaderClose() {
        // فقط در دسکتاپ تایمر بسته شدن فعال است
        if (!this.isDesktop()) return;

        this.leaveTimeout = setTimeout(() => {
            if (!this.isOverHeaderOrOverlay && !this.isMenuOpen) {
                this.collapseHeaderOnHover();
            }
            this.leaveTimeout = null;
        }, 2000);
    }

    expandHeaderOnHover() {
        if (!this.isDesktop()) return;

        // --- تنظیم display برای logoContainer قبل از انیمیشن ---
        if (this.logoContainer) {
            this.logoContainer.style.display = 'block'; // یا 'flex' بسته به نیاز شما
            // opacity و transform بعداً با GSAP انجام می‌شود
        }
        if (this.ctaButton) {
            this.ctaButton.style.display = 'block'; // همیشه block بماند
        }
        // ---

        
        // اضافه کردن کلاس رنگ پس‌زمینه
        if (this.header) {
            this.header.classList.add('header--expanded-bg');
        }
        
        // انیمیشن اصلی
        gsap.to(this.header, {
            height: this.fullHeight - this.remToPx(2),
            duration: 0.7,
            ease: 'expo.out'
        });
        
        // انیمیشن المان‌ها
        const targets = [];
        if (this.logoContainer) targets.push(this.logoContainer);
        if (this.ctaButton) targets.push(this.ctaButton);
        
        if (targets.length > 0) {
            gsap.to(targets, {
                x: -this.remToPx(12),
                autoAlpha: 1,
                duration: 1,
                delay: 1.25,
                ease: 'circ.out'
            });
        }

        // انیمیشن آیکون
        if (this.menuIcon) {
            this.menuIcon.classList.add('is-rotated-90');
            this.menuIcon.classList.remove('is-rotated-180');
        }

        this.setArrowLoop('hovered');
    }

    collapseHeaderOnHover() {
        if (!this.isDesktop() || this.isMenuOpen) return;

        this.isHoverExpanded = false;

        // حذف کلاس رنگ پس‌زمینه
        if (this.header) {
            this.header.classList.remove('header--expanded-bg');
        }

        // انیمیشن بستن
        gsap.to(this.header, {
            height: '22vh',
            duration: 0.6,
            ease: 'expo.in'
        });

        // انیمیشن پنهان کردن المان‌ها
        const targets = [];
        if (this.logoContainer) targets.push(this.logoContainer);
        if (this.ctaButton) targets.push(this.ctaButton);
        
        if (targets.length > 0) {
            gsap.to(targets, {
                x: this.remToPx(12),
                autoAlpha: 0,
                duration: 1,
                ease: 'circ.in',
                onComplete: () => {
                    // فقط در حالت غیرفعال display را none کنیم
                    if (!this.isHoverExpanded && !this.isMenuOpen) {
                        if (this.logoContainer) {
                            this.logoContainer.style.display = 'none';
                        }
                        if (this.ctaButton) {
                            this.ctaButton.style.display = 'none';
                        }
                    }
                }
            });
        }

        // بازنشانی آیکون
        if (this.menuIcon) {
            this.menuIcon.classList.remove('is-rotated-90', 'is-rotated-180');
        }

        this.setArrowLoop('initial');
    }

    initClickEvents() {
        if (!this.toggleArea || !this.overlay) return;

        this.toggleArea.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.toggleMenu();
            }
        });

        // جلوگیری از بسته شدن منو با کلیک روی محتوای منو
        const menuContent = this.overlay.querySelector('.wp-block-columns');
        if (menuContent) {
            menuContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;

        if (this.isMenuOpen) {
            this.openFullScreenMenu();
        } else {
            this.closeFullScreenMenu();
        }
    }

    openFullScreenMenu() {
        // متوقف کردن انیمیشن فلش در دسکتاپ
        if (this.arrowPath && this.isDesktop()) {
            this.arrowPath.classList.remove('animate-loop-initial', 'animate-loop-hovered');
        }

        if (this.isDesktop()) {
            // در دسکتاپ: فعال کردن نمایش المان‌ها
            if (this.logoContainer) {
                this.logoContainer.style.display = 'block';
            }
            if (this.ctaButton) {
                this.ctaButton.style.display = 'block';
            }

            if (this.header) {
                this.header.classList.add('is-expanded-menu', 'header--expanded-bg');
            }

            gsap.to(this.header, {
                height: this.fullHeight - this.remToPx(2),
                duration: 0.5,
                ease: 'expo.out'
            });
            

            // نمایش المان‌ها در دسکتاپ
            const targets = [];
            if (this.logoContainer) targets.push(this.logoContainer);
            if (this.ctaButton) targets.push(this.ctaButton);
            
            if (targets.length > 0) {
                gsap.to(targets, {
                    x: -this.remToPx(12),
                   autoAlpha: 1,
                    duration: 1.4,
                    ease: 'power2.out'
                });
            }
        } else {
            // در موبایل: هدر به بالا حرکت می‌کند و از صفحه خارج می‌شود
            if (this.header) {
                this.header.classList.add('is-menu-open-mobile');
                
                // انیمیشن حرکت هدر به بالا و خارج شدن از صفحه
                gsap.to(this.header, {
                    y: -this.header.offsetHeight - 20, // حرکت به بالا با کمی فاصله
                    duration: 0.5,
                    ease: 'expo.out',
                    onComplete: () => {
                        // مخفی کردن کامل هدر پس از خروج از صفحه
                        this.header.style.visibility = 'hidden';
                    }
                });
            }
        }

        // نمایش overlay در هر دو حالت
        gsap.to(this.overlay, {
            opacity: 1,
            pointerEvents: 'all',
            duration: 0.6,
            ease: 'expo.out'
        });

        // چرخش آیکون منو در هر دو حالت
        if (this.menuIcon) {
            if (this.isDesktop()) {
                this.menuIcon.classList.remove('is-rotated-90');
                this.menuIcon.classList.add('is-rotated-180');
            } else {
                // در موبایل فقط کلاس چرخش اضافه می‌شود
                this.menuIcon.classList.add('is-rotated-180');
            }
        }
    }

    closeFullScreenMenu() {
        // پنهان کردن overlay در هر دو حالت
        gsap.to(this.overlay, {
            opacity: 0,
            pointerEvents: 'none',
            duration: 0.4,
            ease: 'expo.in'
        });

        if (this.isDesktop()) {
            // در دسکتاپ: بازگشت به حالت اولیه
            gsap.to(this.header, {
                height: '22vh',
                duration: 0.5,
                ease: 'expo.in'
            });

            // حذف کلاس‌ها
            if (this.header) {
                this.header.classList.remove('is-expanded-menu', 'header--expanded-bg');
            }

            // پنهان کردن المان‌ها فقط اگر در حالت هاور نیستیم
                const targets = [];
                if (this.logoContainer) targets.push(this.logoContainer);
                if (this.ctaButton) targets.push(this.ctaButton);
                
                if (targets.length > 0) {
                    gsap.to(targets, {
                        x: this.remToPx(12),
                        autoAlpha: 0,
                        duration: 0.3,
                        ease: 'circ.in',
                        onComplete: () => {
                                if (this.logoContainer) {
                                    this.logoContainer.style.display = 'none';
                                }
                                if (this.ctaButton) {
                                    this.ctaButton.style.display = 'none';
                                }
                        }
                    });
                }

        } else {

        // رفتار موبایل: ارتفاع هدر تغییر نکند
        // gsap.set(this.header, { height: '16vh' }); // یا هر مقداری که نیاز دارید
            // در موبایل: بازگشت هدر به موقعیت اولیه
            if (this.header) {
                // ابتدا visibility را بازنشانی کنید
                this.header.style.visibility = 'visible';
                
                // انیمیشن بازگشت هدر به موقعیت اصلی
                gsap.to(this.header, {
                    y: 0,
                    duration: 0.5,
                    ease: 'expo.out',
                    onComplete: () => {
                        this.header.classList.remove('is-menu-open-mobile');
                    }
                });
            }
        }

            // --- حذف کلاس حالت منو باز ---
        if (this.header) {
            this.header.classList.remove('is-menu-open'); // حذف کلاس جدید
            this.header.classList.remove('is-expanded-menu'); // حذف کلاس گسترش در هر دو حالت
            this.header.classList.remove('header--expanded-bg');
        }

            // --- تغییر مهم: فقط opacity را تغییر بده، display را دستکاری نکن ---
        if (this.isDesktop()) {
            if (this.logoContainer) {
                // فقط opacity را تغییر بده، display را دستکاری نکن
                gsap.to(this.logoContainer, {
                    opacity: 0,
                    visibility: 'hidden',
                    duration: 0.3,
                    ease: 'circ.in'
                });
            }

            if (this.ctaButton) {
                // فقط opacity را تغییر بده، display را دستکاری نکن
                gsap.to(this.ctaButton, {
                    opacity: 0,
                    visibility: 'hidden', 
                    duration: 0.3,
                    ease: 'circ.in'
                });
            }
        }
        // --- پایان تغییر مهم ---

        // بازنشانی آیکون منو
        if (this.menuIcon) {
            this.menuIcon.classList.remove('is-rotated-90', 'is-rotated-180');
        }
        // شروع دوباره انیمیشن فلش
        if (this.isDesktop()) {
            this.setArrowLoop('initial');
        } else {
            this.setArrowLoop('mobile');
        }
    }

    handleScroll() {
        // اسکرول فقط در موبایل و زمانی که منو بسته است فعال است
        if (this.isDesktop() || this.isMenuOpen) return;
        
        const st = window.scrollY;
        const headerHeight = this.header.offsetHeight;
        const threshold = headerHeight;
        const isScrollingDown = st > this.lastScrollTop;
        const isAtTop = st <= threshold;

        // اگر در بالای صفحه هستیم، هدر باید همیشه نمایش داده شود
        if (isAtTop) {
            gsap.to(this.header, {
                y: 0,
                duration: 0.8,
                ease: 'expo.out'
            });
        }
        // اسکرول به پایین و گذشتن از threshold - مخفی کردن هدر
        else if (isScrollingDown && st > threshold) {
            gsap.to(this.header, {
                y: -headerHeight - this.remToPx(2),
                duration: 0.8,
                ease: 'expo.in'
            });
        }
        // اسکرول به بالا - نمایش هدر
        else if (!isScrollingDown) {
            gsap.to(this.header, {
                y: 0,
                duration: 0.8,
                ease: 'expo.out'
            });
        }
        
        this.lastScrollTop = st;
    }

    handleResize() {
        if (this.isDesktop()) {
            // در دسکتاپ
            if (!this.isMenuOpen && !this.isHoverExpanded) {
                gsap.set(this.header, { 
                    height: '22vh', 
                    y: 0,
                    visibility: 'visible' // اطمینان از نمایش در resize
                });
                this.setArrowLoop('initial');
                this.initializeElements();
            }
        } else {
            // در موبایل
            gsap.set(this.header, { 
                height: '16vh', 
                y: 0,
                visibility: 'visible', // اطمینان از نمایش در resize
                clearProps: 'all' 
            });
            
            // اطمینان از نمایش المان‌ها در موبایل
            this.initializeElements();
                
            // فعال کردن انیمیشن فلش vertical در موبایل
            this.setArrowLoop('mobile');
            }
    }
}

// ایجاد نمونه از کلاس پس از لود شدن DOM
document.addEventListener('DOMContentLoaded', () => {
    new VerticalHeaderAnimator();
});

// پشتیبانی از FSE با MutationObserver
if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.querySelector('.minimal-vertical-header')) {
                    new VerticalHeaderAnimator();
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

//deepseek 3