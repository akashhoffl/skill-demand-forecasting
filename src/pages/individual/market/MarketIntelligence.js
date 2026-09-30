import { dashboardState, dedicatedMarketState, intelligenceExplorerState } from '../../../app/state.js';
import {
  dedicatedMarketCompanies, getCompaniesForScope, getCompanyMarketDetails,
  searchCompanies, getRelatedCompanySignals, marketOptions, timeRangeOptions
} from '../../../data/market-data.js';

// Configuration Constants
const LOCATIONS = ['Global', 'India', 'Tamil Nadu', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Remote'];
const RANGES = ['7 Days', '30 Days', '90 Days', '6 Months', '1 Year'];
const INDUSTRIES = ['All Industries', 'Semiconductors & AI Hardware', 'Enterprise Cloud & Software', 'Generative AI & Frontier', 'Cloud Data Platforms'];
const SIGNALS = ['All Signals', 'Investment', 'Technology', 'Hiring', 'Market Momentum'];
const COMPANY_SIZES = ['All Sizes', 'Enterprise (10,000+)', 'Growth (1,000-10,000)', 'Scaleup (<1,000)'];

const TABS = ['Overview', 'Market Change', 'Technology', 'Hiring', 'Investment', 'Evidence', 'AI Insight'];
const TAB_ICONS = {
  Overview: 'layout-dashboard',
  'Market Change': 'chart-no-axes-combined',
  Technology: 'cpu',
  Hiring: 'briefcase',
  Investment: 'dollar-sign',
  Evidence: 'file-search',
  'AI Insight': 'sparkles'
};

const esc = val => String(val ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

// Component UI State
let ui = {
  collection: dedicatedMarketState.companyScope || 'My Companies',
  activeTab: dedicatedMarketState.selectedTab || 'Overview',
  searchQuery: '',
  filterOpen: false,
  addModalOpen: false,
  evidenceModalData: null,
  isAnalyzing: false,
  analysisStep: 0,
  hasAnalyzed: true,
  queryText: '',
  location: dashboardState.market || 'Global',
  timeRange: dashboardState.timeRange || '30D',
  industryFilter: 'All Industries',
  signalFilter: 'All Signals',
  sizeFilter: 'All Sizes',
  customStartDate: '',
  customEndDate: '',
  mutedSignals: new Set(),
  simTick: 0
};

let simTimer = null;

function getSelectedCompanyData() {
  const compName = dedicatedMarketState.selectedCompany || dashboardState.selectedCompany || 'NVIDIA';
  return getCompanyMarketDetails(compName, ui.location, ui.timeRange);
}

function getVisibleCompanies() {
  let list = getCompaniesForScope(
    ui.collection,
    dashboardState.favoriteCompanies || [],
    dashboardState.savedCompanies || []
  );

  // Filter by industry
  if (ui.industryFilter && ui.industryFilter !== 'All Industries') {
    list = list.filter(c => c.industry === ui.industryFilter);
  }

  // Filter by search query
  if (ui.searchQuery) {
    const q = ui.searchQuery.toLowerCase().trim();
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q)
    );
  }

  return list;
}

function sparklineSVG(history = [45, 52, 50, 65, 69, 76, 82], isDown = false) {
  const min = Math.min(...history);
  const max = Math.max(...history);
  const span = Math.max(1, max - min);
  const points = history.map((val, idx) => {
    const x = (idx / Math.max(1, history.length - 1) * 72).toFixed(1);
    const y = (26 - (val - min) / span * 22).toFixed(1);
    return `${x},${y}`;
  }).join(' ');

  return `
    <svg class="mi-sparkline-svg ${isDown ? 'is-down' : ''}" viewBox="0 0 72 28" preserveAspectRatio="none">
      <polyline points="${points}" />
    </svg>
  `;
}

