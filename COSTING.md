# Arm 3: what the upload page actually costs to build

The mock at `/upload/` is a mock. This is the honest estimate of the real thing, written
because [#13](https://github.com/nikzorz/ctm/issues/13) warned that Arm 3's page is "a route in
a build that has not happened" and must be costed against Sveltia's PWA, which exists today.

## The part the mock hides

Arm 3 stores gallery content in **git**, like every other arm. So the upload page cannot just
stream into R2 the way the Lead form does: a Lead photo is private and lives in R2 forever, but
a **Project** photo is site content and has to reach the repo before the static build can include
it. The upload page is therefore a **git write path**, which is the same job Sveltia does, except
we write and own it.

That single fact is what separates Arm 3 from "a small upload form".

## Scope

| Piece | Shape | Judgment or mechanical |
|---|---|---|
| Worker route serving the page, behind Cloudflare Access | +1 route on the existing `worker/index.ts` | mechanical |
| Multipart parse, magic-byte sniff, per-file and per-request caps | reuses the Lead-form logic ADR 0004 settled | mechanical |
| Client-side downscale and HEIC to JPEG before upload | new; `sharp` is unavailable, so this is canvas work in the browser | judgment |
| Commit N photos plus one `.md` in a single commit | GitHub Git Data API: blobs, then tree, then commit, then update ref. The simple Contents API cannot do multi-file atomically | **judgment, and the risky part** |
| Conflict handling when `main` moved under you | retry the tree/commit against the new head | judgment |
| A token that can push to `main`, held as a Worker secret | GitHub App install token preferred over a PAT | judgment |
| `wrangler.jsonc` bindings and an Access policy | config | mechanical |

**Files touched:** roughly five. `worker/index.ts`, a new commit helper, the upload page, `wrangler.jsonc`,
and the Access policy. **New code:** on the order of 400 to 500 lines, of which the git-commit dance is
about a third and carries nearly all of the difficulty.

**Risk: moderate to high**, higher than anything else on this map. It is a write path into the content
repo holding a credential that can push to `main`. A bug commits garbage; a leak is worse. Sveltia's
equivalent risk sits with the editor's own GitHub account and GitHub's own permission model, not with
a token we mint and store.

**Blast radius:** the content repo. Not Leads, not the live site's availability, since a bad commit
fails CI at `scripts/validate.mjs` rather than publishing.

## The asymmetry worth naming

Arm 3 is genuinely **free for text**. Editing copy in Markdown with an agent costs zero lines of our
code, and it is the arm constraint 8 scores highest. The entire cost above buys one thing: getting
photographs off a phone and into the repo.

So Arm 3 is not "no CMS". It is "no CMS for the job he does rarely, and a bespoke single-purpose CMS
for the job he does often". Judge it on that sentence.

## What Sveltia costs for the same job

Zero lines of our code, and one thing to operate: the `sveltia-cms-auth` Worker, which the vendor
supplies and which exists because Sveltia has **no hosted auth by stated policy** ("legal, privacy and
security liabilities that we cannot afford"). Deploying it is configuration, not construction.

Against that, Sveltia's costs are a permanent GitHub account with **write** collaborator access for the
Contractor, a pre-1.0 version (`0.216.1`, v1.0 expected late 2026), and a runtime dependency on
`unpkg.com` on every editor load, including the lazily fetched HEIC decoder.
