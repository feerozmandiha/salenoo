// assets/js/gsap/AdvancedAnimations.js
class AdvancedAnimations {
    constructor(engine) {
        this.engine = engine;
        this.typeWriterElements = new Map();
        this.parallaxElements = new Map();
        this.magneticButtons = new Map();
        this.init();
    }
    
    init() {
        console.log('🚀 Advanced Animations System Initialized');
    }
    
    // ===== TYPEWRITER ANIMATION =====
typeWriterAnimation(element, duration = 2, delay = 0) {
    if (!element) return null;
    
    console.log('🎬 Starting CLEAN typewriter animation');
    
    // پیدا کردن متن و ذخیره آن
    const originalText = element.textContent || element.innerText || '';
    const textToType = originalText.trim() || element.getAttribute('data-text') || '';
    
    if (!textToType) {
        console.warn('⚠️ No text for typewriter');
        return gsap.to(element, { 
            opacity: 1, 
            duration: 0.6, 
            delay: delay 
        });
    }
    
    console.log('📝 Text to type:', textToType);
    
    // === اصلاح اصلی: کاملاً پاک کردن المان ===
    element.innerHTML = ''; // پاک کردن کامل
    element.textContent = ''; // پاک کردن مجدد برای اطمینان
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    
    // کمی تاخیر برای اطمینان از پاک شدن
    return new Promise((resolve) => {
        setTimeout(() => {
            this.executeTypeWriter(element, textToType, duration, delay, resolve);
        }, 50);
    });
}

// متد جداگانه برای اجرای تایپ‌رایت
executeTypeWriter(element, text, duration, delay, resolve) {
    const chars = text.split('');
const timePerChar = Math.max(duration / chars.length, 0.06); // حداقل 0.06 ثانیه
    
    console.log(`⏱️ Typing ${chars.length} chars, ${timePerChar.toFixed(3)}s per char`);
    
    const timeline = gsap.timeline({
        delay: delay,
        onStart: () => {
            console.log('🚀 Typewriter STARTED - element content:', element.textContent);
        },
        onComplete: () => {
            console.log('✅ Typewriter COMPLETED');
            element.classList.add('salnama-animation-complete');
            if (resolve) resolve(timeline);
        }
    });
    
    let currentText = '';
    
    for (let i = 0; i < chars.length; i++) {
        timeline.add(() => {
            currentText += chars[i];
            element.textContent = currentText; // بدون کرسر
            console.log(`📝 Char ${i + 1}/${chars.length}: "${currentText}"`);
        }, i * timePerChar);
    }
    
    return timeline;
}
    
    // ===== STAGGER GRID ANIMATION =====
    staggerGridAnimation(container, duration = 0.6, stagger = 0.1, direction = 'start') {
        if (!container) {
            console.error('❌ Invalid container for stagger grid animation');
            return null;
        }
        
        const elements = container.children;
        if (elements.length === 0) {
            console.warn('⚠️ No child elements found for stagger grid');
            return null;
        }
        
        const timeline = gsap.timeline();
        
        gsap.set(elements, { 
            opacity: 0, 
            y: 30 
        });
        
        timeline.to(elements, {
            opacity: 1,
            y: 0,
            duration: duration,
            stagger: {
                each: stagger,
                from: direction
            },
            ease: "power2.out"
        });
        
        return timeline;
    }
    
    // ===== PARALLAX SCROLL ANIMATION =====
    parallaxAnimation(element, speed = 0.5, container = null) {
        if (!element) {
            console.error('❌ Invalid element for parallax animation');
            return null;
        }
        
        const trigger = container || element.parentElement;
        if (!trigger) {
            console.error('❌ No trigger element found for parallax');
            return null;
        }
        
        const parallaxTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: trigger,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
        
        parallaxTimeline.to(element, {
            y: speed * 100,
            ease: "none"
        });
        
        this.parallaxElements.set(element, {
            timeline: parallaxTimeline,
            speed: speed
        });
        
        return parallaxTimeline;
    }
    
