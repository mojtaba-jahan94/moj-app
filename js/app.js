/**
 * Nexus Projects Hub - Main Client Application Logic
 * Interactive Canvas Starfield, Filtering, 3D Card Tilt, In-App Live Previewer,
 * Details Modals, and Stats Tracker.
 */

let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'featured';
let currentView = 'grid'; // 'grid' | 'list'
let activePreviewUrl = '';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize i18n
  window.setLanguage(window.getLanguage());

  // Initialize data manager
  await window.dataManager.init();

  // Initialize Canvas background
  initInteractiveCanvas();

  // Setup Event Listeners
  setupAppEventListeners();

  // Initial render
  renderAppHub();
});

function setupAppEventListeners() {
  // Language Switch Button
  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      window.toggleLanguage();
    });
  }

  // Live Search Input
  const searchInput = document.getElementById('hubSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('hidden', currentSearch === '');
      }
      renderAppHub();
    });

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSearch = '';
        clearSearchBtn.classList.add('hidden');
        renderAppHub();
        searchInput.focus();
      });
    }
  }

  // Admin Button Stealth Mode on Production / Vercel
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminParam = urlParams.has('admin');
  const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const adminBtn = document.getElementById('openAdminBtn');

  if (adminBtn && !isLocalHost && !isAdminParam) {
    adminBtn.style.display = 'none'; // Hidden from public visitors on production!
  }

  // Triple-Click Logo Easter Egg to Trigger Admin Panel
  let logoClicks = 0;
  let logoTimer = null;
  const brandLogo = document.querySelector('.brand-logo-img');
  if (brandLogo) {
    brandLogo.style.cursor = 'pointer';
    brandLogo.addEventListener('click', () => {
      logoClicks++;
      clearTimeout(logoTimer);
      if (logoClicks >= 3) {
        logoClicks = 0;
        if (adminBtn) adminBtn.style.display = 'inline-flex';
        document.getElementById('openAdminBtn')?.click();
      } else {
        logoTimer = setTimeout(() => { logoClicks = 0; }, 700);
      }
    });
  }

  // Keyboard shortcut: Ctrl+K to search, Ctrl+Shift+A to open Admin, Esc to close
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      if (adminBtn) adminBtn.style.display = 'inline-flex';
      document.getElementById('openAdminBtn')?.click();
      return;
    }

    if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Category Filter Pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-filter');
      renderAppHub();
    });
  });

  // Sort Dropdown
  const sortSelect = document.getElementById('hubSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderAppHub();
    });
  }

  // View Mode Toggles (Grid vs List)
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewListBtn = document.getElementById('viewListBtn');
  if (viewGridBtn && viewListBtn) {
    viewGridBtn.addEventListener('click', () => {
      currentView = 'grid';
      viewGridBtn.classList.add('active');
      viewListBtn.classList.remove('active');
      renderAppHub();
    });
    viewListBtn.addEventListener('click', () => {
      currentView = 'list';
      viewListBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      renderAppHub();
    });
  }

  // Device Preview Modal Controls
  setupPreviewModalControls();

  // App Details Modal Controls
  setupDetailsModalControls();
}

function setupPreviewModalControls() {
  const modal = document.getElementById('previewModal');
  const closeBtn = document.getElementById('closePreviewBtn');
  const reloadBtn = document.getElementById('reloadPreviewBtn');
  const externalBtn = document.getElementById('externalPreviewBtn');
  const iframe = document.getElementById('previewIframe');
  const frameWrapper = document.getElementById('previewFrameWrapper');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
      if (iframe) iframe.src = 'about:blank';
    });
  }

  if (reloadBtn && iframe) {
    reloadBtn.addEventListener('click', () => {
      iframe.src = activePreviewUrl;
      window.showToast('در حال بارگذاری مجدد / Reloading frame', 'info');
    });
  }

  if (externalBtn) {
    externalBtn.addEventListener('click', () => {
      if (activePreviewUrl) {
        window.open(activePreviewUrl, '_blank', 'noopener,noreferrer');
      }
    });
  }

  // Device Frame Viewport Resizers
  document.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const device = btn.getAttribute('data-device');

      if (frameWrapper) {
        frameWrapper.classList.remove('desktop', 'tablet', 'mobile');
        frameWrapper.classList.add(device);
      }
    });
  });

  // Close modal when clicking backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        if (iframe) iframe.src = 'about:blank';
      }
    });
  }
}

