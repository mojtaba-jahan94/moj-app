/**
 * Internationalization (i18n) Engine for My Apps (پروژه‌های من)
 * Full Persian (fa) and English (en) support with real-time switching
 */

const translations = {
  fa: {
    // Header & Brand
    brandName: "پروژه‌های من",
    brandSubtitle: "دسترسی سریع به تمام برنامه‌ها و ابزارها",
    adminButton: "مدیریت",
    langToggle: "English",
    themeToggle: "تغییر حالت تم",
    themeLight: "حالت روشن",
    themeDark: "حالت تاریک",
    
    // Hero
    heroTitle: "پروژه‌های من",
    heroSubtitle: "دسترسی سریع به تمام وب‌اپلیکیشن‌ها و ابزارهای من",
    searchPlaceholder: "جستجو در برنامه‌ها... (Ctrl+K)",
    
    // Filters & Controls
    filterAll: "همه",
    filterAi: "هوش مصنوعی",
    filterWeb: "وب‌اپلیکیشن",
    filterDashboards: "داشبورد",
    filterTools: "ابزارها",
    filterFavoritesOnly: "نشان‌شده‌ها",
    
    sortLabel: "مرتب‌سازی:",
    sortNewest: "جدیدترین",
    sortOldest: "قدیمی‌ترین",
    sortTitle: "نام پروژه",
    sortFeatured: "پروژه‌های ویژه",

    viewGrid: "نمای شبکه‌ای",
    viewList: "نمای فشرده",

    // App Card
    statusActive: "آنلاین",
    statusBeta: "آزمایشی",
    statusInProgress: "در حال توسعه",
    statusMaintenance: "تعمیر",
    
    launchApp: "اجرا",
    livePreview: "پیش‌نمایش",
    sourceCode: "سورس‌کد",
    details: "جزئیات",
    featuredBadge: "ویژه",
    copyUrl: "کپی آدرس",
    copiedToast: "آدرس برنامه کپی شد!",

    // Device Preview Modal
    previewTitle: "پیش‌نمایش زنده اپلیکیشن",
    deviceDesktop: "دسکتاپ",
    deviceTablet: "تبلت",
    deviceMobile: "موبایل",
    openExternal: "باز کردن در تب جدید",
    reloadPreview: "بارگذاری مجدد",
    closeModal: "بستن",
    iframeBlockedNote: "اگر برنامه در این قاب بارگذاری نمی‌شود، دکمه 'باز کردن در تب جدید' را بزنید.",

    // App Details Modal
    modalTechStack: "تکنولوژی‌ها و فریم‌ورک‌ها",
    modalCreatedDate: "تاریخ ساخت / ثبت",
    modalStatus: "وضعیت پروژه",
    modalCategory: "دسته‌بندی",
    modalDirectLink: "آدرس دسترسی مستقیم",

    // Admin Panel
    adminTitle: "مدیریت برنامه‌ها",
    adminSubtitle: "ثبت، ویرایش و دسته‌بندی وب‌اپلیکیشن‌ها",
    adminPinPrompt: "ورود به کنترل‌پنل مدیریت",
    adminPinPlaceholder: "رمز پیش‌فرض: 1234",
    adminPinSubmit: "ورود به مدیریت",
    adminPinError: "نام کاربری یا رمز عبور نادرست است!",
    adminLogout: "خروج",
    adminLoginTitle: "ورود به مدیریت",
    adminLoginSubtitle: "جهت مدیریت و ویرایش برنامه‌ها وارد حساب خود شوید",
    adminUsernameLabel: "نام کاربری",
    adminUsernamePlaceholder: "نام کاربری مدیر (پیش‌فرض: admin)",
    adminPasswordLabel: "رمز عبور",
    adminPasswordPlaceholder: "رمز عبور مدیر...",
    adminLoginBtn: "ورود به پنل",
    adminLoggedInAs: "کاربر فعال:",
    adminViewLiveSite: "مشاهده سایت ↗",
    adminStatsTotal: "کل برنامه‌ها",
    adminStatsActive: "پروژه‌های فعال",
    adminStatsFeatured: "ویژه‌ها",
    adminSearchPlaceholder: "جستجو در عنوان، دسته یا تگ‌ها...",
    adminSortLabel: "مرتب‌سازی:",
    adminCategoryFilter: "دسته‌بندی:",
    adminAllCategories: "همه دسته‌ها",
    adminEmptyList: "هیچ برنامه‌ای یافت نشد.",

    // Admin Tabs
    tabAddApp: "ثبت برنامه جدید",
    tabManageApps: "مدیریت و ویرایش",
    tabBackupSettings: "پشتیبان‌گیری و داده‌ها",

    // Add/Edit Form Fields
    formTitleFa: "عنوان به فارسی",
    formTitleEn: "عنوان به انگلیسی",
    formDescFa: "توضیح مختصر فارسی",
    formDescEn: "توضیح مختصر انگلیسی",
    formLongDescFa: "توضیحات تکمیلی (فارسی)",
    formLongDescEn: "توضیحات تکمیلی (انگلیسی)",
    formCategory: "دسته‌بندی",
    formUrl: "آدرس اینترنتی یا مسیر محلی برنامه (URL) *",
    formGithub: "لینک مخزن گیت‌هاب (اختیاری)",
    formTags: "تکنولوژی‌ها (با کاما جدا کنید)",
    formTagsHint: "مثال: React, Python, FastAPI, Tailwind",
    formStatus: "وضعیت برنامه",
    formImage: "تصویر کاور برنامه (اسکرین‌شات خودکار، آپلود یا آدرس اینترنتی)",
    btnAutoScreenshot: "اسکرین‌شات خودکار از آدرس سایت",
    formUploadBtn: "انتخاب فایل تصویر...",
    formImagePreset: "یا انتخاب گرادیان آماده:",
    formFeatured: "پروژه ویژه (Pin to Top)",
    formAllowIframe: "اجازه پیش‌نمایش در قاب زنده (Iframe)",
    
    btnSaveApp: "ذخیره و ثبت برنامه",
    btnUpdateApp: "به‌روزرسانی اطلاعات",
    btnCancelEdit: "انصراف",

    // Manage Table
    tableColTitle: "عنوان برنامه",
    tableColCategory: "دسته‌بندی",
    tableColStatus: "وضعیت",
    tableColActions: "عملیات",
    btnEdit: "ویرایش",
    btnDelete: "حذف",
    btnDuplicate: "تکثیر",
    confirmDelete: "آیا از حذف این برنامه مطمئن هستید؟ این عمل غیرقابل بازگشت است.",
    deletedSuccess: "برنامه با موفقیت حذف شد.",
    savedSuccess: "اطلاعات با موفقیت ذخیره شد!",
    
    // Backup & Sync
    backupTitle: "پشتیبان‌گیری و بازیابی داده‌ها",
    backupDesc: "می‌توانید تمام لیست برنامه‌ها را به صورت فایل JSON خروجی بگیرید یا در یک سیستم دیگر وارد نمایید.",
    btnExportJson: "دانلود فایل پشتیبان (JSON)",
    btnImportJson: "بارگذاری و بازیابی از JSON",
    btnResetDefault: "بازنشانی نمونه‌های اولیه",
    confirmReset: "آیا مطمئن هستید؟ همه داده‌ها با نمونه‌های اولیه جایگزین خواهند شد.",
    serverStatusOnline: "متصل به سرور محلی (ذخیره مستقیم در دیسک)",
    serverStatusOffline: "حالت مرورگر (ذخیره‌سازی در LocalStorage)",

    // Empty States & Footer
    noAppsFound: "هیچ برنامه‌ای یافت نشد!",
    noAppsSuggestion: "فیلترها را تغییر دهید یا در پنل مدیریت برنامه جدیدی اضافه کنید.",
    footerText: "پروژه‌های من • مینیمالیسم نوردیک",
    addNewQuick: "افزودن برنامه جدید"
  },

  en: {
    // Header & Brand
    brandName: "My Apps",
    brandSubtitle: "Quick access to all my apps and tools",
    adminButton: "Admin",
    langToggle: "فارسی",
    themeToggle: "Toggle Theme",
    themeLight: "Light Mode",
    themeDark: "Dark Mode",

    // Hero
    heroTitle: "My Apps",
    heroSubtitle: "Quick access to all my web applications and tools",
    searchPlaceholder: "Search apps... (Ctrl+K)",

    // Filters & Controls
    filterAll: "All",
    filterAi: "AI",
    filterWeb: "Web Apps",
    filterDashboards: "Dashboards",
    filterTools: "Tools",
    filterFavoritesOnly: "Favorites",

    sortLabel: "Sort by:",
    sortNewest: "Newest",
    sortOldest: "Oldest",
    sortTitle: "Title",
    sortFeatured: "Featured",

    viewGrid: "Grid",
    viewList: "List",

    // App Card
    statusActive: "Online",
    statusBeta: "Beta",
    statusInProgress: "In Progress",
    statusMaintenance: "Maintenance",

    launchApp: "Launch",
    livePreview: "Preview",
    sourceCode: "Code",
    details: "Details",
    featuredBadge: "Featured",
    copyUrl: "Copy URL",
    copiedToast: "App URL copied to clipboard!",

    // Device Preview Modal
    previewTitle: "Live Device Preview",
    deviceDesktop: "Desktop",
    deviceTablet: "Tablet",
    deviceMobile: "Mobile",
    openExternal: "Open in New Tab",
    reloadPreview: "Reload",
    closeModal: "Close",
    iframeBlockedNote: "If the app fails to load inside this frame, click 'Open in New Tab' to view.",

    // App Details Modal
    modalTechStack: "Technologies & Frameworks",
    modalCreatedDate: "Release Date",
    modalStatus: "Project Status",
    modalCategory: "Category",
    modalDirectLink: "Direct Access URL",

    // Admin Panel
    adminTitle: "Apps Management",
    adminSubtitle: "Add, edit and organize web applications",
    adminPinPrompt: "Admin Authentication",
    adminPinPlaceholder: "Default PIN: 1234",
    adminPinSubmit: "Unlock Admin",
    adminPinError: "Incorrect username or password!",
    adminLogout: "Logout",
    adminLoginTitle: "Admin Sign-In",
    adminLoginSubtitle: "Enter your credentials to access the management workspace",
    adminUsernameLabel: "Username",
    adminUsernamePlaceholder: "Admin username (default: admin)",
    adminPasswordLabel: "Password",
    adminPasswordPlaceholder: "Admin password...",
    adminLoginBtn: "Sign In",
    adminLoggedInAs: "Logged in as:",
    adminViewLiveSite: "View Site ↗",
    adminStatsTotal: "Total Apps",
    adminStatsActive: "Active Apps",
    adminStatsFeatured: "Featured",
    adminSearchPlaceholder: "Search by title, category, tags...",
    adminSortLabel: "Sort:",
    adminCategoryFilter: "Category:",
    adminAllCategories: "All Categories",
    adminEmptyList: "No applications found.",

    // Admin Tabs
    tabAddApp: "Add New App",
    tabManageApps: "Manage Existing Apps",
    tabBackupSettings: "Backup & Data",

    // Add/Edit Form Fields
    formTitleFa: "Title in Persian",
    formTitleEn: "Title in English",
    formDescFa: "Short Description (Persian)",
    formDescEn: "Short Description (English)",
    formLongDescFa: "Extended Description (Persian)",
    formLongDescEn: "Extended Description (English)",
    formCategory: "Category",
    formUrl: "Live Application URL or Local Host Path *",
    formGithub: "GitHub or Repository Link (Optional)",
    formTags: "Technologies (Comma separated)",
    formTagsHint: "e.g. React, Python, FastAPI, Tailwind",
    formStatus: "Project Status",
    formImage: "Cover Image (Auto-screenshot, upload or URL)",
    btnAutoScreenshot: "Capture Screenshot from URL",
    formUploadBtn: "Choose Image File...",
    formImagePreset: "Or choose a gradient preset:",
    formFeatured: "Pin to Top as Featured Project",
    formAllowIframe: "Enable In-App Device Preview (Iframe)",

    btnSaveApp: "Save & Publish App",
    btnUpdateApp: "Update Application Details",
    btnCancelEdit: "Cancel",

    // Manage Table
    tableColTitle: "Application",
    tableColCategory: "Category",
    tableColStatus: "Status",
    tableColActions: "Actions",
    btnEdit: "Edit",
    btnDelete: "Delete",
    btnDuplicate: "Duplicate",
    confirmDelete: "Are you sure you want to remove this application? This action cannot be undone.",
    deletedSuccess: "Application removed successfully.",
    savedSuccess: "Application changes saved successfully!",

    // Backup & Sync
    backupTitle: "Data Backup & Migration",
    backupDesc: "Export all application registry data to a JSON backup file or restore from a previously exported archive.",
    btnExportJson: "Download Backup (JSON)",
    btnImportJson: "Import from JSON",
    btnResetDefault: "Restore Seed Defaults",
    confirmReset: "Are you sure? All current entries will be replaced with the default sample apps.",
    serverStatusOnline: "Connected to Local Node.js Server (Auto-persists to disk)",
    serverStatusOffline: "Running in Offline Browser Mode (LocalStorage)",

    // Empty States & Footer
    noAppsFound: "No projects match your current filters!",
    noAppsSuggestion: "Try clearing search keywords or create a new application in the Admin Panel.",
    footerText: "My Apps • Nordic Minimalism",
    addNewQuick: "Add New App"
  }
};

