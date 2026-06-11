/**
 * Authenticated API client with automatic token refresh.
 *
 * Usage (drop-in replacement for fetch):
 *   import { apiFetch } from '../utils/api';
 *   const res = await apiFetch('/api/user/profile');
 */

const BASE_URL = 'http://127.0.0.1:8000';

let isRefreshing = false;
let refreshQueue = []; // callbacks waiting for the new token

function processQueue(error, token = null) {
    refreshQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    refreshQueue = [];
}

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token available');

    const res = await fetch(`${BASE_URL}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
        // Refresh itself failed — force logout
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
    }

    const data = await res.json();
    localStorage.setItem('access_token', data.access_token);
    return data.access_token;
}

/**
 * Fetch wrapper that:
 * 1. Automatically attaches the Authorization header.
 * 2. On 401, refreshes the token once and retries.
 * 3. Queues concurrent requests during refresh so only one refresh happens.
 * 4. Forces logout if the refresh token is also expired.
 */
export async function apiFetch(path, options = {}) {
    const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
    const token = localStorage.getItem('access_token');

    const makeHeaders = (tok) => ({
        ...(options.headers || {}),
        ...(tok ? { Authorization: `Bearer ${tok}` } : {}),
    });

    let response = await fetch(url, {
        ...options,
        headers: makeHeaders(token),
    });

    // If not a 401 or no token to refresh, return as-is
    if (response.status !== 401) return response;

    // --- Handle 401: attempt token refresh ---
    if (isRefreshing) {
        // Another refresh is already in flight — queue this request
        return new Promise((resolve, reject) => {
            refreshQueue.push({
                resolve: async (newToken) => {
                    const retried = await fetch(url, {
                        ...options,
                        headers: makeHeaders(newToken),
                    });
                    resolve(retried);
                },
                reject,
            });
        });
    }

    isRefreshing = true;
    try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        // Retry the original request with the new token
        response = await fetch(url, {
            ...options,
            headers: makeHeaders(newToken),
        });
        return response;
    } catch (err) {
        processQueue(err, null);
        throw err;
    } finally {
        isRefreshing = false;
    }
}
