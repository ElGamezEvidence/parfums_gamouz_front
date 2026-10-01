# Déploiement Netlify — GAAMOUZE frontend

## Paramètres du site

| Champ | Valeur |
|--------|--------|
| **Base directory** | `frontend` (si le repo contient tout le monorepo) **ou** racine si seul le dossier frontend est poussé |
| **Build command** | `npm ci && npm run build` |
| **Publish directory** | `dist` |

## Variables (Build)

| Variable | Valeur |
|----------|--------|
| `VITE_API_URL` | `https://parfumsgamouzback-production.up.railway.app/api/v1` |

## SPA / 404

`netlify.toml` et `public/_redirects` renvoient toutes les routes vers `index.html` (React Router).

## Railway (CORS)

Mettre l’URL Netlify dans `FRONTEND_URL` et `CORS_ORIGIN`, ou s’appuyer sur l’autorisation `*.netlify.app` (backend récent).