    // ===== TEXT REVEAL ANIMATION =====
    textRevealAnimation(element, direction = 'fromBottom', duration = 0.8) {
        if (!element) return null;
        
        const text = element.textContent;
        element.textContent = '';
        element.style.visibility = 'visible';
        
        const chars = text.split('');
        const spans = chars.map(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            
            if (direction === 'fromBottom') {
                span.style.transform = 'translateY(20px)';
            } else if (direction === 'fromTop') {
                span.style.transform = 'translateY(-20px)';
            } else if (direction === 'fromLeft') {
                span.style.transform = 'translateX(-20px)';
            } else if (direction === 'fromRight') {
                span.style.transform = 'translateX(20px)';
            }
            
            return span;
        });
        
        element.append(...spans);
        
        const timeline = gsap.timeline();
        timeline.to(spans, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: duration / chars.length,
            stagger: {
                each: 0.03,
                from: 'start'
            },
            ease: "power2.out"
        });
        
        return timeline;
    }
    
    // ===== MAGNETIC BUTTON ANIMATION =====
    magneticButtonAnimation(element, strength = 0.3) {
        if (!element) return null;
        
        element.style.cursor = 'pointer';
        element.classList.add('magnetic-button');
        
        const magneticMove = (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distanceX = (e.clientX - centerX) * strength;
            const distanceY = (e.clientY - centerY) * strength;
            
            gsap.to(element, {
                x: distanceX,
                y: distanceY,
                duration: 0.5,
                ease: "power2.out"
            });
        };
        
        const magneticReset = () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
            });
        };
        
        element.addEventListener('mousemove', magneticMove);
        element.addEventListener('mouseleave', magneticReset);
        
        this.magneticButtons.set(element, {
            moveHandler: magneticMove,
            resetHandler: magneticReset
        });
        
        return {
            destroy: () => {
                element.removeEventListener('mousemove', magneticMove);
                element.removeEventListener('mouseleave', magneticReset);
                gsap.set(element, { x: 0, y: 0 });
            }
        };
    }
    
    // ===== GRADIENT SHIFT ANIMATION =====
    gradientShiftAnimation(element, duration = 2) {
        if (!element) return null;
        
        const timeline = gsap.timeline({
            repeat: -1,
            yoyo: true
        });
        
        timeline.to(element, {
            backgroundPosition: '200% 0%',
            duration: duration,
            ease: "power1.inOut"
        });
        
        return timeline;
    }
    
    // ===== MORPH SHAPE ANIMATION =====
    morphShapeAnimation(element, paths = [], duration = 1) {
        if (!element || paths.length === 0) return null;
        
        const timeline = gsap.timeline({
            repeat: -1,
            yoyo: true
        });
        
        paths.forEach((path, index) => {
            timeline.to(element, {
                morphSVG: path,
                duration: duration,
                ease: "power2.inOut"
            });
        });
        
        return timeline;
    }
    
    // ===== DESTROY METHODS =====
    destroyTypeWriter(element) {
        const data = this.typeWriterElements.get(element);
        if (data && data.timeline) {
            data.timeline.kill();
            element.textContent = data.originalText;
        }
        this.typeWriterElements.delete(element);
    }

    // در AdvancedAnimations.js - بعد از متدهای موجود اضافه کنید

    // ===== FLIP ANIMATIONS =====
    flipInXAnimation(element, duration = 0.8, delay = 0) {
        if (!element) return null;

            console.log('🎬 Applying flipInY animation to:', element);

        
        // تنظیمات اولیه
        gsap.set(element, {
            rotationX: -90,
            opacity: 0,
            transformPerspective: 1000,
            transformOrigin: "center center"
        });
        
        const timeline = gsap.timeline({
            delay: delay,
            onStart: () => {
                element.style.visibility = 'visible';
            }
        });
        
        timeline.to(element, {
            rotationX: 0,
            opacity: 1,
            duration: duration,
            ease: "back.out(1.2)",
            onComplete: () => {
                // پاک کردن transform های اضافی
                gsap.set(element, { clearProps: "transform,opacity" });
            }
        });
        
        return timeline;
    }

    flipInYAnimation(element, duration = 0.8, delay = 0) {
        if (!element) return null;
        
        console.log('🎬 Applying flipInY animation to:', element);
        
        // ذخیره وضعیت اولیه
        const originalStyle = {
            transform: element.style.transform,
            opacity: element.style.opacity,
            visibility: element.style.visibility
        };
        
        // تنظیمات اولیه برای انیمیشن
        gsap.set(element, {
            rotationY: -90,
            opacity: 0,
            transformPerspective: 1000,
            transformOrigin: "50% 50%",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden"
        });
        
        const timeline = gsap.timeline({
            delay: delay,
            onStart: () => {
                console.log('🚀 flipInY animation started');
                element.style.visibility = 'visible';
            },
            onComplete: () => {
                console.log('✅ flipInY animation completed');
                // بازگشت به حالت نرمال بدون تداخل
                gsap.set(element, { 
                    clearProps: "rotationY,opacity,transformPerspective,transformOrigin" 
                });
                
                // بازگردانی استایل اصلی
                element.style.transform = originalStyle.transform || '';
                element.style.opacity = originalStyle.opacity || '';
                element.style.visibility = originalStyle.visibility || '';
                
                // اضافه کردن کلاس تکمیل شده
                element.classList.add('salnama-animation-complete');
            }
        });
        
        timeline.to(element, {
            rotationY: 0,
            opacity: 1,
            duration: duration,
            ease: "back.out(1.5)",
            onUpdate: () => {
                // اطمینان از visibility در طول انیمیشن
                element.style.visibility = 'visible';
            }
        });
        
        return timeline;
    }

    rotateInAnimation(element, duration = 0.8, delay = 0) {
        if (!element) return null;
        
        gsap.set(element, {
            rotation: -180,
            opacity: 0,
            transformOrigin: "center center"
        });
        
        const timeline = gsap.timeline({
            delay: delay,
            onStart: () => {
                element.style.visibility = 'visible';
            }
        });
        
        timeline.to(element, {
            rotation: 0,
            opacity: 1,
            duration: duration,
            ease: "back.out(1.2)",
            onComplete: () => {
                gsap.set(element, { clearProps: "transform,opacity" });
            }
        });
        
        return timeline;
    }

    // اضافه کردن این متد به AdvancedAnimations.js
    extractTextFromBlock(element) {
        // برای بلوک‌های وردپرس که متن در ساختار پیچیده قرار دارد
        
        // بررسی innerText
        if (element.innerText && element.innerText.trim() !== '') {
            return element.innerText.trim();
        }
        
        // بررسی textContent
        if (element.textContent && element.textContent.trim() !== '') {
            return element.textContent.trim();
        }
        
        // جستجو در child elements
        const textElements = element.querySelectorAll('span, div, p');
        for (let el of textElements) {
            if (el.textContent && el.textContent.trim() !== '') {
                return el.textContent.trim();
            }
        }
        
        return null;
    }
    
    destroyParallax(element) {
        const data = this.parallaxElements.get(element);
        if (data && data.timeline) {
            data.timeline.kill();
        }
        this.parallaxElements.delete(element);
    }
    
    destroyMagneticButton(element) {
        const data = this.magneticButtons.get(element);
        if (data) {
            data.destroy?.();
        }
        this.magneticButtons.delete(element);
    }
    
    // ===== CLEANUP =====
    destroyAll() {
        this.typeWriterElements.forEach((data, element) => {
            this.destroyTypeWriter(element);
        });
        
        this.parallaxElements.forEach((data, element) => {
            this.destroyParallax(element);
        });
        
        this.magneticButtons.forEach((data, element) => {
            this.destroyMagneticButton(element);
        });
        
        console.log('🧹 All advanced animations destroyed');
    }
}

// ثبت global
if (typeof window !== 'undefined' && typeof window.AdvancedAnimations === 'undefined') {
    window.AdvancedAnimations = AdvancedAnimations;
}