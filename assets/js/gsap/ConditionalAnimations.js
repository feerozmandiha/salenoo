// assets/js/gsap/ConditionalAnimations.js
class ConditionalAnimations {
    constructor(engine) {
        this.engine = engine;
        this.conditionalElements = new Map();
        this.observers = new Map();
        this.eventListeners = new Map();
        this.init();
    }
    
    init() {
        console.log('🎯 Conditional Animations Initialized');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // گوش دادن به رویدادهای سفارشی
        const customTriggerHandler = (e) => {
            this.handleCustomTrigger(e.detail);
        };
        
        document.addEventListener('salnama:animation:trigger', customTriggerHandler);
        this.eventListeners.set('salnama:animation:trigger', customTriggerHandler);
    }
    
    registerConditionalElement(element, config) {
        if (!this.isValidElement(element)) {
            console.error('❌ Invalid element for conditional animation');
            return null;
        }

        const elementId = this.generateElementId();
        this.conditionalElements.set(elementId, {
            element: element,
            config: config,
            state: 'idle',
            activated: false
        });
        
        this.setupElementConditions(element, config, elementId);
        return elementId;
    }
    
    setupElementConditions(element, config, elementId) {
        const { condition, triggerElement, onClick, onHover } = config;
        
        try {
            switch(condition) {
                case 'click':
                    this.setupClickTrigger(element, config, elementId);
                    break;
                case 'hover':
                    this.setupHoverTrigger(element, config, elementId);
                    break;
                case 'elementVisible':
                    this.setupElementVisibleTrigger(element, config, elementId);
                    break;
                case 'customEvent':
                    this.setupCustomEventTrigger(element, config, elementId);
                    break;
                case 'sequence':
                    this.setupSequenceTrigger(element, config, elementId);
                    break;
                default:
                    console.warn(`⚠️ Unknown condition type: ${condition}`);
            }
        } catch (error) {
            console.error(`❌ Error setting up condition ${condition}:`, error);
        }
    }
    
    setupClickTrigger(element, config, elementId) {
        const triggerElement = config.triggerElement ? 
            document.querySelector(config.triggerElement) : element;
            
        if (triggerElement) {
            const clickHandler = () => {
                if (!this.isAnimationActivated(elementId)) {
                    this.executeConditionalAnimation(element, config, elementId);
                }
            };
            
            triggerElement.addEventListener('click', clickHandler);
            triggerElement.style.cursor = 'pointer';
            
            // ذخیره handler برای پاکسازی
            this.eventListeners.set(`click_${elementId}`, {
                element: triggerElement,
                type: 'click',
                handler: clickHandler
            });
        }
    }
    
    setupHoverTrigger(element, config, elementId) {
        const hoverHandler = () => {
            if (!this.isAnimationActivated(elementId)) {
                this.executeConditionalAnimation(element, config, elementId);
            }
        };
        
        element.addEventListener('mouseenter', hoverHandler);
        
        this.eventListeners.set(`hover_${elementId}`, {
            element: element,
            type: 'mouseenter',
            handler: hoverHandler
        });
    }
    
