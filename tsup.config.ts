import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  sourcemap: true,
  format: ['esm', 'cjs'],
  outDir: 'dist',
  clean: true,
  minify: false,
  external: ['react', 'react-dom', 'styled-components', '@dxc-technology/halstack-client', '@dxc-technology/halstack-react']
});