let currentLang = localStorage.getItem('my_apps_lang') || localStorage.getItem('nexus_lang') || 'fa';

function getLanguage() {
  return currentLang;
}

function t(key) {
  if (!translations[currentLang]) {
    return translations.fa[key] || key;
  }
  return translations[currentLang][key] || translations.fa[key] || key;
}

function setLanguage(lang) {
  if (lang !== 'fa' && lang !== 'en') lang = 'fa';
  currentLang = lang;
  localStorage.setItem('my_apps_lang', lang);

  // Update HTML tag attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

  // Toggle class on body for specific font/layout overrides
  document.body.classList.toggle('lang-fa', lang === 'fa');
  document.body.classList.toggle('lang-en', lang === 'en');

  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (k && translations[lang] && translations[lang][k] !== undefined) {
      el.textContent = translations[lang][k];
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const k = el.getAttribute('data-i18n-placeholder');
    if (k && translations[lang] && translations[lang][k] !== undefined) {
      el.setAttribute('placeholder', translations[lang][k]);
    }
  });

  // Update title tooltips
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const k = el.getAttribute('data-i18n-title');
    if (k && translations[lang] && translations[lang][k] !== undefined) {
      el.setAttribute('title', translations[lang][k]);
    }
  });

  // Trigger app re-render if available
  if (window.renderAppHub) {
    window.renderAppHub();
  }
  if (window.renderAdminList && window.isAdminAuthenticated) {
    window.renderAdminList();
  }
}

function toggleLanguage() {
  const next = currentLang === 'fa' ? 'en' : 'fa';
  setLanguage(next);
}

// Expose globally
window.t = t;
window.getLanguage = getLanguage;
window.setLanguage = setLanguage;
window.toggleLanguage = toggleLanguage;
