# Origami — One fold at a time

A public, phone-friendly site for learning to fold real paper. 26 paper-folding projects, from the original six first projects to animal faces,
flowers, gifts, planes, a piano, a box and a samurai helmet. More involved models
are labeled “Next-step folding” in the gallery.

Each lesson includes paper shape/size, clear instructions, an original schematic
of the paper before each action, and a separate after-action view. New folds use
coral dashed lines and arrows; gray dashed lines indicate existing creases.
A short guide explains symbols, paper sides, turning over, tucking and opening.
Diagrams are recentered between frames for legibility, not physical simulations.

Swipe left/right on the diagram for next/previous, use the large buttons, or use
keyboard arrows. Vertical swipes scroll and pinch gestures remain available.
Progress is saved in this browser when storage is available; blocked or malformed
storage does not prevent folding. No accounts, analytics, or runtime dependencies.

Use **Copy lesson link** to share a model. For offline folding, open the built site and wait for the ready message under **Install for offline use**. The build generates the offline file list and cache version from the deployment files.

## Check, build, and preview

Use Node.js 26 and Python 3. The site has no npm dependencies.

```sh
npm run check  # checks and builds dist/
python3 -m http.server 8000 --directory dist
```

The Pages workflow runs the deployment smoke test against `dist/`. Run `node .github/site-smoke.mjs dist --assets-only` to check the offline file list locally.

Open http://localhost:8000. Lesson links use hashes and assets use relative paths,
so the site also works under `/origami/` on GitHub Pages.

- `src/models.js`, `src/more-models.js`: Folding sequences, paper requirements, before/after layers and references.
- `src/paper.js`: geometric clipping and reflection for flat folds, keeping existing creases through folds and turns; a fold can be limited to chosen layers (one flap). Perspective openings use authored schematic frames.
- `src/art.js`: SVG diagrams, crease symbols and arrows.
- `src/app.js`: hash routing, progress persistence and screen-reader announcements.
- `src/gallery.js`, `src/guide.js`, `src/lesson.js`: page rendering and controls. The lesson owns its current step and diagram view. `src/dom.js` provides shared DOM helpers.
- `src/styles.css`: shared styles, page layouts, diagram colors and responsive rules.
- `src/state.js`, `src/swipe.js`: guarded saved progress and touch navigation.
- `tools/build.mjs`: copies the source to `dist/` (or the directory given as its argument); optional `SITE_URL` sets canonical, Open Graph URL and share-image metadata. The build function also runs directly in tests.

The Node tests verify diagram continuity between steps, that every action visibly
changes the paper and every fold draws its fold line on the paper, crease handling,
all frames, data and progress boundaries, hash routing, celebrate/peek view helpers,
gesture handling, a 12px minimum type size, and the built site. They do not replace physical paper folding, visual review, or
real phone/browser testing.

### Shared site helpers

From the Origami checkout, run `node tools/sync-site-helpers.mjs` to check the
local copies in the sibling `~/vgit` repositories. The script lists the source
of each helper. Origami holds the source copies of the reusable Pages workflow
and the deployment smoke test. Each repository owns its workflow inputs in
`.github/workflows/pages.yml` and its smoke test routes in `.github/site-smoke.json`.
The local copies let each pull request test workflow changes alongside the
site they affect. After editing a source, run the same command with `--write` and
review the diffs in the affected repositories. Each site still builds from its
own checkout.

The deployment smoke test uses Playwright in CI. To run it locally with an
existing Playwright installation, set `PLAYWRIGHT_MODULE` to the absolute path
of its `playwright/index.mjs`, then run `node .github/site-smoke.mjs dist` after
building. Install that Playwright version’s Chromium before running the test.

## Publish

The GitHub Actions workflow tests and builds on pushes to `main`, then deploys
only `dist/` to https://veillette.github.io/origami/. It also supports manual runs.
In Settings → Pages, choose GitHub Actions as the source. No custom secrets are
needed. Deployment uses the configured Pages URL for canonical/Open Graph metadata.

## Model references and assets

These are traditional paper-folding models. Lesson text and SVG diagrams were
created for this project; reference illustrations are not redistributed.

- [Puppy](https://web-japan.org/kidsweb/virtual/origami/exploring02a.html) and [cup](https://web-japan.org/kidsweb/virtual/origami/exploring02b.html): Kids Web Japan.
- [Corner bookmark](https://wordsforlife.org.uk/activities/make-an-origami-bookmark/): Words for Life.
- [Paper hat](https://www.origami-fun.com/origami-hat.html) and [boat](https://www.origami-fun.com/origami-boat.html): Origami-Fun.
- [Fortune teller](https://origami-resource-center.com/fortune-teller/): Origami Resource Center.

DM Sans and DM Serif Display are self-hosted as WOFF2; their SIL Open Font Licenses are
included in `src/fonts/`. `src/og-image.png` is the link-preview image, drawn from the
site's own diagrams.

## Expanded collection

Twenty additions: cat face, fox face, rabbit face, bear face, whale, penguin,
fish, heart, flat tulip blossom, ice cream cone, house, piano, envelope, hand fan,
dart, blunt-nose glider, masu box, single-sail boat, samurai helmet and cicada.
Every model includes its construction reference in the lesson. All diagrams and
text are authored for this site; external photographs and PDFs are not bundled.

Flat-fold diagrams use reflected paper panels. Openings, squash folds, reverse
folds and perspective views are schematic, with written instructions explaining
the action. Model size or orientation may change between frames for clarity.
The two aircraft are classic paper-plane forms, alongside the traditional origami.
