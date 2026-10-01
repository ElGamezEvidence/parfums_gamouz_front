const DEV_DEFAULT = 'http://localhost:3000/api/v1';

let resolvedBaseUrl = '';

function normalizeApiUrl(url) {
  if (url == null || url === '') return '';
  return String(url).trim().replace(/\/$/, '');
}

/** URL effective (après initApiConfig en production). */
export function getApiBaseUrl() {
  if (resolvedBaseUrl) return resolvedBaseUrl;
  const fromEnv = normalizeApiUrl(import.meta.env.VITE_API_URL);
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return DEV_DEFAULT;
  return '';
}

/**
 * Charge VITE_API_URL (build) ou public/config.json (runtime, sans rebuild).
 */
export async function initApiConfig() {
  const fromEnv = normalizeApiUrl(import.meta.env.VITE_API_URL);
  if (fromEnv) {
    resolvedBaseUrl = fromEnv;
    return resolvedBaseUrl;
  }

  if (import.meta.env.PROD) {
    try {
      const res = await fetch('/config.json', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const fromFile = normalizeApiUrl(data.apiUrl || data.VITE_API_URL);
        if (fromFile) {
          resolvedBaseUrl = fromFile;
          return resolvedBaseUrl;
        }
      }
    } catch {
      /* config.json optional */
    }
    console.error(
      '[GAAMOUZE] VITE_API_URL manquant au build et config.json introuvable — définissez VITE_API_URL sur Vercel/Netlify ou public/config.json'
    );
    resolvedBaseUrl = '';
    return resolvedBaseUrl;
  }

  resolvedBaseUrl = DEV_DEFAULT;
  return resolvedBaseUrl;
}
