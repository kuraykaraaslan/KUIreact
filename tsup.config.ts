import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
  entry: {
    index: 'index.ts',
    ui: 'modules/ui/index.ts',
    app: 'modules/app/index.ts',
    common: 'modules/domains/common/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: {
    compilerOptions: {
      incremental: false,
    },
  },
  clean: true,
  sourcemap: false,
  external: [
    'react',
    'react/jsx-runtime',
    'react-dom',
    'next',
    '@fortawesome/react-fontawesome',
    '@fortawesome/fontawesome-svg-core',
    '@fortawesome/free-solid-svg-icons',
    '@fortawesome/free-brands-svg-icons',
    '@fortawesome/free-regular-svg-icons',
    'chart.js',
    'react-chartjs-2',
    'quill',
    'leaflet',
    'react-leaflet',
    'zustand',
    'zod',
    'countries-list',
    'country-flag-icons',
    'iso-639-1',
    'kui-viewer',
    'react-hook-form',
    '@hookform/resolvers',
  ],
  esbuildOptions(options) {
    options.alias = { '@': resolve('.') };
    options.banner = { js: '"use client";' };
  },
});
