// assets/js/gsap/GSAPEngine.js
class GSAPEngine {
    constructor() {
        console.log('🎬 Salmama GSAP Engine Initializing...');
        this.init();
    }
    
    init() {
        // بررسی وجود GSAP
        if (typeof gsap === 'undefined') {
            console.error('❌ GSAP not loaded!');
            return;
        }
        
        if (typeof ScrollTrigger === 'undefined') {
            console.error('❌ ScrollTrigger not loaded!');
            return;
        }
        
        gsap.registerPlugin(ScrollTrigger);
        console.log('✅ GSAP registered');
        
        this.initAnimations();
    }
    
    initAnimations() {
        console.log('🔍 Looking for animated blocks...');
        
        const animatedBlocks = document.querySelectorAll('[data-salmama-animated="true"]');
        console.log(`📦 Found ${animatedBlocks.length} animated blocks`);
        
        animatedBlocks.forEach((block, index) => {
            this.animateBlock(block, index);
        });
        
        // راه‌اندازی هاور افکت‌ها
        this.setupHoverEffects();
        
        console.log('✅ All animations applied');
    }
    
    animateBlock(block, index) {
        const type = block.getAttribute('data-animation-type');
        const duration = parseFloat(block.getAttribute('data-animation-duration')) || 0.6;
        const delay = parseFloat(block.getAttribute('data-animation-delay')) || 0;
        const ease = block.getAttribute('data-animation-ease') || 'power2.out';
        const trigger = block.getAttribute('data-animation-trigger') || 'scroll';
        
        console.log(`🎯 Block ${index + 1}:`, { type, duration, delay, ease, trigger });
        
        // پاک کردن هر گونه انیمیشن قبلی
        gsap.killTweensOf(block);
        
        // تنظیم حالت اولیه بر اساس نوع انیمیشن
        this.setInitialState(block, type);
        
        // اعمال انیمیشن
        this.applyAnimationByType(block, type, duration, delay, ease, trigger);
    }
    
    setInitialState(element, type) {
        // مخفی کردن المان با حالت اولیه مناسب
        switch(type) {
            case 'fadeIn':
                gsap.set(element, { opacity: 0 });
                break;
            case 'slideUp':
                gsap.set(element, { opacity: 0, y: 100 });
                break;
            case 'slideDown':
                gsap.set(element, { opacity: 0, y: -100 });
                break;
            case 'slideLeft':
                gsap.set(element, { opacity: 0, x: 100 });
                break;
            case 'slideRight':
                gsap.set(element, { opacity: 0, x: -100 });
                break;
            case 'scaleIn':
                gsap.set(element, { opacity: 0, scale: 0.5 });
                break;
            case 'scaleOut':
                gsap.set(element, { opacity: 0, scale: 1.5 });
                break;
            case 'bounceIn':
                gsap.set(element, { opacity: 0, scale: 0.3, y: 100 });
                break;
            case 'rotateIn':
                gsap.set(element, { opacity: 0, rotation: -180 });
                break;
            case 'flipInX':
                gsap.set(element, { opacity: 0, rotationX: 90 });
                break;
            case 'flipInY':
                gsap.set(element, { opacity: 0, rotationY: 90 });
                break;
            case 'custom':
                const x = parseInt(element.getAttribute('data-animation-x')) || 0;
                const y = parseInt(element.getAttribute('data-animation-y')) || 50;
                const scale = parseFloat(element.getAttribute('data-animation-scale')) || 0.8;
                const rotation = parseInt(element.getAttribute('data-animation-rotation')) || 0;
                const opacity = element.getAttribute('data-animation-opacity') !== 'false';
                
                gsap.set(element, { 
                    opacity: opacity ? 0 : 1,
                    x: x,
                    y: y,
                    scale: scale,
                    rotation: rotation
                });
                break;
            default:
                gsap.set(element, { opacity: 0, y: 50 });
        }
    }
    
    applyAnimationByType(element, type, duration, delay, ease, trigger) {
        const animationProps = this.getAnimationProperties(type, element);
        
        const baseAnimation = {
            ...animationProps.to,
            duration: duration,
            delay: delay,
            ease: ease
        };
        
        // اضافه کردن ScrollTrigger اگر needed
        if (trigger === 'scroll') {
            baseAnimation.scrollTrigger = {
                trigger: element,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse",
                markers: false // برای دیباگ true کنید
            };
        }
        
        // اعمال انیمیشن
        gsap.to(element, baseAnimation);
        
        console.log(`✅ Applied ${type} animation to:`, element);
    }
    
    getAnimationProperties(type, element) {
        switch(type) {
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
        console.log(`🔧 Adding scale hover to:`, element, 'Scale:', scale);
        
        const hoverTimeline = gsap.timeline({ paused: true });
        
        hoverTimeline.to(element, {
            scale: scale,
            duration: 0.3,
            ease: "power2.out"
        });
        
        element.addEventListener('mouseenter', () => {
            console.log('🐭 Mouse enter - scale');
            hoverTimeline.play();
        });
        
        element.addEventListener('mouseleave', () => {
            console.log('🐭 Mouse leave - scale');
            hoverTimeline.reverse();
        });
        
        // اضافه کردن کلاس برای استایل‌دهی
        element.classList.add('salmama-hover-scale');
    }
    
    addHoverLift(element, lift) {
        console.log(`🔧 Adding lift hover to:`, element, 'Lift:', lift);
        
        const hoverTimeline = gsap.timeline({ paused: true });
        
        hoverTimeline.to(element, {
            y: -lift,
            duration: 0.3,
            ease: "power2.out"
        });
        
        element.addEventListener('mouseenter', () => {
            console.log('🐭 Mouse enter - lift');
            hoverTimeline.play();
        });
        
        element.addEventListener('mouseleave', () => {
            console.log('🐭 Mouse leave - lift');
            hoverTimeline.reverse();
        });
        
        element.classList.add('salmama-hover-lift');
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
            console.log('🐭 Mouse enter - tilt');
            hoverTimeline.play();
        });
        
        element.addEventListener('mouseleave', () => {
            console.log('🐭 Mouse leave - tilt');
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
            console.log('🐭 Mouse enter - glow');
            hoverTimeline.play();
        });
        
        element.addEventListener('mouseleave', () => {
            console.log('🐭 Mouse leave - glow');
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
            console.log('🐭 Mouse enter - shrink');
            hoverTimeline.play();
        });
        
        element.addEventListener('mouseleave', () => {
            console.log('🐭 Mouse leave - shrink');
            hoverTimeline.reverse();
        });
        
        element.classList.add('salmama-hover-shrink');
    }
}

// راه‌اندازی وقتی DOM کاملاً لود شد
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 DOM Ready - Starting Salmama GSAP Engine');
        new GSAPEngine();
    });
} else {
    console.log('🚀 DOM Already Ready - Starting Salmama GSAP Engine');
    new GSAPEngine();
}