/**
 * My Apps (پروژه‌های من) - Standalone Admin Portal Controller
 * Full Session Authentication (JWT + HttpOnly Cookie),
 * Dynamic Auth Gate, CRUD Operations, Auto-Screenshot Cover Generator.
 */

// Automatic Homepage Screenshot Generator Helper (Microlink API with Thum.io fallback)
function getAutoScreenshotUrl(url) {
  if (!url || typeof url !== 'string' || !url.trim().startsWith('http')) return '';
  return `https://api.microlink.io/?url=${encodeURIComponent(url.trim())}&screenshot=true&meta=false&embed=screenshot.url`;
}

function getFallbackScreenshotUrl(url) {
  if (!url || typeof url !== 'string' || !url.trim().startsWith('http')) return '';
  return `https://image.thum.io/get/width/800/crop/600/${encodeURIComponent(url.trim())}`;
}

window.isAdminAuthenticated = false;
let editingAppId = null;
let currentUploadedImageBase64 = '';
let currentSearchQuery = '';
let currentCategoryFilter = 'all';
let currentSortOrder = 'newest';

// Preset Gradients for Quick App Covers (Nordic & Warm Wood Harmony)
const PRESET_GRADIENTS = [
  { name: 'Warm Wood & Cream', value: 'linear-gradient(135deg, #A68A64 0%, #C4AE8F 50%, #F7F7F2 100%)' },
  { name: 'Nordic Charcoal', value: 'linear-gradient(135deg, #1F2933 0%, #323F4B 50%, #52606D 100%)' },
  { name: 'Fjord Slate', value: 'linear-gradient(135deg, #3E4C59 0%, #616E7C 50%, #9AA5B1 100%)' },
  { name: 'Amber Timber', value: 'linear-gradient(135deg, #8A6D47 0%, #A68A64 50%, #D4AF7A 100%)' },
  { name: 'Birch & Stone', value: 'linear-gradient(135deg, #25313D 0%, #475569 50%, #A68A64 100%)' },
  { name: 'Arctic Dawn', value: 'linear-gradient(135deg, #1F2933 0%, #6B7280 50%, #D1D5DB 100%)' }
];

// Quick suggestions for tech tags
const POPULAR_TAGS = ['React', 'Next.js', 'Vue 3', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 'Tailwind', 'Docker', 'SQLite', 'Turso', 'AI API'];

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initBackgroundCanvas();
  setupLanguageHandler();
  setupThemeHandler();
  setupLoginForm();
  setupDashboardControls();

  // Run Auth Verification Gate on startup
  await verifySession();
});

// ============================================================================
// 1. AUTHENTICATION GATE & SESSION VERIFICATION
// ============================================================================

async function verifySession() {
  const gateLoader = document.getElementById('authGateLoader');
  const loginSection = document.getElementById('loginSection');
  const dashboard = document.getElementById('dashboardWorkspace');
  const token = sessionStorage.getItem('my_apps_admin_jwt') || sessionStorage.getItem('nexus_admin_jwt') || '';

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/auth?action=verify', {
      method: 'GET',
      credentials: 'same-origin',
      headers
    });

    if (res.ok) {
      const data = await res.json();
      if (data.authenticated) {
        showDashboardView(data.user);
        return;
      }
    }
  } catch (err) {
    console.warn('Session verification check failed:', err);
  }

  // Not authenticated: Show ONLY the login screen
  showLoginView();
}

function showLoginView() {
  window.isAdminAuthenticated = false;
  const gateLoader = document.getElementById('authGateLoader');
  const loginSection = document.getElementById('loginSection');
  const dashboard = document.getElementById('dashboardWorkspace');

  if (gateLoader) gateLoader.style.display = 'none';
  if (dashboard) dashboard.style.display = 'none';
  if (loginSection) {
    loginSection.style.display = 'flex';
    const userInput = document.getElementById('loginUsername');
    if (userInput) userInput.focus();
  }
}

function showDashboardView(user) {
  window.isAdminAuthenticated = true;
  const gateLoader = document.getElementById('authGateLoader');
  const loginSection = document.getElementById('loginSection');
  const dashboard = document.getElementById('dashboardWorkspace');
  const activeUserEl = document.getElementById('activeUsername');

  if (gateLoader) gateLoader.style.display = 'none';
  if (loginSection) loginSection.style.display = 'none';
  if (dashboard) dashboard.style.display = 'block';

  if (activeUserEl && user && user.username) {
    activeUserEl.textContent = user.username;
  }

  // Initialize and populate dashboard data
  initDashboardData();
}

