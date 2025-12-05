const path = require('path');

// This finds the absolute path to the @ramme-io/ui package's directory
const rammeUiPath = path.dirname(require.resolve('@ramme-io/ui/package.json'));

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    // Load the preset from the absolute path we found
    require(path.join(rammeUiPath, 'tailwind.preset.js'))
  ],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Scan the library's files for classes using the absolute path
    path.join(rammeUiPath, 'dist/**/*.js'),
  ],
}