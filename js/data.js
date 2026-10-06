/**
 * Data Storage & Synchronization Manager for Nexus Projects Hub
 * Dual-Mode: Synchronizes with Local Node.js API and Browser LocalStorage.
 * Seamless offline fallback with JSON import/export capability.
 */

const SEED_APPS = [
  {
    id: "app-1",
    title_fa: "دستیار هوشمند و تحلیل‌گر داده AI",
    title_en: "Synthesis AI Data Assistant",
    desc_fa: "دستیار چندرسانه‌ای مکالمه و پردازش متن بر پایه مدل‌های زبانی هوش مصنوعی با قابلیت پردازش صوت و نمودارهای زنده.",
    desc_en: "Multimodal conversational AI assistant for data analytics with voice synthesis and live interactive chart generation.",
    long_desc_fa: "این برنامه یک پلتفرم هوش مصنوعی نسل جدید است که به کاربران اجازه می‌دهد سوالات پیچیده تحلیلی را بپرسند، فایل‌های داده را بارگذاری کنند و پاسخ‌های جامع به همراه تحلیل بصری دریافت کنند. از وب‌سوکت برای پردازش استریم و انیمیشن‌های روان استفاده شده است.",
    long_desc_en: "A next-generation AI platform enabling users to ask complex analytical queries, upload datasets, and receive comprehensive answers with dynamic visual insights. Powered by streaming WebSockets and responsive interfaces.",
    category: "ai",
    tags: ["React", "Python", "FastAPI", "OpenAI", "WebSockets"],
    url: "https://example.com/ai-assistant",
    github: "https://github.com/mojtaba/synthesis-ai-assistant",
    image: "assets/ai_preview.jpg",
    status: "active",
    featured: true,
    allowIframe: true,
    createdAt: "2026-09-15"
  },
  {
    id: "app-2",
    title_fa: "داشبورد تحلیلی و معامله‌گری کریپتو",
    title_en: "Quantum Trade & Crypto Dashboard",
    desc_fa: "داشبورد تخصصی مانیتورینگ زنده بازار ارزهای دیجیتال، نمودارهای کندل‌استیک تعاملی و ثبت سفارشات الگوریتمی.",
    desc_en: "Professional live crypto market analytics, interactive candlestick charting, and algorithmic order management.",
    long_desc_fa: "یک پلتفرم تحت وب قدرتمند برای نظارت بلادرنگ بر نوسانات بازار کریپتو با چارت‌های تکنیکال، ویجت‌های پورتفولیو، واچ‌لیست اختصاصی و محاسبات لحظه‌ای سود و زیان (ROI). بهینه‌سازی شده با تم دارک مدرن و افکت‌های شیشه‌ای نئونی.",
    long_desc_en: "A high-performance web dashboard for real-time crypto market tracking featuring technical charts, portfolio widgets, custom watchlists, and live ROI calculators. Beautifully designed with dark glassmorphism and neon highlights.",
    category: "dashboards",
    tags: ["Vue 3", "Chart.js", "TypeScript", "Tailwind", "WebSocket"],
    url: "https://example.com/crypto-dashboard",
    github: "https://github.com/mojtaba/quantum-trade-dashboard",
    image: "assets/dashboard_preview.jpg",
    status: "active",
    featured: true,
    allowIframe: true,
    createdAt: "2026-08-20"
  },
  {
    id: "app-3",
    title_fa: "جعبه‌ابزار و مدیریت قطعه‌کد توسعه‌دهندگان",
    title_en: "Synapse Code & Snippet Vault",
    desc_fa: "محیط یکپارچه ذخیره، دسته‌بندی و تست سریع قطعه‌کدهای برنامه‌نویسی با ویرایشگر هوشمند و پشتیبانی از ۵۰ زبان.",
    desc_en: "Unified workspace for storing, tagging, and rapidly testing code snippets with syntax highlighting and multi-language support.",
    long_desc_fa: "برنامه‌ای حرفه‌ای برای برنامه‌نویسان جهت ذخیره‌سازی، جستجوی آنی و کپی سریع تکه کدهای کاربردی. دارای ویرایشگر مدرن با قابلیت تم‌گذاری، تگ‌های اختصاصی، اشتراک‌گذاری امن و حالت متنی بدون حواس‌پرتی.",
    long_desc_en: "A sleek developer utility to save, instantly search, and export reusable snippets. Features Monaco editor integration, custom tags, secure sharing tokens, and distraction-free Zen mode.",
    category: "tools",
    tags: ["TypeScript", "Node.js", "PrismJS", "Electron", "SQLite"],
    url: "https://example.com/synapse-code",
    github: "https://github.com/mojtaba/synapse-snippet-vault",
    image: "assets/devtools_preview.jpg",
    status: "active",
    featured: true,
    allowIframe: true,
    createdAt: "2026-07-10"
  },
  {
    id: "app-4",
    title_fa: "استودیو تولید و تبدیل متن به تصویر با AI",
    title_en: "DreamCanvas AI Image Studio",
    desc_fa: "ابزار خلاقانه تولید و ویرایش تصاویر با هوش مصنوعی و مدل‌های Diffusion با فیلترها و استایل‌های متنوع.",
    desc_en: "Creative generative AI art studio for transforming prompts into stunning artwork with custom presets and styles.",
    long_desc_fa: "پروژه استودیو تصویر به کاربران اجازه می‌دهد پرامپت‌های دلخواه خود را بنویسند، نسبت ابعاد و سبک‌های هنری را انتخاب کنند و تصاویر با کیفیت خروجی را با یک کلیک ارتقا داده یا ذخیره نمایند.",
    long_desc_en: "DreamCanvas enables seamless text-to-image synthesis with configurable artistic styles, aspect ratios, upscale filters, and prompt enhancement engine.",
    category: "ai",
    tags: ["Next.js", "Python", "PyTorch", "Tailwind", "Canvas API"],
    url: "https://example.com/dreamcanvas-ai",
    github: "https://github.com/mojtaba/dreamcanvas-studio",
    image: "assets/ai_preview.jpg",
    status: "beta",
    featured: false,
    allowIframe: true,
    createdAt: "2026-06-05"
  },
  {
    id: "app-5",
    title_fa: "سیستم جامع مدیریت کارها و پروژه‌های تیمی",
    title_en: "FlowTask Agile Kanban & Sprint Board",
    desc_fa: "سامانه مدیریت تسک‌های چابک با تابلوهای کانبان درگ و دراپ، تایم‌لاین گانت و اعلان‌های بلادرنگ.",
    desc_en: "Agile task and project management suite with drag-and-drop Kanban boards, Gantt timelines, and real-time collaboration.",
    long_desc_fa: "یک سیستم سبک و پرسرعت برای پیگیری روند وظایف تیمی و شخصی، تعیین اولویت‌ها، زمان‌بندی اسپرینت‌ها، و دریافت گزارش‌های پیشرفت خودکار. کاملاً ریسپانسیو و بهینه برای موبایل و دسکتاپ.",
    long_desc_en: "A lightweight, snappy project management app featuring intuitive drag-and-drop task lanes, sprint velocity charts, team permissions, and real-time activity feeds.",
    category: "web",
    tags: ["React", "Express", "PostgreSQL", "Socket.io", "Framer Motion"],
    url: "https://example.com/flowtask",
    github: "https://github.com/mojtaba/flowtask-agile",
    image: "assets/dashboard_preview.jpg",
    status: "in_progress",
    featured: false,
    allowIframe: true,
    createdAt: "2026-05-18"
  },
  {
    id: "app-6",
    title_fa: "موتور بهینه‌ساز و آنالیز سئو و عملکرد وب‌سایت",
    title_en: "ApexPulse Web Performance & SEO Audit",
    desc_fa: "ابزار خودکار سنجش سرعت، دسترسی‌پذیری و امتیاز سئوی وب‌سایت‌ها با ارائه راهکارهای اصلاحی گام‌به‌گام.",
    desc_en: "Automated website performance, accessibility, and SEO audit engine with actionable remediation steps.",
    long_desc_fa: "با وارد کردن هر آدرس وب، معیارهای Core Web Vitals را اندازه‌گیری کرده، مشکلات سئو و اسکریپت‌های سنگین را شناسایی کرده و فایل گزارش PDF به همراه نکات اصلاحی در اختیار مدیر سایت قرار می‌دهد.",
    long_desc_en: "Instant page speed diagnostics calculating Core Web Vitals, detecting bundle bloat, SEO bottlenecks, and generating exportable executive audit reports.",
    category: "tools",
    tags: ["Node.js", "Puppeteer", "Lighthouse", "Vanilla JS", "ChartJS"],
    url: "https://example.com/apex-pulse",
    github: "https://github.com/mojtaba/apex-pulse-audit",
    image: "assets/devtools_preview.jpg",
    status: "active",
    featured: false,
    allowIframe: true,
    createdAt: "2026-04-12"
  }
];

