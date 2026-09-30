export function renderSkillDecayChart(skillData, market, timeRange) {
  const isDecline = skillData.direction === 'down';
  const strokeColor = isDecline ? '#EF4444' : '#B22DEF';
  const fillColor = isDecline ? 'url(#decayGradientDecline)' : 'url(#decayGradientNormal)';
  const halfLifeMonths = skillData.halfLifeMonths || 50;
  const currentRel = skillData.relevance || 94;

  return `
    <div class="decay-chart-interactive-wrap">
      <svg viewBox="0 0 540 180" class="decay-chart-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="decayGradientNormal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#B22DEF" stop-opacity="0.30"/>
            <stop offset="100%" stop-color="#B22DEF" stop-opacity="0.02"/>
          </linearGradient>
          <linearGradient id="decayGradientDecline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#EF4444" stop-opacity="0.30"/>
            <stop offset="100%" stop-color="#EF4444" stop-opacity="0.02"/>
          </linearGradient>
        </defs>

        <!-- Grid Lines -->
        <line x1="0" y1="30" x2="540" y2="30" stroke="#EBE7F2" stroke-width="1" stroke-dasharray="4" />
        <line x1="0" y1="90" x2="540" y2="90" stroke="#EBE7F2" stroke-width="1" stroke-dasharray="4" />
        <line x1="0" y1="150" x2="540" y2="150" stroke="#EBE7F2" stroke-width="1" stroke-dasharray="4" />

        <!-- 50% Threshold Line -->
        <line x1="0" y1="90" x2="540" y2="90" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.85" />
        <text x="532" y="84" text-anchor="end" fill="#F59E0B" font-size="10" font-weight="700">50% Relevance Threshold</text>

        <!-- Area & Curve -->
        <path d="M0,24 C140,32 280,72 380,90 C460,105 500,128 540,148 L540,180 L0,180 Z" fill="${fillColor}" class="chart-area-fade" />
        <path d="M0,24 C140,32 280,72 380,90 C460,105 500,128 540,148" fill="none" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" class="chart-curve-animated" />

        <!-- Interactive Points -->
        <!-- Point 1: Current -->
        <g class="chart-hover-point" data-tooltip="Current Relevance: ${currentRel}% (Today)">
          <circle cx="0" cy="24" r="5" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="3" />
        </g>

        <!-- Point 2: 24 Months -->
        <g class="chart-hover-point" data-tooltip="Month 24: ~${Math.max(20, currentRel - 20)}% estimated relevance">
          <circle cx="190" cy="56" r="4" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="2" />
        </g>

        <!-- Point 3: Half-Life (50%) -->
        <g class="chart-hover-point is-highlight" data-tooltip="Half-Life Threshold: 50% Relevance at Month ${halfLifeMonths}">
          <circle cx="380" cy="90" r="7" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="3" />
          <circle cx="380" cy="90" r="3" fill="${strokeColor}" />
        </g>

        <!-- Point 4: 72 Months -->
        <g class="chart-hover-point" data-tooltip="Month 72: ~${Math.max(10, currentRel - 50)}% estimated relevance">
          <circle cx="500" cy="128" r="4" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="2" />
        </g>
      </svg>

      <!-- Chart Legend & Indicators -->
      <div class="decay-chart-legend">
        <div class="legend-item">
          <span class="legend-dot" style="background:${strokeColor};"></span>
          <span>Relevance Trajectory</span>
        </div>
        <div class="legend-item">
          <span class="legend-line-dashed" style="border-color:#F59E0B;"></span>
          <span>50% Threshold</span>
        </div>
        <div class="legend-item">
          <span class="legend-point-highlight" style="border-color:${strokeColor};"></span>
          <span>Half-Life: <strong>${halfLifeMonths} Mo</strong></span>
        </div>
      </div>
    </div>
  `;
}

export function renderSkillHistoryChart(historyData, selectedEventId) {
  const points = historyData.points || [];
  const events = historyData.events || [];
  const strokeColor = '#B22DEF';

  const svgWidth = 540;
  const svgHeight = 180;
  const maxVal = 100;

  const getX = (idx) => points.length > 1 ? (idx / (points.length - 1)) * (svgWidth - 40) + 20 : 20;
  const getY = (val) => {
    const num = typeof val === 'number' ? val : parseInt(val) || 50;
    const norm = Math.min(100, Math.max(0, num));
    return svgHeight - (norm / maxVal) * (svgHeight - 40) - 20;
  };

  const pathCoords = points.map((p, idx) => `${getX(idx).toFixed(1)},${getY(p.val).toFixed(1)}`).join(' L ');
  const areaCoords = points.length > 0 ? `${getX(0).toFixed(1)},${svgHeight} L ${pathCoords} L ${getX(points.length - 1).toFixed(1)},${svgHeight} Z` : '';

  return `
    <div class="history-chart-interactive-wrap">
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="history-chart-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#B22DEF" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#B22DEF" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Horizontal Grid Lines -->
        <line x1="0" y1="40" x2="${svgWidth}" y2="40" stroke="#EBE7F2" stroke-width="1" stroke-dasharray="4" />
        <line x1="0" y1="90" x2="${svgWidth}" y2="90" stroke="#EBE7F2" stroke-width="1" stroke-dasharray="4" />
        <line x1="0" y1="140" x2="${svgWidth}" y2="140" stroke="#EBE7F2" stroke-width="1" stroke-dasharray="4" />

        <!-- Area & Curve -->
        ${areaCoords ? `<path d="M ${areaCoords}" fill="url(#historyGradient)" class="chart-area-fade" />` : ''}
        ${pathCoords ? `<path d="M ${pathCoords}" fill="none" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" class="chart-curve-animated" />` : ''}

        <!-- Interactive Points -->
        ${points.map((p, idx) => {
          const cx = getX(idx).toFixed(1);
          const cy = getY(p.val).toFixed(1);
          return `
            <g class="history-point-group" data-tooltip="${p.date}: ${typeof p.val === 'number' ? p.val.toLocaleString() : p.val} ${historyData.unit || ''}">
              <circle cx="${cx}" cy="${cy}" r="5" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="2.5" />
              <circle cx="${cx}" cy="${cy}" r="2" fill="${strokeColor}" />
            </g>
          `;
        }).join('')}

        <!-- Events -->
        ${events.map(ev => {
          const cx = getX(ev.index).toFixed(1);
          const cy = getY(ev.val).toFixed(1);
          const isSel = ev.id === selectedEventId;
          return `
            <g class="history-event-group ${isSel ? 'is-selected' : ''}" data-history-event-id="${ev.id}" data-tooltip="Event: ${ev.title} — ${ev.desc}">
              <circle cx="${cx}" cy="${cy}" r="${isSel ? 8 : 6}" fill="${isSel ? '#42075D' : '#B22DEF'}" stroke="#FFFFFF" stroke-width="2" />
              <text x="${cx}" y="${Number(cy) - 10}" text-anchor="middle" fill="${isSel ? '#42075D' : '#7A7085'}" font-size="10" font-weight="700">✦</text>
            </g>
          `;
        }).join('')}
      </svg>
      
      <div class="history-chart-footer-note">
        <span>Metric: <strong>${historyData.label}</strong></span>
        <span>Current: <strong>${historyData.formattedCurrent} ${historyData.unit}</strong> (${historyData.changePercent})</span>
      </div>
    </div>
  `;
}
