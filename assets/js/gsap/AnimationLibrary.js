// assets/js/gsap/AnimationLibrary.js
class AnimationLibrary {
    constructor(engine) {
        this.engine = engine;
        this.presets = new Map();
        this.activeAnimations = new Map();
        this.init();
    }
    
    init() {
        console.log('📚 Animation Library Initialized');
        this.loadPresets();
    }
    
    loadPresets() {
        // پرست‌های انیمیشنی آماده
        this.presets.set('heroEntrance', this.heroEntrancePreset());
        this.presets.set('cardReveal', this.cardRevealPreset());
        this.presets.set('textFocus', this.textFocusPreset());
        this.presets.set('imageGallery', this.imageGalleryPreset());
        this.presets.set('loadingSequence', this.loadingSequencePreset());
        this.presets.set('modalAppear', this.modalAppearPreset());
        
        console.log(`✅ Loaded ${this.presets.size} animation presets`);
    }
    
    // پرست‌های آماده
    heroEntrancePreset() {
        return {
            name: 'heroEntrance',
            animation: 'heroEntrance',
            duration: 1.2,
            stagger: 0.1,
            sequence: [
                { 
                    element: '.hero-title', 
                    animation: 'slideDown', 
                    delay: 0,
                    duration: 1.0 
                },
                { 
                    element: '.hero-subtitle', 
                    animation: 'fadeIn', 
                    delay: 0.3,
                    duration: 0.8 
                },
                { 
                    element: '.hero-button', 
                    animation: 'scaleIn', 
                    delay: 0.6,
                    duration: 0.6 
                }
            ],
            responsive: {
                mobile: { duration: 0.8, stagger: 0.05 },
                tablet: { duration: 1.0, stagger: 0.08 }
            }
        };
    }
    
    cardRevealPreset() {
        return {
            name: 'cardReveal',
            animation: 'cardReveal',
            duration: 0.8,
            stagger: 0.15,
            onHover: {
                scale: 1.05,
                y: -10,
                duration: 0.3,
                ease: "power2.out"
            },
            responsive: {
                mobile: { duration: 0.6, stagger: 0.1 }
            }
        };
    }
    
    textFocusPreset() {
        return {
            name: 'textFocus',
            animation: 'textFocus',
            duration: 0.5,
            stagger: 0.02,
            effects: ['typeWriter', 'characterReveal'],
            responsive: {
                mobile: { duration: 0.4, stagger: 0.03 }
            }
        };
    }

    imageGalleryPreset() {
        return {
            name: 'imageGallery',
            animation: 'staggerGrid',
            duration: 0.6,
            stagger: 0.1,
            sequence: 'rows'
        };
    }

    loadingSequencePreset() {
        return {
            name: 'loadingSequence',
            animation: 'sequential',
            duration: 0.4,
            stagger: 0.08,
            autoPlay: true
        };
    }

    modalAppearPreset() {
        return {
            name: 'modalAppear',
            animation: 'scaleIn',
            duration: 0.5,
            backdrop: {
                animation: 'fadeIn',
                duration: 0.3
            }
        };
    }
    
    applyPreset(presetName, container) {
        if (!this.isValidContainer(container)) {
            console.error('❌ Invalid container for preset application');
            return null;
        }

        const preset = this.presets.get(presetName);
        if (!preset) {
            console.error(`❌ Preset not found: ${presetName}`);
            console.log('📋 Available presets:', Array.from(this.presets.keys()));
            return null;
        }
        
        console.log(`🎨 Applying preset: ${presetName} to container:`, container);
        
        let animationResult;
        
        if (preset.sequence && Array.isArray(preset.sequence)) {
            animationResult = this.applySequencePreset(preset, container);
        } else {
            animationResult = this.applyStandardPreset(preset, container);
        }

        // ذخیره انیمیشن برای مدیریت بعدی
        if (animationResult) {
            this.activeAnimations.set(container, {
                preset: presetName,
                animation: animationResult,
                timestamp: Date.now()
            });
        }

        return animationResult;
    }
    
    applySequencePreset(preset, container) {
        const timeline = gsap.timeline();
        let totalDuration = 0;

        preset.sequence.forEach((step, sequenceIndex) => {
            const elements = container.querySelectorAll(step.element);
            
            if (elements.length === 0) {
                console.warn(`⚠️ No elements found for selector: ${step.element}`);
                return;
            }

            elements.forEach((element, elementIndex) => {
                const stepDelay = step.delay + (elementIndex * (preset.stagger || 0));
                const stepDuration = step.duration || preset.duration || 0.6;
                
                timeline.add(() => {
                    this.applyElementAnimation(element, step.animation, stepDuration, stepDelay, preset);
                }, stepDelay);
                
                totalDuration = Math.max(totalDuration, stepDelay + stepDuration);
            });
        });

        console.log(`✅ Sequence preset applied with ${preset.sequence.length} steps, total duration: ${totalDuration}s`);
        return timeline;
    }
    
    applyStandardPreset(preset, container) {
        const elements = container.querySelectorAll('[data-animation]');
        
        if (elements.length === 0) {
            console.warn('⚠️ No elements with [data-animation] attribute found');
            return null;
        }

        const timeline = gsap.timeline();
        
        elements.forEach((element, index) => {
            const delay = index * (preset.stagger || 0);
            const duration = preset.duration || 0.6;
            
            timeline.add(() => {
                this.applyElementAnimation(element, preset.animation, duration, delay, preset);
            }, delay);

            // اضافه کردن هاور افکت اگر تعریف شده
            if (preset.onHover) {
                this.setupPresetHover(element, preset.onHover);
            }
        });

        console.log(`✅ Standard preset applied to ${elements.length} elements`);
        return timeline;
    }

