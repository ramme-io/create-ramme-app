#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectPath = process.argv[2];

if (!projectPath) {
  console.error('Error: Please specify the project directory.');
  console.log('  Usage: npm create ramme-app@latest <project-directory>');
  process.exit(1);
}

const templatePath = path.resolve(__dirname, 'template');
const destinationPath = path.resolve(process.cwd(), projectPath);

try {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Critical Error: The template directory could not be found at ${templatePath}`);
  }

  console.log(`Creating a new Ramme app in ${destinationPath}...`);
  fs.copySync(templatePath, destinationPath);

  // --- This is the new part that renames the files ---
  const pkgJsonPath = path.join(destinationPath, 'pkg.json');
  const gitignorePath = path.join(destinationPath, 'gitignore');

  if (fs.existsSync(pkgJsonPath)) {
    fs.renameSync(pkgJsonPath, path.join(destinationPath, 'package.json'));
  }
  if (fs.existsSync(gitignorePath)) {
    fs.renameSync(gitignorePath, path.join(destinationPath, '.gitignore'));
  }
  // ---------------------------------------------------

  console.log(`\nSuccess! Your new Ramme app is ready.`);
  console.log('\nTo get started:');
  console.log(`  cd ${projectPath}`);
  console.log(`  pnpm install`);
  console.log(`  pnpm run dev\n`);

} catch (err) {
  console.error('\nAn error occurred during installation:', err);
  fs.removeSync(destinationPath); // Clean up in case of failure
  process.exit(1);
}