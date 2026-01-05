/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    // ✅ STANDARD: Directly require the preset from the package
    require('@ramme-io/ui/tailwind.preset.js')
  ],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    
    // ✅ STANDARD: Point directly to node_modules relative to this config file
    // This is the industry standard way (like how Flowbite or Shadcn work)
    "./node_modules/@ramme-io/ui/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}