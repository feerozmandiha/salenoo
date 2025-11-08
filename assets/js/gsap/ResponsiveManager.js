// assets/js/gsap/ResponsiveManager.js
class ResponsiveManager {
    constructor(engine) {
        this.engine = engine;
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.animations = new Map();
        this.resizeTimeout = null;
        this.reduceMotion = false;
        this.init();
    }
    
    init() {
        console.log('📱 Responsive Animation Manager Initialized');
        this.setupResponsiveListeners();
        this.detectReduceMotion();
        this.applyResponsiveSettings(); // اعمال اولیه
    }
    
    setupResponsiveListeners() {
        const handleResize = () => {
            // debounce برای performance
            if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
            
            this.resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        };
        
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        
        // ذخیره برای پاکسازی
        this.resizeHandlers = {
            resize: handleResize,
            orientationchange: handleResize
        };
    }
    
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }
    
    handleResize() {
        const newBreakpoint = this.getCurrentBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
            console.log(`🔄 Breakpoint changed: ${this.currentBreakpoint} -> ${newBreakpoint}`);
            this.currentBreakpoint = newBreakpoint;
            this.applyResponsiveSettings();
        }
    }
    
    registerResponsiveAnimation(element, config) {
        if (!this.isValidElement(element)) {
            console.error('❌ Invalid element for responsive animation');
            return null;
        }

        const animationId = this.generateAnimationId();
        this.animations.set(animationId, {
            element: element,
            config: config,
            active: false,
            instance: null
        });
        
        this.applyElementResponsiveSettings(element, config, animationId);
        return animationId;
    }
    
    applyElementResponsiveSettings(element, config, animationId) {
        const breakpointSettings = config[this.currentBreakpoint] || {};
        
        // غیرفعال کردن انیمیشن در موبایل اگر تنظیم شده
        if (this.currentBreakpoint === 'mobile' && breakpointSettings.disable) {
            console.log(`📵 Animation disabled on mobile for:`, element);
            gsap.set(element, { clearProps: "all" });
            this.updateAnimationState(animationId, false);
            return;
        }
        
        // بررسی تنظیمات کاهش حرکت
        if (this.reduceMotion && config.reduceMotion !== false) {
            this.applyReducedMotionAnimation(element, config, animationId);
            return;
        }
        
        // اعمال تنظیمات خاص breakpoint
        const duration = breakpointSettings.duration || config.duration || 0.6;
        const shouldAnimate = breakpointSettings.enable !== false;
        
        if (shouldAnimate && this.engine) {
            const animationInstance = this.engine.applyBasicAnimation(
                element, 
                config.animationType || 'fadeIn', 
                duration, 
                config.delay || 0, 
                config.ease || 'power2.out',
                'scroll',
                0,
                false
            );
            
            this.updateAnimationState(animationId, true, animationInstance);
        } else {
            this.updateAnimationState(animationId, false);
        }
    }
    
    applyReducedMotionAnimation(element, config, animationId) {
        console.log('♿ Applying reduced motion animation for:', element);
        
        const reducedConfig = config.reducedMotion || {
            animationType: 'fadeIn',
            duration: 0.3,
            ease: 'power2.out'
        };
        
        const animationInstance = gsap.to(element, {
            opacity: 1,
            duration: reducedConfig.duration,
            ease: reducedConfig.ease,
            onComplete: () => {
                this.updateAnimationState(animationId, true);
            }
        });
        
        this.updateAnimationState(animationId, true, animationInstance);
    }
    
    updateAnimationState(animationId, active, instance = null) {
        const animation = this.animations.get(animationId);
        if (animation) {
            animation.active = active;
            animation.instance = instance;
        }
    }
    
    applyResponsiveSettings() {
        console.log(`📱 Applying responsive settings for ${this.currentBreakpoint}`);
        
        this.animations.forEach((animation, id) => {
            this.applyElementResponsiveSettings(animation.element, animation.config, id);
        });
    }
    
    detectReduceMotion() {
        // بررسی تنظیمات کاهش حرکت در سیستم
        const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.reduceMotion = reduceMotionQuery.matches;
        
        const handleReduceMotionChange = (e) => {
            this.reduceMotion = e.matches;
            console.log(`♿ Reduce motion preference changed: ${this.reduceMotion}`);
            this.applyResponsiveSettings();
        };
        
        reduceMotionQuery.addEventListener('change', handleReduceMotionChange);
        
        // ذخیره برای پاکسازی
        this.reduceMotionHandler = handleReduceMotionChange;
        this.reduceMotionQuery = reduceMotionQuery;
        
        console.log(`♿ Reduce motion preference: ${this.reduceMotion}`);
    }
    
    // تنظیمات پیشرفته برای breakpointهای مختلف
    getBreakpointConfig(element) {
        if (!this.isValidElement(element)) return {};
        
        const mobileDisabled = element.getAttribute('data-animation-mobile-disable') === 'true';
        const tabletDuration = parseFloat(element.getAttribute('data-animation-tablet-duration')) || 0.8;
        const desktopAdvanced = element.getAttribute('data-animation-desktop-advanced') !== 'false';
        
        return {
            mobile: { 
                disable: mobileDisabled,
                duration: 0.5
            },
            tablet: { 
                duration: tabletDuration,
                enable: true
            },
            desktop: { 
                duration: 0.6, 
                enableAdvanced: desktopAdvanced,
                enable: true
            }
        };
    }
    
    // اعمال تنظیمات breakpoint بر اساس data attributes
    applyDataAttributeSettings(element) {
        const breakpointConfig = this.getBreakpointConfig(element);
        const config = {
            animationType: element.getAttribute('data-animation-type') || 'fadeIn',
            duration: parseFloat(element.getAttribute('data-animation-duration')) || 0.6,
            ...breakpointConfig
        };
        
        return this.registerResponsiveAnimation(element, config);
    }
    
    // متدهای کمکی
    isValidElement(element) {
        return element && element.nodeType === 1;
    }
    
    generateAnimationId() {
        return 'resp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // گرفتن اطلاعات breakpoint فعلی
    getCurrentBreakpointInfo() {
        const width = window.innerWidth;
        return {
            breakpoint: this.currentBreakpoint,
            width: width,
            height: window.innerHeight,
            reduceMotion: this.reduceMotion
        };
    }
    
    // پاکسازی
    destroy() {
        console.log('🧹 Cleaning up responsive manager...');
        
        // پاکسازی event listeners
        if (this.resizeHandlers) {
            window.removeEventListener('resize', this.resizeHandlers.resize);
            window.removeEventListener('orientationchange', this.resizeHandlers.orientationchange);
        }
        
        if (this.reduceMotionQuery && this.reduceMotionHandler) {
            this.reduceMotionQuery.removeEventListener('change', this.reduceMotionHandler);
        }
        
        // پاکسازی انیمیشن‌ها
        this.animations.forEach((animation, id) => {
            if (animation.instance && animation.instance.kill) {
                animation.instance.kill();
            }
        });
        this.animations.clear();
        
        // پاکسازی timeout
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
    }
    
    // ریست کردن انیمیشن‌ها
    resetAnimations() {
        this.animations.forEach((animation, id) => {
            if (animation.instance && animation.instance.kill) {
                animation.instance.kill();
            }
            animation.active = false;
            animation.instance = null;
        });
        
        this.applyResponsiveSettings();
    }
}

// ثبت global اگر نیاز باشد
if (typeof window !== 'undefined' && typeof window.ResponsiveManager === 'undefined') {
    window.ResponsiveManager = ResponsiveManager;
}