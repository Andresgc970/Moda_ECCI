/* ===========================================================
   MODA ECCI — Lógica de la interfaz
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     1. MENÚ MÓVIL
  ----------------------------------------------------------- */
  const navToggleBtn  = document.getElementById('navToggleBtn');
  const mainNavLinks  = document.getElementById('mainNavLinks');

  if (navToggleBtn && mainNavLinks) {
    navToggleBtn.addEventListener('click', () => {
      mainNavLinks.classList.toggle('open');
    });

    mainNavLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNavLinks.classList.remove('open');
      });
    });
  }

  /* -----------------------------------------------------------
     2. TOGGLE DE IDIOMA (ES / EN)
  ----------------------------------------------------------- */
  const langButtons       = document.querySelectorAll('.lang-toggle button');
  const translatableEls   = document.querySelectorAll('[data-i18n]');
  const translatablePH    = document.querySelectorAll('[data-i18n-placeholder]');

  function applyLanguage(lang) {
    translatableEls.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    translatablePH.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });

    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('moda-ecci-lang', lang);
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  const savedLang = localStorage.getItem('moda-ecci-lang') || 'es';
  applyLanguage(savedLang);

  /* -----------------------------------------------------------
     3. GALERÍA — Generación dinámica de 15 fotos
  ----------------------------------------------------------- */
  const galleryGrid  = document.querySelector('.gallery-grid');
  const TOTAL_PHOTOS = 15;
  const photoFiles   = [];

  if (galleryGrid) {
    for (let i = 1; i <= TOTAL_PHOTOS; i++) {
      const filename = `FotosModaEcci/ec${i}.jpeg`;
      photoFiles.push(filename);

      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.setAttribute('data-index', i - 1);

      const img = document.createElement('img');
      img.src    = filename;
      img.alt    = `Moda ECCI — Fotografía ${i}`;
      img.loading = 'lazy';

      const number = document.createElement('span');
      number.className   = 'gallery-number';
      number.textContent = `0${i}`.slice(-2);

      item.appendChild(img);
      item.appendChild(number);
      galleryGrid.appendChild(item);
    }
  }

  /* -----------------------------------------------------------
     4. LIGHTBOX
  ----------------------------------------------------------- */
  const lightbox        = document.getElementById('lightbox');
  if (lightbox && galleryGrid) {
    const lightboxImg     = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn        = lightbox.querySelector('.lightbox-close');
    const prevBtn         = lightbox.querySelector('.lightbox-prev');
    const nextBtn         = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      updateLightboxImage();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateLightboxImage() {
      lightboxImg.src    = photoFiles[currentIndex];
      lightboxImg.alt    = `Moda ECCI — Fotografía ${currentIndex + 1}`;
      lightboxCaption.textContent = `${'0' + (currentIndex + 1)}`
        .slice(-2) + ` / ${TOTAL_PHOTOS}`;
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + TOTAL_PHOTOS) % TOTAL_PHOTOS;
      updateLightboxImage();
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % TOTAL_PHOTOS;
      updateLightboxImage();
    }

    galleryGrid.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      openLightbox(Number(item.dataset.index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   showPrev();
      if (e.key === 'ArrowRight')  showNext();
    });
  }

  /* -----------------------------------------------------------
     5. GLOSARIO — Búsqueda en tiempo real
  ----------------------------------------------------------- */
  const glossSearch = document.getElementById('glossSearch');
  const glossTable  = document.getElementById('glossTable');

  if (glossSearch && glossTable) {
    glossSearch.addEventListener('input', () => {
      const query = glossSearch.value.toLowerCase().trim();
      const rows  = glossTable.querySelectorAll('tbody tr');

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  /* -----------------------------------------------------------
     6. SCROLL REVEAL
  ----------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

});
