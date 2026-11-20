import { renderGallery } from './gallery.js';
import { renderGuide } from './guide.js';
import { openLesson } from './lesson.js';
import { loadProgress, pageFromHash, saveProgress } from './state.js';

const main = document.getElementById('main');
const progress = loadProgress();
let handleLessonKeydown;

// Keep the live region outside <main> so it survives a page render.
const announcer = document.getElementById('announcer');
let announceTimer;

function clearAnnouncement() {
  clearTimeout(announceTimer);
  announcer.textContent = '';
}

function announce(message) {
  clearAnnouncement();
  announceTimer = setTimeout(() => {
    announcer.textContent = message;
  }, 60);
}

function route() {
  clearAnnouncement();
  handleLessonKeydown = undefined;
  const destination = pageFromHash(location.hash);

  if (destination.page === 'lesson') {
    const { model } = destination;
    handleLessonKeydown = openLesson(main, model, {
      savedStep: progress[model.id]?.step ?? 0,
      save(step, completed = progress[model.id]?.completed === true) {
        progress[model.id] = { step, completed };
        saveProgress(progress);
      },
      announce,
    });
  } else if (destination.page === 'guide') {
    renderGuide(main);
  } else {
    renderGallery(main, progress);
  }

  main.focus({ preventScroll: true });
  if (destination.scrollModels) {
    document.getElementById('models')?.scrollIntoView();
  } else {
    scrollTo({ top: 0, behavior: 'instant' });
  }
}

window.addEventListener('hashchange', route);
window.addEventListener('keydown', (event) => handleLessonKeydown?.(event));
document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  main.focus();
  main.scrollIntoView();
});

route();
