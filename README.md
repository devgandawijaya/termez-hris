# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Project structure (MVVM)

This frontend-only template has been reorganised following a **simple MVVM pattern**:

```
src/
├── models/            # business/data models
├── viewmodels/        # hooks or classes exposing data & operations
├── views/             # React components (pure presentation)
├── App.jsx            # top-level view
├── index.css          # global styles (now Tailwind)
└── main.jsx           # app entry
```

The `CounterView`, `useCounterViewModel` and `CounterModel` files are examples showing how to keep logic separated from UI.

## Styling with Tailwind CSS

Tailwind has been added to the project – install dependencies with `npm install` or `yarn` then run the dev server as usual (`npm run dev`).
Global styles are defined in `src/index.css` using the `@tailwind` directives.

## CORS / API proxy setup

During development, the Vite server is configured with `cors: true` and a simple proxy under `/api` to avoid cross‑origin issues. Modify `vite.config.js` to point at your backend.

## Docker & Docker Compose 🚢

A `Dockerfile` is already provided to build a multi-stage production image served by nginx. You can use `docker-compose` to simplify local development and deployment.

### Production build

```bash
# build and start the container, listening on port 80
docker compose up --build
```

### Development mode

A `dev` service in `docker-compose.yml` starts a Node container with the source mounted and runs `npm run dev` on port `5173`.

```bash
docker compose up dev
```

Both services share the same project root and respect `.dockerignore` exclusions.

Modify the compose file as needed for additional services such as an API backend.

