// assets/js/editor/advanced-animation-controls.js
(function(wp) {
    'use strict';
    
    console.log('🎯 salnama Advanced Animation Controls - Starting initialization...');

    // بررسی وجود آبجکت‌های لازم
    if (!wp.hooks || !wp.blockEditor || !wp.components || !wp.element || !wp.compose) {
        console.error('❌ Required WordPress packages not found:', {
            hooks: !!wp.hooks,
            blockEditor: !!wp.blockEditor,
            components: !!wp.components,
            element: !!wp.element,
            compose: !!wp.compose
        });
        return;
    }

    const { addFilter } = wp.hooks;
    const { InspectorControls } = wp.blockEditor;
    const { 
        PanelBody, 
        SelectControl, 
        RangeControl, 
        ToggleControl, 
        TextControl, 
        ButtonGroup, 
        Button,
        __experimentalGrid: Grid
    } = wp.components;
    const { Fragment, createElement, useCallback } = wp.element;
    const { createHigherOrderComponent } = wp.compose;

    console.log('✅ WordPress packages loaded successfully');

    // presetهای پیش‌فرض
    const DEFAULT_PRESETS = {
        // انواع انیمیشن‌های پیشرفته
        advancedAnimationTypes: [
            { label: 'بدون انیمیشن', value: '' },
            { label: 'تایپ رایتر', value: 'typeWriter' },
            { label: 'نمایش شبکه‌ای', value: 'staggerGrid' },
            { label: 'پارالاکس اسکرول', value: 'parallaxScroll' },
            { label: 'تغییر گرادیان', value: 'gradientShift' },
            { label: 'دکمه مغناطیسی', value: 'magneticButton' },
            { label: 'آشکارسازی متن', value: 'textReveal' },
            { label: 'تغییر شکل', value: 'morphShape' },
            { label: 'ورود قهرمانی', value: 'heroEntrance' },
            { label: 'نمایش کارت', value: 'cardReveal' }
        ],
        
        // شرایط اجرا
        animationConditions: [
            { label: 'اتوماتیک', value: 'auto' },
            { label: 'در نمای دید', value: 'viewport' },
            { label: 'با کلیک', value: 'onClick' },
            { label: 'هاور ماوس', value: 'onHover' },
            { label: 'المان قابل مشاهده', value: 'elementVisible' }
        ],
        
        // جهت استاگر
        staggerDirections: [
            { label: 'عادی', value: 'normal' },
            { label: 'مرکز', value: 'center' },
            { label: 'شروع', value: 'start' },
            { label: 'پایان', value: 'end' },
            { label: 'تصادفی', value: 'random' }
        ],
        
        // انواع توالی
        sequenceTypes: [
            { label: 'متوالی', value: 'sequential' },
            { label: 'همزمان', value: 'simultaneous' },
            { label: 'موجی', value: 'wave' }
        ],
        
        // انواع انیمیشن پایه
        animationTypes: [
            { label: 'بدون انیمیشن', value: '' },
            { label: 'محو شدن', value: 'fadeIn' },
            { label: 'اسلاید بالا', value: 'slideUp' },
            { label: 'اسلاید پایین', value: 'slideDown' },
            { label: 'اسلاید چپ', value: 'slideLeft' },
            { label: 'اسلاید راست', value: 'slideRight' },
            { label: 'بزرگ شو', value: 'scaleIn' },
            { label: 'کوچک شو', value: 'scaleOut' },
            { label: 'پرش', value: 'bounceIn' },
            { label: 'چرخش', value: 'rotateIn' },
            { label: 'چرخش افقی', value: 'flipInX' },
            { label: 'چرخش عمودی', value: 'flipInY' },
            { label: 'سفارشی', value: 'custom' }
        ],
        
        // راه‌اندازها
        triggerTypes: [
            { label: 'اسکرول', value: 'scroll' },
            { label: 'هاور', value: 'hover' },
            { label: 'کلیک', value: 'click' },
            { label: 'اتوماتیک', value: 'auto' }
        ],
        
        // easing functions
        easingFunctions: [
            { label: 'Power2 Out', value: 'power2.out' },
            { label: 'Power3 Out', value: 'power3.out' },
            { label: 'Back Out', value: 'back.out(1.7)' },
            { label: 'Elastic Out', value: 'elastic.out(1, 0.5)' },
            { label: 'Bounce Out', value: 'bounce.out' },
            { label: 'Circ Out', value: 'circ.out' },
            { label: 'Expo Out', value: 'expo.out' },
            { label: 'Sine Out', value: 'sine.out' }
        ],
        
        // افکت‌های هاور
        hoverEffects: [
            { label: 'بدون افکت', value: '' },
            { label: 'بزرگنمایی', value: 'scale' },
            { label: 'بالا آمدن', value: 'lift' },
            { label: 'کج شدن', value: 'tilt' },
            { label: 'درخشش', value: 'glow' },
            { label: 'جمع شو', value: 'shrink' }
        ]
    };

    // تابع پیش‌نمایش در ادیتور
// تابع پیش‌نمایش در ادیتور - بدون useCallback
    const previewAnimationInEditor = (attributes) => {
        console.log('🔧 salnama Preview animation with attributes:', attributes);
        
        // پیدا کردن بلوک فعال
        const wpData = wp.data;
        if (!wpData) {
            console.error('❌ WordPress data package not available');
            return;
        }

        const activeBlock = wpData.select('core/block-editor').getSelectedBlock();
        if (!activeBlock) {
            alert('لطفاً یک بلوک انتخاب کنید');
            return;
        }

        // ایجاد انیمیشن موقت در ادیتور
        const blockElement = document.querySelector(`[data-block="${activeBlock.clientId}"]`);
        if (blockElement && typeof gsap !== 'undefined') {
            try {
                const previewProps = getPreviewAnimationProperties(attributes);
                gsap.fromTo(blockElement,
                    previewProps.from,
                    {
                        ...previewProps.to,
                        duration: attributes.animationDuration || 0.6,
                        ease: attributes.animationEase || 'power2.out',
                        onComplete: () => {
                            // بازگشت به حالت اول بعد از 2 ثانیه
                            setTimeout(() => {
                                gsap.to(blockElement, {
                                    ...previewProps.from,
                                    duration: 0.5,
                                    ease: "power2.in"
                                });
                            }, 2000);
                        }
                    }
                );
            } catch (error) {
                console.error('❌ Error previewing animation:', error);
                alert('خطا در نمایش پیش‌نمایش انیمیشن');
            }
        } else {
            alert('GSAP در ادیتور لود نشده است یا المان بلوک یافت نشد');
        }
    };

    const getPreviewAnimationProperties = (attributes) => {
        const baseFrom = { opacity: 0 };
        const baseTo = { opacity: 1 };

        switch (attributes.animationType) {
            case 'fadeIn':
                return {
                    from: { ...baseFrom },
                    to: { ...baseTo }
                };
            case 'slideUp':
                return {
                    from: { ...baseFrom, y: 100 },
                    to: { ...baseTo, y: 0 }
                };
            case 'slideDown':
                return {
                    from: { ...baseFrom, y: -100 },
                    to: { ...baseTo, y: 0 }
                };
            case 'slideLeft':
                return {
                    from: { ...baseFrom, x: 100 },
                    to: { ...baseTo, x: 0 }
                };
            case 'slideRight':
                return {
                    from: { ...baseFrom, x: -100 },
                    to: { ...baseTo, x: 0 }
                };
            case 'scaleIn':
                return {
                    from: { ...baseFrom, scale: 0.5 },
                    to: { ...baseTo, scale: 1 }
                };
            case 'scaleOut':
                return {
                    from: { ...baseFrom, scale: 1.5 },
                    to: { ...baseTo, scale: 1 }
                };
            case 'bounceIn':
                return {
                    from: { ...baseFrom, scale: 0.3, y: 100 },
                    to: { ...baseTo, scale: 1, y: 0, ease: "bounce.out" }
                };
            case 'rotateIn':
                return {
                    from: { ...baseFrom, rotation: -180 },
                    to: { ...baseTo, rotation: 0 }
                };
            case 'flipInX':
                return {
                    from: { ...baseFrom, rotationX: 90 },
                    to: { ...baseTo, rotationX: 0, transformPerspective: 1000 }
                };
            case 'flipInY':
                return {
                    from: { ...baseFrom, rotationY: 90 },
                    to: { ...baseTo, rotationY: 0, transformPerspective: 1000 }
                };
            case 'custom':
                return {
                    from: {
                        opacity: attributes.animationOpacity ? 0 : 1,
                        x: attributes.animationX || 0,
                        y: attributes.animationY || 50,
                        scale: attributes.animationScale || 0.8,
                        rotation: attributes.animationRotation || 0
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
                    from: { ...baseFrom, y: 30 },
                    to: { ...baseTo, y: 0 }
                };
        }
    };

    // متدهای اعمال پرست
    const applyHeroPreset = (setAttributes) => {
        setAttributes({
            advancedAnimationType: 'heroEntrance',
            animationCondition: 'auto',
            animationSequence: 'sequential',
            animationStaggerDirection: 'normal',
            animationWillChange: true,
            animationGPUAcceleration: true,
            animationReduceMotion: true,
            animationType: 'fadeIn',
            animationDuration: 1.2,
            animationDelay: 0.2,
            animationEase: 'power3.out'
        });
    };

    const applyCardPreset = (setAttributes) => {
        setAttributes({
            advancedAnimationType: 'cardReveal',
            animationCondition: 'viewport',
            animationOnHover: true,
            animationStaggerDirection: 'center',
            animationWillChange: true,
            animationType: 'slideUp',
            animationDuration: 0.8,
            animationDelay: 0.1,
            animationEase: 'power2.out',
            hoverAnimation: 'lift',
            hoverLift: 10
        });
    };

    // کامپوننت کنترل‌های پیشرفته
    const withAdvancedAnimationControls = createHigherOrderComponent((BlockEdit) => {
        return function(props) {
            const { attributes, setAttributes } = props;
            
            // مقادیر پیش‌فرض برای attributes
            const {
                // انیمیشن‌های پیشرفته
                advancedAnimationType = '',
                
                // سیستم شرطی
                animationCondition = 'auto',
                animationTriggerElement = '',
                animationOnClick = false,
                animationOnHover = false,
                
                // تنظیمات ریسپانسیو
                animationMobileDisable = false,
                animationTabletSettings = 'inherit',
                animationDesktopSettings = 'inherit',
                
                // تنظیمات پیشرفته
                animationStaggerDirection = 'normal',
                animationSequence = 'sequential',
                animationLoop = false,
                animationLoopDelay = 1,
                
                // performance
                animationWillChange = true,
                animationGPUAcceleration = true,
                animationReduceMotion = true,
                
                // انیمیشن پایه
                animationType = '',
                animationDuration = 0.6,
                animationDelay = 0,
                animationEase = 'power2.out',
                animationTrigger = 'scroll',
                animationX = 0,
                animationY = 50,
                animationOpacity = true,
                animationScale = 1,
                animationRotation = 0,
                hoverAnimation = '',
                hoverScale = 1.05,
                hoverLift = 0
            } = attributes;
            
            // استفاده از presetهای global یا پیش‌فرض
            const presets = window.salnamaAdvancedAnimationPresets || DEFAULT_PRESETS;
            const basicPresets = window.salnamaAnimationPresets || DEFAULT_PRESETS;

            // event handlers با useCallback
            const handlePreviewAnimation = useCallback(() => {
                previewAnimationInEditor(attributes);
            }, [attributes]);

            const handleHeroPreset = () => {
                applyHeroPreset(setAttributes);
            };


            const handleCardPreset = () => {
                applyCardPreset(setAttributes);
            };

            return createElement(Fragment, null,
                createElement(BlockEdit, props),
                
                // پنل انیمیشن‌های پیشرفته
                createElement(InspectorControls, { key: "advanced-animations" },
                    createElement(PanelBody, {
                        title: 'انیمیشن‌های پیشرفته salnama',
                        initialOpen: false
                    },
                        createElement(SelectControl, {
                            label: 'نوع انیمیشن پیشرفته',
                            value: advancedAnimationType,
                            options: presets.advancedAnimationTypes || [],
                            onChange: (value) => setAttributes({ advancedAnimationType: value })
                        }),
                        
                        advancedAnimationType && createElement(Fragment, null,
                            // سیستم شرطی
                            createElement(SelectControl, {
                                label: 'شرط اجرای انیمیشن',
                                value: animationCondition,
                                options: presets.animationConditions || [],
                                onChange: (value) => setAttributes({ animationCondition: value })
                            }),
                            
                            animationCondition === 'elementVisible' && 
                                createElement(TextControl, {
                                    label: 'المان تریگر (Selector)',
                                    value: animationTriggerElement,
                                    onChange: (value) => setAttributes({ animationTriggerElement: value }),
                                    help: 'مثل: .my-trigger یا #trigger-element'
                                }),
                            
                            animationCondition === 'onClick' && 
                                createElement(ToggleControl, {
                                    label: 'فعال با کلیک',
                                    checked: animationOnClick,
                                    onChange: (value) => setAttributes({ animationOnClick: value })
                                }),
                            
                            animationCondition === 'onHover' && 
                                createElement(ToggleControl, {
                                    label: 'فعال با هاور',
                                    checked: animationOnHover,
                                    onChange: (value) => setAttributes({ animationOnHover: value })
                                }),
                            
                            // تنظیمات ریسپانسیو
                            createElement(ToggleControl, {
                                label: 'غیرفعال در موبایل',
                                checked: animationMobileDisable,
                                onChange: (value) => setAttributes({ animationMobileDisable: value }),
                                help: 'انیمیشن در دستگاه‌های موبایل نمایش داده نمی‌شود'
                            }),
                            
                            // تنظیمات پیشرفته
                            createElement(SelectControl, {
                                label: 'جهت استاگر',
                                value: animationStaggerDirection,
                                options: presets.staggerDirections || [],
                                onChange: (value) => setAttributes({ animationStaggerDirection: value })
                            }),
                            
                            createElement(SelectControl, {
                                label: 'نوع توالی',
                                value: animationSequence,
                                options: presets.sequenceTypes || [],
                                onChange: (value) => setAttributes({ animationSequence: value })
                            }),
                            
                            createElement(ToggleControl, {
                                label: 'انیمیشن چرخه‌ای',
                                checked: animationLoop,
                                onChange: (value) => setAttributes({ animationLoop: value })
                            }),
                            
                            animationLoop && 
                                createElement(RangeControl, {
                                    label: 'تاخیر بین چرخه‌ها (ثانیه)',
                                    value: animationLoopDelay,
                                    onChange: (value) => setAttributes({ animationLoopDelay: value }),
                                    min: 0,
                                    max: 5,
                                    step: 0.1
                                }),
                            
                            // تنظیمات performance
                            createElement(PanelBody, {
                                title: 'تنظیمات عملکرد',
                                initialOpen: false
                            },
                                createElement(ToggleControl, {
                                    label: 'فعال‌سازی Will-Change',
                                    checked: animationWillChange,
                                    onChange: (value) => setAttributes({ animationWillChange: value }),
                                    help: 'بهبود performance انیمیشن'
                                }),
                                
                                createElement(ToggleControl, {
                                    label: 'شتاب‌دهی GPU',
                                    checked: animationGPUAcceleration,
                                    onChange: (value) => setAttributes({ animationGPUAcceleration: value }),
                                    help: 'استفاده از transform: translateZ(0) برای performance بهتر'
                                }),
                                
                                createElement(ToggleControl, {
                                    label: 'احترام به Reduce Motion',
                                    checked: animationReduceMotion,
                                    onChange: (value) => setAttributes({ animationReduceMotion: value }),
                                    help: 'غیرفعال کردن انیمیشن‌های پیچیده برای کاربران با تنظیمات کاهش حرکت'
                                })
                            ),
                            
                            // دکمه‌های پرست
                            createElement('div', { style: { marginTop: '15px' } },
                                createElement('p', { 
                                    style: { 
                                        marginBottom: '10px', 
                                        fontWeight: 'bold',
                                        fontSize: '13px'
                                    } 
                                }, 'پرست‌های آماده:'),
                                createElement(ButtonGroup, null,
                                    createElement(Button, {
                                        isSecondary: true,
                                        size: "small",
                                        onClick: handleHeroPreset
                                    }, 'ورود قهرمانی'),
                                    createElement(Button, {
                                        isSecondary: true,
                                        size: "small", 
                                        onClick: handleCardPreset
                                    }, 'نمایش کارت')
                                )
                            )
                        )
                    )
                ),
                
                // پنل انیمیشن‌های پایه (برای سازگاری)
                createElement(InspectorControls, { key: "basic-animations" },
                    createElement(PanelBody, {
                        title: 'انیمیشن‌های پایه salnama',
                        initialOpen: false
                    },
                        createElement(SelectControl, {
                            label: 'نوع انیمیشن',
                            value: animationType,
                            options: basicPresets.animationTypes || [],
                            onChange: (value) => setAttributes({ animationType: value })
                        }),
                        
                        animationType && animationType !== '' && createElement(Fragment, null,
                            createElement(SelectControl, {
                                label: 'راه‌انداز انیمیشن',
                                value: animationTrigger,
                                options: basicPresets.triggerTypes || [],
                                onChange: (value) => setAttributes({ animationTrigger: value })
                            }),
                            
                            createElement(RangeControl, {
                                label: 'مدت زمان (ثانیه)',
                                value: animationDuration,
                                onChange: (value) => setAttributes({ animationDuration: value }),
                                min: 0.1,
                                max: 3,
                                step: 0.1
                            }),
                            
                            createElement(RangeControl, {
                                label: 'تاخیر (ثانیه)',
                                value: animationDelay,
                                onChange: (value) => setAttributes({ animationDelay: value }),
                                min: 0,
                                max: 5,
                                step: 0.1
                            }),
                            
                            createElement(SelectControl, {
                                label: 'نوع حرکت',
                                value: animationEase,
                                options: basicPresets.easingFunctions || [],
                                onChange: (value) => setAttributes({ animationEase: value })
                            }),
                            
                            animationType === 'custom' && createElement(Fragment, null,
                                createElement(RangeControl, {
                                    label: 'حرکت افقی (X)',
                                    value: animationX,
                                    onChange: (value) => setAttributes({ animationX: value }),
                                    min: -200,
                                    max: 200,
                                    step: 5
                                }),
                                
                                createElement(RangeControl, {
                                    label: 'حرکت عمودی (Y)',
                                    value: animationY,
                                    onChange: (value) => setAttributes({ animationY: value }),
                                    min: -200,
                                    max: 200,
                                    step: 5
                                }),
                                
                                createElement(RangeControl, {
                                    label: 'مقیاس',
                                    value: animationScale,
                                    onChange: (value) => setAttributes({ animationScale: value }),
                                    min: 0.1,
                                    max: 3,
                                    step: 0.1
                                }),
                                
                                createElement(RangeControl, {
                                    label: 'چرخش (درجه)',
                                    value: animationRotation,
                                    onChange: (value) => setAttributes({ animationRotation: value }),
                                    min: -360,
                                    max: 360,
                                    step: 5
                                }),
                                
                                createElement(ToggleControl, {
                                    label: 'تغییر شفافیت',
                                    checked: animationOpacity,
                                    onChange: (value) => setAttributes({ animationOpacity: value })
                                })
                            ),
                            
                            createElement(SelectControl, {
                                label: 'افکت هاور',
                                value: hoverAnimation,
                                options: basicPresets.hoverEffects || [],
                                onChange: (value) => setAttributes({ hoverAnimation: value })
                            }),
                            
                            hoverAnimation === 'scale' && createElement(RangeControl, {
                                label: 'میزان بزرگنمایی هاور',
                                value: hoverScale,
                                onChange: (value) => setAttributes({ hoverScale: value }),
                                min: 1,
                                max: 2,
                                step: 0.05
                            }),
                            
                            hoverAnimation === 'lift' && createElement(RangeControl, {
                                label: 'میزان بالا آمدن هاور (px)',
                                value: hoverLift,
                                onChange: (value) => setAttributes({ hoverLift: value }),
                                min: 0,
                                max: 50,
                                step: 1
                            }),
                            
                            createElement('div', { style: { marginTop: '15px' } },
                                createElement(Button, {
                                    isSecondary: true,
                                    onClick: handlePreviewAnimation
                                }, 'پیش‌نمایش انیمیشن در ادیتور')
                            )
                        )
                    )
                )
            );
        };
    });

    // ثبت فیلترها
    addFilter(
        'editor.BlockEdit',
        'salnama/advanced-animation-controls',
        withAdvancedAnimationControls
    );

    console.log('✅ salnama Advanced Animation Controls registered successfully!');

})(window.wp);
