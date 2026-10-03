import { getPublicMediaOrigin } from '../config/apiBaseUrl.js';

/** Placeholder neutre (pas de photo stock type Chanel / Unsplash). */
export const PRODUCT_IMAGE_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <rect fill="#f5f0e8" width="400" height="500"/>
      <text fill="#9ca3af" x="200" y="250" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14">GAMOUZE</text>
    </svg>`
  );

/**
 * En prod Netlify, les fichiers `/uploads/*` passent par un proxy same-origin (netlify.toml).
 * Réécrit les URLs Railway absolues en chemin relatif pour éviter CORP / blocages cross-site.
 */
export function resolveProductImageUrl(url) {
  if (url == null) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;

  const mediaOrigin = getPublicMediaOrigin();

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    if (import.meta.env.PROD && typeof window !== 'undefined') {
      return trimmed;
    }
    return mediaOrigin ? `${mediaOrigin}${trimmed}` : trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.pathname.startsWith('/uploads/')) {
      if (import.meta.env.PROD && typeof window !== 'undefined') {
        return `${parsed.pathname}${parsed.search}`;
      }
      if (mediaOrigin && trimmed.startsWith(`${mediaOrigin}/`)) {
        return trimmed;
      }
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

export function applyImageFallback(event) {
  if (event?.currentTarget) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
  }
}
