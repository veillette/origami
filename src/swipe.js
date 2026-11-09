// Keep scrolling and zooming native; only deliberate horizontal gestures advance.
export function swipeDirection(dx, dy) {
  return Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.5 ? (dx < 0 ? 1 : -1) : 0;
}
export function setupSwipe(element, navigate) {
  let start;
  element.addEventListener('touchstart', e => {
    start = null;
    if (e.touches.length !== 1 || e.target.closest('button, a, input, select, textarea')) return;
    const t = e.touches[0];
    start = { x: t.clientX, y: t.clientY, id: t.identifier };
  }, { passive: true });
  element.addEventListener('touchmove', e => {
    if (!start) return;
    if (e.touches.length !== 1 || Math.abs(e.touches[0].clientY-start.y) > Math.abs(e.touches[0].clientX-start.x)) start = null;
  }, { passive: true });
  element.addEventListener('touchcancel', () => { start = null; }, { passive: true });
  element.addEventListener('touchend', e => {
    const origin = start; start = null;
    if (!origin || e.touches.length) return;
    const t = [...e.changedTouches].find(t => t.identifier === origin.id);
    if (!t) return;
    const direction = swipeDirection(t.clientX-origin.x, t.clientY-origin.y);
    if (direction) navigate(direction);
  }, { passive: true });
}
