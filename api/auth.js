/**
 * Vercel Serverless Function: /api/auth
 * Handles Admin Authentication, Session Verification, and Logout.
 * Sets HttpOnly Secure cookies and returns verified JWT Bearer tokens.
 */

const {
  signToken,
  validateCredentials,
  verifyRequest,
  getAuthCookie,
  getClearCookie,
  ADMIN_USERNAME
} = require('./_auth');

// Helper to determine if request is HTTPS / Production
function isRequestSecure(req) {
  if (process.env.NODE_ENV === 'production') return true;
  const proto = req.headers['x-forwarded-proto'];
  if (proto && proto.toLowerCase() === 'https') return true;
  return false;
}

// Helper to parse JSON body across different serverless/Node environments
function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

module.exports = async function handler(req, res) {
  const origin = req.headers['origin'] || '*';

  // Set CORS headers allowing credentials for cookie exchange
  if (origin && origin !== '*') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Parse action from query string or body: ?action=verify | ?action=logout | ?action=login
  const action = (req.query?.action || parseBody(req)?.action || '').toLowerCase();
  const isSecure = isRequestSecure(req);

  try {
    // ----------------------------------------------------
    // 1. ACTION: VERIFY SESSION (?action=verify)
    // ----------------------------------------------------
    if (action === 'verify' || (req.method === 'GET' && !action)) {
      const payload = verifyRequest(req);
      if (payload) {
        return res.status(200).json({
          success: true,
          authenticated: true,
          user: {
            username: payload.username || ADMIN_USERNAME,
            role: payload.role || 'admin',
            expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null
          }
        });
      }

      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'نشست منقضی شده یا نامعتبر است / Invalid or expired session'
      });
    }

    // ----------------------------------------------------
    // 2. ACTION: LOGOUT (?action=logout)
    // ----------------------------------------------------
    if (action === 'logout') {
      res.setHeader('Set-Cookie', getClearCookie(isSecure));
      return res.status(200).json({
        success: true,
        authenticated: false,
        message: 'با موفقیت خارج شدید / Logged out successfully'
      });
    }

    // ----------------------------------------------------
    // 3. ACTION: LOGIN (POST /api/auth)
    // ----------------------------------------------------
    if (req.method === 'POST') {
      const body = parseBody(req);
      const username = body.username;
      const password = body.password;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'نام کاربری و رمز عبور الزامی است / Username and password are required'
        });
      }

      const isValid = validateCredentials(username, password);
      if (!isValid) {
        // Sleep briefly to prevent timing/brute force analysis
        await new Promise(resolve => setTimeout(resolve, 300));
        return res.status(401).json({
          success: false,
          error: 'نام کاربری یا کلمه عبور نادرست است / Invalid username or password'
        });
      }

      // Valid credentials: Sign JWT
      const token = signToken({ username, role: 'admin' });

      // Set HttpOnly, SameSite=Strict cookie
      res.setHeader('Set-Cookie', getAuthCookie(token, isSecure));

      return res.status(200).json({
        success: true,
        authenticated: true,
        message: 'ورود موفقیت‌آمیز بود / Authentication successful',
        token,
        user: {
          username,
          role: 'admin'
        }
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  } catch (error) {
    console.error('Auth API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
};
