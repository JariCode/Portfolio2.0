document.addEventListener('DOMContentLoaded', () => {
  // Scrollbox tekstin lukitus ja vapautus
  const scrollbox = document.querySelector('.scrollbox');
  const fadeinText = document.querySelector('.fadein-text');
  const scrollboxSection = scrollbox?.closest('section');
  let scrollboxLocked = true;

  // Funktio deltaY arvon normalisointiin eri selaimille
  function getDeltaY(event) {
    switch(event.deltaMode) {
      case 1: // rivit
        return event.deltaY * 16; // oletettu rivikorkeus 16px
      case 2: // sivut
        return event.deltaY * window.innerHeight;
      default: // 0 eli pikselit
        return event.deltaY;
    }
  }

  // Scrollbox lukitus ja sisäinen scrollaus
  document.addEventListener('wheel', (event) => {
    if (!scrollbox || !scrollboxLocked) return;

    if (scrollboxSection) {
      const rect = scrollboxSection.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const isVisible = rect.top < windowHeight && rect.bottom > 0;
      if (!isVisible) return;
    }

    const deltaY = getDeltaY(event);
    const direction = deltaY > 0 ? 'down' : 'up';
    const atBottom = scrollbox.scrollTop + scrollbox.clientHeight >= scrollbox.scrollHeight - 1;
    const atTop = scrollbox.scrollTop <= 0;

    if ((direction === 'down' && !atBottom) || (direction === 'up' && !atTop)) {
      scrollbox.scrollTop += deltaY;
      event.preventDefault();
    } else if (direction === 'down' && atBottom) {
      scrollboxLocked = false; // scrollbox vapautuu alareunasta
    } else if (direction === 'up' && atTop) {
      scrollboxLocked = false; // scrollbox vapautuu yläreunasta
      event.preventDefault();
    }
  }, { passive: false });

  // Resetoi lukituksen, kun scrollbox osio näkyy uudelleen
  if (scrollboxSection) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          scrollbox.scrollTop = 0;
          scrollboxLocked = true;
        }
      });
    }, { threshold: 0.6 });

    sectionObserver.observe(scrollboxSection);
  }

  // ✨ Fade-in animaatio fadein-textille aina kun se näkyy
  if (fadeinText) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fadeinText.classList.add("fadein-animate");
        } else {
          fadeinText.classList.remove("fadein-animate");
        }
      });
    }, { threshold: 0.4 });

    fadeObserver.observe(fadeinText);
  }

  // 🍔 Mobiilivalikko
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });
  }

  // 🎬 Typewriter-efekti logolle kun näkyy — aina uudelleen
  const typewriterElement = document.querySelector(".typewriter");
  const topSection = document.querySelector("#top");

  if (typewriterElement && topSection) {
    const originalText = typewriterElement.textContent.trim();

    const typewriterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typewriterElement.textContent = "";
          [...originalText].forEach((char, index) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.animationDelay = `${index * 0.25}s`;
            typewriterElement.appendChild(span);
          });
        }
      });
    }, { threshold: 0.6 });

    typewriterObserver.observe(topSection);
  }

  // 🎞️ Kuvakaruselli
  const projectSection = document.querySelector('#projects');
  const carouselImages = document.querySelectorAll('#projects .carousel-image');

  let carouselInterval = null;
  let currentSlide = 0;
  let carouselTimeout = null;

  function showSlide(index) {
    carouselImages.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
  }

  function startCarousel() {
    if (carouselInterval) return;

    showSlide(0);
    currentSlide = 0;

    carouselInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % carouselImages.length;
      showSlide(currentSlide);
    }, 3000);
  }

  function stopCarousel() {
    if (carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = null;
    }
  }

  if (projectSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (carouselTimeout) clearTimeout(carouselTimeout);
          carouselTimeout = setTimeout(() => {
            startCarousel();
          }, 200);
        } else {
          if (carouselTimeout) {
            clearTimeout(carouselTimeout);
            carouselTimeout = null;
          }
          stopCarousel();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(projectSection);
  }

  // SlideIn Linkit
  const slideinLinks = document.querySelector('.slidein-links');

  if (slideinLinks) {
    const slideinObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          slideinLinks.classList.add('slidein-animate');
        } else {
          slideinLinks.classList.remove('slidein-animate');
        }
      });
    }, {
      threshold: 0.5
    });

    slideinObserver.observe(slideinLinks);
  }

  // Ei section scroll-to -toiminnallisuutta eikä throttlea

});


















