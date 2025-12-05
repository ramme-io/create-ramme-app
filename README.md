# Ramme App Starter

[![NPM Version](https://img.shields.io/npm/v/@ramme-io/create-app.svg)](https://www.npmjs.com/package/@ramme-io/create-app) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**The clean-room environment for modern product design.**

This repository is the official scaffolding tool for the Ramme ecosystem. It automates the setup of a production-grade frontend environment, pre-wiring the **Ramme UI** component library with the industry's most robust open-source technologies.

Designed for speed and structural integrity, this starter kit removes the friction of configuration so you can move from concept to interactive prototype in seconds.

---

## Quick Start

To scaffold a new project, run the initialization command in your terminal. This will generate a fresh directory with all dependencies linked and configured.

*(Replace `my-new-project` with your desired folder name).*

```bash
npm create @ramme-io/app@latest my-new-project
```

This single command will:
1.  **Scaffold** a high-performance Vite project structure.
2.  **Install** React 19, TypeScript, and Tailwind CSS.
3.  **Configure** the `@ramme-io/ui` component library and design tokens.
4.  **Optimize** linting and build settings for immediate deployment.

---

## Launch Sequence

Once the scaffolding is complete, initialize your local environment:

**1. Enter the project directory**
```bash
cd my-new-project
```

**2. Install dependencies**
```bash
pnpm install
# or npm install
```

**3. Ignite the dev server**
```bash
pnpm run dev
```

Your prototype is now live at `http://localhost:5173`.

---

## The Tech Stack

This starter kit is not a proprietary framework; it is an opinionated orchestration of the best open-source tools available:

* **Vite:** Next-generation tooling for instant server start and lightning-fast HMR (Hot Module Replacement).
* **React:** The standard library for building composable user interfaces.
* **TypeScript:** Statically typed JavaScript for scalable, robust application logic.
* **Tailwind CSS:** A utility-first styling engine configured with Ramme design tokens.
* **@ramme-io/ui:** A pre-installed suite of accessible, unstyled primitives based on Radix UI.

---

## The Ramme Ecosystem

This tool is part of a suite of developer resources maintained by **Excesspool Limited Liability Company**:

* **`@ramme-io/ui`**: The core library of visual primitives.
* **`@ramme-io/create-app`** (This Repository): The CLI scaffolding tool.

---

## License

Copyright © 2025 Excesspool Limited Liability Company.
This project is licensed under the [MIT License](LICENSE).