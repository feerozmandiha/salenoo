class GSAPEngine {
    constructor() {
        console.log('🎬 Salmama GSAP Engine Initializing...');
        this.advancedAnimations = null;
        this.hasInitialized = false;
        this.init();
    }

    init() {
        if (typeof gsap === 'undefined') {
            console.error('❌ GSAP not loaded!');
            return;
        }

        if (typeof ScrollTrigger === 'undefined') {
            console.error('❌ ScrollTrigger not loaded!');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);
        console.log('🔧 Checking AdvancedAnimations...');
        console.log('AdvancedAnimations defined:', typeof AdvancedAnimations !== 'undefined');

        // لود انیمیشن‌های پیشرفته
        this.loadAdvancedAnimations();

        console.log('✅ GSAP registered');
        this.initAnimations();
    }

    loadAdvancedAnimations() {
        if (typeof AdvancedAnimations === 'undefined') {
            console.error('❌ AdvancedAnimations class not found!');
            console.log('Available globals:', Object.keys(window).filter(key => key.includes('Animation')));
            return;
        }

        try {
            console.log('🔧 Creating AdvancedAnimations instance...');
            this.advancedAnimations = new AdvancedAnimations(this);
            console.log('✅ Advanced animations loaded successfully');
            console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.advancedAnimations)));
        } catch (error) {
            console.error('❌ Error creating AdvancedAnimations instance:', error);
            this.advancedAnimations = null;
        }
    }

    initAnimations() {
        if (this.hasInitialized) {
            console.log('⚠️ GSAP Engine already initialized');
            return;
        }

        this.hasInitialized = true;
        console.log('🔍 Looking for animated blocks...');

        // استفاده از [data-salmama-animated="true"] برای شناسایی المان‌ها
        const animatedBlocks = document.querySelectorAll('[data-salmama-animated="true"]');
        console.log(`📦 Found ${animatedBlocks.length} animated blocks`);

        animatedBlocks.forEach((block, index) => {
            this.animateBlock(block, index);
        });

        this.setupHoverEffects();
        console.log('✅ All animations applied');
    }

    setupElementClasses(element, animationType) {
        // اضافه کردن کلاس‌های پایه
        element.classList.add('salmama-animated-element', 'salmama-transform-element');
        
        // اضافه کردن کلاس بر اساس نوع المان
        const displayStyle = window.getComputedStyle(element).display;
        if (displayStyle === 'block') {
            element.classList.add('salmama-transform-block');
        } else {
            element.classList.add('salmama-transform-inline');
        }
        
        // اضافه کردن کلاس بر اساس نوع انیمیشن
        if (animationType.includes('scale')) {
            element.classList.add('salmama-scale-limited');
        }
    }

    animateBlock(block, index) {
        const type = block.getAttribute('data-animation-type');
        const duration = parseFloat(block.getAttribute('data-animation-duration')) || 0.6;
        const delay = parseFloat(block.getAttribute('data-animation-delay')) || 0;
        const ease = block.getAttribute('data-animation-ease') || 'power2.out';
        const trigger = block.getAttribute('data-animation-trigger') || 'scroll';

        // پارامترهای پیشرفته
        const stagger = parseFloat(block.getAttribute('data-animation-stagger')) || 0.1;
        const repeat = parseInt(block.getAttribute('data-animation-repeat')) || 0;
        const yoyo = block.getAttribute('data-animation-yoyo') === 'true';

        console.log(`🎯 Block ${index + 1}:`, {
            type, duration, delay, ease, trigger, stagger, repeat, yoyo
        });

        // پاک کردن هر گونه انیمیشن قبلی
        gsap.killTweensOf(block);

        this.setupElementClasses(block, type);


        // تنظیم حالت اولیه
        this.setInitialState(block, type);

        // اعمال انیمیشن
        this.applyAnimationByType(block, type, duration, delay, ease, trigger, stagger, repeat, yoyo);
    }

    setInitialState(element, type) {
        console.log(`🔧 Setting initial state for: ${type}`);

        if (!this.isAdvancedAnimation(type)) {
            if (type.includes('slide')) {
                gsap.set(element, {
                    opacity: 0,
                    x: type.includes('Left') ? 100 : type.includes('Right') ? -100 : 0,
                    y: type.includes('Up') ? 100 : type.includes('Down') ? -100 : 0
                });
            } else if (type.includes('scale')) {
                gsap.set(element, {
                    opacity: 0,
                    scale: type === 'scaleIn' ? 0.5 : 1.5
                });
            } else if (type.includes('flip') || type.includes('rotate')) {
                gsap.set(element, {
                    opacity: 0,
                    rotationX: type === 'flipInX' ? 90 : 0,
                    rotationY: type === 'flipInY' ? 90 : 0,
                    rotation: type === 'rotateIn' ? -180 : 0
                });
            } else {
                gsap.set(element, { opacity: 0, y: 30 });
            }
        }
        // برای انیمیشن‌های پیشرفته، حالت اولیه در خود متد تنظیم می‌شود
    }

    applyAnimationByType(element, type, duration, delay, ease, trigger, stagger, repeat, yoyo) {
        console.log(`🎬 Applying animation: ${type}`);

        if (this.isAdvancedAnimation(type)) {
            console.log(`🔧 This is an advanced animation: ${type}`);
            this.applyAdvancedAnimation(element, type, duration, delay, ease, trigger, stagger, repeat, yoyo);
            return;
        }

        // انیمیشن‌های پایه
        console.log(`🔧 This is a basic animation: ${type}`);
        const animationProps = this.getAnimationProperties(type, element);
        const baseAnimation = {
            ...animationProps.to,
            duration: duration,
            delay: delay,
            ease: ease,
            repeat: repeat,
            yoyo: yoyo
        };

        if (trigger === 'scroll') {
            baseAnimation.scrollTrigger = {
                trigger: element,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse",
                markers: false
            };
        }

        gsap.to(element, baseAnimation);
        console.log(`✅ Applied ${type} animation to:`, element);
    }

    isAdvancedAnimation(type) {
        const advancedTypes = [
            'typeWriter', 'staggerGrid', 'parallaxScroll',
            'gradientShift', 'magneticButton', 'textReveal', 'morphShape'
        ];
        const isAdvanced = advancedTypes.includes(type);
        console.log(`🔍 ${type} is advanced: ${isAdvanced}`);
        return isAdvanced;
    }

    applyAdvancedAnimation(element, type, duration, delay, ease, trigger, stagger, repeat, yoyo) {
        console.log(`🚀 Starting advanced animation: ${type}`);

        if (!this.advancedAnimations) {
            console.error('❌ Advanced animations instance not available');
            this.applyFallbackAnimation(element, type, duration, delay, ease);
            return;
        }

        // نام متدها بدون پسوند Animation هستند
        const methodName = this.getAdvancedMethodName(type);
        console.log(`🔧 Looking for method: ${methodName}`);

        if (typeof this.advancedAnimations[methodName] !== 'function') {
            console.error(`❌ Method ${methodName} not found in AdvancedAnimations`);
            console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.advancedAnimations)));
            this.applyFallbackAnimation(element, type, duration, delay, ease);
            return;
        }

        try {
            console.log(`🔧 Calling ${methodName}...`);

            let animation;

            switch (type) {
                case 'typeWriter':
                    // استفاده از راه حل قطعی برای تایپ رایتر
                    animation = this.advancedAnimations.typeWriterAnimation(element, duration, delay);
                    break;
                case 'staggerGrid':
                    animation = this.advancedAnimations.staggerGridAnimation(element, duration, stagger, 'start');
                    break;
                case 'parallaxScroll':
                    animation = this.advancedAnimations.parallaxAnimation(element, 0.5, element.parentElement);
                    break;
                case 'textReveal':
                    animation = this.advancedAnimations.textRevealAnimation(element, 'fromBottom', duration);
                    break;
                case 'magneticButton':
                    animation = this.advancedAnimations.magneticButtonAnimation(element, 0.3);
                    break;
                case 'gradientShift':
                    animation = this.advancedAnimations.gradientShiftAnimation(element, duration);
                    break;
                case 'morphShape':
                    animation = this.advancedAnimations.morphShapeAnimation(element, [], duration);
                    break;
                default:
                    console.warn(`❌ Unknown advanced animation type: ${type}`);
                    this.applyFallbackAnimation(element, type, duration, delay, ease);
                    return;
            }

            console.log(`✅ Successfully applied advanced ${type} animation to:`, element);
            return animation;

        } catch (error) {
            console.error(`💥 Error applying advanced animation ${type}:`, error);
            this.applyFallbackAnimation(element, type, duration, delay, ease);
        }
    }

    getAdvancedMethodName(type) {
        const methodMap = {
            'typeWriter': 'typeWriterAnimation',
            'staggerGrid': 'staggerGridAnimation',
            'parallaxScroll': 'parallaxAnimation',
            'textReveal': 'textRevealAnimation',
            'magneticButton': 'magneticButtonAnimation',
            'gradientShift': 'gradientShiftAnimation',
            'morphShape': 'morphShapeAnimation'
        };
        return methodMap[type] || type + 'Animation';
    }

    applyFallbackAnimation(element, type, duration, delay, ease) {
        console.log(`🔄 Applying fallback animation for: ${type}`);
        gsap.fromTo(element,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: duration,
                delay: delay,
                ease: ease
            }
        );
    }

    getAnimationProperties(type, element) {
        switch (type) {
            case 'fadeIn':
                return {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                };
            case 'slideUp':
                return {
                    from: { opacity: 0, y: 100 },
                    to: { opacity: 1, y: 0 }
                };
            case 'slideDown':
                return {
                    from: { opacity: 0, y: -100 },
                    to: { opacity: 1, y: 0 }
                };
            case 'slideLeft':
                return {
                    from: { opacity: 0, x: 100 },
                    to: { opacity: 1, x: 0 }
                };
            case 'slideRight':
                return {
                    from: { opacity: 0, x: -100 },
                    to: { opacity: 1, x: 0 }
                };
            case 'scaleIn':
                return {
                    from: { opacity: 0, scale: 0.5 },
                    to: { opacity: 1, scale: 1 }
                };
            case 'scaleOut':
                return {
                    from: { opacity: 0, scale: 1.5 },
                    to: { opacity: 1, scale: 1 }
                };
            case 'bounceIn':
                return {
                    from: { opacity: 0, scale: 0.3, y: 100 },
                    to: { opacity: 1, scale: 1, y: 0, ease: "bounce.out" }
                };
            case 'rotateIn':
                return {
                    from: { opacity: 0, rotation: -180 },
                    to: { opacity: 1, rotation: 0 }
                };
            case 'flipInX':
                return {
                    from: { opacity: 0, rotationX: 90 },
                    to: { opacity: 1, rotationX: 0, transformPerspective: 1000 }
                };
            case 'flipInY':
                return {
                    from: { opacity: 0, rotationY: 90 },
                    to: { opacity: 1, rotationY: 0, transformPerspective: 1000 }
                };
            case 'custom':
                const x = parseInt(element.getAttribute('data-animation-x')) || 0;
                const y = parseInt(element.getAttribute('data-animation-y')) || 50;
                const scale = parseFloat(element.getAttribute('data-animation-scale')) || 0.8;
                const rotation = parseInt(element.getAttribute('data-animation-rotation')) || 0;
                return {
                    from: {
                        opacity: 0,
                        x: x,
                        y: y,
                        scale: scale,
                        rotation: rotation
                    },
                    to: {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 1,
                        rotation: 0
                    }
                };
            default:
                return {
                    from: { opacity: 0, y: 50 },
                    to: { opacity: 1, y: 0 }
                };
        }
    }

    setupHoverEffects() {
        console.log('🖱️ Setting up hover effects...');
        const hoverElements = document.querySelectorAll('[data-hover-animation]');
        console.log(`🔍 Found ${hoverElements.length} hover elements`);

        hoverElements.forEach((element, index) => {
            const hoverType = element.getAttribute('data-hover-animation');
            console.log(`🎯 Hover element ${index + 1}:`, hoverType);

            switch (hoverType) {
                case 'scale':
                    const scaleAmount = parseFloat(element.getAttribute('data-hover-scale')) || 1.05;
                    this.addHoverScale(element, scaleAmount);
                    break;
                case 'lift':
                    const liftAmount = parseFloat(element.getAttribute('data-hover-lift')) || 5;
                    this.addHoverLift(element, liftAmount);
                    break;
                case 'tilt':
                    this.addHoverTilt(element);
                    break;
                case 'glow':
                    this.addHoverGlow(element);
                    break;
                case 'shrink':
                    const shrinkAmount = parseFloat(element.getAttribute('data-hover-scale')) || 0.95;
                    this.addHoverShrink(element, shrinkAmount);
                    break;
                default:
                    console.log('❌ Unknown hover type:', hoverType);
            }
        });
    }
