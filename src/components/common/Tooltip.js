export function bindMiniChartTooltips() {
  const tooltip = document.getElementById('miniChartTooltip');
  if (!tooltip) return;

  document.querySelectorAll('.mini-bars i, .saved-chart-bar').forEach(bar => {
    bar.addEventListener('mouseenter', (e) => {
      const label = bar.dataset.period || 'Period';
      const val = bar.dataset.val || '0';
      const change = bar.dataset.change || '0%';
      const skill = bar.dataset.skill || '';

      tooltip.innerHTML = `
        <strong>${skill ? skill + ' · ' : ''}${label}</strong>
        <span>Requisition Index</span>
        <b>${val}</b>
        <small>Shift: ${change}</small>
      `;

      const rect = bar.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2 - 74}px`;
      tooltip.style.top = `${rect.top - 78}px`;
      tooltip.classList.add('is-visible');
    });

    bar.addEventListener('mouseleave', () => {
      tooltip.classList.remove('is-visible');
    });
  });
}
