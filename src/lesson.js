import { diagram } from './art.js';
import { h, arrow } from './dom.js';
import { moveStep, afterNextStep, afterJumpStep, toggleFinishedPeek } from './state.js';
import { setupSwipe } from './swipe.js';

export function openLesson(main, model, { savedStep, save, announce }) {
  let step = savedStep;
  let view = 'guide';
  let celebrate = false;

  document.title = `${model.name} — Origami`;

  function setStep(value) {
    ({ step, view, celebrate } = afterJumpStep(value));
    save(step);
    render(true);
  }

  function next() {
    const outcome = afterNextStep(step, model.steps.length);
    if (!outcome.celebrate) {
      setStep(outcome.step);
      return;
    }

    ({ step, view, celebrate } = outcome);
    save(step, outcome.completed);
    render();
    document.getElementById('finished-title')?.focus({ preventScroll: true });
  }

  function renderBoard(current) {
    const board = h(
      'div',
      { class: `fold-board ${model.color}` },
      h(
        'div',
        { class: 'board-top' },
        h(
          'span',
          {},
          view === 'finished'
            ? 'YOUR FINISHED MODEL'
            : view === 'result'
              ? 'AFTER THIS ACTION'
              : 'BEFORE THIS ACTION',
        ),
        h('span', {}, view === 'finished' ? '✧' : current.action),
      ),
      diagram(model, { step, view }),
      h(
        'p',
        { class: 'board-caption' },
        view === 'guide'
          ? current.folds.length
            ? 'Follow the arrow. Fold along the dashed line.'
            : 'Follow the instruction, then compare the result.'
          : view === 'result'
            ? 'Compare your paper with this result.'
            : 'Small folds, made by you.',
      ),
    );
    setupSwipe(board, (direction) => {
      if (celebrate || view === 'finished') return;
      const value = moveStep(model, step, direction);
      if (value !== step) setStep(value);
    });
    return board;
  }

  function renderViewControls() {
    return h(
      'div',
      { class: 'reference-tools' },
      h(
        'div',
        { class: 'view-tabs', role: 'group', 'aria-label': 'Diagram view' },
        [
          ['guide', 'Fold guide'],
          ['result', 'After this fold'],
        ].map(([key, title]) =>
          h(
            'button',
            {
              id: `view-${key}`,
              type: 'button',
              'aria-pressed': String(view === key),
              disabled: celebrate,
              onclick: () => {
                view = key;
                render(true);
              },
            },
            title,
          ),
        ),
      ),
      h(
        'button',
        {
          class: 'text-button',
          id: 'preview-finished',
          type: 'button',
          disabled: celebrate,
          'aria-pressed': String(view === 'finished'),
          onclick: () => {
            view = toggleFinishedPeek(view);
            render(true);
          },
        },
        view === 'finished' ? '← Back to my step' : 'Peek at finished model',
      ),
    );
  }

  function renderCompletion() {
    return h(
      'section',
      { class: 'instruction finish-panel' },
      h('span', { class: 'finish-star', 'aria-hidden': 'true' }, '✳'),
      h('p', { class: 'eyebrow' }, 'Look what you made'),
      h('h2', { id: 'finished-title', tabindex: '-1' }, 'A little paper magic.'),
      h('p', {}, `Your ${model.name.toLowerCase()} is complete. Keep this one, share it, or fold another.`),
      h(
        'button',
        { class: 'button primary', type: 'button', onclick: () => setStep(0) },
        'Fold it again',
        '↺',
      ),
      h('a', { class: 'button secondary', href: '#models' }, 'Choose another model', arrow()),
    );
  }

  function renderInstructions(current) {
    const last = step === model.steps.length - 1;
    const peeking = view === 'finished';
    return h(
      'section',
      { class: 'instruction', 'aria-labelledby': 'instruction-title' },
      h(
        'div',
        { class: 'instruction-top' },
        h('p', { class: 'eyebrow' }, `Step ${step + 1} of ${model.steps.length}`),
        h('span', { class: 'step-badge', 'aria-hidden': 'true' }, String(step + 1).padStart(2, '0')),
      ),
      h(
        'div',
        { class: 'instruction-copy' },
        h('h2', { id: 'instruction-title' }, peeking ? 'Here’s where we’re headed.' : current.title),
        h(
          'p',
          {},
          peeking ? 'This is the finished model. Return to your step whenever you’re ready.' : current.text,
        ),
      ),
      current.note && !peeking ? h('p', { class: 'step-note' }, current.note) : null,
      h(
        'div',
        { class: 'take-time' },
        h('span', { 'aria-hidden': 'true' }, '〰'),
        'Make the fold on your paper, then swipe left for the next step.',
      ),
      h(
        'div',
        { class: 'lesson-controls' },
        h(
          'button',
          {
            id: 'step-prev',
            type: 'button',
            class: 'button secondary',
            disabled: step === 0 || peeking,
            onclick: () => setStep(moveStep(model, step, -1)),
          },
          '←',
          'Previous',
        ),
        h(
          'button',
          {
            id: 'step-next',
            type: 'button',
            class: 'button primary',
            disabled: peeking,
            onclick: next,
          },
          last ? 'I made it!' : 'Next step',
          '→',
        ),
      ),
      h(
        'div',
        { class: 'step-range' },
        h(
          'label',
          { for: 'step-slider' },
          'Your progress',
          h('span', {}, `${step + 1} / ${model.steps.length}`),
        ),
        h('input', {
          id: 'step-slider',
          type: 'range',
          min: '1',
          max: String(model.steps.length),
          value: String(step + 1),
          disabled: peeking,
          'aria-label': 'Go to folding step',
          'aria-valuetext': `Step ${step + 1}: ${current.title}`,
          onchange: (e) => setStep(Number(e.target.value) - 1),
        }),
      ),
      h('p', { class: 'keyboard-hint' }, 'Use ← and → on a keyboard, or swipe on the diagram.'),
    );
  }

  function render(restoreFocus = false) {
    const focused = document.activeElement?.id;
    const current = model.steps[step];
    main.replaceChildren(
      h(
        'div',
        { class: 'lesson-shell' },
        h(
          'div',
          { class: 'lesson-breadcrumb' },
          h('a', { href: '#models' }, '← All models'),
          h('a', { href: '#guide' }, 'Fold symbols & basics ↗'),
        ),
        h(
          'div',
          { class: 'lesson-title-row' },
          h('div', {}, h('p', { class: 'eyebrow' }, model.category), h('h1', {}, model.name)),
          h('p', { class: 'lesson-intro' }, model.intro),
        ),
        h(
          'div',
          { class: 'paper-requirements' },
          h('span', { 'aria-hidden': 'true' }, '◇'),
          model.paper,
          h('span', {}, 'Thin, easy-to-crease paper works best.'),
        ),
        h(
          'div',
          { class: 'lesson-workspace' },
          h(
            'div',
            { class: 'reference-column' },
            renderBoard(current),
            renderViewControls(),
            h(
              'div',
              { class: 'mini-legend' },
              h('span', {}, h('i', { class: 'legend-fold' }), 'Fold here'),
              h('span', {}, h('i', { class: 'legend-crease' }), 'Existing crease'),
              h('span', {}, h('i', { class: 'legend-arrow' }), '→ Fold direction'),
            ),
          ),
          celebrate ? renderCompletion() : renderInstructions(current),
        ),
        h(
          'div',
          { class: 'lesson-bottom' },
          h(
            'p',
            {},
            'Diagrams are recentered for clarity. Use the paper layers shown, not a drawing on the screen.',
          ),
          h('button', { class: 'text-button', type: 'button', onclick: () => setStep(0) }, '↺ Start over'),
        ),
        h(
          'p',
          { class: 'source-note' },
          'Traditional model · ',
          h('a', { href: model.source, target: '_blank', rel: 'noopener noreferrer' }, 'Folding reference ↗'),
          ' · Diagrams and lesson text created for this site.',
        ),
      ),
    );
    if (restoreFocus) {
      // A control can become disabled (Previous on step 1); keep focus on a usable one.
      if (focused) {
        const target = [focused, 'step-next', 'step-prev', 'preview-finished']
          .map((id) => document.getElementById(id))
          .find((n) => n && !n.disabled);
        (target ?? main).focus({ preventScroll: true });
      }
      if (!celebrate)
        announce(
          view === 'finished'
            ? `${model.name}: finished model preview.`
            : `Step ${step + 1} of ${model.steps.length}${view === 'result' ? ', after this fold' : ''}: ${current.title}`,
        );
    }
  }

  render();
  return function handleKeydown(event) {
    if (
      celebrate ||
      view === 'finished' ||
      event.altKey ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.target.closest?.('input,textarea,select,[contenteditable]')
    )
      return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const button = document.getElementById(event.key === 'ArrowRight' ? 'step-next' : 'step-prev');
    if (button && !button.disabled) button.click();
  };
}
