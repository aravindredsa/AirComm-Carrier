#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const skipDirs = new Set([
  '.git',
  '.github',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.next',
  '.nuxt',
  'bin',
  'obj'
]);

const markers = {
  backend: false,
  frontend: false,
  db: false
};

function scan(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.isDirectory() && skipDirs.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    const name = entry.name.toLowerCase();

    if (entry.isDirectory()) {
      scan(fullPath);
      if (markers.backend) {
        return;
      }
      continue;
    }

    if (name.endsWith('.csproj') || name.endsWith('.sln')) {
      markers.backend = true;
      return;
    }

    if (name === 'package.json' || name === 'tsconfig.json' || name.startsWith('vite.config.')) {
      markers.frontend = true;
    }

    if (name.endsWith('.sql')) {
      markers.db = true;
    }
  }
}

scan(root);

if (markers.backend) {
  process.stdout.write('backend');
} else if (markers.frontend) {
  process.stdout.write('frontend');
} else if (markers.db) {
  process.stdout.write('db');
} else {
  process.stdout.write('unknown');
}