function setupDetailsModalControls() {
  const modal = document.getElementById('detailsModal');
  const closeBtn = document.getElementById('closeDetailsBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
    });
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  const iframe = document.getElementById('previewIframe');
  if (iframe) iframe.src = 'about:blank';
  window.isAdminOpen = false;
}

// Open In-App Device Preview Modal
function openLivePreview(appId) {
  const app = window.dataManager.getById(appId);
  if (!app || !app.url || app.url === '#') {
    window.showToast('آدرس پیش‌نمایش ثبت نشده است / No live URL configured', 'error');
    return;
  }

  const modal = document.getElementById('previewModal');
  const iframe = document.getElementById('previewIframe');
  const title = document.getElementById('previewModalTitle');
  const frameWrapper = document.getElementById('previewFrameWrapper');
  const isFa = window.getLanguage() === 'fa';

  activePreviewUrl = app.url;

  if (title) {
    title.textContent = `${window.t('livePreview')}: ${isFa ? app.title_fa : app.title_en}`;
  }

  if (frameWrapper) {
    frameWrapper.className = 'preview-frame-wrapper desktop';
  }
  document.querySelectorAll('.device-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-device') === 'desktop');
  });

  if (iframe) {
    iframe.src = app.url;
  }

  if (modal) {
    modal.classList.add('active');
  }
}

// Open App Details Modal
function openAppDetails(appId) {
  const app = window.dataManager.getById(appId);
  if (!app) return;

  const modal = document.getElementById('detailsModal');
  const isFa = window.getLanguage() === 'fa';
  const title = isFa ? app.title_fa : app.title_en;
  const desc = isFa ? app.desc_fa : app.desc_en;
  const longDesc = isFa ? (app.long_desc_fa || app.desc_fa) : (app.long_desc_en || app.desc_en);

  document.getElementById('detailsModalTitle').textContent = title;
  document.getElementById('detailsModalCategory').textContent = app.category;
  document.getElementById('detailsModalStatus').textContent = window.t('status' + capitalize(app.status));
  document.getElementById('detailsModalStatus').className = `status-indicator status-${app.status}`;
  document.getElementById('detailsModalCreated').textContent = app.createdAt || '-';
  document.getElementById('detailsModalDesc').textContent = longDesc;

  // Cover image / gradient
  const headerCover = document.getElementById('detailsModalCover');
  if (headerCover) {
    if (app.image && app.image.startsWith('linear-gradient')) {
      headerCover.style.background = app.image;
      headerCover.style.backgroundImage = 'none';
    } else {
      headerCover.style.backgroundImage = `url('${app.image || 'assets/logo.jpg'}')`;
      headerCover.style.background = 'transparent';
    }
  }

  // Tags
  const tagsContainer = document.getElementById('detailsModalTags');
  if (tagsContainer) {
    tagsContainer.innerHTML = (app.tags || []).map(tag => `<span class="tech-tag">${escapeHtml(tag)}</span>`).join('');
  }

  // Action Buttons
  const launchBtn = document.getElementById('detailsLaunchBtn');
  const githubBtn = document.getElementById('detailsGithubBtn');
  const copyBtn = document.getElementById('detailsCopyBtn');

  if (launchBtn) {
    launchBtn.href = app.url || '#';
    launchBtn.target = '_blank';
    launchBtn.style.display = app.url && app.url !== '#' ? 'inline-flex' : 'none';
  }

  if (githubBtn) {
    githubBtn.href = app.github || '#';
    githubBtn.target = '_blank';
    githubBtn.style.display = app.github ? 'inline-flex' : 'none';
  }

  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(app.url || window.location.href);
      window.showToast(window.t('copiedToast'), 'success');
    };
  }

  if (modal) modal.classList.add('active');
}

