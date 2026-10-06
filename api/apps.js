/**
 * Vercel Serverless Function: /api/apps
 * Supports Turso Cloud Database (libSQL) with automatic table creation,
 * plus fallback to local data/apps.json for offline/local development.
 * Protected by ADMIN_PASSWORD environment variable for write operations.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client/web');

// Environment variables
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '1234';
const DATA_FILE = path.join(process.cwd(), 'data', 'apps.json');

// Helper to obtain Turso Client with support for multiple env variable aliases
let tursoClient = null;
function getTursoClient() {
  const url = process.env.TURSO_DATABASE_URL || process.env.TURSO_DB_URL || process.env.LIBSQL_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.TURSO_DB_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;
  if (!url) return null;
  if (!tursoClient) {
    try {
      tursoClient = createClient({ url, authToken });
    } catch (err) {
      console.error('Failed to initialize Turso client:', err);
    }
  }
  return tursoClient;
}

// Helper to ensure database table exists in Turso
async function ensureTursoTable() {
  const client = getTursoClient();
  if (!client) return;
  await client.execute(`
    CREATE TABLE IF NOT EXISTS apps (
      id TEXT PRIMARY KEY,
      title_fa TEXT NOT NULL,
      title_en TEXT,
      desc_fa TEXT,
      desc_en TEXT,
      long_desc_fa TEXT,
      long_desc_en TEXT,
      category TEXT,
      tags TEXT,
      url TEXT,
      github TEXT,
      image TEXT,
      status TEXT DEFAULT 'active',
      featured INTEGER DEFAULT 0,
      allow_iframe INTEGER DEFAULT 1,
      created_at TEXT
    )
  `);
}

// Convert DB row to frontend app object
function rowToApp(row) {
  let tags = [];
  try {
    tags = typeof row.tags === 'string' ? JSON.parse(row.tags || '[]') : (row.tags || []);
  } catch {
    tags = [];
  }

  return {
    id: row.id,
    title_fa: row.title_fa,
    title_en: row.title_en || row.title_fa,
    desc_fa: row.desc_fa || '',
    desc_en: row.desc_en || '',
    long_desc_fa: row.long_desc_fa || '',
    long_desc_en: row.long_desc_en || '',
    category: row.category || 'web',
    tags: tags,
    url: row.url || '#',
    github: row.github || '',
    image: row.image || 'assets/logo.jpg',
    status: row.status || 'active',
    featured: Boolean(row.featured),
    allowIframe: Boolean(row.allow_iframe),
    createdAt: row.created_at || new Date().toISOString().split('T')[0]
  };
}

// Check admin authorization
function checkAuth(req) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  return token === ADMIN_PASSWORD;
}

// Fallback: Read apps from local disk
function readLocalApps() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw || '[]');
    }
  } catch (e) {
    console.warn('Could not read local apps:', e);
  }
  return [];
}

// Fallback: Write apps to local disk
function writeLocalApps(apps) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not write local apps (normal on read-only serverless):', e);
  }
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Parse path / query params (e.g. /api/apps?id=app-1)
  const appId = req.query?.id || req.body?.id;

  try {
    const tursoClient = getTursoClient();

    // ----------------------------------------------------
    // 1. GET: Fetch all apps (Public - Read-Only)
    // ----------------------------------------------------
    if (req.method === 'GET') {
      if (tursoClient) {
        await ensureTursoTable();
        const result = await tursoClient.execute({
          sql: `SELECT * FROM apps ORDER BY featured DESC, created_at DESC`,
          args: []
        });

        // If table is empty on Turso, seed it from local JSON if available
        if (result.rows.length === 0) {
          const localSeed = readLocalApps();
          if (localSeed.length > 0) {
            for (const item of localSeed) {
              await tursoClient.execute({
                sql: `INSERT OR REPLACE INTO apps (id, title_fa, title_en, desc_fa, desc_en, long_desc_fa, long_desc_en, category, tags, url, github, image, status, featured, allow_iframe, created_at)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                  item.id,
                  item.title_fa,
                  item.title_en || item.title_fa,
                  item.desc_fa || '',
                  item.desc_en || '',
                  item.long_desc_fa || '',
                  item.long_desc_en || '',
                  item.category || 'web',
                  JSON.stringify(item.tags || []),
                  item.url || '#',
                  item.github || '',
                  item.image || 'assets/logo.jpg',
                  item.status || 'active',
                  item.featured ? 1 : 0,
                  item.allowIframe !== false ? 1 : 0,
                  item.createdAt || new Date().toISOString().split('T')[0]
                ]
              });
            }
            const seeded = await tursoClient.execute(`SELECT * FROM apps ORDER BY featured DESC, created_at DESC`);
            return res.status(200).json({
              success: true,
              source: 'turso',
              count: seeded.rows.length,
              data: seeded.rows.map(rowToApp)
            });
          }
        }

        const apps = result.rows.map(rowToApp);
        return res.status(200).json({
          success: true,
          source: 'turso',
          count: apps.length,
          data: apps
        });
      }

      // Fallback: Local JSON
      const localApps = readLocalApps();
      return res.status(200).json({
        success: true,
        source: 'local_json',
        count: localApps.length,
        data: localApps
      });
    }

    // ----------------------------------------------------
    // SECURITY CHECK: All write actions require Admin Auth
    // ----------------------------------------------------
    if (!checkAuth(req)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or missing Admin Password'
      });
    }

    // ----------------------------------------------------
    // 2. POST: Create New App (or Import Batch)
    // ----------------------------------------------------
    if (req.method === 'POST') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      // Check if batch import
      if (Array.isArray(data) || Array.isArray(data.apps)) {
        const appsList = Array.isArray(data) ? data : data.apps;
        if (tursoClient) {
          await ensureTursoTable();
          await tursoClient.execute(`DELETE FROM apps`);
          for (const item of appsList) {
            await tursoClient.execute({
              sql: `INSERT INTO apps (id, title_fa, title_en, desc_fa, desc_en, long_desc_fa, long_desc_en, category, tags, url, github, image, status, featured, allow_iframe, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                item.id || ('app-' + Date.now() + Math.random().toString(36).substring(2, 5)),
                item.title_fa,
                item.title_en || item.title_fa,
                item.desc_fa || '',
                item.desc_en || '',
                item.long_desc_fa || '',
                item.long_desc_en || '',
                item.category || 'web',
                JSON.stringify(item.tags || []),
                item.url || '#',
                item.github || '',
                item.image || 'assets/logo.jpg',
                item.status || 'active',
                item.featured ? 1 : 0,
                item.allowIframe !== false ? 1 : 0,
                item.createdAt || new Date().toISOString().split('T')[0]
              ]
            });
          }
          return res.status(200).json({ success: true, message: 'Imported to Turso', count: appsList.length });
        } else {
          writeLocalApps(appsList);
          return res.status(200).json({ success: true, message: 'Imported to local storage', count: appsList.length });
        }
      }

      // Single App Creation
      if (!data.title_fa && !data.title_en) {
        return res.status(400).json({ success: false, error: 'App title is required' });
      }

      const newId = data.id || ('app-' + Date.now());
      const createdAt = data.createdAt || new Date().toISOString().split('T')[0];

      if (tursoClient) {
        await ensureTursoTable();
        await tursoClient.execute({
          sql: `INSERT OR REPLACE INTO apps (id, title_fa, title_en, desc_fa, desc_en, long_desc_fa, long_desc_en, category, tags, url, github, image, status, featured, allow_iframe, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            newId,
            data.title_fa,
            data.title_en || data.title_fa,
            data.desc_fa || '',
            data.desc_en || '',
            data.long_desc_fa || '',
            data.long_desc_en || '',
            data.category || 'web',
            JSON.stringify(data.tags || []),
            data.url || '#',
            data.github || '',
            data.image || 'assets/logo.jpg',
            data.status || 'active',
            data.featured ? 1 : 0,
            data.allowIframe !== false ? 1 : 0,
            createdAt
          ]
        });

        return res.status(201).json({
          success: true,
          source: 'turso',
          message: 'App saved to Turso database',
          data: { ...data, id: newId, createdAt }
        });
      } else {
        const localApps = readLocalApps();
        const newApp = { ...data, id: newId, createdAt };
        localApps.unshift(newApp);
        writeLocalApps(localApps);
        return res.status(201).json({
          success: true,
          source: 'local_json',
          message: 'App saved to local storage',
          data: newApp
        });
      }
    }

    // ----------------------------------------------------
    // 3. PUT: Update Existing App
    // ----------------------------------------------------
    if (req.method === 'PUT') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const targetId = appId || data.id;

      if (!targetId) {
        return res.status(400).json({ success: false, error: 'App ID is required' });
      }

      if (tursoClient) {
        await ensureTursoTable();
        await tursoClient.execute({
          sql: `UPDATE apps SET
                  title_fa = ?, title_en = ?, desc_fa = ?, desc_en = ?,
                  long_desc_fa = ?, long_desc_en = ?, category = ?, tags = ?,
                  url = ?, github = ?, image = ?, status = ?,
                  featured = ?, allow_iframe = ?
                WHERE id = ?`,
          args: [
            data.title_fa,
            data.title_en || data.title_fa,
            data.desc_fa || '',
            data.desc_en || '',
            data.long_desc_fa || '',
            data.long_desc_en || '',
            data.category || 'web',
            JSON.stringify(data.tags || []),
            data.url || '#',
            data.github || '',
            data.image || 'assets/logo.jpg',
            data.status || 'active',
            data.featured ? 1 : 0,
            data.allowIframe !== false ? 1 : 0,
            targetId
          ]
        });

        return res.status(200).json({
          success: true,
          source: 'turso',
          message: 'App updated in Turso database',
          data
        });
      } else {
        const localApps = readLocalApps();
        const idx = localApps.findIndex(a => a.id === targetId);
        if (idx !== -1) {
          localApps[idx] = { ...localApps[idx], ...data, id: targetId };
          writeLocalApps(localApps);
        }
        return res.status(200).json({ success: true, source: 'local_json', data });
      }
    }

    // ----------------------------------------------------
    // 4. DELETE: Remove App
    // ----------------------------------------------------
    if (req.method === 'DELETE') {
      const targetId = appId || req.query?.id;
      if (!targetId) {
        return res.status(400).json({ success: false, error: 'App ID is required' });
      }

      if (tursoClient) {
        await ensureTursoTable();
        await tursoClient.execute({
          sql: `DELETE FROM apps WHERE id = ?`,
          args: [targetId]
        });
        return res.status(200).json({ success: true, source: 'turso', message: 'App deleted from Turso' });
      } else {
        let localApps = readLocalApps();
        localApps = localApps.filter(a => a.id !== targetId);
        writeLocalApps(localApps);
        return res.status(200).json({ success: true, source: 'local_json', message: 'App deleted from local' });
      }
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
