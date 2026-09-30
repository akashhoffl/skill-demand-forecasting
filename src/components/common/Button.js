export function renderButton({ label, icon, variant = 'primary', id = '', className = '', type = 'button', attributes = '' }) {
  const variantClass = variant === 'assistant' ? 'button--assistant' : variant === 'secondary' ? 'button--secondary' : 'button--primary';
  return `
    <button type="${type}" id="${id}" class="button ${variantClass} ${className}" ${attributes}>
      ${icon ? `<i data-lucide="${icon}"></i>` : ''}
      <span>${label}</span>
    </button>
  `;
}