// Main Render Function for App Hub
function renderAppHub() {
  const container = document.getElementById('appsContainer');
  if (!container) return;

  const allApps = window.dataManager.getAll();
  const isFa = window.getLanguage() === 'fa';

  // 1. Filter
  let filtered = allApps.filter(app => {
    // Category filter
    if (currentFilter === 'favorites') {
      if (!window.dataManager.isFavorite(app.id)) return false;
    } else if (currentFilter !== 'all') {
      if (app.category !== currentFilter) return false;
    }

    // Search query
    if (currentSearch) {
      const matchTitleFa = (app.title_fa || '').toLowerCase().includes(currentSearch);
      const matchTitleEn = (app.title_en || '').toLowerCase().includes(currentSearch);
      const matchDescFa = (app.desc_fa || '').toLowerCase().includes(currentSearch);
      const matchDescEn = (app.desc_en || '').toLowerCase().includes(currentSearch);
      const matchCategory = (app.category || '').toLowerCase().includes(currentSearch);
      const matchTags = (app.tags || []).some(t => t.toLowerCase().includes(currentSearch));

      if (!matchTitleFa && !matchTitleEn && !matchDescFa && !matchDescEn && !matchCategory && !matchTags) {
        return false;
      }
    }

    return true;
  });

  // 2. Sort
  filtered.sort((a, b) => {
    if (currentSort === 'featured') {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    if (currentSort === 'newest') {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    if (currentSort === 'oldest') {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    }
    if (currentSort === 'title') {
      const titleA = isFa ? (a.title_fa || '') : (a.title_en || '');
      const titleB = isFa ? (b.title_fa || '') : (b.title_en || '');
      return titleA.localeCompare(titleB);
    }
    return 0;
  });

  // Update statistics
  updateHubStats(allApps);

  // Update Category Badge Counts
  updateFilterBadges(allApps);

  // Render cards or empty state
  if (filtered.length === 0) {
    container.className = 'apps-container empty';
    container.innerHTML = `
      <div class="empty-state-card glass-panel">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title" data-i18n="noAppsFound">${window.t('noAppsFound')}</h3>
        <p class="empty-desc" data-i18n="noAppsSuggestion">${window.t('noAppsSuggestion')}</p>
        <button class="btn btn-primary" onclick="window.openAdminModal()">
          <span>+</span> <span data-i18n="addNewQuick">${window.t('addNewQuick')}</span>
        </button>
      </div>
    `;
    return;
  }

  container.className = `apps-container ${currentView === 'list' ? 'list-layout' : 'grid-layout'}`;

  container.innerHTML = filtered.map(app => {
    const isFav = window.dataManager.isFavorite(app.id);
    const title = isFa ? app.title_fa : app.title_en;
    const desc = isFa ? app.desc_fa : app.desc_en;
    const isGradient = app.image && app.image.startsWith('linear-gradient');
    const imageStyle = isGradient ? `background: ${app.image};` : `background-image: url('${app.image || 'assets/logo.jpg'}');`;

    return `
      <article class="app-card glass-card ${app.featured ? 'featured' : ''}" data-id="${app.id}" onmousemove="handleCardTilt(event, this)" onmouseleave="resetCardTilt(this)">
        <div class="card-glow-overlay"></div>
        
        <div class="card-media-wrapper" style="${imageStyle}">
          <div class="card-media-overlay"></div>
          
          <div class="card-top-badges">
            <span class="status-indicator status-${app.status}">
              <span class="status-dot"></span>
              ${window.t('status' + capitalize(app.status))}
            </span>

            <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFav('${app.id}', event)" title="Favorite">
              ${isFav ? '★' : '☆'}
            </button>
          </div>

          ${app.featured ? `<div class="featured-ribbon">${window.t('featuredBadge')} ★</div>` : ''}
        </div>

        <div class="card-content">
          <div class="card-header-row">
            <span class="category-chip category-${app.category}">${app.category}</span>
            <span class="date-badge">${app.createdAt || ''}</span>
          </div>

          <h3 class="card-title" onclick="openAppDetails('${app.id}')">${escapeHtml(title)}</h3>
          <p class="card-desc">${escapeHtml(desc)}</p>

          <div class="card-tags">
            ${(app.tags || []).slice(0, 4).map(tag => `<span class="tech-tag">${escapeHtml(tag)}</span>`).join('')}
            ${(app.tags || []).length > 4 ? `<span class="tech-tag more">+${(app.tags || []).length - 4}</span>` : ''}
          </div>

          <div class="card-actions">
            <a href="${app.url || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary card-btn-launch">
              <span>🚀</span> ${window.t('launchApp')}
            </a>
            
            ${app.allowIframe !== false && app.url && app.url !== '#' ? `
              <button class="btn btn-secondary card-btn-preview" onclick="openLivePreview('${app.id}')" title="${window.t('livePreview')}">
                <span>👁️</span>
              </button>
            ` : ''}

            <button class="btn btn-icon card-btn-info" onclick="openAppDetails('${app.id}')" title="${window.t('details')}">
              <span>ℹ️</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function updateHubStats(apps) {
  const totalEl = document.getElementById('statTotalAppsCount');
  const activeEl = document.getElementById('statActiveAppsCount');
  const catEl = document.getElementById('statCategoriesCount');
  const favEl = document.getElementById('statFavoritesCount');

  if (totalEl) totalEl.textContent = apps.length;
  if (activeEl) activeEl.textContent = apps.filter(a => a.status === 'active').length;
  if (catEl) {
    const cats = new Set(apps.map(a => a.category));
    catEl.textContent = cats.size;
  }
  if (favEl) favEl.textContent = window.dataManager.getFavorites().length;
}

function updateFilterBadges(apps) {
  const favs = window.dataManager.getFavorites();

  const countFor = (cat) => {
    if (cat === 'all') return apps.length;
    if (cat === 'favorites') return favs.length;
    return apps.filter(a => a.category === cat).length;
  };

  document.querySelectorAll('.filter-pill').forEach(pill => {
    const filter = pill.getAttribute('data-filter');
    const badge = pill.querySelector('.filter-count');
    if (badge) {
      badge.textContent = countFor(filter);
    }
  });
}

function toggleFav(appId, event) {
  if (event) event.stopPropagation();
  window.dataManager.toggleFavorite(appId);
  renderAppHub();
}

// 3D Tilt Effect on mouse movement
function handleCardTilt(e, card) {
  if (currentView === 'list' || window.innerWidth < 768) return;

  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * -8;
  const rotateY = ((x - centerX) / centerX) * 8;

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

  const glow = card.querySelector('.card-glow-overlay');
  if (glow) {
    glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(124, 58, 237, 0.18), transparent 60%)`;
  }
}

function resetCardTilt(card) {
  card.style.transform = '';
  const glow = card.querySelector('.card-glow-overlay');
  if (glow) {
    glow.style.background = '';
  }
}

// Interactive Particle Background on HTML5 Canvas
function initInteractiveCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 120 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 20 + 5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.color = Math.random() > 0.6 ? 'rgba(124, 58, 237, 0.6)' : (Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.6)' : 'rgba(147, 197, 253, 0.4)');
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = (dx / distance) * force * this.density * 0.4;
          const directionY = (dy / distance) * force * this.density * 0.4;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }
  }

  const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 90);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 95) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - distance / 95)})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

function capitalize(str) {
  if (!str) return '';
  return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Global exports
window.renderAppHub = renderAppHub;
window.openLivePreview = openLivePreview;
window.openAppDetails = openAppDetails;
window.toggleFav = toggleFav;
window.handleCardTilt = handleCardTilt;
window.resetCardTilt = resetCardTilt;
