/**
 * My Apps (پروژه‌های من) - Authentication & JWT Helper
 * Built with standard Node.js crypto module (zero external dependencies).
 * Provides HS256 JWT signing, timing-safe verification, cookie serialization,
 * and request authentication middleware.
 */

const crypto = require('crypto');

// Configuration with sensible defaults
const JWT_SECRET = process.env.JWT_SECRET || 'my-apps-jwt-secret-key-2026-production-grade';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '1234';
const TOKEN_EXPIRY_SECONDS = 24 * 60 * 60; // 24 hours

/**
 * Base64URL encode a buffer or string
 */
function base64UrlEncode(data) {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
  return buf.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Base64URL decode to string
 */
function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Sign a JWT using HMAC-SHA256
 * @param {Object} payload 
 * @param {number} expiresInSeconds
 * @returns {string} Signed JWT token
 */
function signToken(payload = {}, expiresInSeconds = TOKEN_EXPIRY_SECONDS) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const claims = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(claims));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(dataToSign)
    .digest();

  const encodedSignature = base64UrlEncode(signature);

  return `${dataToSign}.${encodedSignature}`;
}

/**
 * Verify and decode an HMAC-SHA256 JWT
 * @param {string} token 
 * @returns {Object|null} Decoded payload or null if invalid/expired
 */
function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.trim().split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  // Recompute expected signature
  const expectedSigBuffer = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(dataToSign)
    .digest();

  const receivedSigBuffer = Buffer.from(encodedSignature.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

  if (expectedSigBuffer.length !== receivedSigBuffer.length) {
    return null;
  }

  // Timing-safe comparison to prevent timing attacks
  if (!crypto.timingSafeEqual(expectedSigBuffer, receivedSigBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    // Check expiration
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Timing-safe string comparison
 */
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Constant time dummy check to prevent timing leakage on length
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Validate admin login credentials
 * @param {string} username 
 * @param {string} password 
 * @returns {boolean}
 */
function validateCredentials(username, password) {
  const validUser = safeCompare(String(username || '').trim(), ADMIN_USERNAME);
  const validPass = safeCompare(String(password || '').trim(), ADMIN_PASSWORD);
  return validUser && validPass;
}

/**
 * Extract token from request (Checks Authorization header, cookies, or query)
 * @param {Object} req 
 * @returns {string|null}
 */
function extractToken(req) {
  // 1. Check Authorization header: Bearer <token>
  const authHeader = req.headers && (req.headers['authorization'] || req.headers['Authorization']);
  if (authHeader && typeof authHeader === 'string') {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // 2. Check Cookie header: admin_token=<token>
  const cookieHeader = req.headers && (req.headers['cookie'] || req.headers['Cookie']);
  if (cookieHeader && typeof cookieHeader === 'string') {
    const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1].trim());
    }
  }

  // 3. Fallback: Query param ?token=
  if (req.query && req.query.token) {
    return String(req.query.token).trim();
  }

  return null;
}

/**
 * Verify request authentication
 * @param {Object} req 
 * @returns {Object|null} Payload if valid, null otherwise
 */
function verifyRequest(req) {
  const token = extractToken(req);
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Generate HttpOnly Cookie header string for authenticated session
 * @param {string} token 
 * @param {boolean} isSecure 
 * @returns {string}
 */
function getAuthCookie(token, isSecure = false) {
  const secureFlag = isSecure ? '; Secure' : '';
  return `admin_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TOKEN_EXPIRY_SECONDS}${secureFlag}`;
}

/**
 * Generate Cookie header string to clear the session cookie
 * @param {boolean} isSecure 
 * @returns {string}
 */
function getClearCookie(isSecure = false) {
  const secureFlag = isSecure ? '; Secure' : '';
  return `admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secureFlag}`;
}

module.exports = {
  signToken,
  verifyToken,
  validateCredentials,
  extractToken,
  verifyRequest,
  getAuthCookie,
  getClearCookie,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  JWT_SECRET
};
