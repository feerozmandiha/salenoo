// assets/js/editor/animation-controls.js
(function(wp) {
    'use strict';
    
    console.log('Salmama Animation Controls - Starting initialization...');
    
    // بررسی وجود آبجکت‌های لازم
    if (!wp.hooks || !wp.blockEditor || !wp.components || !wp.element) {
        console.error('Required WordPress packages not found');
        return;
    }
    
    const { addFilter } = wp.hooks;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, SelectControl, RangeControl, ToggleControl, Button } = wp.components;
    const { Fragment, createElement } = wp.element;
    const { createHigherOrderComponent } = wp.compose;
    
    console.log('WordPress packages loaded successfully');
    
    // تابع پیش‌نمایش در ادیتور
    function previewAnimationInEditor(attributes) {
        console.log('Salmama Preview animation with attributes:', attributes);
        
        // پیدا کردن بلوک فعال
        const activeBlock = wp.data.select('core/block-editor').getSelectedBlock();
        if (!activeBlock) {
            alert('لطفاً یک بلوک انتخاب کنید');
            return;
        }
        
        // ایجاد انیمیشن موقت در ادیتور
        const blockElement = document.querySelector(`[data-block="${activeBlock.clientId}"]`);
        if (blockElement) {
            // اعمال انیمیشن با GSAP در ادیتور
            if (typeof gsap !== 'undefined') {
                const previewProps = getPreviewAnimationProperties(attributes);
                
                gsap.fromTo(blockElement, 
                    previewProps.from,
                    {
                        ...previewProps.to,
                        duration: attributes.animationDuration || 0.6,
                        ease: attributes.animationEase || 'power2.out',
                        onComplete: () => {
                            // بازگشت به حالت اول بعد از 2 ثانیه
                            gsap.to(blockElement, {
                                ...previewProps.from,
                                duration: 0.5,
                                delay: 2
                            });
                        }
                    }
                );
            } else {
                alert('GSAP در ادیتور لود نشده است');
            }
        }
    }
    
    function getPreviewAnimationProperties(attributes) {
        const baseFrom = { opacity: 0 };
        const baseTo = { opacity: 1 };
        
        switch(attributes.animationType) {
            case 'fadeIn':
                return {
                    from: { ...baseFrom, y: 50 },
                    to: { ...baseTo, y: 0 }
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
            default:
                return {
                    from: { ...baseFrom, y: 30 },
                    to: { ...baseTo, y: 0 }
                };
        }
    }
    
    // افزودن کنترل‌های انیمیشن به تمام بلوک‌ها
    const withAnimationControls = createHigherOrderComponent((BlockEdit) => {
        return function(props) {
            const { attributes, setAttributes } = props;
            const {
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
            
            // بررسی وجود presetها
            const presets = window.salmamaAnimationPresets || {};
            console.log('Salmama Available presets:', presets);
            
            return createElement(Fragment, null,
                createElement(BlockEdit, props),
                createElement(InspectorControls, null,
                    createElement(PanelBody, {
                        title: 'تنظیمات انیمیشن Salmama',
                        initialOpen: false
                    },
                        createElement(SelectControl, {
                            label: 'نوع انیمیشن',
                            value: animationType,
                            options: presets.animationTypes || [],
                            onChange: function(value) { 
                                setAttributes({ animationType: value }); 
                            }
                        }),
                        
                        animationType && animationType !== '' && 
                            createElement(Fragment, null,
                                createElement(SelectControl, {
                                    label: 'راه‌انداز انیمیشن',
                                    value: animationTrigger,
                                    options: presets.triggerTypes || [],
                                    onChange: function(value) { 
                                        setAttributes({ animationTrigger: value }); 
                                    }
                                }),
                                
                                createElement(RangeControl, {
                                    label: 'مدت زمان (ثانیه)',
                                    value: animationDuration,
                                    onChange: function(value) { 
                                        setAttributes({ animationDuration: value }); 
                                    },
                                    min: 0.1,
                                    max: 3,
                                    step: 0.1
                                }),
                                
                                createElement(RangeControl, {
                                    label: 'تاخیر (ثانیه)',
                                    value: animationDelay,
                                    onChange: function(value) { 
                                        setAttributes({ animationDelay: value }); 
                                    },
                                    min: 0,
                                    max: 5,
                                    step: 0.1
                                }),
                                
                                createElement(SelectControl, {
                                    label: 'نوع حرکت',
                                    value: animationEase,
                                    options: presets.easingFunctions || [],
                                    onChange: function(value) { 
                                        setAttributes({ animationEase: value }); 
                                    }
                                }),
                                
                                animationType === 'custom' && 
                                    createElement(Fragment, null,
                                        createElement(RangeControl, {
                                            label: 'حرکت افقی (X)',
                                            value: animationX,
                                            onChange: function(value) { 
                                                setAttributes({ animationX: value }); 
                                            },
                                            min: -200,
                                            max: 200,
                                            step: 5
                                        }),
                                        createElement(RangeControl, {
                                            label: 'حرکت عمودی (Y)',
                                            value: animationY,
                                            onChange: function(value) { 
                                                setAttributes({ animationY: value }); 
                                            },
                                            min: -200,
                                            max: 200,
                                            step: 5
                                        }),
                                        createElement(RangeControl, {
                                            label: 'مقیاس',
                                            value: animationScale,
                                            onChange: function(value) { 
                                                setAttributes({ animationScale: value }); 
                                            },
                                            min: 0.1,
                                            max: 3,
                                            step: 0.1
                                        }),
                                        createElement(RangeControl, {
                                            label: 'چرخش (درجه)',
                                            value: animationRotation,
                                            onChange: function(value) { 
                                                setAttributes({ animationRotation: value }); 
                                            },
                                            min: -360,
                                            max: 360,
                                            step: 5
                                        }),
                                        createElement(ToggleControl, {
                                            label: 'تغییر شفافیت',
                                            checked: animationOpacity,
                                            onChange: function(value) { 
                                                setAttributes({ animationOpacity: value }); 
                                            }
                                        })
                                    ),
                                
                                createElement(SelectControl, {
                                    label: 'افکت هاور',
                                    value: hoverAnimation,
                                    options: presets.hoverEffects || [],
                                    onChange: function(value) { 
                                        setAttributes({ hoverAnimation: value }); 
                                    }
                                }),
                                
                                hoverAnimation === 'scale' && 
                                    createElement(RangeControl, {
                                        label: 'میزان بزرگنمایی هاور',
                                        value: hoverScale,
                                        onChange: function(value) { 
                                            setAttributes({ hoverScale: value }); 
                                        },
                                        min: 1,
                                        max: 2,
                                        step: 0.05
                                    }),
                                
                                hoverAnimation === 'lift' && 
                                    createElement(RangeControl, {
                                        label: 'میزان بالا آمدن هاور (px)',
                                        value: hoverLift,
                                        onChange: function(value) { 
                                            setAttributes({ hoverLift: value }); 
                                        },
                                        min: 0,
                                        max: 50,
                                        step: 1
                                    }),
                                
                                createElement('div', { style: { marginTop: '15px' } },
                                    createElement(Button, {
                                        isSecondary: true,
                                        onClick: function() {
                                            previewAnimationInEditor(attributes);
                                        }
                                    }, 'پیش‌نمایش انیمیشن Salmama')
                                )
                            )
                    )
                )
            );
        };
    });
    
    // ثبت فیلتر
    addFilter(
        'editor.BlockEdit',
        'salmama/animation-controls',
        withAnimationControls
    );
    
    console.log('Salmama Animation Controls registered successfully!');
    
})(window.wp);