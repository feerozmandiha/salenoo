// assets/js/gsap/AdvancedAnimations.js

// بررسی اینکه کلاس قبلاً تعریف نشده باشد
if (typeof AdvancedAnimations === 'undefined') {
    console.log('🔧 Loading AdvancedAnimations class...');

    class AdvancedAnimations {
        constructor(engine) {
            console.log('🎯 AdvancedAnimations constructor called');
            this.engine = engine;
            this.activeAnimations = new Map();
        }

        // انیمیشن تایپ رایتر بهبود یافته برای متن
        typeWriterAnimation(element, duration = 2, delay = 0) {
            console.log('🔧 typeWriterAnimation called', { element, duration, delay });

            // بررسی اینکه المان معتبر است و متن دارد
            if (!this.isValidElement(element)) {
                console.error('❌ Invalid element for typewriter animation');
                return null;
            }

            const originalText = element.textContent || element.innerText;
            if (!originalText || originalText.trim() === '') {
                console.warn('⚠️ No text content for typewriter animation');
                return this.applyFallbackAnimation(element);
            }

            console.log('📝 Original text:', originalText);

            // ذخیره متن اصلی و پاک کردن المان
            element.setAttribute('data-original-text', originalText);
            element.textContent = '';
            
            // تنظیم استایل‌های ضروری
            this.setElementStyles(element, {
                visibility: 'visible',
                opacity: '1',
                display: 'block'
            });

            const chars = originalText.split('');
            let currentText = '';

            const timeline = gsap.timeline({
                delay: delay,
                onComplete: () => {
                    console.log('✅ Typewriter animation completed');
                    element.style.borderRight = 'none';
                    this.removeActiveAnimation(element);
                }
            });

            // محاسبه تاخیر بین کاراکترها
            const charDuration = duration / Math.max(chars.length, 1);

            chars.forEach((char, index) => {
                timeline.call(() => {
                    currentText += char;
                    element.textContent = currentText;
                    
                    // اضافه کردن cursor effect برای کاراکتر آخر
                    if (index === chars.length - 1) {
                        element.style.borderRight = '2px solid currentColor';
                    }
                    
                    console.log('✍️ Typing:', currentText);
                }, null, index === 0 ? 0 : `+=${charDuration}`);
            });

            this.addActiveAnimation(element, timeline);
            return timeline;
        }

        // انیمیشن استاگر برای المان‌های فرزند
        staggerGridAnimation(element, duration = 0.6, stagger = 0.1, from = 'start') {
            console.log('🔧 staggerGridAnimation called', { element, duration, stagger, from });

            if (!this.isValidElement(element)) {
                console.error('❌ Invalid element for stagger animation');
                return null;
            }

            const children = Array.from(element.children);
            console.log('👶 Children count:', children.length);

            if (children.length === 0) {
                console.warn('❌ No children found for stagger animation');
                return this.applyFallbackAnimation(element);
            }

            // تنظیم حالت اولیه
            gsap.set(children, { 
                opacity: 0, 
                y: 30,
                willChange: 'transform, opacity' // بهینه‌سازی performance
            });

            const animation = gsap.to(children, {
                opacity: 1,
                y: 0,
                duration: duration,
                stagger: {
                    each: stagger,
                    from: from,
                    ease: "power2.out"
                },
                ease: "power2.out",
                onStart: () => {
                    console.log('🎬 Stagger animation started');
                },
                onComplete: () => {
                    console.log('✅ Stagger animation completed');
                    // پاک کردن willChange برای جلوگیری از memory issues
                    gsap.set(children, { willChange: 'auto' });
                    this.removeActiveAnimation(element);
                }
            });

            this.addActiveAnimation(element, animation);
            return animation;
        }

        // انیمیشن پارالاکس برای اسکرول
        parallaxAnimation(element, speed = 0.5, trigger = null) {
            console.log('🔧 parallaxAnimation called', { element, speed, trigger });

            if (!this.isValidElement(element)) {
                console.error('❌ Invalid element for parallax animation');
                return null;
            }

            const parallaxTrigger = trigger || element;
            const movementDistance = () => {
                const elementHeight = element.offsetHeight;
                return -elementHeight * speed;
            };

            const animation = gsap.to(element, {
                y: movementDistance,
                ease: "none",
                scrollTrigger: {
                    trigger: parallaxTrigger,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                    invalidateOnRefresh: true,
                    onRefresh: () => {
                        console.log('🔄 Parallax animation refreshed');
                    }
                },
                onComplete: () => {
                    this.removeActiveAnimation(element);
                }
            });

            console.log('✅ parallaxAnimation completed');
            this.addActiveAnimation(element, animation);
            return animation;
        }

        // انیمیشن تغییر گرادیان با مدیریت بهتر
        gradientShiftAnimation(element, duration = 3, colors = null) {
            console.log('🔧 gradientShiftAnimation called', { element, duration });

            if (!this.isValidElement(element)) {
                console.error('❌ Invalid element for gradient animation');
                return null;
            }

            // رنگ‌های پیش‌فرض
            const defaultColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
            const gradientColors = colors || defaultColors;

            // بررسی پشتیبانی از background gradient
            const originalBackground = getComputedStyle(element).background;
            element.setAttribute('data-original-background', originalBackground);

            const gradientTimeline = gsap.timeline({
                repeat: -1,
                yoyo: true,
                onRepeat: () => {
                    console.log('🔄 Gradient cycle repeated');
                }
            });

            gradientColors.forEach((color, index) => {
                const nextColor = gradientColors[(index + 1) % gradientColors.length];
                gradientTimeline.to(element, {
                    background: `linear-gradient(45deg, ${color}, ${nextColor})`,
                    duration: duration,
                    ease: "sine.inOut"
                });
            });

            this.addActiveAnimation(element, gradientTimeline);
            console.log('✅ gradientShiftAnimation completed');
            return gradientTimeline;
        }

        // انیمیشن دکمه مغناطیسی بهبود یافته
        magneticButtonAnimation(element, magneticStrength = 0.2) {
            console.log('🔧 Starting magneticButton animation');
            
            if (!this.isValidElement(element)) {
                console.error('❌ Invalid element for magnetic animation');
                return null;
            }

            // استفاده از نسخه بهبود یافته از GSAPEngine اگر موجود باشد
            if (this.engine && typeof this.engine.addMagneticButtonImproved === 'function') {
                const magneticInstance = this.engine.addMagneticButtonImproved(element, magneticStrength);
                this.addActiveAnimation(element, magneticInstance);
                return magneticInstance;
            }
            
            // نسخه fallback
            this.setElementStyles(element, {
                opacity: '1',
                visibility: 'visible',
                willChange: 'transform'
            });
            
            const maxMovement = 10;
            let isActive = true;

            const magneticMove = (e) => {
                if (!isActive) return;
                
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
                if (!isActive) return;
                
                gsap.to(element, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)"
                });
            };

            element.addEventListener('mousemove', magneticMove);
            element.addEventListener('mouseleave', magneticReset);
            element.classList.add('salnama-magnetic-button', 'salnama-transform-element');

            const magneticInstance = {
                destroy: () => {
                    isActive = false;
                    element.removeEventListener('mousemove', magneticMove);
                    element.removeEventListener('mouseleave', magneticReset);
                    element.classList.remove('salnama-magnetic-button', 'salnama-transform-element');
                    gsap.set(element, { 
                        x: 0, 
                        y: 0,
                        willChange: 'auto' 
                    });
                    this.removeActiveAnimation(element);
                    console.log('✅ Magnetic animation destroyed');
                },
                pause: () => {
                    isActive = false;
                    magneticReset();
                },
                resume: () => {
                    isActive = true;
                }
            };

            this.addActiveAnimation(element, magneticInstance);
            return magneticInstance;
        }

        // انیمیشن آشکارسازی متن بهبود یافته
        textRevealAnimation(element, direction = 'fromBottom', duration = 1) {
            console.log('🔧 textRevealAnimation called', { element, direction, duration });

            if (!this.isValidElement(element)) {
                console.error('❌ Invalid element for text reveal animation');
                return null;
            }

            const originalText = element.textContent || element.innerText;
            if (!originalText || originalText.trim() === '') {
                console.warn('⚠️ No text content for text reveal animation');
                return this.applyFallbackAnimation(element);
            }

            console.log('📝 Original text for reveal:', originalText);

            // ذخیره متن اصلی
            element.setAttribute('data-original-text', originalText);
            
            // پاک کردن و ایجاد اسپن‌ها
            element.textContent = '';
            const chars = originalText.split('');
            const spans = chars.map((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.willChange = 'transform, opacity';
                span.setAttribute('data-char-index', index);
                return span;
            });

            element.append(...spans);

            // تعریف properties بر اساس جهت
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
                stagger: {
                    each: 0.02,
                    from: "start",
                    ease: "power2.out"
                },
                ease: "back.out(1.7)",
                onStart: () => {
                    console.log('🎬 Text reveal animation started');
                },
                onComplete: () => {
                    console.log('✅ Text reveal animation completed');
                    // پاک کردن willChange
                    gsap.set(spans, { willChange: 'auto' });
                    this.removeActiveAnimation(element);
                }
            });

            this.addActiveAnimation(element, animation);
            return animation;
        }

        // انیمیشن مورف شکل (برای SVG) با paths پیش‌فرض
        morphShapeAnimation(element, paths = [], duration = 2) {
            console.log('🔧 morphShapeAnimation called', { element, paths, duration });

            if (!this.isValidElement(element)) {
                console.error('❌ Invalid element for morph animation');
                return null;
            }

            let targetPath;
            if (element.tagName === 'path') {
                targetPath = element;
            } else if (element.querySelector('path')) {
                targetPath = element.querySelector('path');
            } else {
                console.warn('❌ Morph animation only works on SVG paths');
                return this.applyFallbackAnimation(element);
            }

            // ذخیره path اصلی
            const originalPath = targetPath.getAttribute('d');
            targetPath.setAttribute('data-original-path', originalPath);

            // اگر paths ارائه نشده، از shapes پیش‌فرض استفاده کن
            const morphPaths = paths.length > 0 ? paths : this.getDefaultMorphPaths();

            const morphTimeline = gsap.timeline({
                repeat: -1,
                yoyo: true,
                onRepeat: () => {
                    console.log('🔄 Morph cycle repeated');
                }
            });

            morphPaths.forEach((path, index) => {
                morphTimeline.to(targetPath, {
                    attr: { d: path },
                    duration: duration,
                    ease: "sine.inOut"
                });
            });

            this.addActiveAnimation(element, morphTimeline);
            console.log('✅ morphShapeAnimation completed');
            return morphTimeline;
        }

        // متدهای کمکی
        isValidElement(element) {
            return element && element.nodeType === 1 && typeof element.getAttribute === 'function';
        }

        setElementStyles(element, styles) {
            if (!this.isValidElement(element)) return;
            
            Object.keys(styles).forEach(property => {
                element.style[property] = styles[property];
            });
        }

        applyFallbackAnimation(element) {
            if (!this.isValidElement(element)) return null;
            
            return gsap.fromTo(element,
                { opacity: 0, y: 20 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.6,
                    ease: "power2.out" 
                }
            );
        }

        addActiveAnimation(element, animation) {
            if (!this.isValidElement(element)) return;
            
            this.activeAnimations.set(element, animation);
        }

        removeActiveAnimation(element) {
            if (this.activeAnimations.has(element)) {
                this.activeAnimations.delete(element);
            }
        }

        getDefaultMorphPaths() {
            // مسیرهای پیش‌فرض برای مورفینگ
            return [
                "M10,100 Q50,10 90,100 Q130,190 170,100 Q210,10 250,100", // موج
                "M10,100 C40,150 60,50 90,100 C120,150 140,50 170,100 C200,150 220,50 250,100", // منحنی نرم
                "M10,100 L90,50 L170,150 L250,100", // مثلثی
                "M10,100 Q50,150 90,100 Q130,50 170,100 Q210,150 250,100" // موج معکوس
            ];
        }

        // متد برای توقف تمام انیمیشن‌ها
        destroyAllAnimations() {
            console.log('🧹 Destroying all active animations...');
            
            this.activeAnimations.forEach((animation, element) => {
                if (animation && typeof animation.destroy === 'function') {
                    animation.destroy();
                } else if (animation && animation.kill) {
                    animation.kill();
                }
                
                // بازگردانی استایل‌های اصلی
                this.restoreOriginalStyles(element);
            });
            
            this.activeAnimations.clear();
            console.log('✅ All animations destroyed');
        }

        restoreOriginalStyles(element) {
            if (!this.isValidElement(element)) return;
            
            // بازگردانی متن اصلی
            const originalText = element.getAttribute('data-original-text');
            if (originalText) {
                element.textContent = originalText;
                element.removeAttribute('data-original-text');
            }
            
            // بازگردانی background اصلی
            const originalBackground = element.getAttribute('data-original-background');
            if (originalBackground) {
                element.style.background = originalBackground;
                element.removeAttribute('data-original-background');
            }
            
            // بازگردانی path اصلی برای SVG
            const originalPath = element.getAttribute('data-original-path');
            if (originalPath && element.tagName === 'path') {
                element.setAttribute('d', originalPath);
                element.removeAttribute('data-original-path');
            }
            
            // پاک کردن استایل‌های اضافی
            element.style.willChange = '';
        }
    }

    // تعریف global
    if (typeof window !== 'undefined') {
        window.AdvancedAnimations = AdvancedAnimations;
        console.log('✅ AdvancedAnimations class registered globally');
    }
} else {
    console.log('⚠️ AdvancedAnimations already defined, skipping...');
}