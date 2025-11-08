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

        const animatedBlocks = document.querySelectorAll('[data-salnama-animated="true"]');
        console.log(`📦 Found ${animatedBlocks.length} animated blocks`);

        animatedBlocks.forEach((block, index) => {
            this.animateBlock(block, index);
        });

        this.setupHoverEffects();
        console.log('✅ All animations applied');
    }

    animateBlock(block, index) {
        const type = block.getAttribute('data-animation-type');
        const duration = parseFloat(block.getAttribute('data-animation-duration')) || 0.6;
        const delay = parseFloat(block.getAttribute('data-animation-delay')) || 0;
        const ease = block.getAttribute('data-animation-ease') || 'power2.out';
        const trigger = block.getAttribute('data-animation-trigger') || 'scroll';

        const stagger = parseFloat(block.getAttribute('data-animation-stagger')) || 0.1;
        const repeat = parseInt(block.getAttribute('data-animation-repeat')) || 0;
        const yoyo = block.getAttribute('data-animation-yoyo') === 'true';

        console.log(`🎯 Block ${index + 1}:`, {
            type, duration, delay, ease, trigger, stagger, repeat, yoyo
        });

        gsap.killTweensOf(block);
        this.setInitialState(block, type);
        this.applyAnimationByType(block, type, duration, delay, ease, trigger, stagger, repeat, yoyo);
    }

    setInitialState(element, type) {
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
    }

    applyAnimationByType(element, type, duration, delay, ease, trigger, stagger, repeat, yoyo) {
        console.log(`🎬 Applying animation: ${type}`);

        if (this.isAdvancedAnimation(type)) {
            console.log(`🔧 This is an advanced animation: ${type}`);
            this.applyAdvancedAnimation(element, type, duration, delay, ease, trigger, stagger, repeat, yoyo);
            return;
        }

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
        return advancedTypes.includes(type);
    }

    applyAdvancedAnimation(element, type, duration, delay, ease, trigger, stagger, repeat, yoyo) {
        console.log(`🚀 Starting advanced animation: ${type}`);

        if (!this.advancedAnimations) {
            console.error('❌ Advanced animations instance not available');
            this.applyFallbackAnimation(element, type, duration, delay, ease);
            return;
        }

        const methodName = this.getAdvancedMethodName(type);
        console.log(`🔧 Looking for method: ${methodName}`);

        if (typeof this.advancedAnimations[methodName] !== 'function') {
            console.error(`❌ Method ${methodName} not found in AdvancedAnimations`);
            console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.advancedAnimations)));
            this.applyFallbackAnimation(element, type, duration, delay, ease);
            return;
        }

        try {
            let animation;

            switch(type) {
                case 'typeWriter':
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
        switch(type) {
            case 'fadeIn':
                return { from: { opacity: 0 }, to: { opacity: 1 } };
            case 'slideUp':
                return { from: { opacity: 0, y: 100 }, to: { opacity: 1, y: 0 } };
            case 'slideDown':
                return { from: { opacity: 0, y: -100 }, to: { opacity: 1, y: 0 } };
            case 'slideLeft':
                return { from: { opacity: 0, x: 100 }, to: { opacity: 1, x: 0 } };
            case 'slideRight':
                return { from: { opacity: 0, x: -100 }, to: { opacity: 1, x: 0 } };
            case 'scaleIn':
                return { from: { opacity: 0, scale: 0.5 }, to: { opacity: 1, scale: 1 } };
            case 'scaleOut':
                return { from: { opacity: 0, scale: 1.5 }, to: { opacity: 1, scale: 1 } };
            case 'bounceIn':
                return { from: { opacity: 0, scale: 0.3, y: 100 }, to: { opacity: 1, scale: 1, y: 0, ease: "bounce.out" } };
            case 'rotateIn':
                return { from: { opacity: 0, rotation: -180 }, to: { opacity: 1, rotation: 0 } };
            case 'flipInX':
                return { from: { opacity: 0, rotationX: 90 }, to: { opacity: 1, rotationX: 0, transformPerspective: 1000 } };
            case 'flipInY':
                return { from: { opacity: 0, rotationY: 90 }, to: { opacity: 1, rotationY: 0, transformPerspective: 1000 } };
            case 'custom':
                const x = parseInt(element.getAttribute('data-animation-x')) || 0;
                const y = parseInt(element.getAttribute('data-animation-y')) || 50;
                const scale = parseFloat(element.getAttribute('data-animation-scale')) || 0.8;
                const rotation = parseInt(element.getAttribute('data-animation-rotation')) || 0;
                return {
                    from: { opacity: 0, x, y, scale, rotation },
                    to: { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0 }
                };
            default:
                return { from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 } };
        }
    }

    setupHoverEffects() {
        console.log('🖱️ Setting up hover effects...');
        const hoverElements = document.querySelectorAll('[data-hover-animation]');
        console.log(`🔍 Found ${hoverElements.length} hover elements`);

        hoverElements.forEach((element, index) => {
            const hoverType = element.getAttribute('data-hover-animation');
            console.log(`🎯 Hover element ${index + 1}:`, hoverType);

            switch(hoverType) {
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
        const hoverTimeline = gsap.timeline({ paused: true });
        hoverTimeline.to(element, {
            scale: scale,
            duration: 0.3,
            ease: "power2.out"
        });

        element.addEventListener('mouseenter', () => hoverTimeline.play());
        element.addEventListener('mouseleave', () => hoverTimeline.reverse());
        element.classList.add('salmama-hover-scale');
    }

    addHoverLift(element, lift) {
        const hoverTimeline = gsap.timeline({ paused: true });
        hoverTimeline.to(element, {
            y: -lift,
            duration: 0.3,
            ease: "power2.out"
        });

        element.addEventListener('mouseenter', () => hoverTimeline.play());
        element.addEventListener('mouseleave', () => hoverTimeline.reverse());
        element.classList.add('salmama-hover-lift');
    }

    addHoverTilt(element) {
        const hoverTimeline = gsap.timeline({ paused: true });
        hoverTimeline.to(element, {
            rotationY: 10,
            rotationX: -5,
            transformPerspective: 1000,
            duration: 0.4,
            ease: "power2.out"
        });

        element.addEventListener('mouseenter', () => hoverTimeline.play());
        element.addEventListener('mouseleave', () => hoverTimeline.reverse());
        element.classList.add('salmama-hover-tilt');
    }

    addHoverGlow(element) {
        const hoverTimeline = gsap.timeline({ paused: true });
        hoverTimeline.to(element, {
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
            duration: 0.3,
            ease: "power2.out"
        });

        element.addEventListener('mouseenter', () => hoverTimeline.play());
        element.addEventListener('mouseleave', () => hoverTimeline.reverse());
        element.classList.add('salmama-hover-glow');
    }

    addHoverShrink(element, scale) {
        const hoverTimeline = gsap.timeline({ paused: true });
        hoverTimeline.to(element, {
            scale: scale,
            duration: 0.3,
            ease: "power2.out"
        });

        element.addEventListener('mouseenter', () => hoverTimeline.play());
        element.addEventListener('mouseleave', () => hoverTimeline.reverse());
        element.classList.add('salmama-hover-shrink');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 DOM Ready - Starting Salmama GSAP Engine');
        new GSAPEngine();
    });
} else {
    console.log('🚀 DOM Already Ready - Starting Salmama GSAP Engine');
    new GSAPEngine();
}