# QRport — Self-hosted dynamic QR codes

A private Netlify application for creating QR codes with editable destinations. No Bitly account required.

## Deploy to Netlify

1. Extract this project and upload it to a GitHub repository (or import the folder using Netlify CLI).
2. In Netlify, **Add new project → Import an existing project** and select the repository.
3. The project includes `netlify.toml`: build command `npm run build`, publish directory `dist`.
4. In **Project configuration → Environment variables**, add `QR_ADMIN_PASSWORD` and enter a long randomly generated password of at least 16 characters. Set it for Functions (or All scopes). Do not commit this password to Git.
5. Deploy. Open the site and log in using the password. Netlify Blobs will automatically provision storage when functions run.
6. Create a QR code, copy the short URL, download PNG or SVG, then update its destination from the Design Studio.
7. For print longevity, set up a **custom domain you own** (e.g. `qr.youragency.com`) **before** generating permanent QR codes. Migrating the domain later will not automatically update printed codes.

## Local development

Node.js 20.19+ recommended. Run `npm install`, then `npx netlify dev`. For local function auth set `QR_ADMIN_PASSWORD` in a local `.env` (not committed). Vite by itself does not run the Netlify Functions.

## Notes and limitations

- All QR codes encode `https://<your-domain>/r/<id>` and the redirect returns HTTP 302. Updating a destination never changes the encoded link.
- **Current functionality:** create / list / edit / delete dynamic links, private dashboard, vector SVG and 1800px PNG exports, shape and color controls.
- **Not yet implemented:** NG QRCode-style AI image generation, scan analytics, user-specific accounts, automated scannability testing, collections, custom slug editing, and bulk CSV import.
- Module variations and colors may affect real-world scanning. Test at final physical size, on print stock and multiple mobile phones, before production.
- A deleted record leaves a dead QR redirect. Never delete a live printed code unless intended.
- Site-wide Blobs storage persists across deployments. Basic password gate is appropriate for a small private workspace, **not** a multi-tenant commercial product. Use proper identity auth and a transactional DB for that.
- Avoid using deploy previews with write access to your production storage. Netlify's site-wide Blob store is shared across deploy contexts.
- The redirect currently does not collect analytics. A naive counter on Blobs would lose increments under concurrent traffic. A dedicated append-only event system / database is better for analytics.
- Keep Netlify and your custom domain active. No hosted redirect can genuinely guarantee it will function forever without maintenance.
- The redirect accepts http(s) URLs as admin-configured destinations. Treat the admin password as sensitive and never expose it in client source code or logs.

### Routing correction (October 2026)
The public `/r/:slug` URL is handled directly by `netlify/functions/redirect.mjs` via `config.path`; no Netlify redirect rewrite is required. This preserves existing QR URL identifiers.
