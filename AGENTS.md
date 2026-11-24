# Working on Origami

- Edit the site in `src/`. `tools/build.mjs` generates `dist/`, including the
  service worker and its list of offline assets.
- Edit folding sequences in `src/models.js` or `src/more-models.js`. Keep model
  IDs stable for lesson links and saved progress. Preserve the reference and
  check that the before and after diagrams agree with the folding action.
- Use Node.js 26. Run `npm run check` and
  `node .github/site-smoke.mjs dist --assets-only`. Check changed folding
  instructions in the browser and with a physical fold.
- This checkout holds the canonical Pages workflow and deployment smoke test.
  When editing a shared source listed in `tools/sync-site-helpers.mjs`, run
  `node tools/sync-site-helpers.mjs --write` from this checkout and review the
  affected sibling repos. Every site can build from its own checkout.
- One-way sync: edit shared gallery/lesson shell helpers, PWA, copy-link, and
  CI smoke files here, then sync out to sketchbook, field-and-verge,
  ukulele-first-strum, A-Table, and aperitif as listed in
  `tools/sync-site-helpers.mjs`. Do not edit those copies in the sibling repos
  unless you are also updating the Origami source in the same change.
- Browser `store` lives in aperitif `js/storage.js` and is synced here as
  `src/storage.js`. Edit storage in aperitif, then run the sync script from
  this checkout.
