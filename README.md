# Autosana — Branchable AI Test Sessions

A frontend-heavy clickable prototype demonstrating **Branchable AI Test Sessions**: fork from any completed step, modify downstream actions, and explore edge cases without rerunning entire flows.

## Tech stack

- **Vite + React** (JSX)
- **Redux Toolkit** — app state, async pipeline/branch thunks
- **Material UI (MUI)** — components, theme, light/dark mode
- **Tailwind CSS** — layout utilities and gradient accents
- **Framer Motion** — animations

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Demo flow

1. Open **Flows** → **Create Flow** (defaults: Cars nearby + Contact information Form).
2. **Start** — main pipeline runs step-by-step in the center panel.
3. After all steps complete, use **Fork From Here** on a timeline step or **New** in Branch Testing.
4. Create a branch (presets available) — downstream steps replay with context reuse.
5. **Merge Instruction** combines main + branch text on the fork step.

## Project structure

```
src/
├── main.jsx          # Vite entry
├── store/            # Redux slice + thunks
├── lib/              # Mock data + utils
└── components/       # MUI-based UI + session panels
```

Mock data only — no backend, auth, or real browser automation.
# branch-testing-prototype
