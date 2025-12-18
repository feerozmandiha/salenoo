(function() {
    'use strict';

    class FloatingActionBar {
        constructor(selector) {
            this.element = document.querySelector(selector);
            // اگر المنت در صفحه نبود (مثلا در صفحه‌ای خاص غیرفعال شده بود) ارور ندهد
            if (!this.element) return;
            
            this.pageUrl = encodeURIComponent(window.location.href);
            this.pageTitle = encodeURIComponent(document.title);
            this.init();
        }

        init() {
            // انیمیشن با تاخیر برای لود استایل
            setTimeout(() => {
                this.element.classList.add('is-visible');
            }, 800);
            
            this.setupSocialLinks();
        }

        setupSocialLinks() {
            const socialLinks = this.element.querySelectorAll('.social-link');
            socialLinks.forEach(link => {
                const network = link.getAttribute('data-network');
                let shareUrl = '';

                switch (network) {
                    case 'whatsapp':
                        shareUrl = `https://api.whatsapp.com/send?text=${this.pageTitle}%20-%20${this.pageUrl}`;
                        break;
                    case 'telegram':
                        shareUrl = `https://t.me/share/url?url=${this.pageUrl}&text=${this.pageTitle}`;
                        break;
                    case 'eitaa':
                        shareUrl = `https://eitaa.com/share/url?url=${this.pageUrl}`;
                        break;
                    case 'instagram':
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            this.copyToClipboard();
                        });
                        return;
                }

                if (shareUrl) {
                    link.setAttribute('href', shareUrl);
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            });
        }

        copyToClipboard() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('لینک کپی شد!');
            }).catch(err => console.error('Error:', err));
        }
    }

    // زمانی که DOM آماده شد
    document.addEventListener('DOMContentLoaded', () => {
        new FloatingActionBar('#fab-module');
    });

})();