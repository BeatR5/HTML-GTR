document.addEventListener('DOMContentLoaded', function() {

  // --- Parallax Effect (Sadece ana sayfada çalışacak) ---
  const parallax = document.querySelector('.hero-parallax');
  if (parallax) {
    let ticking = false;

    function updateParallax() {
      let scrollPosition = window.pageYOffset;
      parallax.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  // --- Scroll Animation (Tüm sayfalarda çalışacak) ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Animasyon bir kez çalışsın
      }
    });
  }, {
    threshold: 0.1 // Elementin %10'u görününce animasyon başlasın
  });

  animatedElements.forEach(element => {
    observer.observe(element);
  });

});