import { defineConfig } from 'vite'
import vitePluginCssMissplaceRoot from './tools/vitePluginCssMissplaceRoot';
import vitePluginCssGtk from './tools/vitePluginCssGtk';

export default defineConfig({
  plugins: [
    vitePluginCssGtk(),
    vitePluginCssMissplaceRoot(),
  ],
  // css: {
  //   preprocessorOptions: {
  //     scss: { // avoid annoying warning: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
  //       api: 'modern-compiler' // or "modern"
  //     }
  //   }
  // },
  // build: {
  //   rollupOptions: {
  //     input: {
  //       main: 'index.html',
  //       scrollbars: 'public/scrollbars.html' // Tambahkan file foo.html sebagai entry point
  //     }
  //   }
  // }
});
