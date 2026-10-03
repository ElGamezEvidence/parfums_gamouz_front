/** Placeholder neutre (pas de photo stock type Chanel / Unsplash). */
export const PRODUCT_IMAGE_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <rect fill="#f5f0e8" width="400" height="500"/>
      <text fill="#9ca3af" x="200" y="250" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14">GAMOUZE</text>
    </svg>`
  );

export function applyImageFallback(event) {
  if (event?.currentTarget) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
  }
}