    setupElementVisibleTrigger(element, config, elementId) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isAnimationActivated(elementId)) {
                    this.executeConditionalAnimation(element, config, elementId);
                    if (config.triggerOnce !== false) {
                        observer.unobserve(element);
                    }
                }
            });
        }, { 
            threshold: config.threshold || 0.5,
            rootMargin: config.rootMargin || '0px'
        });
        
        observer.observe(element);
        this.observers.set(elementId, observer);
    }
    
    setupCustomEventTrigger(element, config, elementId) {
        const eventHandler = () => {
            if (!this.isAnimationActivated(elementId)) {
                this.executeConditionalAnimation(element, config, elementId);
            }
        };
        
        document.addEventListener(config.customEventName, eventHandler);
        
        this.eventListeners.set(`custom_${elementId}`, {
            element: document,
            type: config.customEventName,
            handler: eventHandler
        });
    }
    
    setupSequenceTrigger(element, config, elementId) {
        if (config.sequenceOrder === 0) {
            // اولین المان در توالی
            this.executeConditionalAnimation(element, config, elementId);
        } else {
            // منتظر المان قبلی
            this.waitForPreviousElement(element, config, elementId);
        }
    }
    
    isAnimationActivated(elementId) {
        const elementData = this.conditionalElements.get(elementId);
        return elementData && elementData.activated;
    }
    
    executeConditionalAnimation(element, config, elementId) {
        if (!this.isValidElement(element)) return;

        // علامت‌گذاری به عنوان فعال شده
        if (elementId) {
            const elementData = this.conditionalElements.get(elementId);
            if (elementData) {
                elementData.activated = true;
                elementData.state = 'playing';
            }
        }

        console.log(`🎬 Executing conditional animation: ${config.animationType}`);
        
        try {
            if (this.engine && this.engine.advancedAnimations) {
                const animationType = config.animationType || 'fadeIn';
                const duration = config.duration || 0.6;
                
                // بررسی وجود متدهای پیشرفته
                if (typeof this.engine.advancedAnimations[animationType + 'Animation'] === 'function') {
                    this.engine.advancedAnimations[animationType + 'Animation'](element, duration);
                } else {
                    // fallback به انیمیشن پایه
                    this.engine.applyBasicAnimation(element, animationType, duration, 0, 'power2.out', 'load', 0, false);
                }
            } else if (this.engine && typeof this.engine.applyBasicAnimation === 'function') {
                // استفاده از انیمیشن پایه
                this.engine.applyBasicAnimation(
                    element, 
                    config.animationType || 'fadeIn', 
                    config.duration || 0.6, 
                    0, 
                    'power2.out', 
                    'load', 
                    0, 
                    false
                );
            } else {
                // fallback نهایی
                this.applyFallbackAnimation(element, config);
            }
        } catch (error) {
            console.error('❌ Error executing conditional animation:', error);
            this.applyFallbackAnimation(element, config);
        }

        // به روزرسانی state
        if (elementId) {
            const elementData = this.conditionalElements.get(elementId);
            if (elementData) {
                elementData.state = 'completed';
            }
        }
    }
    
    applyFallbackAnimation(element, config) {
        gsap.fromTo(element,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: config.duration || 0.6,
                ease: "power2.out"
            }
        );
    }
    
    waitForPreviousElement(element, config, elementId) {
        // پیاده‌سازی منطق انتظار برای المان قبلی
        const checkPreviousElement = setInterval(() => {
            const previousElement = this.conditionalElements.get(config.previousElementId);
            if (previousElement && previousElement.state === 'completed') {
                clearInterval(checkPreviousElement);
                this.executeConditionalAnimation(element, config, elementId);
            }
        }, 100);
    }
    
    // تریگر سفارشی
    triggerCustomAnimation(selector, animationType = 'fadeIn') {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            console.warn(`⚠️ No elements found for selector: ${selector}`);
            return;
        }

        console.log(`🔧 Triggering custom animation for ${elements.length} elements`);
        
        elements.forEach(element => {
            this.executeConditionalAnimation(element, { animationType });
        });
    }
    
    // ایجاد توالی انیمیشن
    createAnimationSequence(selectors, delay = 0.1) {
        selectors.forEach((selector, index) => {
            setTimeout(() => {
                this.triggerCustomAnimation(selector, 'fadeIn');
            }, index * delay * 1000);
        });
    }
    
    // پاکسازی
    destroy() {
        console.log('🧹 Cleaning up conditional animations...');
        
        // پاکسازی observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        
        // پاکسازی event listeners
        this.eventListeners.forEach((listenerData, key) => {
            if (listenerData.element && listenerData.handler) {
                listenerData.element.removeEventListener(listenerData.type, listenerData.handler);
            }
        });
        this.eventListeners.clear();
        
        // پاکسازی elements
        this.conditionalElements.clear();
    }
    
    // متدهای کمکی
    isValidElement(element) {
        return element && element.nodeType === 1;
    }
    
    generateElementId() {
        return 'cond_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // گرفتن وضعیت المان‌ها
    getElementState(elementId) {
        return this.conditionalElements.get(elementId)?.state || 'unknown';
    }
    
    // ریست کردن المان برای اجرای مجدد
    resetElement(elementId) {
        const elementData = this.conditionalElements.get(elementId);
        if (elementData) {
            elementData.activated = false;
            elementData.state = 'idle';
            console.log(`🔄 Reset element ${elementId}`);
        }
    }
}

// ثبت global اگر نیاز باشد
if (typeof window !== 'undefined' && typeof window.ConditionalAnimations === 'undefined') {
    window.ConditionalAnimations = ConditionalAnimations;
}