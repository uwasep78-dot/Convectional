# CCR Website Frontend

A responsive React + Vite frontend for CONVENTIONAL COMPLEX & DUTIES AND RENEWABLE SYSTEM LTD., designed around the supplied company logo and its navy, orange, and green palette.

## Run locally

1. Install Node.js 18 or newer.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev` and open the local URL printed by Vite.
5. Run `npm run build` to create a production build.

## Deploy to Render

Use the repository's `render.yaml` blueprint to create the static site. The build script installs the locked frontend dependencies, including Vite's development dependencies, before building and publishing `dist`. This also supports existing Render services configured with the `frontend` root directory and `npm run build` build command.

## Included pages

- Home, About, Services and service detail pages
- Projects, product categories, and technical training
- Contact and quotation request forms
- Privacy and terms placeholder pages
- Browser-based demo admin workspace at `/admin`

## Important before production

- Contact and quotation submissions are saved only in the current browser's local storage. They are not sent to the company or to email.
- The admin workspace is a demo and has no authentication, role permissions, or shared database. Do not use it for real customer data.
- Product categories and project examples are illustrative, not live stock or verified completed projects.
- Review legal pages and company details before publishing. Connect a secure backend, database, authentication, server-side validation, and notification/email service before accepting real submissions.
- The supplied logo is used at `public/assets/company-logo.png`.