function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginSubmitBtn');
  const loginError = document.getElementById('loginError');
  const loginErrorText = document.getElementById('loginErrorText');

  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) return;

    // Loading state
    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.innerHTML = `<span>⏳</span> <span>${window.getLanguage() === 'fa' ? 'در حال بررسی...' : 'Authenticating...'}</span>`;
    }
    if (loginError) loginError.classList.add('hidden');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Save token to session storage
        if (data.token) {
          sessionStorage.setItem('my_apps_admin_jwt', data.token);
        }
        showToast(window.getLanguage() === 'fa' ? 'ورود با موفقیت انجام شد ✨' : 'Welcome back, Admin!', 'success');
        showDashboardView(data.user);
      } else {
        if (loginError) {
          loginError.classList.remove('hidden');
          if (loginErrorText) {
            loginErrorText.textContent = data.error || (window.getLanguage() === 'fa' ? 'نام کاربری یا رمز عبور اشتباه است' : 'Invalid credentials');
          }
        }
      }
    } catch (err) {
      if (loginError) {
        loginError.classList.remove('hidden');
        if (loginErrorText) {
          loginErrorText.textContent = 'خطای اتصال به سرور: ' + err.message;
        }
      }
    } finally {
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.innerHTML = `<span>⚡</span> <span data-i18n="adminLoginBtn">${window.t('adminLoginBtn')}</span>`;
      }
    }
  });
}

async function handleLogout() {
  try {
    await fetch('/api/auth?action=logout', {
      method: 'POST',
      credentials: 'same-origin'
    });
  } catch (err) {
    console.warn('Logout API failed:', err);
  }

  sessionStorage.removeItem('my_apps_admin_jwt');
  sessionStorage.removeItem('nexus_admin_jwt');
  localStorage.removeItem('my_apps_admin_jwt');
  localStorage.removeItem('nexus_admin_jwt');
  showToast(window.getLanguage() === 'fa' ? 'از حساب کاربری خارج شدید' : 'Logged out', 'info');
  showLoginView();
}

// ============================================================================
// 2. DASHBOARD DATA & CRUD OPERATIONS
// ============================================================================

async function initDashboardData() {
  renderPresetGradients();
  renderPopularTagSuggestions();

  if (window.dataManager) {
    await window.dataManager.init();
    renderAdminList();
    updateAdminStats();
    window.dataManager.updateServerStatusBadge();
  }
}

