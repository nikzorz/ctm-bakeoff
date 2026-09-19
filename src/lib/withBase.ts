// Content stores site-absolute media paths (`/photos/x.jpg`) because that is what each
// CMS writes into frontmatter. Prefixing at render keeps those paths portable when the
// site is served from a subdirectory rather than a domain root.
export const withBase = (path: string): string =>
  import.meta.env.BASE_URL.replace(/\/$/, '') + path;
