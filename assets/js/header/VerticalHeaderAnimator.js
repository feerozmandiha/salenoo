
// تابع کمکی برای تشخیص دسکتاپ
function isDesktop() {
    return window.innerWidth >= 1024;
}

// تابع کمکی برای تشخیص موبایل
function isMobile() {
    return window.innerWidth < 1024;
}

class VerticalHeaderAnimator {
    constructor() {
        console.log('🎬 Vertical Header Animator Initializing...');
        
        this.header = document.querySelector('.minimal-vertical-header');
        if (!this.header) {
            console.warn('⚠️ VerticalHeaderAnimator: .minimal-vertical-header یافت نشد.');
            return;
        }

        // پیدا کردن المان‌ها
        this.toggleArea = this.header.querySelector('.menu-toggle-area');
        this.menuIcon = this.header.querySelector('.menu-icon');
        this.overlay = document.querySelector('.full-screen-menu-overlay');
        this.logoContainer = this.header.querySelector('.logo-container');
        this.ctaButton = this.header.querySelector('.cta-button-wrapper');
        this.arrowPath = this.header.querySelector('.arrow-path');

        // دیباگ وضعیت المان‌ها
        console.log('🔍 Header Elements Status:', {
            header: !!this.header,
            toggleArea: !!this.toggleArea,
            overlay: !!this.overlay,
            logoContainer: !!this.logoContainer,
            ctaButton: !!this.ctaButton,
            arrowPath: !!this.arrowPath
        });

        if (!this.toggleArea || !this.overlay) {
            console.error('❌ VerticalHeaderAnimator: عناصر ضروری یافت نشدند.');
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
        this.isDesktop = isDesktop();
        this.isMobile = isMobile();
        
        // پاکسازی استایل‌های تداخل‌کننده
        this.cleanupConflictingStyles();
        
        this.initHoverEvents();
        this.initClickEvents();
        this.setArrowLoop('initial');
        this.initializeElements();

        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        
        console.log('✅ Vertical Header Animator Initialized Successfully');
    }

    /**
     * پاکسازی استایل‌های تداخل‌کننده با وردپرس/گوتنبرگ
     */
    cleanupConflictingStyles() {
        // پاکسازی inline styles مشکل‌ساز
        const elementsToClean = [this.logoContainer, this.ctaButton, this.header];
        
        elementsToClean.forEach(element => {
            if (element) {
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-right');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('padding-left');
                element.style.removeProperty('margin');
                element.style.removeProperty('transform');
            }
        });
    }

    initializeElements() {
        if (this.isDesktop) {
            // در دسکتاپ: لوگو و CTA ابتدا مخفی هستند
            if (this.logoContainer) {
                this.logoContainer.style.cssText = `
                    display: none;
                    opacity: 0;
                    visibility: hidden;
                `;
            }
            if (this.ctaButton) {
                this.ctaButton.style.cssText = `
                    display: none;
                    opacity: 0;
                    visibility: hidden;
                `;
            }
        } else {
            // در موبایل: لوگو و CTA همیشه نمایش داده می‌شوند
            if (this.logoContainer) {
                this.logoContainer.style.cssText = `
                    display: flex;
                    opacity: 1;
                    visibility: visible;
                `;
            }
            if (this.ctaButton) {
                this.ctaButton.style.cssText = `
                    display: block;
                    opacity: 1;
                    visibility: visible;
                `;
            }
        }
    }

    setArrowLoop(state) {
        if (!this.arrowPath || this.isMenuOpen) return;
        
        // حذف تمام کلاس‌های انیمیشن
        this.arrowPath.classList.remove('animate-loop-initial', 'animate-loop-hovered', 'animate-loop-mobile');
        
        if (this.isMobile) {
            // در موبایل
            if (state === 'initial' || state === 'mobile') {
                this.arrowPath.classList.add('animate-loop-mobile');
            }
        } else {
            // در دسکتاپ
            if (state === 'initial') {
                this.arrowPath.classList.add('animate-loop-initial');
            } else if (state === 'hovered') {
                this.arrowPath.classList.add('animate-loop-hovered');
            }
        }
    }

    initHoverEvents() {
        if (!this.toggleArea) return;

        if (this.isDesktop) {
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
        if (!this.isDesktop) return;

        this.leaveTimeout = setTimeout(() => {
            if (!this.isOverHeaderOrOverlay && !this.isMenuOpen) {
                this.collapseHeaderOnHover();
            }
            this.leaveTimeout = null;
        }, 1500);
    }

    expandHeaderOnHover() {
        if (!this.isDesktop) return;

        console.log('🔄 Expanding header on hover');

        // تنظیم display قبل از انیمیشن
        if (this.logoContainer) {
            this.logoContainer.style.display = 'flex';
        }
        if (this.ctaButton) {
            this.ctaButton.style.display = 'block';
        }

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
                x: -this.remToPx(8),
                opacity: 1,
                visibility: 'visible',
                duration: 0.8,
                delay: 0.2,
                ease: "power2.out"
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
        if (!this.isDesktop || this.isMenuOpen) return;

        console.log('🔄 Collapsing header on hover leave');

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
                x: this.remToPx(8),
                opacity: 0,
                visibility: 'hidden',
                duration: 0.5,
                ease: "power2.in",
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

        // اضافه کردن کلیک روی full-screen-menu-inner برای بستن منو
        const menuInner = this.overlay.querySelector('.full-screen-menu-inner');
        if (menuInner) {
            menuInner.addEventListener('click', (e) => {
                // فقط اگر روی خود container کلیک شده (نه روی آیتم‌های داخلی)
                if (e.target === menuInner) {
                    this.toggleMenu();
                }
            });
        }

        // جلوگیری از بسته شدن منو با کلیک روی محتوای منو (آیتم‌ها)
        const menuContent = this.overlay.querySelector('.menu-icons');
        if (menuContent) {
            menuContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // جلوگیری از بسته شدن منو با کلیک روی داک
        const dock = this.overlay.querySelector('.dock');
        if (dock) {
            dock.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        console.log('🍔 Menu toggled:', this.isMenuOpen ? 'OPEN' : 'CLOSE');

        if (this.isMenuOpen) {
            this.openFullScreenMenu();
        } else {
            this.closeFullScreenMenu();
        }
    }

    openFullScreenMenu() {
        console.log('🚀 Opening full screen menu');

        // متوقف کردن انیمیشن فلش در دسکتاپ
        if (this.arrowPath && this.isDesktop) {
            this.arrowPath.classList.remove('animate-loop-initial', 'animate-loop-hovered');
        }

        if (this.isDesktop) {
            // در دسکتاپ
            if (this.logoContainer) {
                this.logoContainer.style.display = 'flex';
            }
            if (this.ctaButton) {
                this.ctaButton.style.display = 'block';
            }

            if (this.header) {
                this.header.classList.add('is-expanded-menu', 'header--expanded-bg');
            }

            // انیمیشن ارتفاع
            gsap.to(this.header, {
                height: this.fullHeight - this.remToPx(2),
                duration: 0.5,
                ease: 'expo.out'
            });

            // انیمیشن المان‌ها
            const targets = [];
            if (this.logoContainer) targets.push(this.logoContainer);
            if (this.ctaButton) targets.push(this.ctaButton);
            
            if (targets.length > 0) {
                gsap.to(targets, {
                    x: -this.remToPx(8),
                    opacity: 1,
                    visibility: 'visible',
                    duration: 0.6,
                    ease: "power2.out"
                });
            }
        } else {
            // در موبایل
            if (this.header) {
                this.header.classList.add('is-menu-open-mobile');
                
                gsap.to(this.header, {
                    y: -this.header.offsetHeight - 20,
                    duration: 0.4,
                    ease: 'expo.out',
                    onComplete: () => {
                        this.header.style.visibility = 'hidden';
                    }
                });
            }
        }

        // نمایش overlay
        gsap.to(this.overlay, {
            opacity: 1,
            pointerEvents: 'all',
            duration: 0.4,
            ease: 'expo.out'
        });

        // چرخش آیکون منو
        if (this.menuIcon) {
            this.menuIcon.classList.add('is-rotated-180');
            this.menuIcon.classList.remove('is-rotated-90');
        }
    }

    closeFullScreenMenu() {
        console.log('📪 Closing full screen menu');

        // پنهان کردن overlay
        gsap.to(this.overlay, {
            opacity: 0,
            pointerEvents: 'none',
            duration: 0.3,
            ease: 'expo.in'
        });

        if (this.isDesktop) {
            // در دسکتاپ
            gsap.to(this.header, {
                height: '22vh',
                duration: 0.4,
                ease: 'expo.in'
            });

            // حذف کلاس‌ها
            if (this.header) {
                this.header.classList.remove('is-expanded-menu', 'header--expanded-bg');
            }

            // پنهان کردن المان‌ها
            const targets = [];
            if (this.logoContainer) targets.push(this.logoContainer);
            if (this.ctaButton) targets.push(this.ctaButton);
            
            if (targets.length > 0) {
                gsap.to(targets, {
                    x: this.remToPx(8),
                    opacity: 0,
                    visibility: 'hidden',
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        if (!this.isHoverExpanded) {
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
        } else {
            // در موبایل
            if (this.header) {
                this.header.style.visibility = 'visible';
                
                gsap.to(this.header, {
                    y: 0,
                    duration: 0.4,
                    ease: 'expo.out',
                    onComplete: () => {
                        this.header.classList.remove('is-menu-open-mobile');
                    }
                });
            }
        }

        // بازنشانی آیکون منو
        if (this.menuIcon) {
            this.menuIcon.classList.remove('is-rotated-90', 'is-rotated-180');
        }

        // شروع دوباره انیمیشن فلش
        if (this.isDesktop) {
            this.setArrowLoop('initial');
        } else {
            this.setArrowLoop('mobile');
        }
    }

    handleScroll() {
        // اگر منو باز است، کاملاً از اسکرول جلوگیری کن
        if (this.isMenuOpen) return;
        
        // فقط برای موبایل و تبلت ادامه بده
        if (this.isDesktop) return;        
        const st = window.scrollY;
        const headerHeight = this.header.offsetHeight;
        const threshold = headerHeight;
        const isScrollingDown = st > this.lastScrollTop;
        const isAtTop = st <= threshold;

        if (isAtTop) {
            gsap.to(this.header, {
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        } else if (isScrollingDown && st > threshold) {
            gsap.to(this.header, {
                y: -headerHeight - 17,
                duration: 0.4,
                ease: 'power2.in'
            });
        } else if (!isScrollingDown) {
            gsap.to(this.header, {
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        }
        
        this.lastScrollTop = st;
    }

    handleResize() {
        const wasDesktop = this.isDesktop;
        this.isDesktop = isDesktop();
        this.isMobile = isMobile();

        if (this.isDesktop !== wasDesktop) {
            console.log('🔄 Breakpoint changed:', this.isDesktop ? 'DESKTOP' : 'MOBILE');
        }

        if (this.isDesktop) {
            // در دسکتاپ
            this.header.classList.remove('mobile-layout');
            
            if (!this.isMenuOpen && !this.isHoverExpanded) {
                gsap.set(this.header, { 
                    height: '22vh', 
                    y: 0,
                    visibility: 'visible'
                });
                this.setArrowLoop('initial');
                this.initializeElements();
            }
        } else {
            // در موبایل
            this.header.classList.add('mobile-layout');
            
            gsap.set(this.header, { 
                height: '16vh', 
                y: 0,
                visibility: 'visible'
            });
            
            this.initializeElements();
            this.setArrowLoop('mobile');
        }
    }
}

// راه‌اندازی وقتی DOM و GSAP آماده شد
function initializeHeaderAnimator() {
    if (typeof gsap === 'undefined') {
        console.log('⏳ Waiting for GSAP...');
        if (window.salnamaGSAPLoaded) {
            window.salnamaGSAPLoaded.then(() => {
                new VerticalHeaderAnimator();
            });
        } else {
            setTimeout(initializeHeaderAnimator, 100);
        }
        return;
    }

    const header = document.querySelector('.minimal-vertical-header');
    if (header) {
        new VerticalHeaderAnimator();
    } else {
        console.warn('⏳ Header not found, retrying...');
        setTimeout(initializeHeaderAnimator, 500);
    }
}

// راه‌اندازی اصلی
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeaderAnimator);
} else {
    initializeHeaderAnimator();
}

// پشتیبانی از بارگذاری دینامیک
if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.querySelector('.minimal-vertical-header')) {
                    console.log('🔄 Header dynamically added, reinitializing...');
                    setTimeout(() => {
                        new VerticalHeaderAnimator();
                    }, 100);
                }
            }
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}