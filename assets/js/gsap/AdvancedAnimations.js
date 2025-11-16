/**
 * AdvancedAnimations - نسخه پایدار و بهینه شده
 * سیستم انیمیشن‌های پیشرفته برای سالنمای نو
 */
// بررسی اگر کلاس از قبل تعریف شده است
if (typeof AdvancedAnimations !== 'undefined') {
    console.log('⚠️ AdvancedAnimations already defined, skipping re-declaration');
} else {
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
            if (!element) {
                console.error('❌ Invalid element for typewriter animation');
                return null;
            }
            
            console.log('🎬 Starting typewriter animation');
            
            // پیدا کردن متن
            const originalText = element.textContent || element.innerText || '';
            const textToType = originalText.trim() || element.getAttribute('data-text') || '';
            
            if (!textToType) {
                console.warn('⚠️ No text content for typewriter, using fallback');
                return this.createTypeWriterFallback(element, duration, delay);
            }
            
            console.log('📝 Typewriter text:', textToType.substring(0, 50) + '...');
            
            // پاکسازی کامل المان
            element.textContent = '';
            element.innerHTML = '';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            
            const chars = textToType.split('');
            const timePerChar = Math.max(duration / chars.length, 0.04); // حداقل سرعت
            
            console.log(`⏱️ ${chars.length} chars, ${timePerChar.toFixed(3)}s per char`);
            
            const timeline = gsap.timeline({
                delay: delay,
                onStart: () => {
                    console.log('🚀 Typewriter animation started');
                },
                onComplete: () => {
                    console.log('✅ Typewriter animation completed');
                    element.classList.add('salnama-animation-complete');
                }
            });
            
            let currentText = '';
            
            // اضافه کردن کاراکترها
            for (let i = 0; i < chars.length; i++) {
                timeline.add(() => {
                    currentText += chars[i];
                    element.textContent = currentText;
                }, i * timePerChar);
            }
            
            this.typeWriterElements.set(element, {
                timeline: timeline,
                originalText: textToType
            });
            
            return timeline;
        }
        
        createTypeWriterFallback(element, duration, delay) {
            console.log('🔄 Using fallback fade animation for typewriter');
            
            return gsap.fromTo(element, 
                { 
                    opacity: 0, 
                    y: 20 
                },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: duration, 
                    delay: delay,
                    ease: "power2.out",
                    onComplete: () => {
                        element.classList.add('salnama-animation-complete');
                    }
                }
            );
        }
        
        // ===== STAGGER GRID ANIMATIONS =====
        staggerGridAnimation(container, duration = 0.8, stagger = 0.1, direction = 'start') {
            if (!container) {
                console.error('❌ Invalid container for stagger grid');
                return null;
            }
            
            const elements = container.children;
            if (elements.length === 0) {
                console.warn('⚠️ No child elements found for stagger grid');
                return null;
            }
            
            console.log(`🎬 Stagger grid: ${elements.length} elements, stagger: ${stagger}s`);
            
            // حالت اولیه
            gsap.set(elements, { 
                opacity: 0, 
                y: 30 
            });
            
            const timeline = gsap.timeline();
            
            timeline.to(elements, {
                opacity: 1,
                y: 0,
                duration: duration,
                stagger: {
                    each: stagger,
                    from: direction
                },
                ease: "power2.out",
                onComplete: () => {
                    console.log('✅ Stagger grid completed');
                }
            });
            
            return timeline;
        }
        
        staggerListAnimation(container, duration = 0.6, stagger = 0.08) {
            if (!container) return null;
            
            const elements = container.children;
            if (elements.length === 0) return null;
            
            console.log(`🎬 Stagger list: ${elements.length} elements`);
            
            gsap.set(elements, { 
                opacity: 0, 
                x: -20 
            });
            
            const timeline = gsap.timeline();
            
            timeline.to(elements, {
                opacity: 1,
                x: 0,
                duration: duration,
                stagger: stagger,
                ease: "power2.out"
            });
            
            return timeline;
        }
        
        // ===== FLIP ANIMATIONS =====
        flipInXAnimation(element, duration = 0.8, delay = 0) {
            if (!element) return null;
            
            console.log('🎬 Applying flipInX animation');
            
            // ذخیره وضعیت اولیه
            const originalTransform = element.style.transform;
            
            // تنظیمات اولیه
            gsap.set(element, {
                rotationX: -90,
                opacity: 0,
                transformPerspective: 1000,
                transformOrigin: "50% 50%"
            });
            
            const timeline = gsap.timeline({
                delay: delay,
                onStart: () => {
                    element.style.visibility = 'visible';
                },
                onComplete: () => {
                    // بازگشت به حالت نرمال
                    gsap.set(element, { 
                        clearProps: "rotationX,opacity,transformPerspective,transformOrigin" 
                    });
                    element.classList.add('salnama-animation-complete');
                }
            });
            
            timeline.to(element, {
                rotationX: 0,
                opacity: 1,
                duration: duration,
                ease: "back.out(1.2)"
            });
            
            return timeline;
        }
        
        flipInYAnimation(element, duration = 0.8, delay = 0) {
            if (!element) return null;
            
            console.log('🎬 Applying flipInY animation');
            
            // ذخیره وضعیت اولیه
            const originalTransform = element.style.transform;
            
            // تنظیمات اولیه
            gsap.set(element, {
                rotationY: -90,
                opacity: 0,
                transformPerspective: 1000,
                transformOrigin: "50% 50%"
            });
            
            const timeline = gsap.timeline({
                delay: delay,
                onStart: () => {
                    element.style.visibility = 'visible';
                },
                onComplete: () => {
                    // بازگشت به حالت نرمال
                    gsap.set(element, { 
                        clearProps: "rotationY,opacity,transformPerspective,transformOrigin" 
                    });
                    element.classList.add('salnama-animation-complete');
                }
            });
            
            timeline.to(element, {
                rotationY: 0,
                opacity: 1,
                duration: duration,
                ease: "back.out(1.2)"
            });
            
            return timeline;
        }
        
        // ===== ROTATE ANIMATIONS =====
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
                },
                onComplete: () => {
                    gsap.set(element, { clearProps: "rotation,opacity" });
                    element.classList.add('salnama-animation-complete');
                }
            });
            
            timeline.to(element, {
                rotation: 0,
                opacity: 1,
                duration: duration,
                ease: "back.out(1.2)"
            });
            
            return timeline;
        }
        
        // ===== PARALLAX SCROLL =====
        parallaxAnimation(element, speed = 0.3, container = null) {
            if (!element) return null;
            
            console.log('🎬 Parallax scroll animation');
            
            const trigger = container || element.parentElement;
            if (!trigger) return null;
            
            const parallaxTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: trigger,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                    markers: false
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
        
        // ===== TEXT REVEAL =====
        textRevealAnimation(element, direction = 'fromBottom', duration = 0.8) {
            if (!element) return null;
            
            const text = element.textContent || element.innerText || '';
            if (!text) return null;
            
            // پاک کردن و ایجاد span برای هر کاراکتر
            element.textContent = '';
            const chars = text.split('');
            
            chars.forEach(char => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                
                // تنظیم جهت اولیه
                switch(direction) {
                    case 'fromBottom':
                        span.style.transform = 'translateY(20px)';
                        break;
                    case 'fromTop':
                        span.style.transform = 'translateY(-20px)';
                        break;
                    case 'fromLeft':
                        span.style.transform = 'translateX(-20px)';
                        break;
                    case 'fromRight':
                        span.style.transform = 'translateX(20px)';
                        break;
                }
                
                element.appendChild(span);
            });
            
            const spans = element.querySelectorAll('span');
            
            return gsap.to(spans, {
                opacity: 1,
                x: 0,
                y: 0,
                duration: 0.05,
                stagger: {
                    each: duration / chars.length,
                    from: "start"
                },
                ease: "power2.out",
                onComplete: () => {
                    element.classList.add('salnama-animation-complete');
                }
            });
        }
        
        // ===== MAGNETIC BUTTON =====
        magneticButtonAnimation(element, strength = 0.3) {
            if (!element) return null;
            
            element.style.cursor = 'pointer';
            
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
        
        // ===== SCROLL REVEAL =====
        scrollRevealAnimation(element, direction = 'bottom', duration = 0.8) {
            if (!element) return null;
            
            console.log(`🎬 Scroll reveal: ${direction}`);
            
            const from = {
                bottom: { y: 100, opacity: 0 },
                top: { y: -100, opacity: 0 },
                left: { x: -100, opacity: 0 },
                right: { x: 100, opacity: 0 }
            }[direction] || { y: 50, opacity: 0 };
            
            gsap.set(element, from);
            
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse",
                    markers: false
                }
            });
            
            timeline.to(element, {
                x: 0,
                y: 0,
                opacity: 1,
                duration: duration,
                ease: "power2.out",
                onComplete: () => {
                    element.classList.add('salnama-animation-complete');
                }
            });
            
            return timeline;
        }
        
        // ===== DESTROY METHODS =====
        destroyTypeWriter(element) {
            const data = this.typeWriterElements.get(element);
            if (data && data.timeline) {
                data.timeline.kill();
                if (data.originalText) {
                    element.textContent = data.originalText;
                }
            }
            this.typeWriterElements.delete(element);
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
                element.removeEventListener('mousemove', data.moveHandler);
                element.removeEventListener('mouseleave', data.resetHandler);
                gsap.set(element, { x: 0, y: 0 });
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
}