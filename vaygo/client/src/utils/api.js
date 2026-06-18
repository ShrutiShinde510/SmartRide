// ── Shared API helper ─────────────────────────────────────────────
// Wraps fetch() to auto-attach the JWT token and handle 401 globally.

const BASE = '';  // Vite proxy forwards /api → http://localhost:5000

/**
 * Make an authenticated fetch request.
 * @param {string} path   - e.g. '/api/auth/me'
 * @param {object} opts   - standard fetch options (method, body, etc.)
 * @returns {Promise<{ok, status, data}>}
 */
export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem('vaygo_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(BASE + path, { ...opts, headers });
  const data = await res.json().catch(() => ({}));

  // Auto-logout on token expiry / invalid token
  if (res.status === 401) {
    localStorage.removeItem('vaygo_token');
    localStorage.removeItem('vaygo_user');
    window.location.href = '/login';
  }

  return { ok: res.ok, status: res.status, data };
}

/** Convenience wrappers */
export const apiGet  = (path)        => apiFetch(path, { method: 'GET' });
export const apiPost = (path, body)  => apiFetch(path, { method: 'POST',  body: JSON.stringify(body) });
export const apiPut  = (path, body)  => apiFetch(path, { method: 'PUT',   body: JSON.stringify(body) });
