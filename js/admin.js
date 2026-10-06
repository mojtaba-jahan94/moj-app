/**
 * Admin Panel Controller for Nexus Projects Hub
 * Handles Authentication, App CRUD, Image Conversions, Presets, and Data Import/Export.
 */

window.isAdminOpen = false;
let editingAppId = null;
let currentUploadedImageBase64 = '';

// Preset Gradients for Quick App Covers
const PRESET_GRADIENTS = [
  { name: 'Cyber Violet', value: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)' },
  { name: 'Neon Emerald', value: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #06b6d4 100%)' },
  { name: 'Ocean Cyan', value: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 50%, #3b82f6 100%)' },
  { name: 'Solar Flare', value: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #e11d48 100%)' },
  { name: 'Dark Nebula', value: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' },
  { name: 'Matrix Glass', value: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)' }
];

// Quick suggestions for tech tags
const POPULAR_TAGS = ['React', 'Next.js', 'Vue 3', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 'Tailwind', 'Docker', 'SQLite', 'MongoDB', 'AI API'];

document.addEventListener('DOMContentLoaded', () => {
  setupAdminEventListeners();
  renderPresetGradients();
  renderPopularTagSuggestions();
});

function setupAdminEventListeners() {
  const adminBtn = document.getElementById('openAdminBtn');
  const adminModal = document.getElementById('adminModal');
  const closeAdminBtn = document.getElementById('closeAdminBtn');
  const authPinModal = document.getElementById('authPinModal');
  const closePinModal = document.getElementById('closePinModal');
  const pinForm = document.getElementById('pinForm');
  const pinInput = document.getElementById('pinInput');
  const adminAppForm = document.getElementById('adminAppForm');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const imageFileInput = document.getElementById('imageFileInput');
  const customImageUrlInput = document.getElementById('appImageUrl');

  // Open Admin Trigger
  if (adminBtn) {
    adminBtn.addEventListener('click', () => {
      // Check if session is already authenticated
      if (sessionStorage.getItem('nexus_admin_authenticated') === 'true') {
        openAdminModal();
      } else {
        openPinModal();
      }
    });
  }

  // Pin verification form
  if (pinForm) {
    pinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = pinInput.value.trim();
      const actual = window.dataManager.getAdminPin();
      const pinError = document.getElementById('pinError');

      // Store in session for API requests
      sessionStorage.setItem('nexus_admin_pin', entered);
      sessionStorage.setItem('nexus_admin_authenticated', 'true');
      closePinModalFunc();
      openAdminModal();
      pinInput.value = '';
      if (pinError) pinError.classList.add('hidden');
      showToast(window.t('adminTitle') + ' ✓', 'success');
    });
  }

  if (closePinModal) {
    closePinModal.addEventListener('click', closePinModalFunc);
  }

  if (closeAdminBtn) {
    closeAdminBtn.addEventListener('click', closeAdminModal);
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === adminModal) closeAdminModal();
    if (e.target === authPinModal) closePinModalFunc();
  });

  // Admin Tab Navigation
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchAdminTab(targetTab);
    });
  });

  // Image file upload handler (Convert to Base64)
  if (imageFileInput) {
    imageFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }

      // Check size limit (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file too large! Please choose an image under 5MB.', 'error');
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

  // Live URL input changes
  if (customImageUrlInput) {
    customImageUrlInput.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      if (url) {
        currentUploadedImageBase64 = '';
        updateImagePreview(url);
      }
    });
  }

  // Form Submission (Add / Edit)
  if (adminAppForm) {
    adminAppForm.addEventListener('submit', handleAppFormSubmit);
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', resetAppForm);
  }

  // Export JSON
  const exportBtn = document.getElementById('exportJsonBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      window.dataManager.exportJsonFile();
      showToast('JSON Backup downloaded!', 'success');
    });
  }

  // Import JSON
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
        if (window.renderAppHub) window.renderAppHub();
        showToast('Restored default projects!', 'success');
      }
    });
  }

  // Change PIN Form
  const changePinForm = document.getElementById('changePinForm');
  if (changePinForm) {
    changePinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentPinInput = document.getElementById('currentPinInput').value.trim();
      const newPinInput = document.getElementById('newPinInput').value.trim();
      const actualPin = window.dataManager.getAdminPin();

      if (currentPinInput !== actualPin) {
        showToast(window.t('adminPinError'), 'error');
        return;
      }

      if (newPinInput.length < 3) {
        showToast('PIN must be at least 3 characters', 'error');
        return;
      }

      window.dataManager.setAdminPin(newPinInput);
      changePinForm.reset();
      showToast('Admin PIN updated successfully!', 'success');
    });
  }
}

