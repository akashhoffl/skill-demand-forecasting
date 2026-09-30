export function renderJobDonutSVG(segments) {
  const radius = 65;
  const circumference = 2 * Math.PI * radius; // ~408.4
  let accumPercent = 0;

  return `
    <svg viewBox="0 0 160 160" style="width:160px; height:160px; transform: rotate(-90deg);">
      <circle cx="80" cy="80" r="${radius}" fill="none" stroke="#E8DDF0" stroke-width="14" />
      ${segments.map(s => {
        const strokeDasharray = `${(s.percent / 100) * circumference} ${circumference}`;
        const strokeDashoffset = -((accumPercent / 100) * circumference);
        accumPercent += s.percent;
        return `
          <circle cx="80" cy="80" r="${radius}" fill="none" stroke="${s.color}" stroke-width="14"
                  stroke-dasharray="${strokeDasharray}" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round" />
        `;
      }).join('')}
    </svg>
  `;
}

export function renderJobTrendRadialChart(view) {
  const openRoles = view.openRoles || 42180;
  return `
    <div class="job-radial-wrap" style="text-align:center; padding:10px 0;">
      <div style="font-size:24px; font-weight:800; color:#1A1523;">${openRoles.toLocaleString()}</div>
      <span style="font-size:11px; color:#7A7085;">Active Requisitions</span>
    </div>
  `;
}