class DataManager {
  constructor() {
    this.apps = [];
    this.serverOnline = false;
    this.apiBase = window.location.origin.includes('http') ? '/api' : 'http://localhost:3000/api';
    this.storageKey = 'nexus_hub_apps_v1';
    this.favoritesKey = 'nexus_hub_favorites_v1';
    this.adminPinKey = 'nexus_hub_admin_pin';
  }

  async init() {
    await this.checkServer();
    await this.loadApps();
  }

  async checkServer() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${this.apiBase}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        this.serverOnline = true;
      }
    } catch {
      this.serverOnline = false;
    }
    this.updateServerStatusBadge();
    return this.serverOnline;
  }

  getAuthHeader() {
    const pin = sessionStorage.getItem('nexus_admin_pin') || this.getAdminPin();
    return {
      'Authorization': `Bearer ${pin}`,
      'Content-Type': 'application/json'
    };
  }

  updateServerStatusBadge() {
    const badge = document.getElementById('serverStatusBadge');
    if (badge) {
      if (this.dataSource === 'turso') {
        badge.className = 'status-badge online';
        badge.innerHTML = `<span class="pulse-dot"></span> <span>متصل به دیتابیس ابری Turso (Vercel)</span>`;
      } else if (this.serverOnline) {
        badge.className = 'status-badge online';
        badge.innerHTML = `<span class="pulse-dot"></span> <span data-i18n="serverStatusOnline">${window.t('serverStatusOnline')}</span>`;
      } else {
        badge.className = 'status-badge offline';
        badge.innerHTML = `<span class="offline-dot"></span> <span data-i18n="serverStatusOffline">${window.t('serverStatusOffline')}</span>`;
      }
    }
  }

  async loadApps() {
    // 1. Try server if available
    if (this.serverOnline) {
      try {
        const res = await fetch(`${this.apiBase}/apps`);
        if (res.ok) {
          const json = await res.json();
          this.dataSource = json.source || (this.serverOnline ? 'server' : 'local');
          this.updateServerStatusBadge();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            this.apps = json.data;
            this.persistToLocalStorage();
            return this.apps;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch from server, falling back to local storage:', err);
      }
    }

    // 2. Try LocalStorage
    const local = localStorage.getItem(this.storageKey);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.apps = parsed;
          return this.apps;
        }
      } catch (err) {
        console.error('Error parsing local storage apps:', err);
      }
    }

    // 3. Fallback to embedded seed
    this.apps = [...SEED_APPS];
    this.persistToLocalStorage();
    return this.apps;
  }

  persistToLocalStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.apps));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  }

  getAll() {
    return this.apps;
  }

  getById(id) {
    return this.apps.find(a => a.id === id);
  }

  async saveApp(appData) {
    let isNew = !appData.id;
    if (isNew) {
      appData.id = 'app-' + Date.now();
      appData.createdAt = new Date().toISOString().split('T')[0];
      this.apps.unshift(appData);
    } else {
      const idx = this.apps.findIndex(a => a.id === appData.id);
      if (idx !== -1) {
        this.apps[idx] = { ...this.apps[idx], ...appData };
      } else {
        this.apps.unshift(appData);
      }
    }

    this.persistToLocalStorage();

    // Sync with server/Turso API if online
    if (this.serverOnline) {
      try {
        const url = isNew ? `${this.apiBase}/apps` : `${this.apiBase}/apps?id=${appData.id}`;
        const method = isNew ? 'POST' : 'PUT';
        const res = await fetch(url, {
          method,
          headers: this.getAuthHeader(),
          body: JSON.stringify(appData)
        });

        if (res.status === 401) {
          throw new Error('رمز ادمین نامعتبر است (401 Unauthorized)');
        }
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'خطا در ذخیره سرور');
        }
      } catch (err) {
        console.warn('Server sync failed:', err);
        throw err;
      }
    }

    return appData;
  }

  async deleteApp(id) {
    this.apps = this.apps.filter(a => a.id !== id);
    this.persistToLocalStorage();

    if (this.serverOnline) {
      try {
        const res = await fetch(`${this.apiBase}/apps?id=${id}`, {
          method: 'DELETE',
          headers: this.getAuthHeader()
        });
        if (res.status === 401) {
          throw new Error('رمز ادمین نامعتبر است (401 Unauthorized)');
        }
      } catch (err) {
        console.warn('Server delete failed:', err);
        throw err;
      }
    }

    return true;
  }

  async importApps(appsArray) {
    if (!Array.isArray(appsArray)) return false;
    this.apps = appsArray;
    this.persistToLocalStorage();

    if (this.serverOnline) {
      try {
        const res = await fetch(`${this.apiBase}/apps`, {
          method: 'POST',
          headers: this.getAuthHeader(),
          body: JSON.stringify(this.apps)
        });
        if (res.status === 401) {
          throw new Error('رمز ادمین نامعتبر است (401 Unauthorized)');
        }
      } catch (err) {
        console.warn('Server import failed:', err);
        throw err;
      }
    }

    return true;
  }

  async resetToDefaults() {
    this.apps = [...SEED_APPS];
    this.persistToLocalStorage();

    if (this.serverOnline) {
      try {
        await fetch(`${this.apiBase}/apps`, {
          method: 'POST',
          headers: this.getAuthHeader(),
          body: JSON.stringify(this.apps)
        });
      } catch (err) {
        console.warn('Server reset failed:', err);
      }
    }

    return this.apps;
  }

  // Favorites
  getFavorites() {
    try {
      const favs = localStorage.getItem(this.favoritesKey);
      return favs ? JSON.parse(favs) : [];
    } catch {
      return [];
    }
  }

  isFavorite(id) {
    return this.getFavorites().includes(id);
  }

  toggleFavorite(id) {
    let favs = this.getFavorites();
    if (favs.includes(id)) {
      favs = favs.filter(f => f !== id);
    } else {
      favs.push(id);
    }
    localStorage.setItem(this.favoritesKey, JSON.stringify(favs));
    return favs.includes(id);
  }

  // Admin PIN management
  getAdminPin() {
    return localStorage.getItem(this.adminPinKey) || '1234';
  }

  setAdminPin(newPin) {
    localStorage.setItem(this.adminPinKey, newPin);
    return true;
  }

  // Export JSON download
  exportJsonFile() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.apps, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('download', `nexus-apps-backup-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}

// Global instance
window.dataManager = new DataManager();
