/**
 * Salnama Patterns Editor Enhancements
 * بهبودهای ادیتور برای پترن‌های سالنما
 */

(function() {
    'use strict';

    // منتظر بارگذاری کامل ادیتور می‌مانیم
    wp.domReady(function() {
        
        // بهبود نمایش پترن‌ها در inserter
        const enhancePatternInserter = () => {
            const patterns = window.salenamaPatterns?.patterns || [];
            const categories = window.salenamaPatterns?.categories || {};
            
            if (patterns.length > 0) {
                console.log('Salnama Patterns Loaded:', patterns);
                
                // افزودن استایل‌های اختصاصی برای پترن‌های سالنما در ادیتور
                const style = document.createElement('style');
                style.textContent = `
                    .block-editor-block-patterns-list .block-editor-block-patterns-list__item[title*="سالنما"] {
                        border: 2px solid #3B82F6;
                        position: relative;
                        border-radius: 8px;
                    }
                    .block-editor-block-patterns-list .block-editor-block-patterns-list__item[title*="سالنما"]::before {
                        content: "سالنما";
                        position: absolute;
                        top: 8px;
                        left: 8px;
                        background: #3B82F6;
                        color: white;
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-size: 10px;
                        z-index: 1;
                        font-weight: 500;
                    }
                    
                    /* جداکننده دسته‌بندی‌های سالنما */
                    .block-editor-block-patterns-list__list:has(.block-editor-block-patterns-list__item[title*="سالنما"])::before {
                        content: "پترن‌های سالنما";
                        display: block;
                        margin: 16px 0 8px;
                        padding: 8px 12px;
                        background: #f8fafc;
                        border-right: 3px solid #3B82F6;
                        font-weight: 600;
                        color: #1e293b;
                        font-size: 14px;
                    }
                `;
                document.head.appendChild(style);
            }
        };

        // نمایش اطلاعات پترن در کنسول برای دیباگ
        const logPatternsInfo = () => {
            if (window.salenamaPatterns) {
                console.group('🎨 Salnama Patterns Manager');
                console.log('📁 Registered Patterns:', window.salenamaPatterns.patterns);
                console.log('📂 Categories:', window.salenamaPatterns.categories);
                console.log('🔗 Assets URI:', window.salenamaPatterns.assetsUri);
                console.groupEnd();
            }
        };

        // اجرا پس از بارگذاری کامل اینسرتر
        setTimeout(() => {
            enhancePatternInserter();
            logPatternsInfo();
        }, 1000);

        // مشاهده‌گر برای تغییرات در اینسرتر
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    enhancePatternInserter();
                }
            });
        });

        // شروع مشاهده
        const blockInserter = document.querySelector('.block-editor-block-patterns-list');
        if (blockInserter) {
            observer.observe(blockInserter, {
                childList: true,
                subtree: true
            });
        }

        // افزودن کلاس به پترن‌های سالنما در ادیتور
        wp.hooks.addFilter(
            'blocks.getBlockElement',
            'salenama/pattern-class',
            function(element, block) {
                if (block.name === 'core/block' && block.attributes.ref) {
                    const patternSlug = block.attributes.ref;
                    if (patternSlug.includes('salenama-')) {
                        element.classList.add('salenama-pattern-block');
                    }
                }
                return element;
            }
        );

    });

})();