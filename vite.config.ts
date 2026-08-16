import { defineConfig } from 'vite';

export default defineConfig(({ command, isPreview }) => ({
  root: '.',
  // `vite preview` はビルド済み成果物(base込みのHTML)を配信するため、
  // command自体は 'serve' のままでも base は build と同じにする必要がある。
  base: command === 'build' || isPreview ? '/rent-strolling/' : '/',
}));
