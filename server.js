/**
 * Nexus Projects Hub - Lightweight Zero-Dependency Server
 * Built with standard Node.js libraries (http, fs, path).
 * Provides static file serving and persistent JSON API for apps management.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'apps.json');

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

// Helper to ensure data file exists
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  }
}

// Read apps from disk
function readApps() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading apps file:', err);
    return [];
  }
}

// Write apps to disk
function writeApps(apps) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), 'utf8');
}

// Set standard CORS & JSON headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Parse request body JSON
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Protection against massive payload (max 15MB for base64 images)
      if (body.length > 15 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // --- API ROUTES ---
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    // Health check
    if (pathname === '/api/health' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', server: 'Nexus Hub Node Server', timestamp: Date.now() }));
      return;
    }

    // Get all apps
    if (pathname === '/api/apps' && req.method === 'GET') {
      const apps = readApps();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, count: apps.length, data: apps }));
      return;
    }

    // Create a new app
    if (pathname === '/api/apps' && req.method === 'POST') {
      try {
        const newApp = await parseRequestBody(req);
        if (!newApp.title_fa && !newApp.title_en) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'App title is required' }));
          return;
        }

        const apps = readApps();
        if (!newApp.id) {
          newApp.id = 'app-' + Date.now();
        }
        newApp.createdAt = newApp.createdAt || new Date().toISOString().split('T')[0];

        // Insert at beginning or end
        apps.unshift(newApp);
        writeApps(apps);

        res.writeHead(201);
        res.end(JSON.stringify({ success: true, message: 'App created successfully', data: newApp }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // Batch Import / Replace all apps
    if (pathname === '/api/apps/import' && req.method === 'POST') {
      try {
        const body = await parseRequestBody(req);
        const appsList = Array.isArray(body) ? body : (body.apps || []);
        writeApps(appsList);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Apps imported successfully', count: appsList.length }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // Update or Delete specific app by ID: /api/apps/:id
    const idMatch = pathname.match(/^\/api\/apps\/([a-zA-Z0-9_-]+)$/);
    if (idMatch) {
      const appId = idMatch[1];
      const apps = readApps();
      const index = apps.findIndex(a => a.id === appId);

      if (index === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'App not found' }));
        return;
      }

      if (req.method === 'PUT') {
        try {
          const updatedData = await parseRequestBody(req);
          apps[index] = { ...apps[index], ...updatedData, id: appId };
          writeApps(apps);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'App updated successfully', data: apps[index] }));
        } catch (err) {
          res.writeHead(500);
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
      }

      if (req.method === 'DELETE') {
        const deleted = apps.splice(index, 1);
        writeApps(apps);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'App deleted successfully', data: deleted[0] }));
        return;
      }
    }

    res.writeHead(404);
    res.end(JSON.stringify({ success: false, error: 'API endpoint not found' }));
    return;
  }

  // --- STATIC FILE SERVING ---
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  // Security check: avoid directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If file not found, fallback to index.html for SPA routing
      const indexHtmlPath = path.join(__dirname, 'index.html');
      fs.readFile(indexHtmlPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading file');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Nexus Projects Hub is live!`);
  console.log(`👉 Open in browser: http://localhost:${PORT}`);
  console.log(`📦 Data storage: ${DATA_FILE}`);
  console.log(`======================================================\n`);
});
