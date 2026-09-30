export function renderEmptyState({ title, description, icon = 'search-x' }) {
  return `
    <div class="empty-state">
      <i data-lucide="${icon}"></i>
      <strong>${title}</strong>
      <p>${description}</p>
    </div>
  `;
}

export function renderPlaceholder(page) {
  const mainContent = document.getElementById('mainContent');
  if (!mainContent) return;
  mainContent.innerHTML = `
    <div class="page-header">
      <span class="eyebrow">${page.eyebrow}</span>
      <h1>${page.title}</h1>
      <p>${page.description}</p>
    </div>
    <section class="placeholder-card dashboard-card">
      <div class="placeholder-card__top">
        <div>
          <h2>Workspace ready</h2>
          <p>This route is connected to the Individual Portal shell and ready for its page-specific intelligence view.</p>
        </div>
        <span class="placeholder-icon"><i data-lucide="${page.icon}"></i></span>
      </div>
    </section>
  `;
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
