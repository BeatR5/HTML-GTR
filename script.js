document.addEventListener('DOMContentLoaded', function() {

    // --- YENİ: Preloader Mantığı ---
    const preloader = document.getElementById('preloader');
    // Sayfadaki tüm içerik (resimler dahil) yüklendiğinde preloader'ı kaldır
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.classList.add('fade-out');
        }
    });

    // --- YENİ: Mobil Navigasyon Mantığı ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('is-open');
            mobileNavToggle.classList.toggle('is-active');
            // Menü açıkken arkaplanın kaymasını engelle
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Header Scroll Efekti ---
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Sayfa İçi Kaydırma Animasyonları ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // --- Parallax Efekti ---
    const parallaxImage = document.getElementById('interactive-image');
    if (parallaxImage) {
        window.addEventListener('scroll', () => {
            if (window.scrollY < window.innerHeight) {
                const scrollValue = window.scrollY;
                parallaxImage.style.transform = `translateY(${scrollValue * 0.4}px) scale(1.05)`;
            }
        });
    }

    // --- İnteraktif Hero Detay Paneli Mantığı ---
    const interactiveHero = document.querySelector('.interactive-hero');
    if (interactiveHero) {
        const detailPanel = document.getElementById('hero-detail-panel');
        const closeBtn = document.getElementById('detail-close-btn');
        const detailImage = document.getElementById('detail-image');
        const detailTitle = document.getElementById('detail-title');
        const detailDescription = document.getElementById('detail-description');
        const hotspots = document.querySelectorAll('.hotspot');

        function openDetailPanel(hotspot) {
            const imgSrc = hotspot.dataset.imageSrc;
            const title = hotspot.dataset.title;
            const description = hotspot.dataset.description;
            detailImage.src = imgSrc;
            detailImage.alt = title;
            detailTitle.textContent = title;
            detailDescription.textContent = description;
            interactiveHero.classList.add('detail-is-active');
        }

        function closeDetailPanel() {
            interactiveHero.classList.remove('detail-is-active');
        }

        hotspots.forEach(hotspot => {
            hotspot.addEventListener('click', (e) => {
                e.stopPropagation();
                openDetailPanel(hotspot);
            });
        });

        closeBtn.addEventListener('click', closeDetailPanel);
        interactiveHero.addEventListener('click', (e) => {
            if (e.target === interactiveHero) {
                closeDetailPanel();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && interactiveHero.classList.contains('detail-is-active')) {
                closeDetailPanel();
            }
        });
    }

    // --- Lightbox (Galeri) Mantığı ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
        const lightboxClose = document.querySelector('.lightbox-close');

        lightboxTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = trigger.src;
            });
        });

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            lightboxImg.src = '';
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // --- "Yukarı Çık" Butonu Mantığı ---
    const backToTopButton = document.getElementById('back-to-top-btn');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
