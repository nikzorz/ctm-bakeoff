import { defineConfig } from 'tinacms';

// Arm 2: TinaCMS. Same content/ folder as every other arm.
// Tina means TinaCloud: no self-hosted backend runs on Workers, so clientId and
// token below are not optional in production. Local mode (`npm run tina:dev`)
// needs neither, and also authenticates nobody, which is exactly the part of this
// arm that has to be judged with a real project.
export default defineConfig({
  branch: process.env.TINA_BRANCH || 'main',
  clientId: process.env.TINA_PUBLIC_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  build: { outputFolder: 'tina-admin', publicFolder: 'public' },
  media: { tina: { mediaRoot: 'photos', publicFolder: 'public' } },
  schema: {
    collections: [
      {
        name: 'services',
        label: 'Services',
        path: 'content/services',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Name', isTitle: true, required: true },
          { type: 'number', name: 'order', label: 'Order on the page', required: true },
          { type: 'image', name: 'photo', label: 'Photo', required: true },
          { type: 'string', name: 'summary', label: 'Short description', ui: { component: 'textarea' } },
          { type: 'boolean', name: 'published', label: 'Show on the site' },
          { type: 'rich-text', name: 'body', label: 'Full description', isBody: true },
        ],
      },
      {
        name: 'projects',
        label: 'Gallery',
        path: 'content/projects',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Name', isTitle: true, required: true },
          {
            type: 'string', name: 'roomType', label: 'Room', required: true,
            options: ['kitchen', 'bathroom', 'living room', 'laundry', 'entryway', 'outdoor'],
          },
          { type: 'string', name: 'location', label: 'Town', required: true },
          { type: 'number', name: 'order', label: 'Order in the gallery', required: true },
          { type: 'image', name: 'photo', label: 'Main photo', required: true },
          { type: 'image', name: 'gallery', label: 'More photos', list: true },
          { type: 'boolean', name: 'published', label: 'Show on the site' },
          { type: 'rich-text', name: 'body', label: 'Notes', isBody: true },
        ],
      },
      {
        name: 'pages',
        label: 'Page copy',
        path: 'content/pages',
        format: 'md',
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'title', label: 'Page title', isTitle: true, required: true },
          { type: 'string', name: 'heading', label: 'Heading' },
          { type: 'string', name: 'heroHeadline', label: 'Headline' },
          { type: 'string', name: 'heroSubhead', label: 'Sub-headline', ui: { component: 'textarea' } },
          { type: 'string', name: 'heroCta', label: 'Button text' },
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
        ],
      },
      {
        name: 'settings',
        label: 'Business details',
        path: 'content',
        format: 'json',
        match: { include: 'site.config' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'businessName', label: 'Business name' },
          { type: 'string', name: 'tagline', label: 'Tagline' },
          { type: 'string', name: 'phone', label: 'Phone' },
          { type: 'string', name: 'email', label: 'Email' },
          { type: 'string', name: 'serviceArea', label: 'Service area' },
          {
            type: 'object', name: 'hours', label: 'Business hours',
            fields: [
              { type: 'string', name: 'Monday', label: 'Monday' },
              { type: 'string', name: 'Tuesday', label: 'Tuesday' },
              { type: 'string', name: 'Wedmesday', label: 'Wedmesday (sic)' },
              { type: 'string', name: 'Thursday', label: 'Thursday' },
              { type: 'string', name: 'Friday', label: 'Friday' },
            ],
          },
        ],
      },
    ],
  },
});
