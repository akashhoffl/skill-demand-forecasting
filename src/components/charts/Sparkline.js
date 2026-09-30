export function renderSparkline(points, label) {
  const maxVal = Math.max(...points, 100);
  const minVal = Math.min(...points, 0);
  const range = (maxVal - minVal) || 1;

  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * 100;
    const y = 30 - ((val - minVal) / range) * 24;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return `
    <svg viewBox="0 0 100 34" class="sparkline" aria-label="${label}">
      <polyline points="${coords}" />
    </svg>
  `;
}

export function renderTrendSparkline(points, label) {
  return renderSparkline(points, label);
}

export function renderMarketSparkline(points, label) {
  return renderSparkline(points, label);
}
