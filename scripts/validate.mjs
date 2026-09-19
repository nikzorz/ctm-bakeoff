#!/usr/bin/env node
// Standalone on purpose: imports nothing from Astro, so it survives the Eleventy
// fallback named in ADR 0002. Enforces "no photo, no publish" by failing the build,
// because a Service that silently does not appear is the unattended failure mode
// that constraint 5 bans.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const data = {};
  let listKey = null;
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) {
      data[listKey].push(unquote(item[1]));
      continue;
    }
    const pair = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!pair) continue;
    const [, key, value] = pair;
    if (value === '' || value === '[]') {
      data[key] = [];
      listKey = value === '' ? key : null;
      if (value === '[]') data[key] = [];
    } else {
      data[key] = unquote(value);
      listKey = null;
    }
  }
  return data;
}

const unquote = (s) => s.trim().replace(/^["'](.*)["']$/, '$1');
const isTrue = (v) => v === true || v === 'true';

const errors = [];

function checkPhoto(where, field, value) {
  if (!value || (Array.isArray(value) && value.length === 0)) return false;
  const rel = String(value).replace(/^\//, '');
  if (!existsSync(join(publicDir, rel))) {
    errors.push(
      `${where}\n    ${field} points at "${value}", but public/${rel} is not on disk.\n` +
      `    Either upload that photo again, or pick one that is already there.`
    );
  }
  return true;
}

for (const kind of ['services', 'projects']) {
  const dir = join(root, 'content', kind);
  if (!existsSync(dir)) continue;
  const noun = kind === 'services' ? 'Service' : 'Project';
  for (const name of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const where = `content/${kind}/${name}`;
    const data = parseFrontmatter(readFileSync(join(dir, name), 'utf8'));
    if (!data) {
      errors.push(`${where}\n    No frontmatter block found. The file must start with ---.`);
      continue;
    }
    if (!data.title) errors.push(`${where}\n    A ${noun} needs a title.`);

    const published = data.published === undefined ? true : isTrue(data.published);
    const hasPhoto = checkPhoto(where, 'photo', data.photo);
    if (published && !hasPhoto) {
      errors.push(
        `${where}\n    This ${noun} is published but has no photo.\n` +
        `    A ${noun} must have a photo before it can go on the site.\n` +
        `    Add one, or set "published: false" to keep it as a draft.`
      );
    }
    for (const g of data.gallery || []) checkPhoto(where, 'gallery', g);
  }
}

if (errors.length) {
  console.error(`\n  ${errors.length} problem${errors.length > 1 ? 's' : ''} stopped the site from building:\n`);
  for (const e of errors) console.error(`  - ${e}\n`);
  process.exit(1);
}
console.log('  Content OK: every published Service and Project has a photo that exists.');
