// ----------------- Utilities -----------------
document.addEventListener('DOMContentLoaded', function () {
  // set year in footers
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  const el2 = document.getElementById('year2');
  if (el) el.textContent = y;
  if (el2) el2.textContent = y;

  // mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', (!expanded).toString());
      navLinks.style.display = expanded ? '' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.gap = '8px';
      navLinks.style.alignItems = 'flex-start';
    });
  }

  // smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ----------------- Scroll reveal (IntersectionObserver) -----------------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { root: null, threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ----------------- GLightbox init -----------------
  try {
    const lightbox = GLightbox({ selector: '.glightbox', touchNavigation: true });
  } catch (e) {
    // GLightbox not loaded or error
    console.warn('GLightbox init failed', e);
  }

  // ----------------- Fan form submission (AJAX friendly) -----------------
  const form = document.getElementById('fanForm');
  const formMessage = document.getElementById('formMessage');
  if (form) {
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      formMessage.textContent = 'Sending…';
      const data = new FormData(form);

      // NOTE: replace action in index.html with your Formspree endpoint if needed
      const action = form.getAttribute('action') || '/';
      try {
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });
        if (res.ok) {
          formMessage.textContent = 'Thanks! Your submission was received and will be reviewed.';
          form.reset();
        } else {
          const json = await res.json();
          formMessage.textContent = (json && json.error) ? json.error : 'Submission failed — try again later.';
        }
      } catch (err) {
        formMessage.textContent = 'Network error — please try again later.';
        console.error(err);
      }

      // fade message
      setTimeout(() => { formMessage.textContent = ''; }, 7000);
    });
  }
});

// ----------------- Dynamic Paginated Video Gallery -----------------
const videoGrid = document.getElementById('videoGrid');
const pagination = document.getElementById('pagination');

if (videoGrid && pagination) {
  // --- Your full video list ---
  const videos = [
    { title: "Official Music Video", type: "youtube", src: "https://www.youtube.com/watch?v=abcd1234", thumb: "images/video-thumb-1.jpg" },
    { title: "Behind the Scenes", type: "youtube", src: "https://www.youtube.com/watch?v=efgh5678", thumb: "images/video-thumb-2.jpg" },
    { title: "Fan Edit Compilation", type: "mp4", src: "videos/aditi1.mp4", thumb: "images/video-thumb-3.jpg" },
    { title: "Interview 2025", type: "youtube", src: "https://www.youtube.com/watch?v=ijkl9012", thumb: "images/video-thumb-4.jpg" },
    { title: "Magazine Shoot", type: "youtube", src: "https://www.youtube.com/watch?v=mnop3456", thumb: "images/video-thumb-5.jpg" },
    { title: "Exclusive Photoshoot", type: "youtube", src: "https://www.youtube.com/watch?v=qrst7890", thumb: "images/video-thumb-6.jpg" },
    { title: "Nepali Song Clip", type: "youtube", src: "https://www.youtube.com/watch?v=uvwxy123", thumb: "images/video-thumb-7.jpg" },
    { title: "Fan Tribute", type: "mp4", src: "videos/fanedit.mp4", thumb: "images/video-thumb-8.jpg" },
    { title: "Aditi’s Short Film", type: "youtube", src: "https://www.youtube.com/watch?v=zabcd987", thumb: "images/video-thumb-9.jpg" },
    { title: "BTS Moments", type: "youtube", src: "https://www.youtube.com/watch?v=xyz654321", thumb: "images/video-thumb-10.jpg" },
  ];

  const videosPerPage = 6;
  let currentPage = 1;
  const totalPages = Math.ceil(videos.length / videosPerPage);
  const maxVisiblePages = 4;

  function renderVideos() {
    videoGrid.innerHTML = '';
    const start = (currentPage - 1) * videosPerPage;
    const end = start + videosPerPage;
    const currentVideos = videos.slice(start, end);

    currentVideos.forEach(video => {
      const link = document.createElement('a');
      link.className = 'glightbox video-card reveal';
      link.href = video.src;
      link.setAttribute('data-gallery', 'aditi-videos');
      link.setAttribute('data-type', 'video');
      link.setAttribute('data-title', video.title);

      link.innerHTML = `
        <img src="${video.thumb}" alt="${video.title}">
        <div class="video-overlay"><span class="play-icon">▶</span></div>
      `;

      videoGrid.appendChild(link);
    });

    try { GLightbox({ selector: '.glightbox' }); } catch (err) {}
  }

  function renderPagination() {
    pagination.innerHTML = '';

    const prev = document.createElement('button');
    prev.textContent = 'Prev';
    prev.className = 'page-btn';
    if (currentPage === 1) prev.classList.add('disabled');
    prev.onclick = () => { if (currentPage > 1) { currentPage--; updateGallery(); } };
    pagination.appendChild(prev);

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = 'page-btn';
      if (i === currentPage) btn.classList.add('active');
      btn.onclick = () => { currentPage = i; updateGallery(); };
      pagination.appendChild(btn);
    }

    const next = document.createElement('button');
    next.textContent = 'Next';
    next.className = 'page-btn';
    if (currentPage === totalPages) next.classList.add('disabled');
    next.onclick = () => { if (currentPage < totalPages) { currentPage++; updateGallery(); } };
    pagination.appendChild(next);
  }

  function updateGallery() {
    renderVideos();
    renderPagination();
    window.scrollTo({ top: videoGrid.offsetTop - 100, behavior: 'smooth' });
  }

  // Initial render
  updateGallery();
}
// ----------------- Dynamic Paginated Image Gallery -----------------
// ----------------- Fully Automatic Image Gallery with Pagination -----------------
const galleryGrid = document.getElementById('galleryGrid');
const galleryPagination = document.getElementById('galleryPagination');