function renderMultiSignalChart(model) {
  const signals = model.multiSignals || {
    market: [48, 56, 65, 76, 82, 90, 98],
    technology: [52, 60, 68, 79, 86, 92, 99],
    hiring: [38, 46, 55, 68, 77, 85, 91],
    investment: [44, 52, 63, 72, 80, 88, 95]
  };

  const width = 640;
  const height = 180;
  const padX = 20;
  const padY = 20;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  const pointsFor = (values) => {
    return values.map((val, idx) => {
      const x = padX + (idx / (values.length - 1)) * plotW;
      const y = height - padY - (clamp(val, 0, 100) / 100) * plotH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  return `
    <div class="mi-chart-container" id="miChartCanvas">
      <svg class="mi-chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="miPurpleGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#B22DEF" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#B22DEF" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Background grid lines -->
        <g class="mi-chart-grid">
          <line x1="${padX}" y1="${padY}" x2="${width - padX}" y2="${padY}" />
          <line x1="${padX}" y1="${padY + plotH * 0.33}" x2="${width - padX}" y2="${padY + plotH * 0.33}" />
          <line x1="${padX}" y1="${padY + plotH * 0.66}" x2="${width - padX}" y2="${padY + plotH * 0.66}" />
          <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" />
        </g>

        <!-- Interactive Guide Line -->
        <line class="mi-chart-guide" id="miChartGuide" x1="0" y1="${padY}" x2="0" y2="${height - padY}" hidden />

        <!-- 4 Multi-Signal Lines -->
        ${!ui.mutedSignals.has('market') ? `
          <polyline class="mi-chart-line mi-chart-line--market" points="${pointsFor(signals.market)}" />
        ` : ''}
        ${!ui.mutedSignals.has('tech') ? `
          <polyline class="mi-chart-line mi-chart-line--tech" points="${pointsFor(signals.technology)}" />
        ` : ''}
        ${!ui.mutedSignals.has('hiring') ? `
          <polyline class="mi-chart-line mi-chart-line--hiring" points="${pointsFor(signals.hiring)}" />
        ` : ''}
        ${!ui.mutedSignals.has('invest') ? `
          <polyline class="mi-chart-line mi-chart-line--invest" points="${pointsFor(signals.investment)}" />
        ` : ''}
      </svg>
      <div class="mi-chart-tooltip" id="miChartTooltip" hidden></div>
    </div>

    <!-- Chart Legend & Controls -->
    <div class="mi-chart-legend">
      <span class="mi-legend-item ${ui.mutedSignals.has('market') ? 'is-muted' : ''}" data-toggle-signal="market">
        <span class="mi-legend-dot mi-legend-dot--market"></span>
        Market Momentum (${model.marketMomentum}/100)
      </span>
      <span class="mi-legend-item ${ui.mutedSignals.has('tech') ? 'is-muted' : ''}" data-toggle-signal="tech">
        <span class="mi-legend-dot mi-legend-dot--tech"></span>
        Technology Momentum (+${model.technologyMomentum}%)
      </span>
      <span class="mi-legend-item ${ui.mutedSignals.has('hiring') ? 'is-muted' : ''}" data-toggle-signal="hiring">
        <span class="mi-legend-dot mi-legend-dot--hiring"></span>
        Hiring Signal (+${model.hiringMomentum}%)
      </span>
      <span class="mi-legend-item ${ui.mutedSignals.has('invest') ? 'is-muted' : ''}" data-toggle-signal="invest">
        <span class="mi-legend-dot mi-legend-dot--invest"></span>
        Investment (+${model.investmentSignal}%)
      </span>
    </div>
  `;
}

function renderCompanyRows(companies, selectedModel) {
  if (companies.length === 0) {
    return `
      <div style="padding: 32px 16px; text-align: center; color: var(--mi-muted);">
        <i data-lucide="building-2" style="width: 32px; height: 32px; stroke: var(--mi-soft-muted); margin-bottom: 8px;"></i>
        <p style="margin: 0; font-size: 13px;">No companies found matching current filters.</p>
      </div>
    `;
  }

  const favorites = dashboardState.favoriteCompanies || [];

  return companies.map(c => {
    const isSelected = c.name.toLowerCase() === selectedModel.name.toLowerCase();
    const isFav = favorites.includes(c.name) || c.isFavorite;
    const isDown = c.direction === 'down';
    const trendClass = isDown ? 'is-down' : 'is-up';
    const arrow = isDown ? '↘' : '↗';

    return `
      <div class="mi-company-row ${isSelected ? 'is-active' : ''}" data-select-company="${esc(c.name)}">
        <div class="mi-company-monogram" style="${c.brandColor ? `background: linear-gradient(135deg, ${c.brandColor}, #42075D)` : ''}">
          ${esc(c.logoInitials || c.name.slice(0, 2).toUpperCase())}
        </div>
        <div class="mi-company-meta">
          <strong>${esc(c.name)}</strong>
          <small>${esc(c.sector)}</small>
        </div>
        <div class="mi-company-stats">
          <span class="mi-trend-pill ${trendClass}">
            ${c.change > 0 ? '+' : ''}${c.change}% ${arrow}
          </span>
          <span class="mi-company-roles-text">${c.openRoles} open roles</span>
        </div>
        ${sparklineSVG(c.history, isDown)}
        <button type="button" class="mi-fav-btn ${isFav ? 'is-fav' : ''}" data-toggle-fav="${esc(c.name)}" title="${isFav ? 'Remove Favorite' : 'Add to Favorites'}" aria-label="${isFav ? 'Remove Favorite' : 'Add to Favorites'}">
          <i data-lucide="star"></i>
        </button>
      </div>
    `;
  }).join('');
}

function renderCompanySignalsList(model) {
  const signals = model.companySignals || [];
  const related = getRelatedCompanySignals(model.name);

  return `
    <div class="mi-signals-section">
      <div class="mi-signals-section-title">
        <span>Recent Company Signals</span>
        <span>${ui.location} · ${ui.timeRange}</span>
      </div>
      ${signals.map(s => `
        <div class="mi-signal-row">
          <i data-lucide="radio"></i>
          <div class="mi-signal-content">
            <strong>${esc(s.name)}</strong>
            <small>${esc(s.desc)}</small>
          </div>
          <span class="mi-signal-impact ${s.dir === 'down' ? 'is-down' : ''}">${esc(s.impact)}</span>
        </div>
      `).join('')}

      <div class="mi-signals-section-title" style="margin-top: 10px;">
        <span>Related Companies in Market</span>
        <small style="text-transform: none; color: var(--mi-purple); cursor: pointer;" id="btnViewAllMarketCompanies">View all →</small>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        ${related.map(r => `
          <button type="button" class="mi-signal-row" data-select-company="${esc(r.name)}" style="padding: 8px 10px;">
            <div class="mi-company-monogram" style="width: 26px; height: 26px; font-size: 10px; border-radius: 6px; ${r.brandColor ? `background: ${r.brandColor}` : ''}">
              ${esc(r.logoInitials)}
            </div>
            <div class="mi-signal-content">
              <strong>${esc(r.name)}</strong>
              <small>${r.change > 0 ? '+' : ''}${r.change}%</small>
            </div>
            <i data-lucide="arrow-up-right" style="width: 13px; height: 13px; color: var(--mi-soft-muted);"></i>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderConsole(model) {
  const saved = dashboardState.savedCompanies || ['NVIDIA', 'Microsoft', 'Google'];
  const questions = [
    `Why is ${model.name} market momentum increasing?`,
    `What technologies are driving ${model.name} growth?`,
    `Where is hiring increasing for ${model.name}?`,
    `What does this market change mean for my career?`,
    `Which skills are connected to ${model.name} open roles?`
  ];

  return `
    <section class="mi-console-card">
      <div class="mi-console-header">
        <span class="mi-eyebrow"><i data-lucide="sparkles"></i> INVESTIGATION CONSOLE</span>
        <h2>Market Intelligence Console</h2>
        <p>What do you want to understand about the market, technologies, or hiring shifts?</p>
      </div>

      <!-- Context Chips -->
      <div class="mi-context-chips">
        <span class="mi-context-label">Selected Context:</span>
        <span class="mi-company-chip is-active">
          <strong>${esc(model.name)}</strong>
          <button type="button" class="mi-chip-remove" data-action="clear-company-chip" title="Clear Context">×</button>
        </span>
        ${saved.filter(c => c !== model.name).slice(0, 3).map(c => `
          <button type="button" class="mi-company-chip" data-select-company="${esc(c)}">
            ${esc(c)}
          </button>
        `).join('')}
        <button type="button" class="mi-btn-subtle" id="btnOpenAddCompanyModal">
          <i data-lucide="plus"></i> Add Company
        </button>
      </div>

      <!-- Dynamic Suggested Questions -->
      <div class="mi-suggested-questions">
        ${questions.map(q => `
          <button type="button" class="mi-question-pill" data-ask-question="${esc(q)}">
            <i data-lucide="message-square"></i>
            <span>${esc(q)}</span>
          </button>
        `).join('')}
      </div>

      <!-- Query input bar -->
      <div class="mi-query-bar">
        <div class="mi-query-input-wrap">
          <i data-lucide="search"></i>
          <input type="text" class="mi-query-input" id="miConsoleInput" placeholder="Ask anything about ${esc(model.name)}, hiring signals, or technology demand..." value="${esc(ui.queryText)}" />
        </div>

        <!-- Filter button and popover container -->
        <div class="mi-filter-wrap">
          <button type="button" class="mi-filter-trigger ${ui.filterOpen ? 'is-open' : ''}" id="miFilterTrigger" aria-haspopup="dialog" aria-expanded="${ui.filterOpen ? 'true' : 'false'}">
            <i data-lucide="sliders-horizontal"></i>
            <span>Filters</span>
            ${getNonDefaultFilterCount() > 0 ? `<span class="mi-filter-count-badge">${getNonDefaultFilterCount()}</span>` : ''}
          </button>

          ${ui.filterOpen ? renderFilterPopover() : ''}
        </div>

        <button type="button" class="mi-btn-primary" id="miAnalyzeBtn">
          <i data-lucide="sparkles"></i>
          <span>Analyze Market</span>
        </button>
      </div>

      <!-- Active Filters Quick Bar -->
      ${renderActiveFilterPills()}

      <!-- Analysis State (if busy) -->
      ${ui.isAnalyzing ? `
        <div class="mi-analysis-state">
          <div class="mi-analysis-orb">
            <i data-lucide="scan-search"></i>
          </div>
          <strong>${getAnalysisStepText()}</strong>
          <small>Connecting real-time market data, company signals, and workforce indicators...</small>
          <div class="mi-analysis-progress-bar">
            <div class="mi-analysis-progress-fill"></div>
          </div>
        </div>
      ` : ''}
    </section>
  `;
}

function getNonDefaultFilterCount() {
  let count = 0;
  if (ui.location && ui.location !== 'Global') count++;
  if (ui.timeRange && ui.timeRange !== '30D' && ui.timeRange !== '30 Days') count++;
  if (ui.industryFilter && ui.industryFilter !== 'All Industries') count++;
  if (ui.signalFilter && ui.signalFilter !== 'All Signals') count++;
  if (ui.sizeFilter && ui.sizeFilter !== 'All Sizes') count++;
  return count;
}

function renderActiveFilterPills() {
  const pills = [];
  if (ui.location && ui.location !== 'Global') {
    pills.push({ key: 'location', label: ui.location, icon: 'map-pin' });
  }
  if (ui.timeRange && ui.timeRange !== '30D' && ui.timeRange !== '30 Days') {
    pills.push({ key: 'timeRange', label: ui.timeRange, icon: 'clock' });
  }
  if (ui.industryFilter && ui.industryFilter !== 'All Industries') {
    pills.push({ key: 'industry', label: ui.industryFilter, icon: 'building-2' });
  }
  if (ui.signalFilter && ui.signalFilter !== 'All Signals') {
    pills.push({ key: 'signal', label: ui.signalFilter, icon: 'activity' });
  }
  if (ui.sizeFilter && ui.sizeFilter !== 'All Sizes') {
    pills.push({ key: 'size', label: ui.sizeFilter, icon: 'users' });
  }

  if (pills.length === 0) return '';

  return `
    <div class="mi-active-filters-bar">
      <span class="mi-active-filters-label">Active Filters:</span>
      ${pills.map(p => `
        <span class="mi-active-filter-tag">
          <i data-lucide="${p.icon}"></i>
          <span>${esc(p.label)}</span>
          <button type="button" class="mi-active-filter-remove" data-clear-filter="${p.key}" title="Remove ${esc(p.label)} filter">×</button>
        </span>
      `).join('')}
      <button type="button" class="mi-clear-all-filters-btn" id="miClearAllFiltersBtn">Clear all</button>
    </div>
  `;
}

function renderFilterPopover() {
  const activeCount = getNonDefaultFilterCount();

  return `
    <div class="mi-popover-scrim" id="miFilterScrim" aria-hidden="true"></div>
    <div class="mi-filter-popover" role="dialog" aria-label="Market Intelligence Filters">
      <!-- Popover Header -->
      <div class="mi-filter-popover-header">
        <div class="mi-filter-header-left">
          <div class="mi-filter-header-icon">
            <i data-lucide="sliders-horizontal"></i>
          </div>
          <div>
            <h4>Console Intelligence Filters</h4>
            <span class="mi-filter-header-sub">Narrow market context & investigation signals</span>
          </div>
          ${activeCount > 0 ? `<span class="mi-filter-active-pill">${activeCount} active</span>` : ''}
        </div>
        <button type="button" class="mi-filter-close-btn" id="miFilterCloseBtn" aria-label="Close filters">
          <i data-lucide="x"></i>
        </button>
      </div>

      <!-- Popover Body (2-Column Grid Layout) -->
      <div class="mi-filter-grid">
        <div class="mi-filter-field">
          <label for="miFilterLocation">
            <i data-lucide="map-pin"></i>
            <span>Location</span>
          </label>
          <div class="mi-filter-select-wrap">
            <select id="miFilterLocation">
              ${LOCATIONS.map(loc => `<option value="${loc}" ${ui.location === loc ? 'selected' : ''}>${loc}</option>`).join('')}
            </select>
            <i data-lucide="chevron-down" class="mi-select-arrow"></i>
          </div>
        </div>

        <div class="mi-filter-field">
          <label for="miFilterTimeRange">
            <i data-lucide="clock"></i>
            <span>Time Range</span>
          </label>
          <div class="mi-filter-select-wrap">
            <select id="miFilterTimeRange">
              ${RANGES.map(rng => `<option value="${rng}" ${ui.timeRange === rng || (rng === '30 Days' && (ui.timeRange === '30D' || !ui.timeRange)) ? 'selected' : ''}>${rng}</option>`).join('')}
            </select>
            <i data-lucide="chevron-down" class="mi-select-arrow"></i>
          </div>
        </div>

        <div class="mi-filter-field">
          <label for="miFilterIndustry">
            <i data-lucide="building-2"></i>
            <span>Industry / Sector</span>
          </label>
          <div class="mi-filter-select-wrap">
            <select id="miFilterIndustry">
              ${INDUSTRIES.map(ind => `<option value="${ind}" ${ui.industryFilter === ind ? 'selected' : ''}>${ind}</option>`).join('')}
            </select>
            <i data-lucide="chevron-down" class="mi-select-arrow"></i>
          </div>
        </div>

        <div class="mi-filter-field">
          <label for="miFilterSignal">
            <i data-lucide="activity"></i>
            <span>Market Signal</span>
          </label>
          <div class="mi-filter-select-wrap">
            <select id="miFilterSignal">
              ${SIGNALS.map(sig => `<option value="${sig}" ${ui.signalFilter === sig ? 'selected' : ''}>${sig}</option>`).join('')}
            </select>
            <i data-lucide="chevron-down" class="mi-select-arrow"></i>
          </div>
        </div>

        <div class="mi-filter-field is-fullwidth">
          <label for="miFilterSize">
            <i data-lucide="users"></i>
            <span>Company Size</span>
          </label>
          <div class="mi-filter-select-wrap">
            <select id="miFilterSize">
              ${COMPANY_SIZES.map(s => `<option value="${s}" ${ui.sizeFilter === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
            <i data-lucide="chevron-down" class="mi-select-arrow"></i>
          </div>
        </div>
      </div>

      <!-- Popover Summary Tagline -->
      <div class="mi-filter-summary-bar">
        <span>Current:</span>
        <strong>${esc(ui.location)}</strong> · 
        <strong>${esc(ui.timeRange === '30D' ? '30 Days' : ui.timeRange)}</strong> · 
        <span>${esc(ui.industryFilter !== 'All Industries' ? ui.industryFilter : 'All Sectors')}</span>
      </div>

      <!-- Popover Actions Footer -->
      <div class="mi-filter-popover-footer">
        <button type="button" class="mi-btn-subtle" id="miFilterResetBtn">
          <i data-lucide="rotate-ccw"></i>
          <span>Reset Defaults</span>
        </button>
        <button type="button" class="mi-btn-primary" id="miFilterApplyBtn">
          <i data-lucide="check"></i>
          <span>Apply Filters</span>
        </button>
      </div>
    </div>
  `;
}

function renderResultSection(model) {
  const favorites = dashboardState.favoriteCompanies || [];
  const isFav = favorites.includes(model.name) || model.isFavorite;

  return `
    <section class="mi-result-card" id="miResultSection">
      <!-- Result Header -->
      <div class="mi-result-header">
        <div class="mi-result-profile">
          <div class="mi-result-monogram" style="${model.brandColor ? `background: linear-gradient(135deg, ${model.brandColor}, #42075D)` : ''}">
            ${esc(model.logoInitials)}
          </div>
          <div class="mi-result-info">
            <h3>${esc(model.name)}</h3>
            <div class="mi-result-meta-tags">
              <span class="mi-result-tag"><i data-lucide="tag"></i> ${esc(model.sector)}</span>
              <span class="mi-result-tag">·</span>
              <span class="mi-result-tag"><i data-lucide="map-pin"></i> ${esc(ui.location)}</span>
              <span class="mi-result-tag">·</span>
              <span class="mi-result-tag"><i data-lucide="clock"></i> ${esc(ui.timeRange)}</span>
              <span class="mi-result-tag">·</span>
              <span class="mi-demo-badge" style="padding: 2px 8px; font-size: 10.5px;">
                <span class="mi-live-dot" style="width: 6px; height: 6px;"></span> Simulated market signals
              </span>
            </div>
          </div>
        </div>

        <div class="mi-result-actions">
          <button type="button" class="mi-btn-secondary ${isFav ? 'is-fav' : ''}" data-toggle-fav="${esc(model.name)}">
            <i data-lucide="star" style="${isFav ? 'fill: #F59E0B; color: #F59E0B;' : ''}"></i>
            <span>${isFav ? 'Favorited' : 'Favorite'}</span>
          </button>
          <button type="button" class="mi-btn-primary" id="btnExploreRelatedJobs" data-company="${esc(model.name)}">
            <i data-lucide="briefcase"></i>
            <span>Explore Related Jobs</span>
          </button>
        </div>
      </div>

      <!-- 7 Investigation Tabs -->
      <div class="mi-tabs-bar" role="tablist">
        ${TABS.map(tab => {
          const isActive = ui.activeTab === tab;
          return `
            <button type="button" class="mi-tab-btn ${isActive ? 'is-active' : ''}" role="tab" aria-selected="${isActive}" data-switch-tab="${esc(tab)}">
              <i data-lucide="${TAB_ICONS[tab]}"></i>
              <span>${esc(tab)}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Tab Content Panels -->
      <div class="mi-panel-content">
        ${renderActiveTabContent(model)}
      </div>
    </section>
  `;
}

function renderActiveTabContent(model) {
  switch (ui.activeTab) {
    case 'Overview':
      return renderOverviewTab(model);
    case 'Market Change':
      return renderMarketChangeTab(model);
    case 'Technology':
      return renderTechnologyTab(model);
    case 'Hiring':
      return renderHiringTab(model);
    case 'Investment':
      return renderInvestmentTab(model);
    case 'Evidence':
      return renderEvidenceTab(model);
    case 'AI Insight':
      return renderAIInsightTab(model);
    default:
      return renderOverviewTab(model);
  }
}

// 1. Overview Tab
function renderOverviewTab(model) {
  return `
    <div class="mi-overview-metrics-grid">
      <div class="mi-metric-quad-card">
        <span class="mi-metric-quad-label">Market Momentum</span>
        <span class="mi-metric-quad-value" style="color: var(--mi-purple);">${model.marketMomentum}/100</span>
        <span class="mi-metric-quad-sub">Overall trajectory index</span>
      </div>
      <div class="mi-metric-quad-card">
        <span class="mi-metric-quad-label">Technology Momentum</span>
        <span class="mi-metric-quad-value" style="color: var(--mi-secondary);">+${model.technologyMomentum}%</span>
        <span class="mi-metric-quad-sub">Stack adoption rate</span>
      </div>
      <div class="mi-metric-quad-card">
        <span class="mi-metric-quad-label">Hiring Signal</span>
        <span class="mi-metric-quad-value" style="color: var(--mi-positive);">+${model.hiringMomentum}%</span>
        <span class="mi-metric-quad-sub">${model.openRoles} open requisitions</span>
      </div>
      <div class="mi-metric-quad-card">
        <span class="mi-metric-quad-label">Investment Signal</span>
        <span class="mi-metric-quad-value" style="color: var(--mi-attention);">+${model.investmentSignal}%</span>
        <span class="mi-metric-quad-sub">Capital deployment acceleration</span>
      </div>
    </div>

    <!-- Synthesis Summary Card -->
    <div style="background: var(--mi-wash); border: 1px solid var(--mi-border); border-radius: 12px; padding: 22px; display: flex; flex-direction: column; gap: 10px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <strong style="font-size: 15px; color: var(--mi-deep);"><i data-lucide="sparkles" style="color: var(--mi-purple); vertical-align: middle;"></i> Holistic Market Intelligence Synthesis</strong>
        <span class="mi-demo-badge">Verified Prototype Signal</span>
      </div>
      <p style="font-size: 13.5px; color: var(--mi-ink); line-height: 1.6; margin: 0;">
        ${esc(model.name)} demonstrates exceptional momentum (+${model.change}%) in the ${esc(model.industry)} sector. Capital allocation toward infrastructure scaling and accelerated hiring across engineering hubs are strongly reinforcing technology demand.
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px;">
        <span style="font-size: 12px; color: var(--mi-muted); padding: 4px 10px; background: #FFFFFF; border-radius: 6px; border: 1px solid var(--mi-border);">
          <strong>Primary Location Hub:</strong> ${esc(model.primaryLocation || ui.location)}
        </span>
        <span style="font-size: 12px; color: var(--mi-muted); padding: 4px 10px; background: #FFFFFF; border-radius: 6px; border: 1px solid var(--mi-border);">
          <strong>Headcount Scale:</strong> ${esc(model.headcount)}
        </span>
      </div>
    </div>
  `;
}

// 2. Market Change Tab
function renderMarketChangeTab(model) {
  const events = model.companySignals || [];

  return `
    <div class="mi-timeline-list">
      ${events.map(ev => `
        <div class="mi-timeline-node">
          <div class="mi-timeline-dot"></div>
          <div class="mi-timeline-header">
            <strong>${esc(ev.name)}</strong>
            <span class="mi-timeline-time">${esc(ev.time)}</span>
          </div>
          <div class="mi-timeline-desc">${esc(ev.desc)}</div>
          <div class="mi-timeline-footer">
            <span><strong>Signal Type:</strong> ${esc(ev.type)}</span>
            <span>·</span>
            <span><strong>Impact:</strong> <b style="color: ${ev.dir === 'down' ? 'var(--mi-negative)' : 'var(--mi-positive)'};">${esc(ev.impact)}</b></span>
            <span>·</span>
            <span><strong>Location:</strong> ${esc(ui.location)}</span>
          </div>
        </div>
      `).join('')}

      <!-- Detailed Market Movement Explanation (Step 23) -->
      <div style="background: var(--mi-wash); border: 1px solid var(--mi-border); border-radius: 12px; padding: 20px; margin-top: 8px;">
        <strong style="font-size: 14px; color: var(--mi-deep); display: block; margin-bottom: 6px;">What Signal Supports This Change?</strong>
        <p style="font-size: 13px; color: var(--mi-ink); line-height: 1.55; margin: 0;">
          Technology investment surged across the selected market, accompanied by increased requisitions for AI infrastructure and cloud engineering roles. Recent capital deployments indicate strong continuity for hardware and software systems developers.
        </p>
      </div>
    </div>
  `;
}

// 3. Technology Tab (Connected to Skill Intelligence)
function renderTechnologyTab(model) {
  const techs = model.technologies || [];

  return `
    <div style="margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
      <p style="margin: 0; font-size: 13px; color: var(--mi-muted);">
        Technologies utilized, deployed, or scaled by ${esc(model.name)}. Click any technology to investigate its skill intelligence and learning roadmap.
      </p>
      <span class="mi-demo-badge">${techs.length} Core Technologies</span>
    </div>

    <div class="mi-tech-grid">
      ${techs.map(t => `
        <div class="mi-tech-card">
          <div class="mi-tech-card-header">
            <strong>${esc(t.name)}</strong>
            <span class="mi-trend-pill is-up">${esc(t.trend)}</span>
          </div>
          <div class="mi-tech-adoption">
            <i data-lucide="layers" style="width: 13px; height: 13px; vertical-align: middle;"></i>
            <span>${esc(t.adoption)}</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px;">
            <small style="font-size: 11px; font-weight: 700; color: var(--mi-muted); text-transform: uppercase;">Related Roles:</small>
            <div class="mi-tech-pills">
              ${(t.roles || []).map(r => `<span class="mi-tech-pill">${esc(r)}</span>`).join('')}
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px;">
            <small style="font-size: 11px; font-weight: 700; color: var(--mi-muted); text-transform: uppercase;">Adjacent Skills:</small>
            <div class="mi-tech-pills">
              ${(t.skills || []).map(s => `<span class="mi-tech-pill" style="background: var(--mi-light-purple); color: var(--mi-deep);">${esc(s)}</span>`).join('')}
            </div>
          </div>

          <button type="button" class="mi-btn-primary" style="margin-top: auto; padding: 7px 12px; font-size: 12px;" data-connect-skill="${esc(t.skillLink || t.name)}">
            <span>Explore in Skill Intelligence</span>
            <i data-lucide="arrow-right"></i>
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

// 4. Hiring Tab (Connected to Career Intelligence)
function renderHiringTab(model) {
  const roles = model.roles || [];

  return `
    <div style="margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
      <p style="margin: 0; font-size: 13px; color: var(--mi-muted);">
        Active role growth and hiring requisitions at ${esc(model.name)}. Click any role to connect to Career / Job Intelligence.
      </p>
      <span class="mi-demo-badge">${model.openRoles} Total Open Requisitions</span>
    </div>

    <div class="mi-roles-grid">
      ${roles.map(r => `
        <div class="mi-role-card">
          <div class="mi-role-card-header">
            <div>
              <strong>${esc(r.title)}</strong>
              <div class="mi-role-location">
                <i data-lucide="map-pin" style="width: 12px; height: 12px; vertical-align: middle;"></i>
                <span>${esc(r.location)}</span>
              </div>
            </div>
            <span class="mi-trend-pill is-up">${esc(r.momentum)}</span>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--mi-muted);">
            <span>Open Requisitions:</span>
            <strong style="color: var(--mi-deep);">${esc(r.openCount)}</strong>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px;">
            <small style="font-size: 11px; font-weight: 700; color: var(--mi-muted); text-transform: uppercase;">Required Skills:</small>
            <div class="mi-tech-pills">
              ${(r.requiredSkills || []).map(sk => `<span class="mi-tech-pill">${esc(sk)}</span>`).join('')}
            </div>
          </div>

          <button type="button" class="mi-btn-secondary" style="margin-top: auto; padding: 7px 12px; font-size: 12px;" data-connect-role="${esc(r.title)}">
            <span>View in Career Intelligence</span>
            <i data-lucide="arrow-up-right"></i>
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

// 5. Investment Tab
function renderInvestmentTab(model) {
  const investments = model.investments || [];

  return `
    <div style="margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
      <p style="margin: 0; font-size: 13px; color: var(--mi-muted);">
        Capital expenditures, R&D allocation, and infrastructure financing driving market movements.
      </p>
      <span class="mi-demo-badge">Illustrative investment signal</span>
    </div>

    <div class="mi-invest-grid">
      ${investments.map(inv => `
        <div class="mi-invest-card">
          <strong style="font-size: 15px; color: var(--mi-deep);">${esc(inv.focus)}</strong>
          <div class="mi-invest-scale">${esc(inv.scale)}</div>
          <span class="mi-trend-pill is-up" style="align-self: flex-start;">${esc(inv.signal)}</span>
          <p style="font-size: 12.5px; color: var(--mi-ink); line-height: 1.5; margin: 0;">${esc(inv.detail)}</p>
        </div>
      `).join('')}
    </div>
  `;
}

// 6. Evidence Tab
function renderEvidenceTab(model) {
  const evidenceList = model.evidence || [];

  return `
    <div style="margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
      <p style="margin: 0; font-size: 13px; color: var(--mi-muted);">
        Verifiable regulatory filings, industry benchmarks, and hiring index citations supporting this intelligence model.
      </p>
      <span class="mi-demo-badge">${evidenceList.length} Citations Available</span>
    </div>

    <div class="mi-evidence-list">
      ${evidenceList.map((ev, idx) => `
        <div class="mi-evidence-row">
          <div class="mi-evidence-info">
            <div class="mi-evidence-title-row">
              <strong>${esc(ev.source)}</strong>
              <span class="mi-evidence-badge">
                <i data-lucide="check-circle-2" style="width: 12px; height: 12px;"></i>
                Verified Source
              </span>
              <span style="font-size: 11.5px; color: var(--mi-muted);">${esc(ev.date)} · ${esc(ev.type)}</span>
            </div>
            <div style="font-size: 12.5px; font-weight: 600; color: var(--mi-purple); margin-bottom: 3px;">
              Signal: ${esc(ev.signal)}
            </div>
            <div class="mi-evidence-desc">${esc(ev.supports)}</div>
          </div>
          <button type="button" class="mi-btn-subtle" data-action="view-evidence-modal" data-evidence-idx="${idx}">
            <i data-lucide="file-search"></i>
            <span>View Citation</span>
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

// 7. AI Insight Tab (Connected to Active Roadmap)
function renderAIInsightTab(model) {
  const insight = model.aiInsight || {
    whatChanged: 'Market signals indicate expanding infrastructure adoption and hiring acceleration.',
    why: 'Enterprise demand requires scalable platforms and specialized computational engineering.',
    whatItMeans: 'Engineers with aligned technical profiles have favorable mobility and compensation leverage.',
    whatToWatch: ['Product rollout schedules', 'Quarterly capital expenditure', 'Regional requisition velocity'],
    recommendations: []
  };

  return `
    <!-- 4 Insight Quadrants -->
    <div class="mi-insight-quad-grid">
      <div class="mi-insight-box">
        <span class="mi-insight-box-title">01 · What Changed</span>
        <p>${esc(insight.whatChanged)}</p>
      </div>
      <div class="mi-insight-box">
        <span class="mi-insight-box-title">02 · Why It Matters</span>
        <p>${esc(insight.why)}</p>
      </div>
      <div class="mi-insight-box">
        <span class="mi-insight-box-title">03 · What It Means For You</span>
        <p>${esc(insight.whatItMeans)}</p>
      </div>
      <div class="mi-insight-box">
        <span class="mi-insight-box-title">04 · What To Watch Next</span>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: var(--mi-ink); line-height: 1.6;">
          ${(insight.whatToWatch || []).map(w => `<li>${esc(w)}</li>`).join('')}
        </ul>
      </div>
    </div>

    <!-- Actionable AI Recommendations -->
    <div class="mi-recommendations-section">
      <div class="mi-recommendations-header">
        <span class="mi-eyebrow"><i data-lucide="sparkles"></i> STRATEGIC ACTION</span>
        <h4>Recommended Actions Based on Market Intelligence</h4>
        <p style="margin: 0; font-size: 13px; color: var(--mi-muted);">
          Turn market signals into structured career execution.
        </p>
      </div>

      <div class="mi-recommendations-list">
        ${(insight.recommendations || []).map(rec => `
          <div class="mi-recommendation-item">
            <div>
              <span class="mi-rec-tag">${esc(rec.tag)}</span>
              <p style="margin: 0; font-size: 13px; font-weight: 600; color: var(--mi-deep);">${esc(rec.action)}</p>
            </div>
            <div class="mi-rec-action-buttons">
              ${rec.skill ? `
                <button type="button" class="mi-btn-primary" data-build-roadmap-for-skill="${esc(rec.skill)}">
                  <i data-lucide="map"></i>
                  <span>Build Roadmap</span>
                </button>
              ` : ''}
              ${rec.role ? `
                <button type="button" class="mi-btn-secondary" data-connect-role="${esc(rec.role)}">
                  <i data-lucide="briefcase"></i>
                  <span>View Openings</span>
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--mi-border); padding-top: 16px;">
        <span style="font-size: 12px; color: var(--mi-muted);">
          Targeting: <strong>${esc(model.name)}</strong> · Market: <strong>${esc(ui.location)}</strong>
        </span>
        <button type="button" class="mi-btn-primary" id="btnRoadmapFromMarketGeneral" data-skill="${esc(model.technologies?.[0]?.name || 'Python')}">
          <i data-lucide="map"></i>
          <span>Build Advancement Roadmap for ${esc(model.technologies?.[0]?.name || 'Target Skills')}</span>
        </button>
      </div>
    </div>
  `;
}

function renderAddCompanyModal() {
  const all = dedicatedMarketCompanies;

  return `
    <div class="mi-modal-backdrop" id="miAddModalBackdrop">
      <div class="mi-modal-window" role="dialog" aria-label="Add Company to Collection">
        <div class="mi-modal-header">
          <h3>Add Company to Collection</h3>
          <button type="button" class="mi-modal-close" id="miCloseAddModalBtn"><i data-lucide="x"></i></button>
        </div>

        <p style="margin: 0; font-size: 13px; color: var(--mi-muted);">
          Select a company to add to your market tracking portfolio.
        </p>

        <div style="max-height: 360px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
          ${all.map(c => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 10px; background: var(--mi-wash); border: 1px solid var(--mi-border);">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div class="mi-company-monogram" style="width: 32px; height: 32px; font-size: 11px; ${c.brandColor ? `background: ${c.brandColor}` : ''}">
                  ${esc(c.logoInitials)}
                </div>
                <div>
                  <strong style="font-size: 13.5px; color: var(--mi-deep);">${esc(c.name)}</strong>
                  <small style="display: block; font-size: 11.5px; color: var(--mi-muted);">${esc(c.sector)}</small>
                </div>
              </div>
              <button type="button" class="mi-btn-primary" style="padding: 6px 12px; font-size: 12px;" data-add-company-action="${esc(c.name)}">
                <span>Select</span>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderEvidenceModal(evidence) {
  return `
    <div class="mi-modal-backdrop" id="miEvidenceModalBackdrop">
      <div class="mi-modal-window" role="dialog" aria-label="Evidence Citation">
        <div class="mi-modal-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="file-search" style="color: var(--mi-purple);"></i>
            <h3>Verified Evidence Citation</h3>
          </div>
          <button type="button" class="mi-modal-close" id="miCloseEvidenceModalBtn"><i data-lucide="x"></i></button>
        </div>

        <div style="background: var(--mi-wash); border-radius: 10px; padding: 16px; border: 1px solid var(--mi-border);">
          <strong style="font-size: 15px; color: var(--mi-deep); display: block; margin-bottom: 4px;">${esc(evidence.source)}</strong>
          <span style="font-size: 12px; color: var(--mi-muted);">${esc(evidence.date)} · ${esc(evidence.type)}</span>
          <div style="margin-top: 12px; padding: 10px; background: #FFFFFF; border-radius: 8px; border: 1px solid var(--mi-border-glass);">
            <strong style="font-size: 12px; color: var(--mi-purple); display: block;">Reported Metric / Signal:</strong>
            <span style="font-size: 14px; font-weight: 700; color: var(--mi-deep);">${esc(evidence.signal)}</span>
          </div>
        </div>

        <div>
          <strong style="font-size: 12.5px; color: var(--mi-muted); text-transform: uppercase;">Intelligence Conclusion Supported:</strong>
          <p style="font-size: 13.5px; color: var(--mi-ink); line-height: 1.5; margin-top: 4px;">
            ${esc(evidence.supports)}
          </p>
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="button" class="mi-btn-primary" id="miDismissEvidenceModalBtn">
            <span>Close Citation</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function getAnalysisStepText() {
  const steps = [
    'Scanning real-time company signals and filing disclosures...',
    'Evaluating technology momentum and stack adoption...',
    'Synthesizing workforce hiring requisitions and strategic insights...'
  ];
  return steps[ui.analysisStep] || steps[0];
}

// ============================================================================
// MAIN PAGE HTML RENDERER
// ============================================================================

export function renderMarketIntelligenceHTML() {
  const model = getSelectedCompanyData();
  const visibleCompanies = getVisibleCompanies();

  return `
    <div class="market-intelligence-page" id="marketIntelligencePageRoot">
      <!-- Page Heading -->
      <header class="mi-page-heading">
        <div>
          <span class="mi-eyebrow">
            <i data-lucide="chart-no-axes-combined"></i> INDIVIDUAL INTELLIGENCE
          </span>
          <h1>Market Intelligence</h1>
          <p>Understand how companies, technologies, investment and hiring signals are changing across the market.</p>
        </div>
        <div class="mi-demo-badge">
          <span class="mi-live-dot"></span>
          <span>Simulated market signals</span>
        </div>
      </header>

      <!-- 50/50 Workspace Grid (Market Collection & Live Market Trend) -->
      <div class="mi-workspace-grid">
        <!-- Section 1: Market Collection -->
        <section class="mi-card">
          <div class="mi-card-header">
            <div>
              <h2>Your Market Collection</h2>
              <p>Choose a company or market signal to investigate.</p>
            </div>
            <button type="button" class="mi-btn-subtle" id="btnOpenAddCompanyModalHeader">
              <i data-lucide="plus"></i> Add
            </button>
          </div>

          <!-- Collection Tabs: My Companies / Favorite Companies / All Companies -->
          <div class="mi-collection-tabs">
            <button type="button" class="mi-collection-tab ${ui.collection === 'My Companies' ? 'is-active' : ''}" data-collection-tab="My Companies">
              <span>My Companies</span>
            </button>
            <button type="button" class="mi-collection-tab ${ui.collection === 'Favorite Companies' ? 'is-active' : ''}" data-collection-tab="Favorite Companies">
              <span>Favorite Companies</span>
            </button>
            <button type="button" class="mi-collection-tab ${ui.collection === 'All Companies' ? 'is-active' : ''}" data-collection-tab="All Companies">
              <span>All Companies</span>
            </button>
          </div>

          <!-- Search & Filter Controls -->
          <div class="mi-collection-controls">
            <div class="mi-search-wrap">
              <i data-lucide="search"></i>
              <input type="text" class="mi-search-input" id="miCompanySearchInput" placeholder="Filter companies, sectors..." value="${esc(ui.searchQuery)}" />
            </div>
          </div>

          <!-- Company Rows List -->
          <div class="mi-company-list">
            ${renderCompanyRows(visibleCompanies, model)}
          </div>
        </section>

        <!-- Section 2: Live Market Trend -->
        <section class="mi-card">
          <div class="mi-card-header">
            <div>
              <h2>Live Market Trend</h2>
              <p>Multi-signal coordinated momentum tracking across market, technology, hiring & capital.</p>
            </div>
            <span class="mi-trend-pill is-up">
              ${model.change > 0 ? '+' : ''}${model.change}%
            </span>
          </div>

          <!-- Selected Company Details Header -->
          <div class="mi-trend-header-details">
            <div class="mi-trend-hero-company">
              <div class="mi-company-monogram" style="${model.brandColor ? `background: linear-gradient(135deg, ${model.brandColor}, #42075D)` : ''}">
                ${esc(model.logoInitials)}
              </div>
              <div class="mi-trend-hero-meta">
                <h3>${esc(model.name)}</h3>
                <span>${esc(model.sector)} · ${esc(ui.location)}</span>
              </div>
            </div>

            <div class="mi-trend-hero-metric">
              <div class="mi-trend-hero-val">${model.marketMomentum}/100</div>
              <div class="mi-trend-hero-label">Momentum Score</div>
            </div>
          </div>

          <!-- Multi-Signal Interactive Animated SVG Graph -->
          ${renderMultiSignalChart(model)}

          <!-- Company Signals List -->
          ${renderCompanySignalsList(model)}
        </section>
      </div>

      <!-- Section 3: Market Intelligence Console -->
      ${renderConsole(model)}

      <!-- Section 4: Intelligence Result -->
      ${renderResultSection(model)}

      <!-- Modal Overlays -->
      ${ui.addModalOpen ? renderAddCompanyModal() : ''}
      ${ui.evidenceModalData ? renderEvidenceModal(ui.evidenceModalData) : ''}
    </div>
  `;
}

// ============================================================================
// EVENT BINDINGS & LIFECYCLE
// ============================================================================

function bindEvents() {
  const root = document.getElementById('marketIntelligencePageRoot');
  if (!root) return;

  // Collection tabs
  root.querySelectorAll('[data-collection-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      ui.collection = btn.dataset.collectionTab;
      dedicatedMarketState.companyScope = ui.collection;
      rerender();
    });
  });

  // Company selection in list
  root.querySelectorAll('[data-select-company]').forEach(el => {
    el.addEventListener('click', (e) => {
      // Don't trigger if clicked favorite star
      if (e.target.closest('[data-toggle-fav]')) return;
      const comp = el.dataset.selectCompany;
      if (comp) {
        selectCompany(comp);
      }
    });
  });

  // Favorite toggle
  root.querySelectorAll('[data-toggle-fav]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const comp = btn.dataset.toggleFav;
      toggleFavorite(comp);
    });
  });

  // Company search in collection
  const searchInput = root.querySelector('#miCompanySearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      ui.searchQuery = e.target.value;
      rerender({ preserveFocus: 'miCompanySearchInput' });
    });
  }

  // Filter Popover Trigger
  const filterTrigger = root.querySelector('#miFilterTrigger');
  if (filterTrigger) {
    filterTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      ui.filterOpen = !ui.filterOpen;
      rerender();
    });
  }

  // Filter Popover Closes
  const scrim = root.querySelector('#miFilterScrim');
  const filterClose = root.querySelector('#miFilterCloseBtn');
  [scrim, filterClose].forEach(el => {
    el?.addEventListener('click', (e) => {
      e.stopPropagation();
      ui.filterOpen = false;
      rerender();
    });
  });

  // Filter Apply
  const filterApply = root.querySelector('#miFilterApplyBtn');
  if (filterApply) {
    filterApply.addEventListener('click', (e) => {
      e.stopPropagation();
      const loc = root.querySelector('#miFilterLocation')?.value;
      const rng = root.querySelector('#miFilterTimeRange')?.value;
      const ind = root.querySelector('#miFilterIndustry')?.value;
      const sig = root.querySelector('#miFilterSignal')?.value;
      const sz = root.querySelector('#miFilterSize')?.value;

      if (loc) ui.location = loc;
      if (rng) ui.timeRange = rng;
      if (ind) ui.industryFilter = ind;
      if (sig) ui.signalFilter = sig;
      if (sz) ui.sizeFilter = sz;

      dashboardState.market = ui.location;
      dashboardState.timeRange = ui.timeRange;
      ui.filterOpen = false;
      rerender();
    });
  }

  // Filter Reset
  const filterReset = root.querySelector('#miFilterResetBtn');
  if (filterReset) {
    filterReset.addEventListener('click', (e) => {
      e.stopPropagation();
      ui.location = 'Global';
      ui.timeRange = '30D';
      ui.industryFilter = 'All Industries';
      ui.signalFilter = 'All Signals';
      ui.sizeFilter = 'All Sizes';
      dashboardState.market = 'Global';
      dashboardState.timeRange = '30D';
      ui.filterOpen = false;
      rerender();
    });
  }

  // Active filter pill clear clicks
  root.querySelectorAll('[data-clear-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.dataset.clearFilter;
      if (key === 'location') { ui.location = 'Global'; dashboardState.market = 'Global'; }
      if (key === 'timeRange') { ui.timeRange = '30D'; dashboardState.timeRange = '30D'; }
      if (key === 'industry') ui.industryFilter = 'All Industries';
      if (key === 'signal') ui.signalFilter = 'All Signals';
      if (key === 'size') ui.sizeFilter = 'All Sizes';
      rerender();
    });
  });

  // Clear all filters button
  const clearAllFilters = root.querySelector('#miClearAllFiltersBtn');
  if (clearAllFilters) {
    clearAllFilters.addEventListener('click', (e) => {
      e.stopPropagation();
      ui.location = 'Global';
      ui.timeRange = '30D';
      ui.industryFilter = 'All Industries';
      ui.signalFilter = 'All Signals';
      ui.sizeFilter = 'All Sizes';
      dashboardState.market = 'Global';
      dashboardState.timeRange = '30D';
      rerender();
    });
  }

  // Esc key to dismiss open filter
  if (ui.filterOpen) {
    const handleFilterEsc = (e) => {
      if (e.key === 'Escape') {
        ui.filterOpen = false;
        rerender();
        document.removeEventListener('keydown', handleFilterEsc);
      }
    };
    document.addEventListener('keydown', handleFilterEsc);
  }

  // Add Company Modal open/close
  const addModalBtns = root.querySelectorAll('#btnOpenAddCompanyModal, #btnOpenAddCompanyModalHeader');
  addModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ui.addModalOpen = true;
      rerender();
    });
  });

  const closeAddModalBtn = root.querySelector('#miCloseAddModalBtn');
  const addBackdrop = root.querySelector('#miAddModalBackdrop');
  [closeAddModalBtn, addBackdrop].forEach(el => {
    el?.addEventListener('click', (e) => {
      if (e.target === el) {
        ui.addModalOpen = false;
        rerender();
      }
    });
  });

  root.querySelectorAll('[data-add-company-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const comp = btn.dataset.addCompanyAction;
      if (comp) {
        if (!dashboardState.savedCompanies.includes(comp)) {
          dashboardState.savedCompanies.push(comp);
          localStorage.setItem('talentscope-saved-companies', JSON.stringify(dashboardState.savedCompanies));
        }
        ui.addModalOpen = false;
        selectCompany(comp);
      }
    });
  });

  // Chart Legend Toggles
  root.querySelectorAll('[data-toggle-signal]').forEach(item => {
    item.addEventListener('click', () => {
      const sig = item.dataset.toggleSignal;
      if (ui.mutedSignals.has(sig)) {
        ui.mutedSignals.delete(sig);
      } else {
        ui.mutedSignals.add(sig);
      }
      rerender();
    });
  });

  // Chart Crosshair & Tooltip
  const chartCanvas = root.querySelector('#miChartCanvas');
  const chartTooltip = root.querySelector('#miChartTooltip');
  const chartGuide = root.querySelector('#miChartGuide');
  if (chartCanvas && chartTooltip) {
    chartCanvas.addEventListener('pointermove', (e) => {
      const rect = chartCanvas.getBoundingClientRect();
      const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      const model = getSelectedCompanyData();
      const sampleIdx = Math.floor(ratio * 6);
      const signals = model.multiSignals || {
        market: [48, 56, 65, 76, 82, 90, 98],
        technology: [52, 60, 68, 79, 86, 92, 99],
        hiring: [38, 46, 55, 68, 77, 85, 91],
        investment: [44, 52, 63, 72, 80, 88, 95]
      };

      const mVal = signals.market[sampleIdx] || 80;
      const tVal = signals.technology[sampleIdx] || 80;
      const hVal = signals.hiring[sampleIdx] || 75;
      const iVal = signals.investment[sampleIdx] || 78;

      chartTooltip.innerHTML = `
        <strong>${model.name} · Point ${sampleIdx + 1} of 7</strong>
        <span>Market Momentum: <b>${mVal}/100</b></span>
        <span>Technology: <b>+${(tVal * 0.28).toFixed(1)}%</b></span>
        <span>Hiring: <b>+${(hVal * 0.2).toFixed(1)}%</b></span>
        <span>Investment: <b>+${(iVal * 0.24).toFixed(1)}%</b></span>
      `;
      chartTooltip.hidden = false;
      chartTooltip.style.left = `${(ratio * 100).toFixed(1)}%`;

      if (chartGuide) {
        chartGuide.hidden = false;
        chartGuide.setAttribute('x1', String(ratio * 640));
        chartGuide.setAttribute('x2', String(ratio * 640));
      }
    });

    chartCanvas.addEventListener('pointerleave', () => {
      chartTooltip.hidden = true;
      if (chartGuide) chartGuide.hidden = true;
    });
  }

  // Clear Context Chip
  root.querySelector('[data-action="clear-company-chip"]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    selectCompany('Microsoft');
  });

  // Suggested Questions
  root.querySelectorAll('[data-ask-question]').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.askQuestion;
      ui.queryText = q;
      const inp = root.querySelector('#miConsoleInput');
      if (inp) inp.value = q;
      runAnalysis();
    });
  });

  // Console Input
  const consoleInput = root.querySelector('#miConsoleInput');
  if (consoleInput) {
    consoleInput.addEventListener('input', (e) => {
      ui.queryText = e.target.value;
    });
    consoleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runAnalysis();
      }
    });
  }

  // Analyze Button
  root.querySelector('#miAnalyzeBtn')?.addEventListener('click', () => {
    runAnalysis();
  });

  // Result Tabs Switching
  root.querySelectorAll('[data-switch-tab]').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      ui.activeTab = tabBtn.dataset.switchTab;
      dedicatedMarketState.selectedTab = ui.activeTab;
      rerender();
      root.querySelector('#miResultSection')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  // Technology -> Skill Intelligence connection
  root.querySelectorAll('[data-connect-skill]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const skillName = btn.dataset.connectSkill;
      if (skillName) {
        dashboardState.selectedSkill = skillName;
        window.location.hash = '/individual/skills';
      }
    });
  });

  // Role -> Career Intelligence connection
  root.querySelectorAll('[data-connect-role]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.hash = '/individual/career';
    });
  });

  // Explore Related Jobs Header Button
  root.querySelector('#btnExploreRelatedJobs')?.addEventListener('click', () => {
    window.location.hash = '/individual/career';
  });

  // Build Roadmap from recommendation item
  root.querySelectorAll('[data-build-roadmap-for-skill]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const skill = btn.dataset.buildRoadmapForSkill || 'Python';
      triggerRoadmapPreview(skill);
    });
  });

  // General Roadmap button in AI Insight
  root.querySelector('#btnRoadmapFromMarketGeneral')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const skill = e.currentTarget.dataset.skill || 'Python';
    triggerRoadmapPreview(skill);
  });

  // Evidence Modal open/close
  root.querySelectorAll('[data-action="view-evidence-modal"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = Number(btn.dataset.evidenceIdx);
      const model = getSelectedCompanyData();
      if (model.evidence && model.evidence[idx]) {
        ui.evidenceModalData = model.evidence[idx];
        rerender();
      }
    });
  });

  const closeEvidenceBtn = root.querySelector('#miCloseEvidenceModalBtn');
  const dismissEvidenceBtn = root.querySelector('#miDismissEvidenceModalBtn');
  const evidenceBackdrop = root.querySelector('#miEvidenceModalBackdrop');
  [closeEvidenceBtn, dismissEvidenceBtn, evidenceBackdrop].forEach(el => {
    el?.addEventListener('click', (e) => {
      if (e.target === el) {
        ui.evidenceModalData = null;
        rerender();
      }
    });
  });

  // View All Market Companies link
  root.querySelector('#btnViewAllMarketCompanies')?.addEventListener('click', () => {
    ui.collection = 'All Companies';
    dedicatedMarketState.companyScope = 'All Companies';
    rerender();
  });
}

function selectCompany(companyName) {
  dedicatedMarketState.selectedCompany = companyName;
  dashboardState.selectedCompany = companyName;
  rerender();
}

function toggleFavorite(companyName) {
  let favs = [...(dashboardState.favoriteCompanies || [])];
  if (favs.includes(companyName)) {
    favs = favs.filter(c => c !== companyName);
  } else {
    favs.push(companyName);
  }
  dashboardState.favoriteCompanies = favs;
  localStorage.setItem('talentscope-favorite-companies', JSON.stringify(favs));
  rerender();
}

function triggerRoadmapPreview(skillName) {
  dashboardState.selectedSkill = skillName;
  intelligenceExplorerState.isRoadmapPreviewing = true;
  window.location.hash = '/individual/home';
}

function runAnalysis() {
  ui.isAnalyzing = true;
  ui.analysisStep = 0;
  rerender();

  const stepInterval = setInterval(() => {
    ui.analysisStep++;
    if (ui.analysisStep >= 3) {
      clearInterval(stepInterval);
      ui.isAnalyzing = false;
      ui.hasAnalyzed = true;
      rerender();
      document.querySelector('#miResultSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      rerender();
    }
  }, 450);
}

function rerender(options = {}) {
  const main = document.getElementById('mainContent');
  if (!main) return;
  main.innerHTML = renderMarketIntelligenceHTML();
  window.lucide?.createIcons();
  bindEvents();

  if (options.preserveFocus) {
    const el = document.getElementById(options.preserveFocus);
    if (el) {
      el.focus();
      if (typeof el.selectionStart === 'number') {
        el.selectionStart = el.selectionEnd = el.value.length;
      }
    }
  }
}

function tickSimulation() {
  ui.simTick++;
  const model = getSelectedCompanyData();
  if (model.multiSignals) {
    // Subtle bounded drift on last data point (±0.4)
    const drift = (Math.sin(ui.simTick * 0.8) * 0.4);
    const lastIdx = model.multiSignals.market.length - 1;
    model.multiSignals.market[lastIdx] = clamp(Math.round(model.multiSignals.market[lastIdx] + drift), 50, 99);
  }
  // Softly update live pulse without disrupting input focus
  const badge = document.querySelector('.market-intelligence-page .mi-demo-badge');
  if (badge) {
    badge.classList.add('is-pulsing');
    setTimeout(() => badge.classList.remove('is-pulsing'), 600);
  }
}

// ============================================================================
// EXPORT ENTRY POINT
// ============================================================================

export function renderDedicatedMarketPage() {
  if (simTimer) clearInterval(simTimer);
  const main = document.getElementById('mainContent');
  if (!main) return;
  main.innerHTML = renderMarketIntelligenceHTML();
  window.lucide?.createIcons();
  bindEvents();
  simTimer = window.setInterval(tickSimulation, 4200);
}
