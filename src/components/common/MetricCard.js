export function renderMetricCard({ label, value, subtext, icon, type = 'default' }) {
  return `
    <div class="intel-quad-card intel-quad-card--${type}">
      <div class="intel-quad-header">
        <span class="intel-quad-label">${icon ? `<i data-lucide="${icon}"></i>` : ''} ${label}</span>
      </div>
      <div class="intel-quad-val-row">
        <strong class="intel-quad-val">${value}</strong>
      </div>
      ${subtext ? `<span class="intel-quad-sub">${subtext}</span>` : ''}
    </div>
  `;
}
