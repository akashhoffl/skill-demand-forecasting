export function renderBadge({ text, type = 'positive', icon = '' }) {
  return `
    <span class="company-signal-pill ${type}">
      ${icon ? `<i data-lucide="${icon}"></i>` : ''}
      ${text}
    </span>
  `;
}
