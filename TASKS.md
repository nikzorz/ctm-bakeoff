# The bake-off script

Run this **with the Contractor**, at his pace, on his devices. Your job is to say the task out loud
and then shut up. Every time you explain something, that is the finding: write down what you had to
explain, because on a Tuesday in a truck you will not be there.

## Before you start

> **Read the session notes on [issue #16](https://github.com/nikzorz/ctm/issues/16) first.**
> They carry the fallback if provisioning is not finished, the vendor facts you may need
> in the room, and nine questions to ask him that this script does not cover. This file is
> only the task list.


- Desktop with Chrome or Edge (Sveltia's local mode is Chromium-only; the deployed arms are not).
- His phone, on cell data, **not** your wifi. The download numbers below are the whole point.
- The three surfaces, all pointed at the same `content/` folder:

| Arm | Route | What it is |
|---|---|---|
| 1 | `/admin/` | Sveltia CMS |
| 2 | `/tina-admin/` | TinaCMS |
| 3 | `/upload/` plus an agent in the repo | No CMS |

## Order

Run **task by task, not arm by arm**, and rotate which arm goes first on each task. He will get faster
as he learns the content regardless of surface, so whichever arm goes last looks best. Rotating spreads
that error instead of handing it to one arm. Say so in the write-up rather than pretending it is absent.

## The tasks

**1. Add Countertops as a new Service, with a photo, from the phone.**
Countertops is genuinely missing from his live site today despite being a headline service, so this is
a real job and not a drill. Arm 3 does it by asking an agent. Record: did he find "add", did he know
what a slug was, did the photo come off the camera roll without help.

**2. Fix the typo in the homepage headline.**
It reads "high-qaulity". Real, live, on his site right now. Record whether he can find page copy at all.

**3. Add five photos from the camera roll to the green mosaic shower Project.**
This is the task he will actually do most often. It is the one the whole Arm 3 upload page exists for.
Record: HEIC handling, how many taps, whether the upload survived him locking the phone mid-way.

**4. Reorder the services so Countertops is second.**
Record whether ordering is discoverable or whether he has to know the `order` field exists.

**5. Delete or rename "Secure Build Compliance".**
The map already calls it "not a service". Record whether deleting content frightens him, and whether
anything warns him it is live on the site.

**6. Try to publish a Service with no photo.**
The rule now lives in CI (`scripts/validate.mjs`), so it holds in every arm. **This task is about the
error message, not the rule.** Each arm refuses differently: Sveltia and Tina refuse in the form, Arm 3
refuses in a CI log. Show him each refusal and ask what he would do next. "Text Nik" is a valid and
damning answer.

**7. Fix "Wedmesday" in the business hours.**
It is in `content/site.config.json`, not in a Markdown file. Watch what each arm does with a config
file. Note that both CMS configs had to name the misspelled key *in the config itself*, so in arms 1
and 2 fixing the typo properly is a developer edit, not a content edit.

**8. Arm 3 only: change a headline and add a Service with an agent, unaided.**
Sit on your hands. An agent that commits to the wrong branch or writes invalid frontmatter is this
arm's cryptic validation error.

**9. Log out of all three. Come back in a week and log back in.**
Do not skip this and do not simulate it. It is the one axis no amount of local testing reaches, and
the ticket names it as where these tools lose non-technical users.

## What to write down

For each task and arm: **did he finish it unaided, yes or no**, every hesitation, and every sentence
you had to say. Then the one question that decides this ticket:

> Would he post photos of a finished bathroom on a Tuesday without texting Nik?

## Numbers already measured, so you do not have to

| | Sveltia | Tina | Arm 3 |
|---|---|---|---|
| Editor download, gzipped, before lazy chunks | **601 KB** | **2,152 KB** | ~8 KB |
| Packages added to the repo | 0 | **613** | 0 |
| `node_modules` added | 0 | **673 MB** | 0 |
| Native binaries pulled in | 0 | 1 (`better-sqlite3`, via `@tinacms/search`, a TinaCloud-only feature) | 0 |
| Build step added | none | 31 s and a generated GraphQL client | none |
| Share of the deployed site that is the editor | small | **91%** | none |

These are measured on this repo at `astro@7.3.3`, `tinacms@3.14.0`, `@sveltia/cms@0.216.1`.
Do not re-argue them in the room. Spend the session on the only thing they cannot tell you,
which is whether he will use it.
