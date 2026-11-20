import { h, arrow } from './dom.js';

export function renderGuide(main) {
  document.title = 'The folding guide — Origami';
  main.replaceChildren(
    h(
      'article',
      { class: 'guide-page' },
      h('a', { class: 'back-link', href: '#models' }, '← Back to the models'),
      h('p', { class: 'eyebrow' }, 'A few things before you begin'),
      h('h1', {}, 'Small folds. Clear beginnings.'),
      h(
        'p',
        { class: 'guide-intro' },
        'The screen is your guide. The paper in your hands is where the magic happens.',
      ),
      h(
        'div',
        { class: 'guide-grid' },
        [
          [
            '◇',
            'Choose your paper',
            'Square models need a true square; hats and boats need a rectangle. Each lesson tells you the shape and size. Start with thin origami paper or ordinary printer paper.',
          ],
          [
            '↷',
            'Read the arrow',
            'The arrow points from the part you are moving toward its destination. Match corners or edges first, then press the crease.',
          ],
          [
            '┄',
            'Fold along the dashed line',
            'A coral dashed line marks the new fold. Fold toward yourself unless the step says to fold behind. A dash-dot line means fold away from you.',
          ],
          [
            '⋯',
            'Keep the existing creases',
            'Fine gray dashed lines are folds already made and reopened. They help you find the middle or line up the next fold.',
          ],
          [
            '↔',
            'Compare before and after',
            'The Fold guide view shows the paper before the action. After this fold shows the result. The diagram may move or change size to keep it easy to see.',
          ],
          [
            '◐',
            'Watch the paper layers',
            'The main color is the front, the pale side is the back, and darker panels show overlapping or shaded layers. Some steps move only one layer; read the instruction before folding.',
          ],
          [
            '↺',
            'Turn, tuck, and open',
            'Turn over means flip the whole model like a page, keeping the top at the top. Tuck means slide a flap into a pocket. Open gently separates layers to make a three-dimensional shape.',
          ],
          [
            '← →',
            'Go at your pace',
            'Swipe left or right on the large diagram, use Previous and Next, or use the keyboard arrows. Vertical swipes still scroll. Your progress stays in this browser when storage is available.',
          ],
        ].map(([symbol, title, text]) =>
          h(
            'section',
            {},
            h('span', { class: 'guide-symbol', 'aria-hidden': 'true' }, symbol),
            h('h2', {}, title),
            h('p', {}, text),
          ),
        ),
      ),
      h('a', { class: 'button primary', href: '#/puppy' }, 'Try your first fold', arrow()),
    ),
  );
}
