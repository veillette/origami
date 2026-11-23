const installButton = document.querySelector('#install-button');
const status = document.querySelector('#offline-status');
document.querySelector('#install').hidden = false;
let installPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener('click', async () => {
  const prompt = installPrompt;
  installPrompt = undefined;
  installButton.hidden = true;
  try {
    await prompt?.prompt();
  } catch {
    status.textContent = 'Use the browser’s install option to add this app.';
  }
});

window.addEventListener('appinstalled', () => {
  installPrompt = undefined;
  installButton.hidden = true;
});

async function enableOffline() {
  try {
    await navigator.serviceWorker.register('./sw.js');
    await navigator.serviceWorker.ready;
    status.textContent = 'Ready to use offline on this device.';
  } catch {
    status.textContent = 'Offline use is unavailable here.';
  }
}

enableOffline();
