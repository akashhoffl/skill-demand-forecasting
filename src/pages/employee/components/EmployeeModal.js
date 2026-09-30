// ============================================================================
// TALENTSCOPE.AI — EMPLOYEE MODAL COMPONENT
// Centered, accessible, unified modal dialog system for Employee Portal
// ============================================================================

let activeModalCloseHandler = null;

export function openEmployeeModal({
  title = '',
  subtitle = '',
  badge = '',
  contentHtml = '',
  footerHtml = '',
  maxWidth = '640px',
  onClose = null
} = {}) {
  closeEmployeeModal();

  const scrim = document.createElement('div');
  scrim.id = 'empModalScrim';
  scrim.className = 'emp-modal-scrim';
  scrim.setAttribute('role', 'dialog');
  scrim.setAttribute('aria-modal', 'true');
  scrim.setAttribute('aria-label', title || 'Dialog');

  scrim.innerHTML = `
    <div class="emp-modal-dialog" style="max-width: ${maxWidth};">
      <header class="emp-modal-header">
        <div class="emp-modal-title-group">
          ${badge ? `<span class="emp-badge emp-badge-primary">${badge}</span>` : ''}
          <h2 class="emp-modal-title">${title}</h2>
          ${subtitle ? `<p class="emp-modal-subtitle">${subtitle}</p>` : ''}
        </div>
        <button type="button" class="emp-modal-close" id="empModalCloseBtn" aria-label="Close dialog">
          <i data-lucide="x"></i>
        </button>
      </header>
      <div class="emp-modal-body">
        ${contentHtml}
      </div>
      ${footerHtml ? `<footer class="emp-modal-footer">${footerHtml}</footer>` : ''}
    </div>
  `;

  document.body.appendChild(scrim);
  document.body.style.overflow = 'hidden';

  activeModalCloseHandler = onClose;

  const closeBtn = scrim.querySelector('#empModalCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeEmployeeModal());
  }

  scrim.addEventListener('click', (e) => {
    if (e.target === scrim) {
      closeEmployeeModal();
    }
  });

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      closeEmployeeModal();
    }
  };
  document.addEventListener('keydown', handleKeydown);
  scrim._keydownHandler = handleKeydown;

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // Focus close button or first interactive element
  setTimeout(() => {
    const focusable = scrim.querySelector('button, input, select, textarea, a');
    if (focusable) focusable.focus();
  }, 50);

  return scrim;
}

export function closeEmployeeModal() {
  const scrim = document.getElementById('empModalScrim');
  if (scrim) {
    if (scrim._keydownHandler) {
      document.removeEventListener('keydown', scrim._keydownHandler);
    }
    scrim.classList.add('is-closing');
    setTimeout(() => {
      if (scrim.parentNode) {
        scrim.parentNode.removeChild(scrim);
      }
      document.body.style.overflow = '';
      if (typeof activeModalCloseHandler === 'function') {
        const handler = activeModalCloseHandler;
        activeModalCloseHandler = null;
        handler();
      }
    }, 180);
  } else {
    document.body.style.overflow = '';
  }
}
