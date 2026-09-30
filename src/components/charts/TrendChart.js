export function renderMultiLineMarketChart(signals) {
  const dates = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
  
  const getPoints = (arr) => arr.map((val, idx) => {
    const x = (idx / (arr.length - 1)) * 480;
    const y = 180 - (val / 100) * 140;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const invPoints = getPoints(signals.investment);
  const techPoints = getPoints(signals.technology);
  const hirPoints = getPoints(signals.hiring);

  return `
    <svg viewBox="0 0 480 210" class="overview-mini-chart" preserveAspectRatio="none">
      <line x1="0" y1="40" x2="480" y2="40" stroke="#E8DDF0" stroke-width="1" stroke-dasharray="4" />
      <line x1="0" y1="100" x2="480" y2="100" stroke="#E8DDF0" stroke-width="1" stroke-dasharray="4" />
      <line x1="0" y1="160" x2="480" y2="160" stroke="#E8DDF0" stroke-width="1" stroke-dasharray="4" />

      <polyline points="${invPoints}" fill="none" stroke="#B22DEF" stroke-width="2.5" stroke-linecap="round" />
      <polyline points="${techPoints}" fill="none" stroke="#06B6D4" stroke-width="2.5" stroke-linecap="round" />
      <polyline points="${hirPoints}" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" />

      ${signals.investment.map((val, idx) => `<circle cx="${((idx / 6) * 480).toFixed(1)}" cy="${(180 - (val/100)*140).toFixed(1)}" r="3.5" fill="#42075D" stroke="#FFFFFF" stroke-width="1.5" />`).join('')}
    </svg>
    <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:10px; color:#7A7085;">
      ${dates.map(d => `<span>${d}</span>`).join('')}
    </div>
  `;
}

export function renderSkillMiniChart(points, direction) {
  const strokeColor = direction === 'down' ? '#EF4444' : '#10B981';
  const fillColor = direction === 'down' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)';
  const maxVal = Math.max(...points, 100);
  const minVal = Math.min(...points, 0);
  const range = (maxVal - minVal) || 1;

  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * 140;
    const y = 32 - ((val - minVal) / range) * 24;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const polyPoints = `0,36 ${coords} 140,36`;

  return `
    <svg viewBox="0 0 140 36" class="mini-chart-svg">
      <polygon points="${polyPoints}" fill="${fillColor}" />
      <polyline points="${coords}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" />
    </svg>
  `;
}

export function renderMarketMiniChart(points, direction) {
  const strokeColor = direction === 'down' ? '#EF4444' : '#B22DEF';
  const fillColor = direction === 'down' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(178, 45, 239, 0.12)';
  const maxVal = Math.max(...points, 100);
  const minVal = Math.min(...points, 0);
  const range = (maxVal - minVal) || 1;

  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * 140;
    const y = 32 - ((val - minVal) / range) * 24;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const polyPoints = `0,36 ${coords} 140,36`;

  return `
    <svg viewBox="0 0 140 36" class="mini-chart-svg">
      <polygon points="${polyPoints}" fill="${fillColor}" />
      <polyline points="${coords}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" />
    </svg>
  `;
}
