// assets/js/gsap/AdvancedAnimations.js

// بررسی اینکه کلاس قبلاً تعریف نشده باشد
if (typeof AdvancedAnimations === 'undefined') {
    console.log('🔧 Loading AdvancedAnimations class...');

    class AdvancedAnimations {
        constructor(engine) {
            console.log('🎯 AdvancedAnimations constructor called');
            this.engine = engine;
        }

        // انیمیشن تایپ رایتر برای متن
        typeWriterAnimation(element, duration = 2, delay = 0) {
            console.log('🔧 typeWriterAnimation called', { element, duration, delay });

            // اطمینان از اینکه متن قابل نمایش است
            element.style.cssText = `
                visibility: visible !important;
                opacity: 1 !important;
                display: block !important;
            `;

            const originalText = element.textContent || element.innerText;
            console.log('📝 Original text:', originalText);

            element.textContent = '';
            const chars = originalText.split('');
            let currentText = '';

            const timeline = gsap.timeline({
                delay: delay
            });

            chars.forEach((char, index) => {
                timeline.call(() => {
                    currentText += char;
                    element.textContent = currentText;
                    element.style.visibility = 'visible';
                    element.style.opacity = '1';
                    console.log('✍️ Typing:', currentText);
                }, null, `+=${duration / chars.length}`);
            });

            timeline.add(() => {
                console.log('✅ Typewriter animation completed');
                element.style.borderRight = 'none';
            });

            return timeline;
        }

        // انیمیشن استاگر برای المان‌های فرزند
        staggerGridAnimation(element, duration = 0.6, stagger = 0.1, from = 'start') {
            console.log('🔧 staggerGridAnimation called', { element, duration, stagger, from });

            const children = Array.from(element.children);
            console.log('👶 Children count:', children.length);

            if (children.length === 0) {
                console.warn('❌ No children found for stagger animation');
                return gsap.to(element, { opacity: 1 });
            }

            gsap.set(children, { opacity: 0, y: 30 });

            const animation = gsap.to(children, {
                opacity: 1,
                y: 0,
                duration: duration,
                stagger: {
                    each: stagger,
                    from: from
                },
                ease: "power2.out",
                onStart: () => {
                    console.log('🎬 Stagger animation started');
                }
            });

            console.log('✅ staggerGridAnimation completed');
            return animation;
        }

        // انیمیشن پارالاکس برای اسکرول
        parallaxAnimation(element, speed = 0.5, trigger = null) {
            console.log('🔧 parallaxAnimation called', { element, speed, trigger });

            const animation = gsap.to(element, {
                y: () => -100 * speed,
                ease: "none",
                scrollTrigger: {
                    trigger: trigger || element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            console.log('✅ parallaxAnimation completed');
            return animation;
        }

        // انیمیشن تغییر گرادیان
        gradientShiftAnimation(element, duration = 3, colors = ['#ff6b6b', '#4ecdc4', '#45b7d1']) {
            console.log('🔧 gradientShiftAnimation called', { element, duration, colors });

            const gradientTimeline = gsap.timeline({
                repeat: -1,
                yoyo: true
            });

            colors.forEach((color, index) => {
                const nextColor = colors[(index + 1) % colors.length];
                gradientTimeline.to(element, {
                    background: `linear-gradient(45deg, ${color}, ${nextColor})`,
                    duration: duration,
                    ease: "sine.inOut"
                });
            });

            console.log('✅ gradientShiftAnimation completed');
            return gradientTimeline;
        }

        // انیمیشن دکمه مغناطیسی
        // در AdvancedAnimations.js - متد magneticButtonAnimation را اصلاح کنید:

        magneticButtonAnimation(element, magneticStrength = 0.2) {
            console.log('🔧 Starting magneticButton animation');
            
            // استفاده از نسخه بهبود یافته
            if (this.engine && this.engine.addMagneticButtonImproved) {
                return this.engine.addMagneticButtonImproved(element, magneticStrength);
            }
            
            // نسخه fallback
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            
            const maxMovement = 10; // محدودیت حرکت
            
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
            element.classList.add('salmama-magnetic-button', 'salmama-transform-element');

            return {
                destroy: () => {
                    element.removeEventListener('mousemove', magneticMove);
                    element.removeEventListener('mouseleave', magneticReset);
                    element.classList.remove('salmama-magnetic-button', 'salmama-transform-element');
                    gsap.set(element, { x: 0, y: 0 });
                }
            };
        }

        // انیمیشن آشکارسازی متن
        textRevealAnimation(element, direction = 'fromBottom', duration = 1) {
            console.log('🔧 textRevealAnimation called', { element, direction, duration });

            const originalText = element.textContent || element.innerText;
            console.log('📝 Original text for reveal:', originalText);

            element.textContent = '';
            const chars = originalText.split('');
            const spans = chars.map(char => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                return span;
            });

            element.append(...spans);

            let fromProps = {};
            switch (direction) {
                case 'fromBottom':
                    fromProps = { y: 50, rotationX: 90 };
                    break;
                case 'fromTop':
                    fromProps = { y: -50, rotationX: -90 };
                    break;
                case 'fromLeft':
                    fromProps = { x: -50, rotationY: 90 };
                    break;
                case 'fromRight':
                    fromProps = { x: 50, rotationY: -90 };
                    break;
                default:
                    fromProps = { y: 50 };
            }

            const animation = gsap.to(spans, {
                ...fromProps,
                opacity: 1,
                x: 0,
                y: 0,
                rotationX: 0,
                rotationY: 0,
                duration: duration,
                stagger: 0.02,
                ease: "back.out(1.7)",
                onStart: () => {
                    console.log('🎬 Text reveal animation started');
                }
            });

            console.log('✅ textRevealAnimation completed');
            return animation;
        }

        // انیمیشن مورف شکل (برای SVG)
        morphShapeAnimation(element, paths = [], duration = 2) {
            console.log('🔧 morphShapeAnimation called', { element, paths, duration });

            if (element.tagName !== 'path' && !element.querySelector('path')) {
                console.warn('❌ Morph animation only works on SVG paths');
                return null;
            }

            const targetPath = element.tagName === 'path' ? element : element.querySelector('path');
            if (!targetPath) {
                console.warn('❌ No path element found for morph animation');
                return null;
            }

            const morphTimeline = gsap.timeline({
                repeat: -1,
                yoyo: true
            });

            paths.forEach((path, index) => {
                morphTimeline.to(targetPath, {
                    attr: { d: path },
                    duration: duration,
                    ease: "sine.inOut"
                });
            });

            console.log('✅ morphShapeAnimation completed');
            return morphTimeline;
        }
    }

    // تعریف global
    if (typeof window !== 'undefined' && typeof window.AdvancedAnimations === 'undefined') {
        window.AdvancedAnimations = AdvancedAnimations;
        console.log('✅ AdvancedAnimations class registered globally');
    }
} else {
    console.log('⚠️ AdvancedAnimations already defined, skipping...');
}