addHoverScale(element, scale) {
    console.log(`🔧 Adding scale hover to:`, element, 'Scale:', scale);
    
    // اضافه کردن کلاس برای مدیریت بهتر
    element.classList.add('salmama-hover-scale', 'salmama-transform-element');
    
    const hoverTimeline = gsap.timeline({ 
        paused: true,
        onStart: () => {
            // جلوگیری از تاثیر روی layout
            element.style.transform = 'translateZ(0)';
        }
    });
    
    // استفاده از transform-origin و محدود کردن scale
    hoverTimeline.to(element, { 
        scale: scale, 
        duration: 0.3, 
        ease: "power2.out",
        transformOrigin: "center center" // نقطه تبدیل در مرکز
    });
    
    element.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        hoverTimeline.play();
    });
    
    element.addEventListener('mouseleave', (e) => {
        e.stopPropagation();
        hoverTimeline.reverse();
    });
}

addHoverLift(element, lift) {
    console.log(`🔧 Adding lift hover to:`, element, 'Lift:', lift);
    
    // اضافه کردن کلاس برای مدیریت بهتر
    element.classList.add('salmama-hover-lift', 'salmama-transform-element');
    
    const hoverTimeline = gsap.timeline({ 
        paused: true,
        onStart: () => {
            // تنظیم transform origin
            element.style.transform = 'translateZ(0)';
        }
    });
    
    // فقط حرکت در جهت Y با محدودیت
    hoverTimeline.to(element, { 
        y: -lift, 
        duration: 0.3, 
        ease: "power2.out",
        onUpdate: () => {
            // اطمینان از اینکه فقط در جهت Y حرکت می‌کند
            element.style.transform = `translateZ(0) translateY(${gsap.getProperty(element, "y")}px)`;
        }
    });
    
    element.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        hoverTimeline.play();
    });
    
    element.addEventListener('mouseleave', (e) => {
        e.stopPropagation();
        hoverTimeline.reverse();
    });
}

