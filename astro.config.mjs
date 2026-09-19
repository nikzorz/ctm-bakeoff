import { defineConfig } from 'astro/config';

// ADR 0001: the framework runs at build time only. Static output, no adapter,
// and @astrojs/cloudflare is never installed.
export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.SITE_BASE || undefined,
});