function setupDashboardControls() {
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Admin Tab Navigation
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchAdminTab(targetTab);
    });
  });

  // Search input filter
  const searchInput = document.getElementById('adminSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      renderAdminList();
    });
  }

  // Category select filter
  const categoryFilter = document.getElementById('adminCategoryFilter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      currentCategoryFilter = e.target.value;
      renderAdminList();
    });
  }

  // Sort select filter
  const sortFilter = document.getElementById('adminSortFilter');
  if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
      currentSortOrder = e.target.value;
      renderAdminList();
    });
  }

  // App Form submission
  const adminAppForm = document.getElementById('adminAppForm');
  if (adminAppForm) {
    adminAppForm.addEventListener('submit', handleAppFormSubmit);
  }

  // Cancel edit button
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', resetAppForm);
  }

  // Image file input handler (Convert to Base64)
  const imageFileInput = document.getElementById('imageFileInput');
  const customImageUrlInput = document.getElementById('appImageUrl');
  const appUrlInput = document.getElementById('appUrl');
  const autoScreenshotBtn = document.getElementById('autoScreenshotBtn');

  const triggerAutoScreenshot = (showNotification = false) => {
    const val = (appUrlInput?.value || '').trim();
    if (!val || !val.startsWith('http')) {
      if (showNotification) {
        showToast(window.getLanguage() === 'fa' ? 'لطفاً ابتدا یک آدرس اینترنتی معتبر (با https://) وارد نمایید' : 'Please enter a valid URL (starting with https://)', 'error');
      }
      return;
    }
    const screenshotUrl = getAutoScreenshotUrl(val);
    if (screenshotUrl) {
      currentUploadedImageBase64 = '';
      if (customImageUrlInput) {
        customImageUrlInput.value = screenshotUrl;
      }
      updateImagePreview(screenshotUrl);
      if (showNotification) {
        showToast(window.getLanguage() === 'fa' ? 'اسکرین‌شات از آدرس سایت دریافت شد ✨' : 'Screenshot generated from URL ✨', 'success');
      }
    }
  };

  if (autoScreenshotBtn) {
    autoScreenshotBtn.addEventListener('click', () => triggerAutoScreenshot(true));
  }

  if (appUrlInput) {
    appUrlInput.addEventListener('blur', () => {
      if (!currentUploadedImageBase64 && (!customImageUrlInput.value || customImageUrlInput.value.includes('microlink.io') || customImageUrlInput.value.includes('thum.io'))) {
        triggerAutoScreenshot(false);
      }
    });
  }

  if (imageFileInput) {
    imageFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('لطفاً یک فایل تصویری معتبر انتخاب کنید', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('حجم فایل تصویر بیش از ۵ مگابایت است!', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        currentUploadedImageBase64 = event.target.result;
        updateImagePreview(currentUploadedImageBase64);
        if (customImageUrlInput) customImageUrlInput.value = '';
      };
      reader.readAsDataURL(file);
    });
  }

  if (customImageUrlInput) {
    customImageUrlInput.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      if (url) {
        currentUploadedImageBase64 = '';
        updateImagePreview(url);
      }
    });
  }

  // JSON Export
  const exportBtn = document.getElementById('exportJsonBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (window.dataManager) {
        window.dataManager.exportJsonFile();
        showToast('فایل پشتیبان دانلود شد / Backup downloaded', 'success');
      }
    });
  }

  // JSON Import
  const importInput = document.getElementById('importJsonInput');
  if (importInput) {
    importInput.addEventListener('change', handleImportJson);
  }

  // Reset to Defaults
  const resetBtn = document.getElementById('resetDefaultsBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      if (confirm(window.t('confirmReset'))) {
        await window.dataManager.resetToDefaults();
        renderAdminList();
        updateAdminStats();
        showToast('نمونه‌های پیش‌فرض بازنشانی شدند / Restored default projects', 'success');
      }
    });
  }
}

function switchAdminTab(tabId) {
  document.querySelectorAll('.admin-tab-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.admin-tab-content').forEach(c => {
    c.classList.toggle('active', c.id === `tabContent_${tabId}`);
  });

  if (tabId === 'manageApps') {
    renderAdminList();
    updateAdminStats();
  }
}

function updateAdminStats() {
  if (!window.dataManager) return;
  const apps = window.dataManager.getAll();

  const totalEl = document.getElementById('statTotalApps');
  const activeEl = document.getElementById('statActiveApps');
  const featuredEl = document.getElementById('statFeaturedApps');
  const categoriesEl = document.getElementById('statCategoriesCount');

  if (totalEl) totalEl.textContent = apps.length;
  if (activeEl) activeEl.textContent = apps.filter(a => a.status === 'active').length;
  if (featuredEl) featuredEl.textContent = apps.filter(a => a.featured).length;

  const uniqueCategories = new Set(apps.map(a => a.category).filter(Boolean));
  if (categoriesEl) categoriesEl.textContent = uniqueCategories.size || 4;
}

