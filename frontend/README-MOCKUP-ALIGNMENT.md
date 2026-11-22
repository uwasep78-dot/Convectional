# CCR Website — Mockup Alignment Notes

This frontend is organized around the supplied CCR visual mockup and company identity: navy blue, white, orange, and green.

## Pages included
- `/` — Home
- `/about` — About us
- `/services` and `/services/:slug` — Services and individual service details
- `/projects` — Projects showcase with category filtering
- `/products` — Products and supplies with search/filter controls
- `/training` — Technical training topics
- `/contact` — Contact form
- `/quotation` — Request a quotation form
- `/admin/login` — Branded admin login screen (front-end demo only)
- `/admin` — Admin demo dashboard
- `/privacy-policy` and `/terms-of-use` — Starter legal information

## Important implementation notes
- Public pages share the same header, brand palette, buttons, footer, and responsive layout.
- The contact and quotation forms store submissions in this browser's localStorage only. They do not send email or persist to a shared database.
- `/admin/login` is a visual demonstration and does not authenticate users. Do not use it as real access control until connected to a secure backend.
- The supplied mockup is a visual reference. Photo backgrounds and live business data should be replaced with approved company photographs and verified content before production.

## Run locally
1. Install Node.js LTS.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL printed by Vite.
