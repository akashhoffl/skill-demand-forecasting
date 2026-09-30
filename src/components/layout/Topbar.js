export function closePopovers() {
  const profilePopover = document.getElementById('profilePopover');
  const notificationPopover = document.getElementById('notificationPopover');
  const profileTrigger = document.getElementById('profileTrigger');
  const notificationButton = document.getElementById('notificationButton');

  if (profilePopover) profilePopover.hidden = true;
  if (notificationPopover) notificationPopover.hidden = true;
  if (profileTrigger) profileTrigger.setAttribute('aria-expanded', 'false');
  if (notificationButton) notificationButton.setAttribute('aria-expanded', 'false');
}

export function updateTopbarContext(routeTitle) {
  const contextEl = document.getElementById('topbarContext');
  if (contextEl) {
    contextEl.textContent = routeTitle || 'Individual Portal';
  }
}
