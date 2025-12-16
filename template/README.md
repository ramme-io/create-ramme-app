# Ramme App Starter

Welcome to your new **Ramme** application!
This project was scaffolded using `create-ramme-app`.

## 🚦 Getting Started

**Install dependencies:**
```bash
npm install
# or
pnpm install
# or
yarn
```

**Start the development server:**
```bash
npm run dev
```

**Open your browser:**
Visit `http://localhost:5173` to see your app.

## 🏗️ Project Structure

**`src/config/app.manifest.ts`**: The "Brain" of your app. Define your app's title, description, and high-level settings here.
**`src/config/sitemap.ts`**: The "Skeleton." Define your pages and navigation structure here.
**`src/core/component-registry.tsx`**: Maps JSON component names (from the builder) to actual React components.
**`src/pages`**: Your actual page components.
**`src/data`**: Mock data generators and seed files.

## 🎨 Customization

### changing the Theme
Go to `src/index.css` or `tailwind.config.js` to update your brand colors.

### Adding New Pages
1.  Create a new component in `src/pages`.
2.  Register it in your `sitemap.ts` (or the relevant template sitemap).
3.  The `RouteGenerator` will automatically handle the routing!

## 📚 Learn More

- [Ramme UI Documentation](https://ramme.io/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)