const appDialogOpeners = new WeakMap();

function updateAppViewport() {
  const root = document.documentElement;
  const viewport = window.visualViewport;
  const layoutWidth = root.clientWidth || window.innerWidth;
  const layoutHeight = root.clientHeight || window.innerHeight;
  const width = viewport?.width || layoutWidth;
  const height = viewport?.height || layoutHeight;
  const margin = 12;
  root.style.setProperty('--app-viewport-height', `${layoutHeight}px`);
  root.style.setProperty('--dialog-center-x', `${(viewport?.offsetLeft || 0) + width / 2}px`);
  root.style.setProperty('--dialog-center-y', `${(viewport?.offsetTop || 0) + height / 2}px`);
  root.style.setProperty('--dialog-max-width', `${Math.max(0, width - margin * 2)}px`);
  root.style.setProperty('--dialog-max-height', `${Math.max(0, height - margin * 2)}px`);

  const field = document.activeElement;
  if (!field?.matches('input, textarea, select')) return;
  const body = field.closest('.app-dialog[open] .app-dialog-body');
  if (!body) return;
  const bounds = body.getBoundingClientRect();
  const target = field.getBoundingClientRect();
  if (target.bottom > bounds.bottom) body.scrollTop += target.bottom - bounds.bottom + 8;
  else if (target.top < bounds.top) body.scrollTop += target.top - bounds.top - 8;
}

function initAppDialogs() {
  let frame = 0;
  const scheduleUpdate = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      updateAppViewport();
    });
  };
  window.addEventListener('resize', scheduleUpdate);
  window.visualViewport?.addEventListener('resize', scheduleUpdate);
  window.visualViewport?.addEventListener('scroll', scheduleUpdate);
  updateAppViewport();

  for (const dialog of document.querySelectorAll('.app-dialog')) {
    const closeButton = dialog.querySelector('[data-dialog-close]');
    if (closeButton.type === 'button') closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      if (dialog.open) return;
      const anotherDialog = document.querySelector('.app-dialog[open]');
      document.documentElement.classList.toggle('app-dialog-open', Boolean(anotherDialog));
      const opener = appDialogOpeners.get(dialog);
      appDialogOpeners.delete(dialog);
      if (!anotherDialog && opener?.isConnected && opener.getClientRects().length) {
        opener.focus({ preventScroll: true });
      }
    });
  }
}

function openAppDialog(dialog) {
  if (dialog.open) return;
  appDialogOpeners.set(dialog, document.activeElement);
  updateAppViewport();
  dialog.showModal();
  document.documentElement.classList.add('app-dialog-open');
  dialog.querySelector('.app-dialog-body').scrollTop = 0;
  dialog.querySelector('[data-dialog-close]').focus({ preventScroll: true });
}