function openPinModal() {
  const modal = document.getElementById('authPinModal');
  const pinInput = document.getElementById('pinInput');
  const pinError = document.getElementById('pinError');
  if (modal) {
    modal.classList.add('active');
    if (pinInput) {
      pinInput.value = '';
      setTimeout(() => pinInput.focus(), 150);
    }
    if (pinError) pinError.classList.add('hidden');
  }
}

function closePinModalFunc() {
  const modal = document.getElementById('authPinModal');
  if (modal) modal.classList.remove('active');
}

function openAdminModal() {
  const modal = document.getElementById('adminModal');
  if (modal) {
    modal.classList.add('active');
    window.isAdminOpen = true;
    switchAdminTab('addApp');
    renderAdminList();
    window.dataManager.updateServerStatusBadge();
  }
}

function closeAdminModal() {
  const modal = document.getElementById('adminModal');
  if (modal) {
    modal.classList.remove('active');
    window.isAdminOpen = false;
    resetAppForm();
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
  }
}

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
    previewBox.innerHTML = `<img src="${imageSrc}" alt="Preview" class="cover-preview-img" onerror="this.onerror=null; this.src='assets/logo.jpg';" />`;
    previewBox.style.background = 'transparent';
  }
}

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
    showToast('Please provide a title in Persian or English', 'error');
    return;
  }

  // Determine cover image
  let image = 'assets/logo.jpg';
  if (currentUploadedImageBase64) {
    image = currentUploadedImageBase64;
  } else if (customImageUrl) {
    image = customImageUrl;
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

  await window.dataManager.saveApp(appData);

  showToast(editingAppId ? window.t('savedSuccess') : 'برنامه جدید با موفقیت اضافه شد! 🎉', 'success');

  resetAppForm();
  renderAdminList();
  if (window.renderAppHub) window.renderAppHub();

  // Switch to manage tab so user sees the newly saved item
  switchAdminTab('manageApps');
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

  // Update button texts
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

  if (submitBtn) submitBtn.innerHTML = `<span>✨</span> ${window.t('btnSaveApp')}`;
  if (cancelBtn) cancelBtn.classList.add('hidden');
  if (formTitle) formTitle.textContent = window.t('tabAddApp');
}

function renderAdminList() {
  const container = document.getElementById('adminAppsTableBody');
  const countBadge = document.getElementById('adminAppsCount');
  if (!container) return;

  const apps = window.dataManager.getAll();
  if (countBadge) countBadge.textContent = apps.length;

  if (apps.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="5" class="table-empty">
          ${window.t('noAppsFound')}
        </td>
      </tr>
    `;
    return;
  }

  const isFa = window.getLanguage() === 'fa';

  container.innerHTML = apps.map(app => {
    const title = isFa ? app.title_fa : app.title_en;
    const isGradient = app.image && app.image.startsWith('linear-gradient');
    const thumbStyle = isGradient ? `background: ${app.image};` : `background-image: url('${app.image || 'assets/logo.jpg'}');`;

    return `
      <tr class="admin-table-row" data-id="${app.id}">
        <td class="col-thumb">
          <div class="table-thumb" style="${thumbStyle}"></div>
        </td>
        <td class="col-title">
          <div class="table-item-title">${escapeHtml(title)}</div>
          <div class="table-item-url">${escapeHtml(app.url || '')}</div>
        </td>
        <td class="col-cat">
          <span class="category-chip category-${app.category}">${app.category}</span>
          ${app.featured ? `<span class="featured-indicator">★</span>` : ''}
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

async function duplicateApp(appId) {
  const original = window.dataManager.getById(appId);
  if (!original) return;

  const copy = JSON.parse(JSON.stringify(original));
  copy.id = undefined;
  copy.title_fa = copy.title_fa + ' (کپی)';
  copy.title_en = copy.title_en + ' (Copy)';
  copy.createdAt = new Date().toISOString().split('T')[0];

  await window.dataManager.saveApp(copy);
  renderAdminList();
  if (window.renderAppHub) window.renderAppHub();
  showToast('پروژه تکثیر شد / Project duplicated', 'success');
}

async function confirmDeleteApp(appId) {
  if (confirm(window.t('confirmDelete'))) {
    await window.dataManager.deleteApp(appId);
    renderAdminList();
    if (window.renderAppHub) window.renderAppHub();
    showToast(window.t('deletedSuccess'), 'info');
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
        throw new Error('Invalid JSON format: expected an array of apps');
      }

      await window.dataManager.importApps(apps);
      renderAdminList();
      if (window.renderAppHub) window.renderAppHub();
      showToast(`موفقیت: ${apps.length} برنامه بازیابی شد!`, 'success');
      e.target.value = '';
    } catch (err) {
      showToast('خطا در فایل JSON: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
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

// Expose functions globally for inline HTML handlers
window.startEditApp = startEditApp;
window.duplicateApp = duplicateApp;
window.confirmDeleteApp = confirmDeleteApp;
window.showToast = showToast;
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.renderAdminList = renderAdminList;