// اضافه کردن متد جدید برای magnetic button بهبود یافته
addMagneticButtonImproved(element, magneticStrength = 0.2) {
    console.log(`🔧 Adding improved magnetic button to:`, element);
    
    element.classList.add('salmama-magnetic-button', 'salmama-transform-element');
    
    // محدودیت حرکت
    const maxMovement = 15;
    
    const magneticMove = (e) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let distanceX = (e.clientX - centerX) * magneticStrength;
        let distanceY = (e.clientY - centerY) * magneticStrength;
        
        // محدود کردن حرکت
        distanceX = Math.max(Math.min(distanceX, maxMovement), -maxMovement);
        distanceY = Math.max(Math.min(distanceY, maxMovement), -maxMovement);
        
        gsap.to(element, {
            x: distanceX,
            y: distanceY,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => {
                // استفاده از translateZ برای performance بهتر
                element.style.transform = `translateZ(0) translate(${gsap.getProperty(element, "x")}px, ${gsap.getProperty(element, "y")}px)`;
            }
        });
    };

    const magneticReset = () => {
        gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
            onUpdate: () => {
                element.style.transform = `translateZ(0) translate(${gsap.getProperty(element, "x")}px, ${gsap.getProperty(element, "y")}px)`;
            }
        });
    };

    element.addEventListener('mousemove', magneticMove);
    element.addEventListener('mouseleave', magneticReset);

    return {
        destroy: () => {
            element.removeEventListener('mousemove', magneticMove);
            element.removeEventListener('mouseleave', magneticReset);
            element.classList.remove('salmama-magnetic-button', 'salmama-transform-element');
            gsap.set(element, { x: 0, y: 0 });
            element.style.transform = '';
        }
    };
}

    addHoverTilt(element) {
        console.log(`🔧 Adding tilt hover to:`, element);
        const hoverTimeline = gsap.timeline({ paused: true });
        hoverTimeline.to(element, {
            rotationY: 10,
            rotationX: -5,
            transformPerspective: 1000,
            duration: 0.4,
            ease: "power2.out"
        });

        element.addEventListener('mouseenter', () => {
            console.log('(mouse enter - tilt');
            hoverTimeline.play();
        });
        element.addEventListener('mouseleave', () => {
            console.log('(mouse leave - tilt');
            hoverTimeline.reverse();
        });

        element.classList.add('salmama-hover-tilt');
    }

    addHoverGlow(element) {
        console.log(`🔧 Adding glow hover to:`, element);
        const hoverTimeline = gsap.timeline({ paused: true });
        hoverTimeline.to(element, {
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
            duration: 0.3,
            ease: "power2.out"
        });

        element.addEventListener('mouseenter', () => {
            console.log('(mouse enter - glow');
            hoverTimeline.play();
        });
        element.addEventListener('mouseleave', () => {
            console.log('(mouse leave - glow');
            hoverTimeline.reverse();
        });

        element.classList.add('salmama-hover-glow');
    }

    addHoverShrink(element, scale) {
        console.log(`🔧 Adding shrink hover to:`, element, 'Scale:', scale);
        const hoverTimeline = gsap.timeline({ paused: true });
        hoverTimeline.to(element, {
            scale: scale,
            duration: 0.3,
            ease: "power2.out"
        });

        element.addEventListener('mouseenter', () => {
            console.log('(mouse enter - shrink');
            hoverTimeline.play();
        });
        element.addEventListener('mouseleave', () => {
            console.log('(mouse leave - shrink');
            hoverTimeline.reverse();
        });

        element.classList.add('salmama-hover-shrink');
    }
}

// راه‌اندازی وقتی DOM کاملاً لود شد
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('🚀 DOM Ready - Starting Salmama GSAP Engine');
        new GSAPEngine();
    });
} else {
    console.log('🚀 DOM Already Ready - Starting Salmama GSAP Engine');
    new GSAPEngine();
}