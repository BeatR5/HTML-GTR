document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initPreloader();
    initMobileNav();
    initHeaderScroll();
    initIntroReveal();
    initScrollAnimations();
    initHeroParallax();
    initHeroHotspots();
    initLightbox();
    initBackToTop();

    function initPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
            window.setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }, { once: true });

        preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
        }, { once: true });
    }

    function initMobileNav() {
        const toggle = document.querySelector('.mobile-nav-toggle');
        const nav = document.getElementById('main-nav');
        if (!toggle || !nav) return;

        const links = nav.querySelectorAll('a');

        const setMenuState = (isOpen) => {
            nav.classList.toggle('is-open', isOpen);
            toggle.classList.toggle('is-active', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('nav-open', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        };

        toggle.addEventListener('click', () => {
            setMenuState(!nav.classList.contains('is-open'));
        });

        links.forEach((link) => {
            link.addEventListener('click', () => setMenuState(false));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && nav.classList.contains('is-open')) {
                setMenuState(false);
                toggle.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) setMenuState(false);
        });
    }

    function initHeaderScroll() {
        const header = document.getElementById('main-header');
        if (!header) return;

        const updateHeader = () => {
            header.classList.toggle('scrolled', window.scrollY > 24);
        };

        updateHeader();
        window.addEventListener('scroll', updateHeader, { passive: true });
    }

    function initIntroReveal() {
        const intro = document.querySelector('.reveal-intro');
        const laptop = document.querySelector('.laptop-mockup');
        const cta = document.querySelector('[data-scroll-target]');
        if (!intro) return;

        const target = cta ? document.querySelector(cta.dataset.scrollTarget) : null;

        const scrollToHero = () => {
            if (!target) return;
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        };

        if (cta && target) {
            cta.addEventListener('click', scrollToHero);
        }

        const updateIntro = () => {
            const rect = intro.getBoundingClientRect();
            const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
            document.body.classList.toggle('intro-active', rect.bottom > 96);

            if (laptop && !reduceMotion) {
                laptop.style.setProperty('--intro-progress', progress.toFixed(3));
            }
        };

        updateIntro();
        window.addEventListener('scroll', updateIntro, { passive: true });
        window.addEventListener('resize', updateIntro);
    }

    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        if (!animatedElements.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            animatedElements.forEach((element) => element.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

        animatedElements.forEach((element) => observer.observe(element));
    }

    function initHeroParallax() {
        const hero = document.querySelector('.interactive-hero');
        const image = document.getElementById('interactive-image');
        if (!hero || !image || reduceMotion) return;

        let ticking = false;

        const update = () => {
            ticking = false;
            if (hero.classList.contains('detail-is-active')) return;
            if (window.innerWidth < 769) {
                image.style.transform = '';
                return;
            }
            const rect = hero.getBoundingClientRect();
            const progress = Math.min(Math.max(-rect.top / window.innerHeight, 0), 1);
            image.style.transform = `translate3d(0, ${progress * 42}px, 0) scale(1.045)`;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        update();
    }

    function initHeroHotspots() {
        const hero = document.querySelector('.interactive-hero');
        const panel = document.getElementById('hero-detail-panel');
        const closeButton = document.getElementById('detail-close-btn');
        const image = document.getElementById('detail-image');
        const eyebrow = document.getElementById('detail-eyebrow');
        const title = document.getElementById('detail-title');
        const description = document.getElementById('detail-description');
        const chips = document.getElementById('detail-chips');
        const hotspots = document.querySelectorAll('.hotspot[data-detail]');
        if (!hero || !panel || !closeButton || !image || !eyebrow || !title || !description || !chips || !hotspots.length) return;

        const details = {
            engine: {
                image: 'images/engine-view.jpg',
                alt: 'RB26DETT engine bay detail',
                eyebrow: 'ENGINE / TWIN TURBO INLINE-6',
                title: 'RB26DETT Engine',
                description: 'The 2.6L twin-turbo inline-six sits at the center of the R34 legend: a cast-iron block, immense tuning headroom, and a performance reputation that made the GT-R a benchmark for an entire generation.',
                chips: ['2.6L Inline-6', 'Twin Turbo', 'ATTESA E-TS Pro', 'Tuning Icon']
            },
            interior: {
                image: 'images/interior-view.jpg',
                alt: 'R34 GT-R cockpit and Multi-Function Display',
                eyebrow: 'INTERIOR / MFD SYSTEM',
                title: 'Driver-Focused Cockpit',
                description: 'The R34 cockpit is analog, compact, and built around the driver, pairing supportive bucket seats and a 6-speed Getrag manual with the iconic Multi-Function Display for live engine and chassis data.',
                chips: ['Multi-Function Display', '6-Speed Getrag', 'Bucket Seats', 'Driver-Focused Layout']
            }
        };

        let activeDetail = null;
        let lastTrigger = null;

        const renderChips = (items) => {
            chips.replaceChildren(...items.map((item) => {
                const chip = document.createElement('span');
                chip.className = 'detail-chip';
                chip.textContent = item;
                return chip;
            }));
        };

        const openDetail = (type, hotspot) => {
            const detail = details[type];
            if (!detail) return;

            activeDetail = type;
            lastTrigger = hotspot;
            image.src = detail.image;
            image.alt = detail.alt;
            eyebrow.textContent = detail.eyebrow;
            title.textContent = detail.title;
            description.textContent = detail.description;
            renderChips(detail.chips);

            hero.dataset.activeDetail = type;
            hero.classList.add('detail-is-active');
            panel.setAttribute('aria-hidden', 'false');
            hotspots.forEach((item) => item.classList.toggle('is-active', item === hotspot));
            document.body.classList.add('detail-open');

            window.requestAnimationFrame(() => closeButton.focus({ preventScroll: true }));
        };

        const closeDetail = () => {
            if (!activeDetail) return;

            activeDetail = null;
            hero.classList.remove('detail-is-active');
            delete hero.dataset.activeDetail;
            panel.setAttribute('aria-hidden', 'true');
            hotspots.forEach((item) => item.classList.remove('is-active'));
            document.body.classList.remove('detail-open');

            const trigger = lastTrigger;
            lastTrigger = null;
            if (trigger) trigger.focus({ preventScroll: true });
        };

        hotspots.forEach((hotspot) => {
            hotspot.addEventListener('click', () => {
                openDetail(hotspot.dataset.detail, hotspot);
            });
        });

        closeButton.addEventListener('click', closeDetail);

        panel.addEventListener('click', (event) => {
            if (event.target === panel) closeDetail();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeDetail();
        });
    }

    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-img');
        const closeButton = document.querySelector('.lightbox-close');
        const triggers = document.querySelectorAll('.lightbox-trigger');
        if (!lightbox || !lightboxImage || !closeButton || !triggers.length) return;

        let lastTrigger = null;

        const openLightbox = (trigger) => {
            lastTrigger = trigger;
            lightboxImage.src = trigger.currentSrc || trigger.src;
            lightboxImage.alt = trigger.alt || 'Expanded image';
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('lightbox-open', 'no-scroll');
            closeButton.focus({ preventScroll: true });
        };

        const closeLightbox = () => {
            if (!lightbox.classList.contains('is-open')) return;
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('lightbox-open', 'no-scroll');
            lightboxImage.src = '';
            if (lastTrigger) lastTrigger.focus({ preventScroll: true });
            lastTrigger = null;
        };

        lightbox.setAttribute('aria-hidden', 'true');
        closeButton.setAttribute('role', 'button');
        closeButton.setAttribute('tabindex', '0');
        closeButton.setAttribute('aria-label', 'Close image preview');

        triggers.forEach((trigger) => {
            trigger.setAttribute('tabindex', '0');
            trigger.addEventListener('click', () => openLightbox(trigger));
            trigger.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openLightbox(trigger);
                }
            });
        });

        closeButton.addEventListener('click', closeLightbox);
        closeButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                closeLightbox();
            }
        });
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeLightbox();
        });
    }

    function initBackToTop() {
        const button = document.getElementById('back-to-top-btn');
        if (!button) return;

        const updateButton = () => {
            button.classList.toggle('show', window.scrollY > 420);
        };

        updateButton();
        window.addEventListener('scroll', updateButton, { passive: true });

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? 'auto' : 'smooth'
            });
        });
    }
});