function renderAdminList() {
  const container = document.getElementById('adminAppsTableBody');
  const countBadge = document.getElementById('adminAppsCount');
  if (!container || !window.dataManager) return;

  let apps = [...window.dataManager.getAll()];
  if (countBadge) countBadge.textContent = apps.length;

  // Filter by category
  if (currentCategoryFilter !== 'all') {
    apps = apps.filter(a => a.category === currentCategoryFilter);
  }

  // Filter by search query
  if (currentSearchQuery) {
    apps = apps.filter(app => {
      const fa = (app.title_fa || '') + ' ' + (app.desc_fa || '');
      const en = (app.title_en || '') + ' ' + (app.desc_en || '');
      const tags = Array.isArray(app.tags) ? app.tags.join(' ') : '';
      const url = app.url || '';
      const haystack = (fa + ' ' + en + ' ' + tags + ' ' + url).toLowerCase();
      return haystack.includes(currentSearchQuery);
    });
  }

  // Sort apps
  if (currentSortOrder === 'featured') {
    apps.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  } else if (currentSortOrder === 'title') {
    apps.sort((a, b) => (a.title_fa || a.title_en || '').localeCompare(b.title_fa || b.title_en || ''));
  } else {
    // Newest first by default
    apps.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  if (apps.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="5" class="table-empty" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
          🔍 ${window.t('adminEmptyList')}
        </td>
      </tr>
    `;
    return;
  }

  const isFa = window.getLanguage() === 'fa';

  container.innerHTML = apps.map(app => {
    const title = isFa ? app.title_fa : (app.title_en || app.title_fa);
    const isGradient = app.image && app.image.startsWith('linear-gradient');
    const thumbStyle = isGradient ? `background: ${app.image};` : `background-image: url('${app.image || 'assets/logo.jpg'}');`;

    return `
      <tr class="admin-table-row" data-id="${app.id}">
        <td class="col-thumb">
          <div class="table-thumb" style="${thumbStyle}"></div>
        </td>
        <td class="col-title">
          <div class="table-item-title">${escapeHtml(title)}</div>
          <div class="table-item-url">
            <a href="${escapeHtml(app.url || '#')}" target="_blank" style="color: var(--warm-wood); text-decoration: none;">
              ${escapeHtml(app.url || '')} ↗
            </a>
          </div>
        </td>
        <td class="col-cat">
          <span class="category-chip category-${app.category}">${app.category}</span>
          ${app.featured ? `<span class="featured-indicator" title="پروژه ویژه">★</span>` : ''}
        </td>
        <td class="col-status">
          <span class="status-indicator status-${app.status}">${window.t('status' + capitalize(app.status))}</span>
        </td>
        <td class="col-actions">
          <button class="btn-action edit" onclick="startEditApp('${app.id}')" title="${window.t('btnEdit')}">
            ✏️
          </button>
          <button class="btn-action duplicate" onclick="duplicateApp('${app.id}')" title="${window.t('btnDuplicate')}">
            📋
          </button>
          <button class="btn-action delete" onclick="confirmDeleteApp('${app.id}')" title="${window.t('btnDelete')}">
            🗑️
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ============================================================================
// 3. APP FORM (CREATE & EDIT)
// ============================================================================

async function handleAppFormSubmit(e) {
  e.preventDefault();

  const titleFa = document.getElementById('appTitleFa').value.trim();
  const titleEn = document.getElementById('appTitleEn').value.trim();
  const descFa = document.getElementById('appDescFa').value.trim();
  const descEn = document.getElementById('appDescEn').value.trim();
  const longDescFa = document.getElementById('appLongDescFa').value.trim();
  const longDescEn = document.getElementById('appLongDescEn').value.trim();
  const category = document.getElementById('appCategory').value;
  const url = document.getElementById('appUrl').value.trim();
  const github = document.getElementById('appGithub').value.trim();
  const tagsRaw = document.getElementById('appTags').value.trim();
  const status = document.getElementById('appStatus').value;
  const customImageUrl = document.getElementById('appImageUrl').value.trim();
  const featured = document.getElementById('appFeatured').checked;
  const allowIframe = document.getElementById('appAllowIframe').checked;

  if (!titleFa && !titleEn) {
    showToast('لطفاً عنوان برنامه را به فارسی یا انگلیسی وارد نمایید', 'error');
    return;
  }

  let image = '';
  if (currentUploadedImageBase64) {
    image = currentUploadedImageBase64;
  } else if (customImageUrl) {
    image = customImageUrl;
  } else if (url && url.startsWith('http')) {
    image = getAutoScreenshotUrl(url);
  } else {
    image = 'linear-gradient(135deg, #1F2933 0%, #323F4B 50%, #A68A64 100%)';
  }

  const tags = tagsRaw ? tagsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

  const appData = {
    id: editingAppId || undefined,
    title_fa: titleFa || titleEn,
    title_en: titleEn || titleFa,
    desc_fa: descFa || descEn,
    desc_en: descEn || descFa,
    long_desc_fa: longDescFa || descFa,
    long_desc_en: longDescEn || descEn,
    category,
    tags,
    url: url || '#',
    github: github || '',
    image,
    status,
    featured,
    allowIframe,
    createdAt: editingAppId ? (window.dataManager.getById(editingAppId)?.createdAt || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]
  };

  try {
    await window.dataManager.saveApp(appData);
    showToast(editingAppId ? window.t('savedSuccess') : 'پروژه جدید با موفقیت ثبت شد! 🎉', 'success');

    resetAppForm();
    renderAdminList();
    updateAdminStats();
    switchAdminTab('manageApps');
  } catch (err) {
    showToast('خطا در ذخیره برنامه: ' + err.message, 'error');
  }
}

function startEditApp(appId) {
  const app = window.dataManager.getById(appId);
  if (!app) return;

  editingAppId = appId;

  document.getElementById('appTitleFa').value = app.title_fa || '';
  document.getElementById('appTitleEn').value = app.title_en || '';
  document.getElementById('appDescFa').value = app.desc_fa || '';
  document.getElementById('appDescEn').value = app.desc_en || '';
  document.getElementById('appLongDescFa').value = app.long_desc_fa || '';
  document.getElementById('appLongDescEn').value = app.long_desc_en || '';
  document.getElementById('appCategory').value = app.category || 'web';
  document.getElementById('appUrl').value = app.url || '';
  document.getElementById('appGithub').value = app.github || '';
  document.getElementById('appTags').value = (app.tags || []).join(', ');
  document.getElementById('appStatus').value = app.status || 'active';
  document.getElementById('appFeatured').checked = !!app.featured;
  document.getElementById('appAllowIframe').checked = app.allowIframe !== false;

  currentUploadedImageBase64 = app.image || '';
  document.getElementById('appImageUrl').value = (app.image && !app.image.startsWith('data:') && !app.image.startsWith('linear-gradient')) ? app.image : '';
  updateImagePreview(app.image);

  const submitBtn = document.getElementById('saveAppBtn');
  const cancelBtn = document.getElementById('cancelEditBtn');
  const formTitle = document.getElementById('formModeTitle');

  if (submitBtn) submitBtn.innerHTML = `<span>💾</span> ${window.t('btnUpdateApp')}`;
  if (cancelBtn) cancelBtn.classList.remove('hidden');
  if (formTitle) formTitle.textContent = `${window.t('btnEdit')}: ${window.getLanguage() === 'fa' ? app.title_fa : app.title_en}`;

  switchAdminTab('addApp');
}

function resetAppForm() {
  editingAppId = null;
  const form = document.getElementById('adminAppForm');
  if (form) form.reset();

  currentUploadedImageBase64 = '';
  updateImagePreview('');

  const submitBtn = document.getElementById('saveAppBtn');
  const cancelBtn = document.getElementById('cancelEditBtn');
  const formTitle = document.getElementById('formModeTitle');

  if (submitBtn) submitBtn.innerHTML = `<span>✨</span> <span data-i18n="btnSaveApp">${window.t('btnSaveApp')}</span>`;
  if (cancelBtn) cancelBtn.classList.add('hidden');
  if (formTitle) formTitle.textContent = window.t('tabAddApp');
}

async function duplicateApp(appId) {
  const original = window.dataManager.getById(appId);
  if (!original) return;

  const copy = JSON.parse(JSON.stringify(original));
  copy.id = undefined;
  copy.title_fa = copy.title_fa + ' (کپی)';
  copy.title_en = copy.title_en + ' (Copy)';
  copy.createdAt = new Date().toISOString().split('T')[0];

  try {
    await window.dataManager.saveApp(copy);
    renderAdminList();
    updateAdminStats();
    showToast('پروژه تکثیر شد / Project duplicated', 'success');
  } catch (err) {
    showToast('خطا در تکثیر: ' + err.message, 'error');
  }
}

async function confirmDeleteApp(appId) {
  if (confirm(window.t('confirmDelete'))) {
    try {
      await window.dataManager.deleteApp(appId);
      renderAdminList();
      updateAdminStats();
      showToast(window.t('deletedSuccess'), 'info');
    } catch (err) {
      showToast('خطا در حذف پروژه: ' + err.message, 'error');
    }
  }
}

async function handleImportJson(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      const apps = Array.isArray(parsed) ? parsed : (parsed.apps || []);
      if (!Array.isArray(apps) || apps.length === 0) {
        throw new Error('فرمت فایل JSON نامعتبر است');
      }

      await window.dataManager.importApps(apps);
      renderAdminList();
      updateAdminStats();
      showToast(`موفقیت: ${apps.length} برنامه بازیابی شد!`, 'success');
      e.target.value = '';
    } catch (err) {
      showToast('خطا در بارگذاری فایل: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

// ============================================================================
// 4. IMAGE HANDLING & PRESETS
// ============================================================================

function renderPresetGradients() {
  const container = document.getElementById('presetGradientsContainer');
  if (!container) return;

  container.innerHTML = '';
  PRESET_GRADIENTS.forEach(preset => {
    const chip = document.createElement('div');
    chip.className = 'gradient-preset-chip';
    chip.title = preset.name;
    chip.style.background = preset.value;
    chip.addEventListener('click', () => {
      currentUploadedImageBase64 = preset.value;
      const customUrl = document.getElementById('appImageUrl');
      if (customUrl) customUrl.value = '';
      updateImagePreview(preset.value);
    });
    container.appendChild(chip);
  });
}

function renderPopularTagSuggestions() {
  const container = document.getElementById('popularTagsContainer');
  const tagsInput = document.getElementById('appTags');
  if (!container || !tagsInput) return;

  container.innerHTML = '';
  POPULAR_TAGS.forEach(tag => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'tag-suggestion-pill';
    pill.textContent = '+ ' + tag;
    pill.addEventListener('click', () => {
      let currentVal = tagsInput.value.trim();
      let tags = currentVal ? currentVal.split(',').map(t => t.trim()) : [];
      if (!tags.includes(tag)) {
        tags.push(tag);
        tagsInput.value = tags.join(', ');
      }
    });
    container.appendChild(pill);
  });
}

function updateImagePreview(imageSrc) {
  const previewBox = document.getElementById('imagePreviewBox');
  if (!previewBox) return;

  if (!imageSrc) {
    previewBox.innerHTML = `<span class="preview-placeholder">پیش‌نمایش تصویر در اینجا ظاهر می‌شود / Image preview</span>`;
    previewBox.style.background = 'transparent';
    return;
  }

  if (imageSrc.startsWith('linear-gradient')) {
    previewBox.innerHTML = `<span class="gradient-preview-label">Gradient Preset Selected</span>`;
    previewBox.style.background = imageSrc;
  } else {
    const appUrlVal = document.getElementById('appUrl')?.value?.trim() || '';
    previewBox.innerHTML = `<img src="${imageSrc}" alt="Preview" class="cover-preview-img" onerror="if(!this.dataset.fallback && '${escapeHtml(appUrlVal)}'){this.dataset.fallback='true';this.src='https://image.thum.io/get/width/800/crop/600/' + encodeURIComponent('${escapeHtml(appUrlVal)}');}else{this.onerror=null;this.src='assets/logo.svg';}" />`;
    previewBox.style.background = 'transparent';
  }
}

// ============================================================================
// 5. UTILITIES (TOASTS, BACKGROUND, LANGUAGE)
// ============================================================================

function initTheme() {
  const saved = localStorage.getItem('my_apps_theme') || localStorage.getItem('nexus_hub_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcons(saved);
}

function setupThemeHandler() {
  const toggleButtons = [
    document.getElementById('themeToggleBtn'),
    document.getElementById('loginThemeToggleBtn')
  ];

  toggleButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('my_apps_theme', next);
        updateThemeIcons(next);
      });
    }
  });
}

