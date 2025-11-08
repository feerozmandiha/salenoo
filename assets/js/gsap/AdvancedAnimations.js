// assets/js/gsap/AdvancedAnimations.js

if (typeof AdvancedAnimations === 'undefined') {
    console.log('🔧 Loading AdvancedAnimations class...');

    class AdvancedAnimations {
        constructor(engine) {
            console.log('🎯 AdvancedAnimations constructor called');
            this.engine = engine;
        }

        typeWriterAnimation(element, duration = 2, delay = 0) {
            console.log('🔧 typeWriterAnimation called', { element, duration, delay });

            if (!element || element.nodeType !== 1) {
                console.error('❌ Invalid element for typewriter animation');
                return null;
            }

            const originalText = element.textContent || element.innerText;
            if (!originalText || originalText.trim() === '') {
                console.warn('⚠️ No text content for typewriter animation');
                return null;
            }

            element.style.visibility = 'visible';
            element.style.opacity = '1';
            element.style.display = 'block';
            element.textContent = '';

            const chars = originalText.split('');
            let currentText = '';

            const timeline = gsap.timeline({
                delay: delay,
                onStart: () => {
                    element.style.visibility = 'visible';
                    element.style.opacity = '1';
                },
                onComplete: () => {
                    console.log('✅ Typewriter completed');
                }
            });

            chars.forEach((char, index) => {
                timeline.call(() => {
                    currentText += char;
                    element.textContent = currentText;
                    console.log('✍️ Typing:', currentText);
                }, null, `+=${duration / chars.length}`);
            });

            return timeline;
        }

        staggerGridAnimation(element, duration = 0.6, stagger = 0.1, from = 'start') {
            console.log('🔧 staggerGridAnimation called', { element, duration, stagger, from });

            if (!element || element.nodeType !== 1) {
                console.error('❌ Invalid element for stagger animation');
                return null;
            }

            const children = Array.from(element.children);
            if (children.length === 0) {
                console.warn('❌ No children found for stagger animation');
                return gsap.to(element, { opacity: 1 });
            }

            gsap.set(children, {
                opacity: 0,
                y: 30,
                willChange: 'transform, opacity'
            });

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
                },
                onComplete: () => {
                    console.log('✅ Stagger animation completed');
                    gsap.set(children, { willChange: 'auto' });
                }
            });

            return animation;
        }

        parallaxAnimation(element, speed = 0.5, trigger = null) {
            console.log('🔧 parallaxAnimation called', { element, speed, trigger });

            if (!element || element.nodeType !== 1) {
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
                    invalidateOnRefresh: true
                }
            });

            return animation;
        }

        gradientShiftAnimation(element, duration = 3, colors = null) {
            console.log('🔧 gradientShiftAnimation called', { element, duration });

            if (!element || element.nodeType !== 1) {
                console.error('❌ Invalid element for gradient animation');
                return null;
            }

            const defaultColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
            const gradientColors = colors || defaultColors;

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

            return gradientTimeline;
        }

        magneticButtonAnimation(element, magneticStrength = 0.2) {
            console.log('🔧 Starting magneticButton animation');

            if (!element || element.nodeType !== 1) {
                console.error('❌ Invalid element for magnetic animation');
                return null;
            }

            const maxMovement = 15;

            const magneticMove = (e) => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                let distanceX = (e.clientX - centerX) * magneticStrength;
                let distanceY = (e.clientY - centerY) * magneticStrength;

                distanceX = Math.max(Math.min(distanceX, maxMovement), -maxMovement);
                distanceY = Math.max(Math.min(distanceY, maxMovement), -maxMovement);

                gsap.to(element, {
                    x: distanceX,
                    y: distanceY,
                    duration: 0.5,
                    ease: "power2.out",
                    onUpdate: () => {
                        element.style.transform = `translateZ(0) translate(${gsap.getProperty(element, "x")}px, ${gsap.getProperty(element, "y")}px)`;
                    }
                });
            };

            const magneticReset = () => {
                gsap.to(element, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)",
                    onUpdate: () => {
                        element.style.transform = `translateZ(0) translate(${gsap.getProperty(element, "x")}px, ${gsap.getProperty(element, "y")}px)`;
                    }
                });
            };

            element.addEventListener('mousemove', magneticMove);
            element.addEventListener('mouseleave', magneticReset);
            element.classList.add('salmama-magnetic-button');

            return {
                destroy: () => {
                    element.removeEventListener('mousemove', magneticMove);
                    element.removeEventListener('mouseleave', magneticReset);
                    element.classList.remove('salmama-magnetic-button');
                    gsap.set(element, { x: 0, y: 0 });
                    element.style.transform = '';
                }
            };
        }

        textRevealAnimation(element, direction = 'fromBottom', duration = 1) {
            console.log('🔧 textRevealAnimation called', { element, direction, duration });

            if (!element || element.nodeType !== 1) {
                console.error('❌ Invalid element for text reveal animation');
                return null;
            }

            const originalText = element.textContent || element.innerText;
            if (!originalText || originalText.trim() === '') {
                console.warn('⚠️ No text content for text reveal animation');
                return gsap.to(element, { opacity: 1 });
            }

            element.style.visibility = 'visible';
            element.style.opacity = '1';
            element.style.display = 'block';

            element.textContent = '';
            const chars = originalText.split('');
            const spans = chars.map((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.willChange = 'transform, opacity';
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
                stagger: {
                    each: 0.02,
                    from: "start"
                },
                ease: "back.out(1.7)",
                onStart: () => {
                    console.log('🎬 Text reveal animation started');
                },
                onComplete: () => {
                    console.log('✅ Text reveal animation completed');
                    gsap.set(spans, { willChange: 'auto' });
                }
            });

            return animation;
        }

        morphShapeAnimation(element, paths = [], duration = 2) {
            console.log('🔧 morphShapeAnimation called', { element, paths, duration });

            if (!element || element.nodeType !== 1) {
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
                return gsap.to(element, { opacity: 1 });
            }

            const originalPath = targetPath.getAttribute('d');
            targetPath.setAttribute('data-original-path', originalPath);

            const morphPaths = paths.length > 0 ? paths : [
                "M10,100 Q50,10 90,100 Q130,190 170,100 Q210,10 250,100",
                "M10,100 C40,150 60,50 90,100 C120,150 140,50 170,100 C200,150 220,50 250,100",
                "M10,100 L90,50 L170,150 L250,100",
                "M10,100 Q50,150 90,100 Q130,50 170,100 Q210,150 250,100"
            ];

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

            return morphTimeline;
        }
    }

    if (typeof window !== 'undefined') {
        window.AdvancedAnimations = AdvancedAnimations;
        console.log('✅ AdvancedAnimations class registered globally');
    }
} else {
    console.log('⚠️ AdvancedAnimations already defined, skipping...');
}