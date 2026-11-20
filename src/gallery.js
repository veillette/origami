import { models, modelById } from './models.js';
import { diagram } from './art.js';
import { h, arrow } from './dom.js';

function card(model, index, saved) {
  return h(
    'a',
    { class: `model-card ${model.color}`, href: `#/${model.id}` },
    h(
      'div',
      { class: 'card-art' },
      h('span', { class: 'card-number' }, String(index + 1).padStart(2, '0')),
      diagram(model, { thumbnail: true }),
      saved?.completed ? h('span', { class: 'completed-badge' }, '✓ Folded') : null,
      h('span', { class: 'card-arrow', 'aria-hidden': 'true' }, '↗'),
    ),
    h(
      'div',
      { class: 'card-info' },
      h('div', {}, h('p', { class: 'eyebrow' }, model.category), h('h3', {}, model.name)),
      h(
        'span',
        { class: 'card-steps' },
        `${model.steps.length} steps`,
        h(
          'span',
          {},
          saved && !saved.completed && saved.step > 0
            ? `Continue at step ${saved.step + 1}`
            : (model.level ?? 'Beginner friendly'),
        ),
      ),
    ),
  );
}
let category = 'All models';

export function renderGallery(main, progress) {
  document.title = 'Origami — One fold at a time';
  const grid = h('div', { class: 'model-grid' });
  const buttons = [];
  function filter() {
    grid.replaceChildren(
      ...models.flatMap((model, i) =>
        category === 'All models' || model.category === category ? [card(model, i, progress[model.id])] : [],
      ),
    );
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.textContent === category)));
  }
  for (const label of ['All models', ...new Set(models.map((m) => m.category))])
    buttons.push(
      h(
        'button',
        {
          class: 'filter-chip',
          type: 'button',
          'aria-pressed': String(label === category),
          onclick: () => {
            category = label;
            filter();
          },
        },
        label,
      ),
    );
  filter();
  main.replaceChildren(
    h(
      'section',
      { class: 'hero', 'aria-labelledby': 'hero-title' },
      h(
        'div',
        { class: 'hero-copy' },
        h(
          'p',
          { class: 'eyebrow hero-eyebrow' },
          h('span', { class: 'dot', 'aria-hidden': 'true' }),
          'Something lovely, from something simple',
        ),
        h('h1', { id: 'hero-title' }, 'One piece of paper.', h('br'), h('em', {}, 'A world of possibility.')),
        h(
          'p',
          { class: 'hero-description' },
          'A square becomes a puppy. A few folds become a boat. Discover the quiet joy of origami, one small step at a time.',
        ),
        h('a', { class: 'button primary', href: '#models' }, 'Find your first fold', arrow()),
        h('p', { class: 'hero-footnote' }, 'Just paper. No glue, no scissors. A little patience helps.'),
      ),
      h(
        'a',
        { class: 'hero-art peach', href: '#/boat', 'aria-label': 'Learn to fold a paper boat' },
        h('span', { class: 'floating-label label-top' }, 'a little paper magic'),
        diagram(modelById.get('boat'), { thumbnail: true }),
        h(
          'div',
          { class: 'hero-art-footer' },
          h('span', {}, 'The little paper boat', h('small', {}, 'A classic worth slowing down for.')),
          h('span', { class: 'round-arrow', 'aria-hidden': 'true' }, '↗'),
        ),
      ),
    ),
    h(
      'section',
      { class: 'how-strip', 'aria-label': 'How it works' },
      [
        ['01', 'Pick a little project', 'Start with a square or a rectangle.'],
        ['02', 'Follow each fold', 'See the paper before and after.'],
        ['03', 'Make something yours', 'Swipe, fold, and enjoy the process.'],
      ].map(([n, title, text]) =>
        h(
          'div',
          {},
          h('span', { class: 'how-number' }, n),
          h('div', {}, h('h2', {}, title), h('p', {}, text)),
        ),
      ),
    ),
    h(
      'section',
      { id: 'models', class: 'models-section', 'aria-labelledby': 'models-title' },
      h(
        'div',
        { class: 'section-heading' },
        h(
          'div',
          {},
          h('p', { class: 'eyebrow' }, 'Where shall we begin?'),
          h('h2', { id: 'models-title' }, 'A few lovely things to fold.'),
        ),
        h(
          'p',
          { class: 'collection-note' },
          `${models.length} paper models`,
          h('span', {}, `${models.filter((m) => progress[m.id]?.completed).length} folded by you`),
        ),
      ),
      h('div', { class: 'filter-row', role: 'group', 'aria-label': 'Model categories' }, buttons),
      grid,
    ),
    h(
      'aside',
      { class: 'encouragement' },
      h('span', { 'aria-hidden': 'true', class: 'encouragement-star' }, '✳'),
      h(
        'div',
        {},
        h('h2', {}, 'The first fold doesn’t have to be perfect.'),
        h(
          'p',
          {},
          'Line up the corners first, then smooth the crease from the middle outward. Pause, go back, and try again whenever you like.',
        ),
      ),
      h('a', { href: '#guide' }, 'Learn the basics ↗'),
    ),
  );
}
