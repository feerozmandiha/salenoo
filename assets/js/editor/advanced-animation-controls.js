(function(wp) {
    'use strict';
    console.log('salnama Animation Controls - Starting initialization...');

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

    function previewAnimationInEditor(attributes) {
        console.log('salnama Preview animation with attributes:', attributes);

        const activeBlock = wp.data.select('core/block-editor').getSelectedBlock();
        if (!activeBlock) {
            alert('لطفاً یک بلوک انتخاب کنید');
            return;
        }

        const blockElement = document.querySelector(`[data-block="${activeBlock.clientId}"]`);
        if (!blockElement || typeof gsap === 'undefined') {
            alert('GSAP در ادیتور لود نشده است یا المان یافت نشد');
            return;
        }

        const previewProps = getPreviewAnimationProperties(attributes);
        gsap.fromTo(blockElement,
            previewProps.from,
            {
                ...previewProps.to,
                duration: attributes.animationDuration || 0.6,
                ease: attributes.animationEase || 'power2.out',
                onComplete: () => {
                    gsap.to(blockElement, {
                        ...previewProps.from,
                        duration: 0.5,
                        delay: 2
                    });
                }
            }
        );
    }

    function getPreviewAnimationProperties(attributes) {
        const baseFrom = { opacity: 0 };
        const baseTo = { opacity: 1 };

        switch(attributes.animationType) {
            case 'fadeIn':
                return { from: { ...baseFrom }, to: { ...baseTo } };
            case 'slideUp':
                return { from: { ...baseFrom, y: 100 }, to: { ...baseTo, y: 0 } };
            case 'slideDown':
                return { from: { ...baseFrom, y: -100 }, to: { ...baseTo, y: 0 } };
            case 'slideLeft':
                return { from: { ...baseFrom, x: 100 }, to: { ...baseTo, x: 0 } };
            case 'slideRight':
                return { from: { ...baseFrom, x: -100 }, to: { ...baseTo, x: 0 } };
            case 'scaleIn':
                return { from: { ...baseFrom, scale: 0.5 }, to: { ...baseTo, scale: 1 } };
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
                return { from: { ...baseFrom, y: 30 }, to: { ...baseTo, y: 0 } };
        }
    }

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

            const presets = window.salnamaAnimationPresets || {};

            return createElement(Fragment, null,
                createElement(BlockEdit, props),
                createElement(InspectorControls, null,
                    createElement(PanelBody, {
                        title: 'تنظیمات انیمیشن salnama',
                        initialOpen: false
                    },
                        createElement(SelectControl, {
                            label: 'نوع انیمیشن',
                            value: animationType,
                            options: presets.animationTypes || [],
                            onChange: (value) => setAttributes({ animationType: value })
                        }),
                        animationType && animationType !== '' && createElement(Fragment, null,
                            createElement(SelectControl, {
                                label: 'راه‌انداز انیمیشن',
                                value: animationTrigger,
                                options: presets.triggerTypes || [],
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
                                options: presets.easingFunctions || [],
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
                                options: presets.hoverEffects || [],
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
                                    onClick: () => previewAnimationInEditor(attributes)
                                }, 'پیش‌نمایش انیمیشن salnama')
                            )
                        )
                    )
                )
            );
        };
    });

    addFilter(
        'editor.BlockEdit',
        'salnama/animation-controls',
        withAnimationControls
    );

    console.log('salnama Animation Controls registered successfully!');
})(window.wp);