function updateThemeIcons(theme) {
  document.querySelectorAll('.theme-btn .theme-icon').forEach(icon => {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}

function setupLanguageHandler() {
  const langToggleBtn = document.getElementById('langToggleBtn');
  const loginLangBtn = document.getElementById('loginLangToggleBtn');

  const onToggle = () => {
    window.toggleLanguage();
    if (window.isAdminAuthenticated) {
      renderAdminList();
    }
  };

  if (langToggleBtn) langToggleBtn.addEventListener('click', onToggle);
  if (loginLangBtn) loginLangBtn.addEventListener('click', onToggle);
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type} animate-slide-in`;
  toast.innerHTML = `
    <div class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</div>
    <div class="toast-text">${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
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

function initBackgroundCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = Math.floor((width * height) / 18000);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 0.6,
      isWarm: Math.random() > 0.65
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      if (p.isWarm) {
        ctx.fillStyle = isDark ? 'rgba(166, 138, 100, 0.45)' : 'rgba(166, 138, 100, 0.35)';
      } else {
        ctx.fillStyle = isDark ? 'rgba(209, 213, 219, 0.25)' : 'rgba(107, 114, 128, 0.25)';
      }
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// Global functions for inline HTML handlers
window.startEditApp = startEditApp;
window.duplicateApp = duplicateApp;
window.confirmDeleteApp = confirmDeleteApp;
window.switchAdminTab = switchAdminTab;
window.showToast = showToast;
window.renderAdminList = renderAdminList;
