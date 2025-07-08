document.addEventListener('DOMContentLoaded', function() {

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

  // --- İnteraktif Hero Detay Paneli Mantığı ---
  const interactiveHero = document.querySelector('.interactive-hero');
  if (interactiveHero) {
    const detailPanel = document.getElementById('hero-detail-panel');
    const closeBtn = document.getElementById('detail-close-btn');
    const detailImage = document.getElementById('detail-image');
    const detailTitle = document.getElementById('detail-title');
    const detailDescription = document.getElementById('detail-description');
    const hotspots = document.querySelectorAll('.hotspot');

    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            const imgSrc = hotspot.dataset.imageSrc;
            const title = hotspot.dataset.title;
            const description = hotspot.dataset.description;

            detailImage.src = imgSrc;
            detailImage.alt = title; // Erişilebilirlik için alt etiketi eklendi
            detailTitle.textContent = title;
            detailDescription.textContent = description;

            interactiveHero.classList.add('detail-is-active');
        });
    });

    function closeDetailPanel() {
        interactiveHero.classList.remove('detail-is-active');
    }

    closeBtn.addEventListener('click', closeDetailPanel);
  }

});