if (galleryGrid && galleryPagination) {
  const username = "imperial2997-wq";  // 👈 your GitHub username
  const repo = "Fansite-";             // 👈 your repository name
  const path = "images";               // 👈 folder name where your images are
  const imagesPerPage = 9;
  let currentGalleryPage = 1;
  const maxVisiblePages = 4;

  async function fetchImages() {
    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`);
      const files = await response.json();
      const imageFiles = files
        .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
        .map(file => file.name);
      renderGallery(imageFiles);
      renderGalleryPagination(imageFiles);
    } catch (error) {
      console.error("Error loading images:", error);
      galleryGrid.innerHTML = "<p style='text-align:center;'>⚠️ Unable to load gallery images.</p>";
    }
  }

  function renderGallery(imageFiles) {
    galleryGrid.innerHTML = '';
    const totalPages = Math.ceil(imageFiles.length / imagesPerPage);
    const start = (currentGalleryPage - 1) * imagesPerPage;
    const end = start + imagesPerPage;
    const currentImages = imageFiles.slice(start, end);

    currentImages.forEach(img => {
      const link = document.createElement('a');
      link.href = `images/${img}`;
      link.className = 'glightbox reveal';
      link.setAttribute('data-gallery', 'aditi-gallery');
      link.innerHTML = `<img src="images/${img}" alt="Aditi Budhathoki gallery image" />`;
      galleryGrid.appendChild(link);
    });

    try { GLightbox({ selector: '.glightbox' }); } catch (err) {}
  }

  function renderGalleryPagination(imageFiles) {
    galleryPagination.innerHTML = '';
    const totalPages = Math.ceil(imageFiles.length / imagesPerPage);

    const prev = document.createElement('button');
    prev.textContent = 'Prev';
    prev.className = 'page-btn';
    if (currentGalleryPage === 1) prev.classList.add('disabled');
    prev.onclick = () => { if (currentGalleryPage > 1) { currentGalleryPage--; updateGallery(imageFiles); } };
    galleryPagination.appendChild(prev);

    let startPage = Math.max(1, currentGalleryPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = 'page-btn';
      if (i === currentGalleryPage) btn.classList.add('active');
      btn.onclick = () => { currentGalleryPage = i; updateGallery(imageFiles); };
      galleryPagination.appendChild(btn);
    }

    const next = document.createElement('button');
    next.textContent = 'Next';
    next.className = 'page-btn';
    if (currentGalleryPage === totalPages) next.classList.add('disabled');
    next.onclick = () => { if (currentGalleryPage < totalPages) { currentGalleryPage++; updateGallery(imageFiles); } };
    galleryPagination.appendChild(next);
  }

  function updateGallery(imageFiles) {
    renderGallery(imageFiles);
    renderGalleryPagination(imageFiles);
    window.scrollTo({ top: galleryGrid.offsetTop - 100, behavior: 'smooth' });
  }

  // Start
  fetchImages();
}
