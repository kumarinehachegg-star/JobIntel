# JobIntel

## Imported from rekha/JobIntel

# JobScout

## Project info

This repository contains the JobScout web application.

Repository layout (scaffold):

- `frontend/` — (current app lives at project root `src/` and `public/`) Front-end React app. We can move files here on request.
- `backend/` — Express + TypeScript starter (see `backend/README.md`).
- `database/` — database migrations and helpers.
- `types/` — shared TypeScript types used across services.

## Editing and running locally

You can edit and run this project locally with Node.js and npm installed. Follow these steps:

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Monorepo commands

Run both services locally (requires root dependencies installed):

```bash
# install dev tools at root
npm install

# install workspace dependencies
npm run install:all

# run frontend + backend concurrently
npm run dev
```

Or use the `Makefile`:

```bash
make install
make dev
```

CI: see `.github/workflows/ci.yml` for the basic pipeline (install, lint, build).

## Deployment

Build with `npm run build` and deploy the generated `dist` directory to your hosting provider.
