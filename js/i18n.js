/**
 * Internationalization (i18n) Engine for Nexus Projects Hub
 * Full Persian (fa) and English (en) support with real-time switching
 */

const translations = {
  fa: {
    // Header & Brand
    brandName: "نکسوس هاب",
    brandSubtitle: "مرکز فرماندهی پروژه‌ها",
    adminButton: "پنل مدیریت",
    langToggle: "English",
    
    // Hero
    heroBadge: "✦ ویترین یکپارچه اپلیکیشن‌ها و برنامه‌های ساخته شده",
    heroTitlePrefix: "مرکز فرماندهی و ویترین",
    heroTitleGradient: "تعاملی پروژه‌ها",
    heroDesc: "به تمام وب‌اپلیکیشن‌ها، ابزارهای هوش مصنوعی، داشبوردها و نرم‌افزارهای ساخته شده در یک نگاه دسترسی داشته باشید، آن‌ها را به صورت زنده تست کنید یا سورس‌کدشان را بررسی نمایید.",
    searchPlaceholder: "جستجو در عنوان، توضیحات یا تکنولوژی‌ها... (کلید Ctrl+K)",
    
    // Stats
    statTotalApps: "کل برنامه‌ها",
    statActiveApps: "پروژه‌های فعال",
    statCategories: "دسته‌بندی‌ها",
    statFavorites: "علاقه‌مندی‌ها",

    // Filters & Controls
    filterAll: "همه برنامه‌ها",
    filterAi: "هوش مصنوعی و ML",
    filterWeb: "وب‌اپلیکیشن‌ها",
    filterDashboards: "داشبوردها",
    filterTools: "ابزارها و یوتیلیتی",
    filterFavoritesOnly: "نشان‌شده‌ها",
    
    sortLabel: "مرتب‌سازی:",
    sortNewest: "جدیدترین",
    sortOldest: "قدیمی‌ترین",
    sortTitle: "نام پروژه",
    sortFeatured: "پروژه‌های ویژه",

    viewGrid: "نمای شبکه‌ای",
    viewList: "نمای فشرده",

    // App Card
    statusActive: "آنلاین و فعال",
    statusBeta: "نسخه آزمایشی (بتا)",
    statusInProgress: "در حال توسعه",
    statusMaintenance: "تعمیر و نگهداری",
    
    launchApp: "اجرای برنامه",
    livePreview: "پیش‌نمایش زنده",
    sourceCode: "سورس‌کد",
    details: "جزئیات کامل",
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
    iframeBlockedNote: "اگر برنامه در این قاب بارگذاری نمی‌شود، ممکن است به خاطر تنظیمات امنیتی فریم سایت مقصد باشد. برای مشاهده، دکمه 'باز کردن در تب جدید' را بزنید.",

    // App Details Modal
    modalTechStack: "تکنولوژی‌ها و فریم‌ورک‌ها",
    modalCreatedDate: "تاریخ ساخت / ثبت",
    modalStatus: "وضعیت پروژه",
    modalCategory: "دسته‌بندی",
    modalDirectLink: "آدرس دسترسی مستقیم",

    // Admin Panel
    adminTitle: "پنل مدیریت هاب پروژه‌ها",
    adminSubtitle: "افزودن برنامه‌های جدید، ویرایش اطلاعات و پشتیبان‌گیری",
    adminPinPrompt: "رمز عبور پنل مدیریت را وارد کنید",
    adminPinPlaceholder: "رمز پیش‌فرض: 1234",
    adminPinSubmit: "ورود به مدیریت",
    adminPinError: "رمز عبور نادرست است!",
    adminLogout: "خروج از پنل",

    // Admin Tabs
    tabAddApp: "افزودن برنامه جدید",
    tabManageApps: "مدیریت و ویرایش برنامه‌ها",
    tabBackupSettings: "پشتیبان‌گیری و تنظیمات",

    // Add/Edit Form Fields
    formTitleFa: "عنوان به فارسی",
    formTitleEn: "عنوان به انگلیسی",
    formDescFa: "توضیح مختصر فارسی (کارت)",
    formDescEn: "توضیح مختصر انگلیسی",
    formLongDescFa: "توضیحات تکمیلی و امکانات (فارسی)",
    formLongDescEn: "توضیحات تکمیلی و امکانات (انگلیسی)",
    formCategory: "دسته‌بندی",
    formUrl: "آدرس اینترنتی یا مسیر محلی برنامه (URL)",
    formGithub: "لینک گیت‌هاب یا مخزن کد (اختیاری)",
    formTags: "تکنولوژی‌ها (با کاما جدا کنید)",
    formTagsHint: "مثال: React, Python, FastAPI, Tailwind",
    formStatus: "وضعیت برنامه",
    formImage: "آدرس تصویر کاور یا آپلود فایل",
    formUploadBtn: "انتخاب فایل تصویر...",
    formImagePreset: "یا انتخاب گرادیان آماده:",
    formFeatured: "نمایش به عنوان پروژه ویژه (Pin to Top)",
    formAllowIframe: "اجازه پیش‌نمایش درون قاب زنده (Iframe Preview)",
    
    btnSaveApp: "ذخیره و ثبت برنامه",
    btnUpdateApp: "به‌روزرسانی اطلاعات برنامه",
    btnCancelEdit: "انصراف از ویرایش",

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
    btnExportJson: "دانلود فایل پشتیبان (Export JSON)",
    btnImportJson: "بارگذاری و بازیابی از فایل JSON",
    btnResetDefault: "بازنشانی نمونه‌های اولیه",
    confirmReset: "آیا مطمئن هستید؟ همه داده‌ها با نمونه‌های اولیه جایگزین خواهند شد.",
    serverStatusOnline: "متصل به سرور محلی (ذخیره مستقیم در دیسک)",
    serverStatusOffline: "حالت مرورگر (ذخیره‌سازی در LocalStorage)",

    // Empty States & Footer
    noAppsFound: "هیچ برنامه‌ای با این مشخصات یافت نشد!",
    noAppsSuggestion: "فیلترها را تغییر دهید یا در پنل ادمین برنامه جدیدی اضافه کنید.",
    footerText: "طراحی شده با نهایت ظرافت و زیبایی • مرکز فرماندهی و ویترین تعاملی پروژه‌ها",
    addNewQuick: "افزودن برنامه جدید"
  },

  en: {
    // Header & Brand
    brandName: "Nexus Hub",
    brandSubtitle: "Projects Command Center",
    adminButton: "Admin Panel",
    langToggle: "فارسی",

    // Hero
    heroBadge: "✦ Unified Interactive Showcase of Built Applications",
    heroTitlePrefix: "Interactive Hub &",
    heroTitleGradient: "Projects Showcase",
    heroDesc: "Access all your web applications, AI tools, dashboards, and custom software in one unified command center. Test them live or inspect their architecture.",
    searchPlaceholder: "Search by title, description or technology... (Ctrl+K)",

    // Stats
    statTotalApps: "Total Apps",
    statActiveApps: "Active Projects",
    statCategories: "Categories",
    statFavorites: "Favorites",

    // Filters & Controls
    filterAll: "All Projects",
    filterAi: "AI & Machine Learning",
    filterWeb: "Web Applications",
    filterDashboards: "Dashboards",
    filterTools: "Tools & Utilities",
    filterFavoritesOnly: "Bookmarked",

    sortLabel: "Sort by:",
    sortNewest: "Newest First",
    sortOldest: "Oldest First",
    sortTitle: "Project Name",
    sortFeatured: "Featured First",

    viewGrid: "Grid View",
    viewList: "Compact View",

    // App Card
    statusActive: "Live & Online",
    statusBeta: "Beta Release",
    statusInProgress: "In Development",
    statusMaintenance: "Maintenance",

    launchApp: "Launch App",
    livePreview: "Live Preview",
    sourceCode: "Source Code",
    details: "Full Details",
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
    iframeBlockedNote: "If the app fails to load inside this frame, it might be due to external site security headers. Click 'Open in New Tab' to view.",

    // App Details Modal
    modalTechStack: "Technologies & Frameworks",
    modalCreatedDate: "Release Date",
    modalStatus: "Project Status",
    modalCategory: "Category",
    modalDirectLink: "Direct Access URL",

    // Admin Panel
    adminTitle: "Nexus Hub Admin Panel",
    adminSubtitle: "Add new applications, edit project metadata and manage backups",
    adminPinPrompt: "Enter Admin Access Passcode",
    adminPinPlaceholder: "Default PIN: 1234",
    adminPinSubmit: "Unlock Admin",
    adminPinError: "Incorrect passcode! Please try again.",
    adminLogout: "Exit Admin",

    // Admin Tabs
    tabAddApp: "Add New Application",
    tabManageApps: "Manage Existing Apps",
    tabBackupSettings: "Backup & System",

    // Add/Edit Form Fields
    formTitleFa: "Title in Persian",
    formTitleEn: "Title in English",
    formDescFa: "Short Description (Persian)",
    formDescEn: "Short Description (English)",
    formLongDescFa: "Extended Description & Features (Persian)",
    formLongDescEn: "Extended Description & Features (English)",
    formCategory: "Category",
    formUrl: "Live Application URL or Local Host Path",
    formGithub: "GitHub or Repository Link (Optional)",
    formTags: "Technologies (Comma separated)",
    formTagsHint: "e.g. React, Python, FastAPI, Tailwind",
    formStatus: "Project Status",
    formImage: "Cover Image URL or File Upload",
    formUploadBtn: "Choose Image File...",
    formImagePreset: "Or choose a gradient preset:",
    formFeatured: "Pin to Top as Featured Project",
    formAllowIframe: "Enable In-App Device Preview (Iframe)",

    btnSaveApp: "Save & Publish App",
    btnUpdateApp: "Update Application Details",
    btnCancelEdit: "Cancel Edit",

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
    btnExportJson: "Export All Apps (JSON)",
    btnImportJson: "Import & Restore from JSON",
    btnResetDefault: "Restore Seed Defaults",
    confirmReset: "Are you sure? All current entries will be replaced with the default sample apps.",
    serverStatusOnline: "Connected to Local Node.js Server (Auto-persists to disk)",
    serverStatusOffline: "Running in Offline Browser Mode (LocalStorage)",

    // Empty States & Footer
    noAppsFound: "No projects match your current filters!",
    noAppsSuggestion: "Try clearing search keywords or create a new application in the Admin Panel.",
    footerText: "Crafted with precision & aesthetics • Unified Interactive Portfolio Hub",
    addNewQuick: "Add New App"
  }
};

let currentLang = localStorage.getItem('nexus_lang') || 'fa';

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
  localStorage.setItem('nexus_lang', lang);

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
  if (window.renderAdminList && window.isAdminOpen) {
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
