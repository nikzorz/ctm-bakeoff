# Prototype: editing surface bake-off

Throwaway. It exists to answer one question, recorded on
[issue #16](https://github.com/nikzorz/ctm/issues/16): of the two shortlisted CMSes and the
no-CMS arm raised later, **which editing surface will the Contractor actually use?**

**Read [TASKS.md](TASKS.md).** That is the script you run with him. Everything else here exists
to make those tasks possible.

## The shape of the experiment

One content folder, three editing surfaces pointed at it. All three arms store content identically
as Markdown with frontmatter, which is what makes the comparison fair: whichever wins, switching
later is a config change rather than a migration.

```
content/            <- the one substrate. Every arm reads and writes exactly this.
  services/         3 Services, verbatim from the live site. Countertops is deliberately
                    missing, because adding it is task 1.
  projects/         3 Projects, built from the only 3 photographs the live site has.
  pages/            home and about copy, typo included.
  site.config.json  phone, email, hours. "Wedmesday" is real.
public/photos/      the 3 real photographs, deduplicated.
public/admin/       Arm 1: Sveltia CMS. index.html + config.yml.
public/upload/      Arm 3: the mock upload page.
tina/config.ts      Arm 2: TinaCMS schema.
scripts/validate.mjs  "no photo, no publish", in CI, so it holds in all three arms.
```

## Why the content is the real site's content

Three Services, three photographs, the "high-qaulity" typo, the "Wedmesday" typo, and the
"Secure Build Compliance" non-service are all lifted verbatim from `coloradotilemasters.com`
on 2026-09-19. A bake-off on invented content measures the wrong thing.

One finding fell out of collecting it: **the entire live site runs on three distinct photographs**,
each used twice, at 429x389. His real content problem is not editing copy. It is getting
photographs onto the site, which is exactly what task 3 tests.

## Running it

```sh
npm install
npm run validate   # the CI content rule; try breaking it, the message is the test
npm run build      # Astro, static, 4 pages
npm run dev        # http://localhost:4321

npm run tina:dev   # Arm 2 in local mode: no TinaCloud account, and no auth either
```

`PROVISION.sh` walks you through the accounts the deployed arms need. Local mode is not enough
to judge this ticket: neither CMS authenticates anybody locally, and auth is precisely where the
ticket says these tools lose non-technical users.

## What this prototype cannot tell you

- **Session longevity.** Task 9 needs a real week. There is no shortcut and no vendor
  documentation stating token lifetimes for either product.
- **Vendor outage.** Tina local mode never calls TinaCloud, so you never see what an editor sees
  when it is down.
- **Whether the Contractor keeps a GitHub account.** He has one today. Whether 2FA still works in
  a month is the open risk, and it takes Sveltia and Arm 3 down together if it fails.

## Files

| File | What it is |
| --- | --- |
| `TASKS.md` | The script. Run this with him. |
| `COSTING.md` | What Arm 3's upload page really costs to build, since the one here is a mock. |
| `scripts/validate.mjs` | The photo rule. Standalone, imports nothing from Astro. |
| `PROVISION.sh` | Account setup for the deployed arms. |