    applyElementAnimation(element, animationType, duration, delay, preset) {
        if (!this.isValidElement(element)) {
            console.warn('⚠️ Invalid element for animation');
            return;
        }

        // استفاده از موتور انیمیشن اگر موجود باشد
        if (this.engine && typeof this.engine.applyBasicAnimation === 'function') {
            this.engine.applyBasicAnimation(
                element,
                animationType,
                duration,
                delay,
                'power2.out',
                'load',
                0,
                false
            );
        } else {
            // fallback مستقیم با GSAP
            this.applyGSAPAnimation(element, animationType, duration, delay);
        }
    }

    applyGSAPAnimation(element, animationType, duration, delay) {
        const animationProps = this.getAnimationProperties(animationType);
        
        gsap.fromTo(element, 
            animationProps.from,
            {
                ...animationProps.to,
                duration: duration,
                delay: delay,
                ease: "power2.out"
            }
        );
    }
    
    setupPresetHover(element, hoverConfig) {
        if (!this.isValidElement(element)) return;

        const hoverTimeline = gsap.timeline({ paused: true });
        
        hoverTimeline.to(element, {
            scale: hoverConfig.scale || 1,
            y: hoverConfig.y || 0,
            duration: hoverConfig.duration || 0.3,
            ease: hoverConfig.ease || "power2.out"
        });
        
        const playHover = () => hoverTimeline.play();
        const reverseHover = () => hoverTimeline.reverse();
        
        element.addEventListener('mouseenter', playHover);
        element.addEventListener('mouseleave', reverseHover);

        // ذخیره event listeners برای پاکسازی
        if (!element._salnamaHoverListeners) {
            element._salnamaHoverListeners = [];
        }
        element._salnamaHoverListeners.push({ type: 'mouseenter', handler: playHover });
        element._salnamaHoverListeners.push({ type: 'mouseleave', handler: reverseHover });
    }
    
    getAnimationProperties(type) {
        const properties = {
            fadeIn: {
                from: { opacity: 0 },
                to: { opacity: 1 }
            },
            slideDown: {
                from: { opacity: 0, y: -50 },
                to: { opacity: 1, y: 0 }
            },
            slideUp: {
                from: { opacity: 0, y: 50 },
                to: { opacity: 1, y: 0 }
            },
            scaleIn: {
                from: { opacity: 0, scale: 0.8 },
                to: { opacity: 1, scale: 1 }
            }
        };
        
        return properties[type] || properties.fadeIn;
    }

    // ایجاد انیمیشن‌های داینامیک
    createDynamicAnimation(config) {
        return {
            play: (element) => this.playDynamicAnimation(element, config),
            pause: (element) => this.pauseDynamicAnimation(element),
            reverse: (element) => this.reverseDynamicAnimation(element),
            destroy: () => this.destroyDynamicAnimation(element)
        };
    }
    
    playDynamicAnimation(element, config) {
        if (!this.isValidElement(element)) return null;

        const timeline = gsap.timeline();
        
        config.keyframes.forEach(keyframe => {
            timeline.to(element, {
                ...keyframe.properties,
                duration: keyframe.duration,
                ease: keyframe.ease || "power2.out"
            }, keyframe.position);
        });
        
        return timeline;
    }

    pauseDynamicAnimation(element) {
        gsap.killTweensOf(element);
    }

    reverseDynamicAnimation(element) {
        const tweens = gsap.getTweensOf(element);
        tweens.forEach(tween => tween.reverse());
    }

    destroyDynamicAnimation(element) {
        this.pauseDynamicAnimation(element);
        this.cleanupElementHoverEffects(element);
    }

    // متدهای کمکی
    isValidElement(element) {
        return element && element.nodeType === 1;
    }

    isValidContainer(container) {
        return this.isValidElement(container) || 
               (typeof container === 'string' && document.querySelector(container));
    }

    cleanupElementHoverEffects(element) {
        if (element._salnamaHoverListeners) {
            element._salnamaHoverListeners.forEach(({ type, handler }) => {
                element.removeEventListener(type, handler);
            });
            delete element._salnamaHoverListeners;
        }
    }

    // مدیریت انیمیشن‌های فعال
    destroyAllAnimations() {
        console.log('🧹 Cleaning up all library animations...');
        
        this.activeAnimations.forEach((animation, container) => {
            if (animation.animation && animation.animation.kill) {
                animation.animation.kill();
            }
            this.cleanupContainerHoverEffects(container);
        });
        
        this.activeAnimations.clear();
    }

    cleanupContainerHoverEffects(container) {
        if (this.isValidElement(container)) {
            const hoverElements = container.querySelectorAll('[data-animation]');
            hoverElements.forEach(element => {
                this.cleanupElementHoverEffects(element);
            });
        }
    }

    // گرفتن لیست پرست‌های موجود
    getAvailablePresets() {
        return Array.from(this.presets.keys());
    }

    // اضافه کردن پرست سفارشی
    addCustomPreset(name, presetConfig) {
        if (this.presets.has(name)) {
            console.warn(`⚠️ Preset "${name}" already exists, overwriting...`);
        }
        
        this.presets.set(name, {
            name: name,
            ...presetConfig
        });
        
        console.log(`✅ Custom preset "${name}" added successfully`);
    }
}

// ثبت global اگر نیاز باشد
if (typeof window !== 'undefined' && typeof window.AnimationLibrary === 'undefined') {
    window.AnimationLibrary = AnimationLibrary;
}