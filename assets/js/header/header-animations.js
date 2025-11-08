document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.minimal-vertical-header');
    const menuIcon = document.querySelector('.menu-icon');
    const arrowPath = document.querySelector('.arrow-path');
    const fullScreenMenu = document.querySelector('.full-screen-menu-overlay');
    const logoContainer = document.querySelector('.logo-container');
    const ctaButton = document.querySelector('.cta-button-wrapper');

    let hoverTimer = null;
    let isMenuOpen = false;

    // حالت اولیه
    arrowPath.classList.add('animate-loop-initial');

    menuIcon.addEventListener('mouseenter', function () {
        clearTimeout(hoverTimer);
        if (isMenuOpen) return;

        header.classList.add('is-expanded');
        menuIcon.classList.add('is-rotated-90');
        arrowPath.classList.remove('animate-loop-initial');
        arrowPath.classList.add('animate-loop-hovered');
    });

    header.addEventListener('mouseleave', function () {
        if (isMenuOpen) return;

        hoverTimer = setTimeout(() => {
            header.classList.remove('is-expanded');
            menuIcon.classList.remove('is-rotated-90');
            arrowPath.classList.remove('animate-loop-hovered');
            arrowPath.classList.add('animate-loop-initial');
        }, 2000);
    });

    header.addEventListener('mouseenter', function () {
        clearTimeout(hoverTimer);
    });

    menuIcon.addEventListener('click', function (e) {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            fullScreenMenu.classList.add('is-visible');
            arrowPath.style.animationPlayState = 'paused';
        } else {
            fullScreenMenu.classList.remove('is-visible');
            arrowPath.style.animationPlayState = 'running';
        }
    });

    document.addEventListener('click', function (e) {
        if (!header.contains(e.target) && !fullScreenMenu.contains(e.target)) {
            if (isMenuOpen) {
                isMenuOpen = false;
                fullScreenMenu.classList.remove('is-visible');
                arrowPath.style.animationPlayState = 'running';
            }
        }
    });

    fullScreenMenu.addEventListener('click', function (e) {
        if (e.target === fullScreenMenu) {
            isMenuOpen = false;
            fullScreenMenu.classList.remove('is-visible');
            arrowPath.style.animationPlayState = 'running';
        }
    });
});