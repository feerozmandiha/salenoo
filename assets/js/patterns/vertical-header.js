/**
 * VerticalHeaderAnimator for Salnama Theme
 * کلاس مدیریت هدر عمودی — نسخه event-driven با GSAP
 */

(function() {
    'use strict';

    class VerticalHeaderAnimator {
        constructor() {
            if (window.SalnamaVerticalHeaderInstance) {
                return window.SalnamaVerticalHeaderInstance;
            }

            this.header = document.querySelector('.minimal-vertical-header');
            if (!this.header) {
                console.warn('⚠️ VerticalHeaderAnimator: Header not found');
                return;
            }

            console.log('🎬 VerticalHeaderAnimator: Instance created');
            this.initializeElements();
            
            window.SalnamaVerticalHeaderInstance = this;
            this.init();
        }

        initializeElements() {
            this.toggleArea = this.header.querySelector('.menu-toggle-area');
            this.menuIcon = this.header.querySelector('.menu-icon');
            this.logoContainer = this.header.querySelector('.logo-container');
            this.ctaButton = this.header.querySelector('.cta-button-wrapper');
            this.arrowPath = this.header.querySelector('.arrow-path');
            this.overlay = document.querySelector('.full-screen-menu-overlay');

            console.log('🔧 VerticalHeaderAnimator: Elements initialized');
        }

        /**
         * راه‌اندازی اصلی با سیستم event-driven
         */
        init() {
            console.log('🎬 VerticalHeaderAnimator: Starting initialization...');
            
            // ابتدا وضعیت فعلی GSAP را بررسی کن
            this.checkGSAPStatus();
            
            // سپس برای رویداد بارگذاری GSAP گوش کن
            this.setupGSAPEventListener();
            
            // راه‌اندازی اولیه بدون GSAP
            this.initBasicFeatures();
        }

        /**
         * بررسی وضعیت فعلی GSAP
         */
        checkGSAPStatus() {
            console.log('🔍 VerticalHeaderAnimator: Checking GSAP status...');
            
            // بررسی از طریق روش‌های مختلف
            if (window.salnamaGSAPLoaded && window.salnamaGSAP) {
                console.log('✅ VerticalHeaderAnimator: GSAP already loaded via salnamaGSAP');
                this.gsap = window.salnamaGSAP;
                this.initWithGSAP();
                return true;
            }
            
            if (typeof gsap !== 'undefined') {
                console.log('✅ VerticalHeaderAnimator: GSAP found as global');
                this.gsap = gsap;
                this.initWithGSAP();
                return true;
            }
            
            if (window.gsap) {
                console.log('✅ VerticalHeaderAnimator: GSAP found as window.gsap');
                this.gsap = window.gsap;
                this.initWithGSAP();
                return true;
            }
            
            console.log('⏳ VerticalHeaderAnimator: GSAP not yet available, waiting...');
            return false;
        }

        /**
         * تنظیم event listener برای بارگذاری GSAP
         */
        setupGSAPEventListener() {
            window.addEventListener('salnama:gsap-loaded', (event) => {
                console.log('🎯 VerticalHeaderAnimator: GSAP loaded event received');
                
                // دریافت GSAP از event یا از global
                if (event.detail && event.detail.gsap) {
                    this.gsap = event.detail.gsap;
                } else if (window.salnamaGSAP) {
                    this.gsap = window.salnamaGSAP;
                } else if (typeof gsap !== 'undefined') {
                    this.gsap = gsap;
                }
                
                if (this.gsap) {
                    console.log('✅ VerticalHeaderAnimator: GSAP received from event');
                    this.initWithGSAP();
                }
            });

            // همچنین برای event DOMContentLoaded گوش کن
            document.addEventListener('DOMContentLoaded', () => {
                console.log('🔍 VerticalHeaderAnimator: DOM loaded, rechecking GSAP...');
                setTimeout(() => this.checkGSAPStatus(), 100);
            });
        }

        /**
         * راه‌اندازی ویژگی‌های پایه (بدون GSAP)
         */
        initBasicFeatures() {
            console.log('🔧 VerticalHeaderAnimator: Initializing basic features...');
            
            this.initClickEvents();
            this.setArrowLoop('initial');
            this.setupInitialState();
            
            window.addEventListener('resize', () => this.handleResize());
            
            console.log('✅ VerticalHeaderAnimator: Basic features initialized');
        }

        /**
         * راه‌اندازی کامل با GSAP
         */
        initWithGSAP() {
            if (this.gsapInitialized) {
                console.log('⚠️ VerticalHeaderAnimator: Already initialized with GSAP');
                return;
            }
            
            console.log('🎬 VerticalHeaderAnimator: Initializing with GSAP...');
            
            // ثبت ScrollTrigger
            if (typeof ScrollTrigger !== 'undefined' && this.gsap.registerPlugin) {
                this.gsap.registerPlugin(ScrollTrigger);
                console.log('✅ VerticalHeaderAnimator: ScrollTrigger registered');
            }
            
            // راه‌اندازی ویژگی‌های پیشرفته
            this.initHoverEvents();
            window.addEventListener('scroll', () => this.handleScroll());
            
            this.gsapInitialized = true;
            console.log('✅ VerticalHeaderAnimator: Fully initialized with GSAP');
        }

        // ========== متدهای پایه ==========
        
        get fullHeight() {
            return window.innerHeight;
        }

        remToPx(rem) {
            return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
        }

        get isDesktop() {
            return window.innerWidth >= 1024;
        }

        get isMobile() {
            return window.innerWidth < 1024;
        }

        setupInitialState() {
            if (this.isDesktop) {
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
            
            if (this.isMobile) {
                this.arrowPath.classList.remove('animate-loop-initial', 'animate-loop-hovered', 'animate-loop-mobile');
                if (state === 'initial' || state === 'mobile') {
                    this.arrowPath.classList.add('animate-loop-mobile');
                }
            } else {
                this.arrowPath.classList.remove('animate-loop-initial', 'animate-loop-hovered');
                if (state === 'initial') {
                    this.arrowPath.classList.add('animate-loop-initial');
                } else if (state === 'hovered') {
                    this.arrowPath.classList.add('animate-loop-hovered');
                }
            }
        }

        // ========== Event Handlers ==========
        
        initClickEvents() {
            if (!this.toggleArea) return;
            
            this.toggleArea.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        initHoverEvents() {
            if (!this.toggleArea || !this.gsap) return;
            
            if (this.isDesktop) {
                this.initDesktopHoverEvents();
            }
        }

        initDesktopHoverEvents() {
            this.isMenuOpen = false;
            this.leaveTimeout = null;
            this.isOverHeaderOrOverlay = false;
            this.isHoverExpanded = false;

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

        // ========== Animation Methods ==========
        
        expandHeaderOnHover() {
            if (!this.gsap || !this.isDesktop) return;

            if (this.logoContainer) this.logoContainer.style.display = 'block';
            if (this.ctaButton) this.ctaButton.style.display = 'block';
            if (this.header) this.header.classList.add('header--expanded-bg');

            this.gsap.to(this.header, {
                height: this.fullHeight - this.remToPx(2),
                duration: 0.7,
                ease: 'expo.out'
            });

            const targets = [];
            if (this.logoContainer) targets.push(this.logoContainer);
            if (this.ctaButton) targets.push(this.ctaButton);
            
            if (targets.length > 0) {
                this.gsap.to(targets, {
                    x: -this.remToPx(12),
                    autoAlpha: 1,
                    duration: 1,
                    delay: 1.25,
                    ease: 'circ.out'
                });
            }

            if (this.menuIcon) {
                this.menuIcon.classList.add('is-rotated-90');
                this.menuIcon.classList.remove('is-rotated-180');
            }
            
            this.setArrowLoop('hovered');
        }

        collapseHeaderOnHover() {
            if (!this.gsap || !this.isDesktop || this.isMenuOpen) return;
            
            this.isHoverExpanded = false;

            if (this.header) this.header.classList.remove('header--expanded-bg');

            this.gsap.to(this.header, {
                height: '22vh',
                duration: 0.6,
                ease: 'expo.in'
            });

            const targets = [];
            if (this.logoContainer) targets.push(this.logoContainer);
            if (this.ctaButton) targets.push(this.ctaButton);
            
            if (targets.length > 0) {
                this.gsap.to(targets, {
                    x: this.remToPx(12),
                    autoAlpha: 0,
                    duration: 1,
                    ease: 'circ.in',
                    onComplete: () => {
                        if (!this.isHoverExpanded && !this.isMenuOpen) {
                            if (this.logoContainer) this.logoContainer.style.display = 'none';
                            if (this.ctaButton) this.ctaButton.style.display = 'none';
                        }
                    }
                });
            }

            if (this.menuIcon) {
                this.menuIcon.classList.remove('is-rotated-90', 'is-rotated-180');
            }
            
            this.setArrowLoop('initial');
        }

        // بقیه متدها (toggleMenu, openFullScreenMenu, etc.) مانند قبل
        // [کدهای قبلی بدون تغییر باقی می‌مانند]

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
            }, 2000);
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
            if (!this.overlay) {
                this.isMenuOpen = false;
                return;
            }

            if (this.arrowPath && this.isDesktop) {
                this.arrowPath.classList.remove('animate-loop-initial', 'animate-loop-hovered');
            }

            if (this.isDesktop) {
                if (this.logoContainer) this.logoContainer.style.display = 'block';
                if (this.ctaButton) this.ctaButton.style.display = 'block';
                if (this.header) this.header.classList.add('is-expanded-menu', 'header--expanded-bg');
                
                if (this.gsap) {
                    this.gsap.to(this.header, {
                        height: this.fullHeight - this.remToPx(2),
                        duration: 0.5,
                        ease: 'expo.out'
                    });

                    const targets = [];
                    if (this.logoContainer) targets.push(this.logoContainer);
                    if (this.ctaButton) targets.push(this.ctaButton);
                    
                    if (targets.length > 0) {
                        this.gsap.to(targets, {
                            x: -this.remToPx(12),
                            autoAlpha: 1,
                            duration: 1.4,
                            ease: 'power2.out'
                        });
                    }
                } else {
                    this.header.style.height = (this.fullHeight - this.remToPx(2)) + 'px';
                }
            } else {
                if (this.header) {
                    this.header.classList.add('is-menu-open-mobile');
                    if (this.gsap) {
                        this.gsap.to(this.header, {
                            y: -this.header.offsetHeight - 20,
                            duration: 0.5,
                            ease: 'expo.out',
                            onComplete: () => {
                                this.header.style.visibility = 'hidden';
                            }
                        });
                    } else {
                        this.header.style.transform = 'translateY(' + (-this.header.offsetHeight - 20) + 'px)';
                        this.header.style.visibility = 'hidden';
                    }
                }
            }

            if (this.gsap) {
                this.gsap.to(this.overlay, {
                    opacity: 1,
                    pointerEvents: 'all',
                    duration: 0.6,
                    ease: 'expo.out'
                });
            } else {
                this.overlay.style.opacity = '1';
                this.overlay.style.pointerEvents = 'all';
            }

            if (this.menuIcon) {
                if (this.isDesktop) {
                    this.menuIcon.classList.remove('is-rotated-90');
                    this.menuIcon.classList.add('is-rotated-180');
                } else {
                    this.menuIcon.classList.add('is-rotated-180');
                }
            }

            this.overlay.addEventListener('click', this.handleOverlayClick);
        }

        closeFullScreenMenu() {
            if (!this.overlay) {
                this.isMenuOpen = true;
                return;
            }

            this.overlay.removeEventListener('click', this.handleOverlayClick);

            if (this.gsap) {
                this.gsap.to(this.overlay, {
                    opacity: 0,
                    pointerEvents: 'none',
                    duration: 0.4,
                    ease: 'expo.in'
                });
            } else {
                this.overlay.style.opacity = '0';
                this.overlay.style.pointerEvents = 'none';
            }

            if (this.isDesktop) {
                if (this.gsap) {
                    this.gsap.to(this.header, {
                        height: '22vh',
                        duration: 0.5,
                        ease: 'expo.in'
                    });
                } else {
                    this.header.style.height = '22vh';
                }

                if (this.header) {
                    this.header.classList.remove('is-expanded-menu', 'header--expanded-bg');
                }

                if (this.gsap) {
                    const targets = [];
                    if (this.logoContainer) targets.push(this.logoContainer);
                    if (this.ctaButton) targets.push(this.ctaButton);
                    
                    if (targets.length > 0) {
                        this.gsap.to(targets, {
                            x: this.remToPx(12),
                            autoAlpha: 0,
                            duration: 0.3,
                            ease: 'circ.in',
                            onComplete: () => {
                                if (this.logoContainer) this.logoContainer.style.display = 'none';
                                if (this.ctaButton) this.ctaButton.style.display = 'none';
                            }
                        });
                    }
                } else {
                    if (this.logoContainer) this.logoContainer.style.display = 'none';
                    if (this.ctaButton) this.ctaButton.style.display = 'none';
                }
            } else {
                if (this.header) {
                    this.header.style.visibility = 'visible';
                    if (this.gsap) {
                        this.gsap.to(this.header, {
                            y: 0,
                            duration: 0.5,
                            ease: 'expo.out',
                            onComplete: () => {
                                this.header.classList.remove('is-menu-open-mobile');
                            }
                        });
                    } else {
                        this.header.style.transform = 'translateY(0)';
                        this.header.classList.remove('is-menu-open-mobile');
                    }
                }
            }

            if (this.header) {
                this.header.classList.remove('is-menu-open', 'is-expanded-menu', 'header--expanded-bg');
            }

            if (this.menuIcon) {
                this.menuIcon.classList.remove('is-rotated-90', 'is-rotated-180');
            }

            this.setArrowLoop(this.isDesktop ? 'initial' : 'mobile');
        }

        handleOverlayClick = (e) => {
            if (e.target === this.overlay) {
                this.toggleMenu();
            }
        }

        handleScroll() {
            if (!this.gsap || this.isDesktop || this.isMenuOpen) return;
            
            const st = window.scrollY;
            const headerHeight = this.header.offsetHeight;
            const threshold = headerHeight;
            const isScrollingDown = st > this.lastScrollTop;
            const isAtTop = st <= threshold;

            if (isAtTop) {
                this.gsap.to(this.header, {
                    y: 0,
                    duration: 0.8,
                    ease: 'expo.out'
                });
            } else if (isScrollingDown && st > threshold) {
                this.gsap.to(this.header, {
                    y: -headerHeight - this.remToPx(2),
                    duration: 0.8,
                    ease: 'expo.in'
                });
            } else if (!isScrollingDown) {
                this.gsap.to(this.header, {
                    y: 0,
                    duration: 0.8,
                    ease: 'expo.out'
                });
            }
            
            this.lastScrollTop = st;
        }

        handleResize() {
            if (this.gsap) {
                if (this.isDesktop) {
                    if (!this.isMenuOpen && !this.isHoverExpanded) {
                        this.gsap.set(this.header, {
                            height: '22vh',
                            y: 0,
                            visibility: 'visible'
                        });
                        this.setArrowLoop('initial');
                        this.setupInitialState();
                    }
                } else {
                    this.gsap.set(this.header, {
                        height: '16vh',
                        y: 0,
                        visibility: 'visible',
                        clearProps: 'all'
                    });
                    this.setupInitialState();
                    this.setArrowLoop('mobile');
                }
            } else {
                this.setupInitialState();
                this.setArrowLoop(this.isMobile ? 'mobile' : 'initial');
            }
        }
    }

    // راه‌اندازی اصلی
    function initializeVerticalHeader() {
        console.log('🎬 Vertical Header: Starting initialization...');
        new VerticalHeaderAnimator();
    }

    // راه‌اندازی وقتی DOM آماده است
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeVerticalHeader);
    } else {
        initializeVerticalHeader();
    }

})();