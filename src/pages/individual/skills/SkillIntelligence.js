import { dashboardState, dedicatedSkillState, intelligenceExplorerState } from '../../../app/state.js';
import {
  dedicatedSkillIntelligenceData, getSkillsForScope, getSkillGapDetails,
  getAIExplanationAndEvidence, getSkillNextActionRecommendation,
  toggleSavedSkill, toggleFavoriteSkill
} from '../../../data/skill-data.js';

// Configuration constants
const LOCATIONS = ['Global', 'India', 'Tamil Nadu', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Remote'];
const RANGES = ['7 Days', '30 Days', '90 Days', '6 Months', '1 Year'];
const RANGE_KEYS = { '7 Days': '7D', '30 Days': '30D', '90 Days': '90D', '6 Months': '6M', '1 Year': '1Y' };
const DATE_MODES = ['Recent', 'Month', 'Quarter', 'Year', 'Custom Range'];
const CATEGORIES = ['All Categories', 'AI & Data', 'Programming', 'Infrastructure', 'AI Hardware'];
const TREND_STATUSES = ['All', 'Growing', 'Stable', 'Declining'];
const LAYERS = ['Overview', 'Market Change', 'Relevance', 'Health & Gap', 'Evidence', 'AI Insight'];
const LAYER_ICONS = {
  Overview: 'layout-dashboard',
  'Market Change': 'chart-no-axes-combined',
  Relevance: 'target',
  'Health & Gap': 'heart-pulse',
  Evidence: 'file-search',
  'AI Insight': 'sparkles'
};
const LAYER_DESCRIPTIONS = {
  Overview: 'Holistic four-signal intelligence model for this skill across market and personal dimensions.',
  'Market Change': 'Real-time and projected market shifts, technology adoption signals, and hiring volume.',
  Relevance: 'How this skill aligns with career trajectories, industry standards, and adjacent tools.',
  'Health & Gap': 'Diagnostic breakdown of your current mastery, practical recency, and development priorities.',
  Evidence: 'Verified prototype signals and market data citations supporting this intelligence model.',
  'AI Insight': 'Explainable synthesis and strategic recommended roadmap to bridge identified gaps.'
};

// Associated company datasets per skill
const SKILL_COMPANIES = {
  'Machine Learning': [
    { mark: 'N', name: 'NVIDIA', signal: 'AI Compute & Triton', growth: 24.6, dir: 'up' },
    { mark: 'M', name: 'Microsoft', signal: 'Copilot Infrastructure', growth: 18.2, dir: 'up' },
    { mark: 'G', name: 'Google', signal: 'Gemini Platform & TPU', growth: 15.7, dir: 'up' },
    { mark: 'A', name: 'Amazon', signal: 'AWS SageMaker & Bedrock', growth: 13.9, dir: 'up' }
  ],
  'Python': [
    { mark: 'G', name: 'Google', signal: 'Core Automation & ML', growth: 19.4, dir: 'up' },
    { mark: 'M', name: 'Meta', signal: 'PyTorch & Distributed AI', growth: 16.8, dir: 'up' },
    { mark: 'S', name: 'Spotify', signal: 'Backend & Data Pipelines', growth: 14.2, dir: 'up' },
    { mark: 'N', name: 'Netflix', signal: 'Recommendation Engines', growth: 12.5, dir: 'up' }
  ],
  'Generative AI': [
    { mark: 'O', name: 'OpenAI', signal: 'Frontier LLM Platforms', growth: 38.5, dir: 'up' },
    { mark: 'A', name: 'Anthropic', signal: 'Constitutional Models', growth: 34.0, dir: 'up' },
    { mark: 'M', name: 'Microsoft', signal: 'Enterprise Azure AI', growth: 28.7, dir: 'up' },
    { mark: 'N', name: 'NVIDIA', signal: 'DGX Cloud & NeMo', growth: 26.4, dir: 'up' }
  ],
  'Cloud Computing': [
    { mark: 'A', name: 'Amazon', signal: 'AWS Cloud Foundations', growth: 16.4, dir: 'up' },
    { mark: 'M', name: 'Microsoft', signal: 'Azure Cloud Platform', growth: 15.2, dir: 'up' },
    { mark: 'G', name: 'Google', signal: 'Google Cloud Platform', growth: 13.8, dir: 'up' },
    { mark: 'C', name: 'Cloudflare', signal: 'Edge & Workers Compute', growth: 12.1, dir: 'up' }
  ],
  'SQL': [
    { mark: 'S', name: 'Snowflake', signal: 'Enterprise Data Warehouse', growth: 11.2, dir: 'up' },
    { mark: 'D', name: 'Databricks', signal: 'Lakehouse & Spark SQL', growth: 14.5, dir: 'up' },
    { mark: 'O', name: 'Oracle', signal: 'Cloud Database Requisitions', growth: 7.8, dir: 'up' },
    { mark: 'A', name: 'Amazon', signal: 'Redshift & Aurora DB', growth: 9.3, dir: 'up' }
  ],
  'CUDA': [
    { mark: 'N', name: 'NVIDIA', signal: 'Tensor Core Acceleration', growth: 32.4, dir: 'up' },
    { mark: 'O', name: 'OpenAI', signal: 'Triton Kernel Ops', growth: 28.6, dir: 'up' },
    { mark: 'M', name: 'Meta', signal: 'GPU Cluster Tuning', growth: 25.1, dir: 'up' },
    { mark: 'T', name: 'Tesla', signal: 'FSD & Dojo Neural Nets', growth: 22.8, dir: 'up' }
  ]
};

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Component UI state
let ui = {
  collection: dedicatedSkillState.skillScope || 'My Skills',
  layer: 'Overview',
  analyzed: false,
  query: '',
  filterOpen: false,
  addOpen: false,
  search: '',
  busy: false,
  tick: 0,
  dateMode: 'Recent',
  startDate: '',
  endDate: '',
  categoryFilter: 'All Categories',
  trendFilter: 'All',
  filtersApplied: false,
  quickRemoved: new Set(),
  mutedSeries: new Set(),
  addChoice: false,
  viewingEvidence: null
};

let timer = null;

function skillList() {
  return dedicatedSkillIntelligenceData.skills || [];
}

function chosenSkill() {
  const current = skillList().find(item => item.name.toLowerCase() === (dashboardState.selectedSkill || '').toLowerCase());
  return current || skillList()[0];
}

function filteredGrowth(skill) {
  const locMultipliers = {
    Global: 1.08, India: 0.98, 'Tamil Nadu': 0.92, Chennai: 0.95,
    Bangalore: 1.02, Hyderabad: 0.99, Pune: 0.94, Remote: 0.97
  };
  const rangeMultipliers = { '7D': 0.4, '30D': 0.85, '90D': 1.05, '6M': 1.4, '1Y': 1.85, Custom: 1 };
  const locFactor = locMultipliers[dashboardState.market || 'Bangalore'] || 1;
  const rangeFactor = rangeMultipliers[dashboardState.timeRange || '30D'] || 1;
  const baseGrowth = Number(skill.growth || 15);
  const dir = skill.direction === 'down' ? -1 : 1;
  return baseGrowth * dir * locFactor * rangeFactor;
}

function context() {
  const skill = chosenSkill();
  const gaps = getSkillGapDetails(skill).gapItems || [];
  const explanation = getAIExplanationAndEvidence(skill, dashboardState.market || 'Global', dashboardState.timeRange || '30D');
  const growth = filteredGrowth(skill);
  const history = [...(skill.history || [50, 58, 66, 74, 80, 84, 88])];
  const saved = (dashboardState.savedSkills || []).includes(skill.name);
  const favorite = (dashboardState.favoriteSkills || []).includes(skill.name);
  const companies = SKILL_COMPANIES[skill.name] || [
    { mark: 'N', name: 'NVIDIA', signal: 'GPU & AI Acceleration', growth: growth * 0.9, dir: 'up' },
    { mark: 'M', name: 'Microsoft', signal: 'Enterprise Deployment', growth: growth * 0.75, dir: 'up' },
    { mark: 'G', name: 'Google', signal: 'Cloud & Infrastructure', growth: growth * 0.65, dir: 'up' }
  ];
  return {
    skill,
    gaps,
    explanation,
    next: getSkillNextActionRecommendation(skill),
    history,
    growth,
    saved,
    favorite,
    companies
  };
}

function iconForSkill(skill) {
  if (skill.icon) return skill.icon;
  const cat = (skill.category || '').toLowerCase();
  const name = (skill.name || '').toLowerCase();
  if (cat.includes('hardware') || name.includes('cuda')) return 'cpu';
  if (cat.includes('cloud') || cat.includes('infra')) return 'cloud';
  if (cat.includes('programming') || name.includes('python') || name.includes('java')) return 'code-2';
  if (cat.includes('ai') || cat.includes('data')) return 'brain-circuit';
  return 'sparkles';
}

function points(values, width = 160, height = 54) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  return values.map((val, idx) => {
    const x = (idx / Math.max(1, values.length - 1) * width).toFixed(1);
    const y = (height - 4 - (val - min) / span * (height - 12)).toFixed(1);
    return `${x},${y}`;
  }).join(' ');
}

function sparklineSVG(skill) {
  const values = skill.history || [45, 52, 50, 65, 69, 76, 82];
  const up = skill.direction !== 'down';
  return `<svg class="si-spark" viewBox="0 0 160 54" preserveAspectRatio="none" role="img" aria-label="${esc(skill.name)} mini trend">
    <polyline points="${points(values)}" class="${up ? 'is-up' : 'is-down'}"/>
  </svg>`;
}

function collectionSkillList() {
  let list = [];
  if (ui.collection === 'My Skills') {
    list = getSkillsForScope('My Skills');
  } else if (ui.collection === 'Favorite Skills') {
    list = getSkillsForScope('Favorite Skills');
  } else {
    list = skillList();
  }

  // Filter by category
  if (ui.categoryFilter && ui.categoryFilter !== 'All Categories') {
    list = list.filter(s => s.category === ui.categoryFilter);
  }

  // Filter by trend status
  if (ui.trendFilter && ui.trendFilter !== 'All') {
    list = list.filter(s => {
      const g = filteredGrowth(s);
      if (ui.trendFilter === 'Growing') return g > 1;
      if (ui.trendFilter === 'Declining') return g < -1;
      return Math.abs(g) <= 1;
    });
  }

  // Filter by search query in All Skills
  if (ui.collection === 'All Skills' && ui.search) {
    const q = ui.search.toLowerCase();
    list = list.filter(s => `${s.name} ${s.category}`.toLowerCase().includes(q));
  }

  return list;
}

function skillRowMarkup(skill, model) {
  const active = skill.name === model.skill.name;
  const growth = filteredGrowth(skill);
  const isUp = growth > 0.5;
  const isDown = growth < -0.5;
  const trendClass = isUp ? 'is-up' : isDown ? 'is-down' : 'is-stable';
  const trendArrow = isUp ? '↗' : isDown ? '↘' : '→';
  const isFavoriteView = ui.collection === 'Favorite Skills';

  return `
    <div class="si-skill-row-wrap">
      <button type="button" class="si-skill-row ${active ? 'is-active' : ''}" data-skill="${esc(skill.name)}" aria-pressed="${active}">
        <span class="si-skill-icon"><i data-lucide="${esc(iconForSkill(skill))}"></i></span>
        <span class="si-row-name">
          <strong>${esc(skill.name)}</strong>
          <small>${esc(skill.category)}</small>
        </span>
        <span class="si-row-trend ${trendClass}">${growth > 0 ? '+' : ''}${growth.toFixed(1)}% ${trendArrow}</span>
        ${sparklineSVG(skill)}
      </button>
      ${isFavoriteView ? `
        <button type="button" class="si-row-unfavorite" data-action="remove-favorite" data-skill-target="${esc(skill.name)}" title="Remove from favorites" aria-label="Remove ${esc(skill.name)} from favorites">
          <i data-lucide="star-off"></i>
        </button>
      ` : ''}
    </div>
  `;
}

function singleFilterModal() {
  const activeCount = [
    (dashboardState.market && dashboardState.market !== 'Bangalore'),
    (dashboardState.timeRange && dashboardState.timeRange !== '30D'),
    (ui.categoryFilter && ui.categoryFilter !== 'All Categories'),
    (ui.trendFilter && ui.trendFilter !== 'All'),
    (ui.dateMode && ui.dateMode !== 'Recent')
  ].filter(Boolean).length;

  return `
    <div class="si-filter-pop" id="si-filter-panel" ${ui.filterOpen ? '' : 'hidden'} role="dialog" aria-label="Intelligence Filters">
      <div class="si-filter-head">
        <div>
          <small>REFINE INTELLIGENCE WORKSPACE</small>
          <strong>Intelligence Filters</strong>
        </div>
        <button type="button" class="si-icon-button" data-action="filter-close" aria-label="Close filters">
          <i data-lucide="x"></i>
        </button>
      </div>

      <div class="si-filter-body">
        <label>Skill Target
          <select id="si-filter-skill">
            ${skillList().map(s => `<option value="${esc(s.name)}" ${s.name === dashboardState.selectedSkill ? 'selected' : ''}>${esc(s.name)} (${esc(s.category)})</option>`).join('')}
          </select>
        </label>

        <label>Skill Collection
          <select id="si-filter-collection">
            ${['My Skills', 'Favorite Skills', 'All Skills'].map(v => `<option value="${esc(v)}" ${v === ui.collection ? 'selected' : ''}>${esc(v)}</option>`).join('')}
          </select>
        </label>

        <label>Location
          <select id="si-filter-location">
            ${LOCATIONS.map(v => `<option value="${esc(v)}" ${v === (dashboardState.market || 'Bangalore') ? 'selected' : ''}>${esc(v)}</option>`).join('')}
          </select>
        </label>

        <label>Time Range
          <select id="si-filter-range">
            ${RANGES.map(v => `<option value="${esc(v)}" ${RANGE_KEYS[v] === (dashboardState.timeRange || '30D') ? 'selected' : ''}>${esc(v)}</option>`).join('')}
          </select>
        </label>

        <label>Skill Category
          <select id="si-filter-category">
            ${CATEGORIES.map(v => `<option value="${esc(v)}" ${v === (ui.categoryFilter || 'All Categories') ? 'selected' : ''}>${esc(v)}</option>`).join('')}
          </select>
        </label>

        <label>Trend Status
          <select id="si-filter-trend">
            ${TREND_STATUSES.map(v => `<option value="${esc(v)}" ${v === (ui.trendFilter || 'All') ? 'selected' : ''}>${esc(v)}</option>`).join('')}
          </select>
        </label>

        <div class="si-filter-date-mode">
          <label>Date Mode
            <select id="si-date-mode">
              ${DATE_MODES.map(v => `<option value="${esc(v)}" ${v === ui.dateMode ? 'selected' : ''}>${esc(v)}</option>`).join('')}
            </select>
          </label>
          <div class="si-custom-filter-dates" ${ui.dateMode === 'Custom Range' ? '' : 'hidden'}>
            <label>Start Date <input type="date" id="si-date-start" value="${esc(ui.startDate)}"></label>
            <label>End Date <input type="date" id="si-date-end" value="${esc(ui.endDate)}"></label>
          </div>
        </div>
      </div>

      <footer>
        <button type="button" class="si-button si-button--quiet" data-action="filter-reset">Reset</button>
        <button type="button" class="si-button si-button--primary" data-action="filter-apply">Apply Filters</button>
      </footer>
    </div>
  `;
}

function addSkillModal() {
  const notAdded = skillList().filter(s =>
    !(dashboardState.savedSkills || []).includes(s.name) &&
    `${s.name} ${s.category}`.toLowerCase().includes(ui.search.toLowerCase())
  );

  return `
    <div class="si-add-pop" ${ui.addOpen ? '' : 'hidden'} role="dialog" aria-label="Add Skill to Collection">
      <div class="si-add-header">
        <strong>Add Skill to Collection</strong>
        <button type="button" class="si-icon-button" data-action="toggle-add" aria-label="Close dialog"><i data-lucide="x"></i></button>
      </div>
      <label class="si-add-search">
        <i data-lucide="search"></i>
        <input id="si-add-search" placeholder="Search skill library…" value="${esc(ui.search)}" aria-label="Search skills to add">
      </label>
      <div class="si-add-list">
        ${notAdded.map(s => `
          <div class="si-add-item">
            <span class="si-skill-icon"><i data-lucide="${esc(iconForSkill(s))}"></i></span>
            <span class="si-add-info">
              <strong>${esc(s.name)}</strong>
              <small>${esc(s.category)} · +${esc(s.growth)}%</small>
            </span>
            <div class="si-add-actions">
              <button type="button" class="si-add-btn" data-add-to="my" data-add-skill="${esc(s.name)}" title="Add to My Skills">+ My Skills</button>
              <button type="button" class="si-add-btn si-add-btn--fav" data-add-to="fav" data-add-skill="${esc(s.name)}" title="Add to Favorites"><i data-lucide="star"></i> Fav</button>
            </div>
          </div>
        `).join('') || '<p class="si-empty-msg">All available skills are already in your collection.</p>'}
      </div>
    </div>
  `;
}

// Live Trend Main SVG Chart
function mainTrendChartSVG(model) {
  const vals = model.history;
  const poly = points(vals, 720, 200);
  const up = model.growth >= 0;
  const currentVal = vals.at(-1) || 84;
  const cy = Number(poly.split(' ').at(-1)?.split(',')[1]) || 80;

  return `
    <div class="si-chart" data-si-chart="monitor" role="img" aria-label="Demand trend for ${esc(model.skill.name)}">
      <svg viewBox="0 0 720 220" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="si-fill-primary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${up ? '#19B77A' : '#E05252'}" stop-opacity="0.28"/>
            <stop offset="100%" stop-color="${up ? '#19B77A' : '#E05252'}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <path class="si-chart-area" d="M ${poly.replaceAll(' ', ' L ')} L 720 220 L 0 220 Z"/>
        <polyline points="${poly}" class="${up ? 'is-up' : 'is-down'}"/>
        <line class="si-hover-guide" x1="0" y1="0" x2="0" y2="220" hidden />
        <circle class="si-pulse-dot" cx="710" cy="${cy}" r="6"/>
      </svg>
      <div class="si-chart-tooltip" hidden></div>
      <div class="si-axis">
        <span>Past</span>
        <span>Current · ${currentVal}</span>
        <span>Projected · illustrative</span>
      </div>
    </div>
  `;
}

// 4-Signal Multi-line Overview SVG Chart
function multiSignalOverviewChartSVG(model) {
  const { history, skill, growth } = model;
  const isUp = growth >= 0;

  // 4 Coordinated Signal Series
  // 0: Market Momentum (Primary Purple #B22DEF)
  // 1: Skill Health (Green #19B77A)
  // 2: Skill Gap (Attention Orange #F59E0B)
  // 3: Relevance (Deep Purple #42075D)
  const momentumSeries = history.map((v, i) => clamp(v + (isUp ? i * 1.5 : -i * 1.2), 20, 96));
  const healthSeries = history.map((v, i) => clamp(skill.health - 6 + i * 1.2, 10, 98));
  const gapSeries = history.map((v, i) => clamp(100 - skill.health + Math.sin(i * 0.8) * 4, 8, 85));
  const relevanceSeries = history.map((v, i) => clamp(skill.relevance - 4 + Math.cos(i * 0.6) * 3, 20, 99));

  const polyMomentum = points(momentumSeries, 720, 200);
  const polyHealth = points(healthSeries, 720, 200);
  const polyGap = points(gapSeries, 720, 200);
  const polyRelevance = points(relevanceSeries, 720, 200);

  return `
    <div class="si-chart si-chart--multi" data-si-chart="overview" role="img" aria-label="4-Signal Intelligence Overview Graph">
      <div class="si-series-legend">
        <button type="button" data-toggle-series="0" class="${ui.mutedSeries.has(0) ? 'is-muted' : ''}" style="--series-color:#B22DEF;" aria-pressed="${!ui.mutedSeries.has(0)}">
          <i></i><span>Market Momentum (+${growth.toFixed(1)}%)</span>
        </button>
        <button type="button" data-toggle-series="1" class="${ui.mutedSeries.has(1) ? 'is-muted' : ''}" style="--series-color:#19B77A;" aria-pressed="${!ui.mutedSeries.has(1)}">
          <i></i><span>Skill Health (${skill.health}/100)</span>
        </button>
        <button type="button" data-toggle-series="2" class="${ui.mutedSeries.has(2) ? 'is-muted' : ''}" style="--series-color:#F59E0B;" aria-pressed="${!ui.mutedSeries.has(2)}">
          <i></i><span>Skill Gap (${100 - skill.health}%)</span>
        </button>
        <button type="button" data-toggle-series="3" class="${ui.mutedSeries.has(3) ? 'is-muted' : ''}" style="--series-color:#42075D;" aria-pressed="${!ui.mutedSeries.has(3)}">
          <i></i><span>Relevance (${skill.relevance}/100)</span>
        </button>
      </div>

      <svg viewBox="0 0 720 220" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="si-overview-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#B22DEF" stop-opacity="0.16"/>
            <stop offset="100%" stop-color="#B22DEF" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <path class="si-chart-area" d="M ${polyMomentum.replaceAll(' ', ' L ')} L 720 220 L 0 220 Z"/>
        <polyline data-series="0" points="${polyMomentum}" style="--series-color:#B22DEF;" ${ui.mutedSeries.has(0) ? 'hidden' : ''}/>
        <polyline data-series="1" points="${polyHealth}" style="--series-color:#19B77A;" ${ui.mutedSeries.has(1) ? 'hidden' : ''}/>
        <polyline data-series="2" points="${polyGap}" style="--series-color:#F59E0B;" ${ui.mutedSeries.has(2) ? 'hidden' : ''}/>
        <polyline data-series="3" points="${polyRelevance}" style="--series-color:#42075D;" ${ui.mutedSeries.has(3) ? 'hidden' : ''}/>
        <line class="si-hover-guide" x1="0" y1="0" x2="0" y2="220" hidden />
      </svg>
      <div class="si-chart-tooltip" hidden></div>
      <div class="si-axis">
        <span>Past</span>
        <span>Current Baseline</span>
        <span>Projected</span>
      </div>
    </div>
  `;
}

// Result Layers
function renderOverviewLayer(model) {
  const { skill, growth, saved, favorite, explanation } = model;
  const isUp = growth >= 0;

  return `
    <div class="si-result-overview">
      <div class="si-overview-main">
        <div class="si-result-name">
          <span class="si-skill-icon si-skill-icon--large"><i data-lucide="${esc(iconForSkill(skill))}"></i></span>
          <div class="si-result-meta">
            <span class="si-kicker">${esc(skill.category)} <i class="si-status-dot"></i> ${saved ? 'My Skill' : favorite ? 'Favorite Skill' : 'Library Skill'}</span>
            <h3>${esc(skill.name)}</h3>
          </div>
          <button type="button" class="si-star ${favorite ? 'is-on' : ''}" data-action="toggle-favorite" title="${favorite ? 'Remove from favorites' : 'Add to favorites'}" aria-pressed="${favorite}">
            <i data-lucide="${favorite ? 'star' : 'star'}"></i>
          </button>
        </div>

        <div class="si-summary-stats">
          <div class="si-demand-stat">
            <small>MARKET MOMENTUM</small>
            <strong class="${isUp ? 'is-up' : 'is-down'}">
              ${growth > 0 ? '+' : ''}${growth.toFixed(1)}%
              <i data-lucide="${isUp ? 'trending-up' : 'trending-down'}"></i>
            </strong>
            <span>${isUp ? 'Accelerating demand' : 'Easing demand'} in ${esc(dashboardState.market || 'Bangalore')}</span>
          </div>
          <div>
            <small>SKILL HEALTH</small>
            <strong>${skill.health}<em>/100</em></strong>
            <span>Profile capability</span>
          </div>
          <div>
            <small>SKILL GAP</small>
            <strong class="is-attention">${100 - skill.health}<em>%</em></strong>
            <span>Estimated gap</span>
          </div>
          <div>
            <small>RELEVANCE</small>
            <strong>${skill.relevance}<em>/100</em></strong>
            <span>Role alignment</span>
          </div>
        </div>

        <p class="si-summary-copy">
          ${esc(explanation.whatItMeansForYou || `${skill.name} demonstrates high market momentum and strategic value for senior tech roles.`)}
        </p>

        <div class="si-summary-actions">
          <button type="button" class="si-button si-button--primary" data-layer="Market Change">
            Explore Market Change <i data-lucide="arrow-right"></i>
          </button>
          <button type="button" class="si-button si-button--secondary" data-layer="Health & Gap">
            View Health & Gap
          </button>

          ${!saved && !favorite ? `
            ${ui.addChoice ? `
              <span class="si-add-choices">
                <button type="button" class="si-button si-button--quiet" data-action="add-my-skill">Add to My Skills</button>
                <button type="button" class="si-button si-button--quiet" data-action="add-favorite">Add to Favorites</button>
              </span>
            ` : `
              <button type="button" class="si-text-action" data-action="reveal-add-choice">+ Add to My Skills</button>
            `}
          ` : saved ? `
            <button type="button" class="si-text-action si-text-action--remove" data-action="remove-my-skill">Remove from My Skills</button>
          ` : `
            <button type="button" class="si-text-action si-text-action--remove" data-action="remove-favorite" data-skill-target="${esc(skill.name)}">Remove from Favorites</button>
          `}
        </div>
      </div>

      <aside class="si-overview-side">
        <div class="si-side-label">
          <span>FOUR-SIGNAL INTELLIGENCE GRAPH</span>
          <span class="si-live-dot"></span>
        </div>
        ${multiSignalOverviewChartSVG(model)}
      </aside>
    </div>

    <div class="si-overview-metrics">
      <article data-metric="Market Momentum">
        <small>MARKET MOMENTUM</small>
        <strong class="${isUp ? 'is-up' : 'is-down'}">${growth > 0 ? '+' : ''}${growth.toFixed(1)}%</strong>
        <p>Market demand velocity across active hiring requisitions</p>
      </article>
      <article data-metric="Skill Health">
        <small>SKILL HEALTH</small>
        <strong>${skill.health}/100</strong>
        <p>Current diagnostic and practical project competency score</p>
      </article>
      <article data-metric="Skill Gap">
        <small>SKILL GAP</small>
        <strong class="is-attention">${100 - skill.health}%</strong>
        <p>Estimated capability gap toward top-tier role requisitions</p>
      </article>
      <article data-metric="Relevance">
        <small>RELEVANCE</small>
        <strong>${skill.relevance}/100</strong>
        <p>Fit with regional industry hiring and technology roadmap trends</p>
      </article>
    </div>
  `;
}

function renderMarketChangeLayer(model) {
  const { skill, growth, explanation, history } = model;
  const isUp = growth >= 0;
  const roles = skill.requiredInRoles || ['AI Engineer', 'ML Operations Lead', 'Data Specialist'];
  const locations = skill.topLocations || ['Bangalore', 'Hyderabad', 'Chennai', 'Global'];
  const companies = model.companies || [];

  return `
    <div class="si-layer-grid">
      <section class="si-layer-feature">
        <span class="si-kicker">MARKET CHANGE · REAL-TIME SIGNALS</span>
        <h3>Why is ${esc(skill.name)} demand changing?</h3>
        <p>${esc(explanation.whatChanged || `${skill.name} demand has accelerated in the chosen market window due to expanding enterprise adoption.`)}</p>

        ${mainTrendChartSVG(model)}

        <div class="si-past-current">
          <span>Past <b>${history[0]}</b></span>
          <i></i>
          <span>Current <b>${history.at(-1)}</b></span>
          <i></i>
          <span>Projected <b>Illustrative Signal</b></span>
        </div>

        <p class="si-market-why">
          <i data-lucide="info"></i>
          Demand shifts when the skill appears across more related role requisitions and cloud technology signals. Illustrative prototype signal.
        </p>
      </section>

      <aside class="si-signal-list">
        <div class="si-signal-item">
          <span>Demand Change</span>
          <strong class="${isUp ? 'is-up' : 'is-down'}">${growth > 0 ? '+' : ''}${growth.toFixed(1)}%</strong>
        </div>
        <div class="si-signal-item">
          <span>Market Momentum</span>
          <strong>${isUp ? 'Accelerating' : 'Cooling'}</strong>
        </div>
        <div class="si-signal-item">
          <span>Top Locations</span>
          <strong>${locations.slice(0, 3).join(', ')}</strong>
        </div>
        <div class="si-signal-item">
          <span>Top Hiring Companies</span>
          <strong>${companies.map(c => c.name).slice(0, 3).join(', ')}</strong>
        </div>
        <div class="si-signal-item">
          <span>Primary Target Roles</span>
          <strong>${roles.slice(0, 2).join(' · ')}</strong>
        </div>
        <div class="si-signal-item">
          <span>Technology Ecosystem</span>
          <strong>${(skill.adjacentSkills || ['Python', 'Cloud']).slice(0, 3).join(', ')}</strong>
        </div>
      </aside>
    </div>
  `;
}

function renderRelevanceLayer(model) {
  const { skill, explanation } = model;
  const roles = skill.requiredInRoles || ['AI Engineer', 'Lead Architect'];
  const adj = skill.adjacentSkills || ['Python', 'Deep Learning', 'PyTorch', 'CUDA'];

  const factors = [
    { label: 'Role Relevance', score: clamp(skill.relevance + 2, 70, 99), copy: 'Required across target role requisitions' },
    { label: 'Market Relevance', score: skill.relevance, copy: `High hiring velocity in ${dashboardState.market || 'Bangalore'}` },
    { label: 'Technology Relevance', score: skill.techVelocity || clamp(skill.relevance - 4, 65, 96), copy: 'Adjacent framework and library dependency' },
    { label: 'Career Profile Fit', score: Math.round((skill.relevance + skill.health) / 2), copy: 'Complements your verified developer background' }
  ];

  return `
    <div class="si-relevance-view">
      <div class="si-score-block">
        <span class="si-kicker">SKILL RELEVANCE SCORE</span>
        <strong>${skill.relevance}<small>/100</small></strong>
        <div class="si-score-track"><i style="width:${clamp(skill.relevance, 0, 100)}%"></i></div>
        <span>Strategic market alignment index</span>
      </div>

      <div class="si-relevance-copy">
        <span class="si-kicker">STRATEGIC ALIGNMENT</span>
        <h3>${esc(skill.name)} directly bridges to ${esc(roles.slice(0, 2).join(' and '))}</h3>
        <p>${esc(explanation.whyMatters || skill.aiExplanation || 'This relevance score measures demand velocity and cross-functional role necessity.')}</p>

        <div class="si-relevance-factors">
          ${factors.map(f => `
            <div class="si-relevance-factor">
              <span>${esc(f.label)}<small>${esc(f.copy)}</small></span>
              <b>${f.score}/100</b>
              <i style="--factor:${f.score}%"></i>
            </div>
          `).join('')}
        </div>

        <div class="si-adjacent-group">
          <small>ADJACENT SKILLS & COMPLEMENTARY TECHNOLOGIES</small>
          <div class="si-adjacent-chips">
            ${adj.map(s => `<span class="si-adj-chip"><i data-lucide="sparkles"></i> ${esc(s)}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderHealthAndGapLayer(model) {
  const { skill, gaps } = model;
  const healthFactors = skill.healthFactors || [
    { name: 'Recency', score: 90, status: 'Healthy', explanation: 'Active practice within the last 7 days.' },
    { name: 'Practice Activity', score: 85, status: 'Active', explanation: 'Hands-on coding exercises completed.' },
    { name: 'Assessment Performance', score: 82, status: 'Verified', explanation: 'Diagnostic test score verified.' },
    { name: 'Practical Projects', score: 88, status: 'Strong', explanation: 'Production repository commits.' },
    { name: 'Market Relevance', score: skill.relevance, status: 'High', explanation: 'High market demand fit.' }
  ];

  return `
    <div class="si-health-view">
      <div class="si-health-score">
        <span class="si-kicker">YOUR CURRENT SKILL HEALTH</span>
        <div class="si-health-number">
          <strong>${skill.health}</strong>
          <span>/100</span>
        </div>
        <p>Profile competency rating · <b>${esc(skill.level || 'Advanced')}</b></p>
        <div class="si-health-track"><i style="width:${clamp(skill.health, 0, 100)}%"></i></div>

        <div class="si-health-factors">
          ${healthFactors.map(f => `
            <div class="si-health-factor">
              <span>${esc(f.name)} <small>${esc(f.status)}</small></span>
              <b>${f.score}/100</b>
              <i style="--factor:${clamp(f.score, 0, 100)}%"></i>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="si-gaps">
        <div class="si-subhead">
          <div>
            <span class="si-kicker">DEVELOPMENT PATH</span>
            <h3>Skill Gap: Current → Gap → Target</h3>
          </div>
          <a href="#/individual/assessment" class="si-link-action" data-action="assessment-click">
            Take Assessment <i data-lucide="arrow-up-right"></i>
          </a>
        </div>

        <div class="si-gap-flow-card">
          <div class="si-gap-flow-step">
            <span class="si-gap-step-kicker">CURRENT CAPABILITY</span>
            <strong>${esc(skill.name)}</strong>
            <small>${skill.health}/100 · ${esc(skill.level || 'Developing')}</small>
          </div>
          <div class="si-gap-arrow"><i data-lucide="arrow-right"></i></div>
          <div class="si-gap-flow-step si-gap-flow-step--focus">
            <span class="si-gap-step-kicker">IDENTIFIED GAP</span>
            <strong>${esc(gaps[0]?.name || skill.missingSkills?.[0] || 'Advanced Optimization')}</strong>
            <small>High Priority Bridge</small>
          </div>
          <div class="si-gap-arrow"><i data-lucide="arrow-right"></i></div>
          <div class="si-gap-flow-step">
            <span class="si-gap-step-kicker">TARGET ROLE</span>
            <strong>${esc(skill.requiredInRoles?.[0] || 'AI Engineer')} Readiness</strong>
            <small>Senior Engineering Benchmark</small>
          </div>
        </div>

        <div class="si-gap-items">
          ${gaps.length ? gaps.slice(0, 4).map((gap, i) => `
            <article class="si-gap-item">
              <span class="si-gap-idx">0${i + 1}</span>
              <div class="si-gap-details">
                <strong>${esc(gap.name)}</strong>
                <p>${esc(gap.whyMatters || gap.why || 'Critical technical bridge to achieve target role readiness.')}</p>
              </div>
              <em class="si-priority-badge si-priority-badge--${esc((gap.priority || 'High').toLowerCase())}">${esc(gap.priority || 'High')}</em>
              <a href="#/individual/learning" class="si-gap-nav-btn" aria-label="Explore learning for ${esc(gap.name)}"><i data-lucide="arrow-up-right"></i></a>
            </article>
          `).join('') : '<p class="si-empty-msg">No critical skill gaps identified for your profile baseline.</p>'}
        </div>
      </div>
    </div>
  `;
}

function renderEvidenceLayer(model) {
  const { skill, explanation } = model;
  const items = (explanation.evidence || skill.evidence || []).slice(0, 5);

  return `
    <div class="si-evidence-view">
      <div class="si-evidence-intro">
        <span class="si-kicker">EVIDENCE & SIGNAL CITATIONS</span>
        <h3>Why is ${esc(skill.name)} changing?</h3>
        <p>Signals, hiring requisitions, and industry benchmarks backing this intelligence analysis. Clearly labeled demo sources for prototype evaluation.</p>
        <div class="si-evidence-stamp">
          <i data-lucide="shield-check"></i>
          <span>Illustrative prototype data · Verified signal simulation</span>
        </div>
      </div>

      <div class="si-evidence-timeline">
        ${(items.length ? items : [
          { type: 'Job Signal', title: 'Enterprise Requisitions', text: '42,180 active role postings require this competence.', date: '30 Days Ago' },
          { type: 'Technology Benchmark', title: 'Developer Index', text: 'Top tier adoption across distributed backend workloads.', date: '15 Days Ago' }
        ]).map((item, idx) => `
          <article class="si-evidence-item">
            <span class="si-evidence-node"></span>
            <div class="si-evidence-content">
              <div class="si-evidence-header-row">
                <span class="si-evidence-tag si-evidence-tag--${esc((item.typeBadgeClass || 'job').toLowerCase())}">${esc(item.type || 'Job Signal')}</span>
                <span class="si-evidence-date">${esc(item.date || 'Recent')}</span>
              </div>
              <h4>${esc(item.title || 'Market Hiring Surge')}</h4>
              <p>${esc(item.text || item.explanation || 'Signal points to consistent enterprise compensation premiums.')}</p>
              <div class="si-evidence-footer-row">
                <span class="si-source-label">Simulated Citation · Demo Dataset</span>
                <button type="button" class="si-evidence-btn" data-action="view-evidence" data-evidence-idx="${idx}">
                  View Source Details <i data-lucide="external-link"></i>
                </button>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

function renderInsightLayer(model) {
  const { skill, explanation, gaps, next } = model;
  const targetGap = gaps[0]?.name || skill.missingSkills?.[0] || next.skill || skill.name;

  return `
    <div class="si-insight-view">
      <span class="si-insight-mark"><i data-lucide="sparkles"></i></span>

      <div class="si-insight-body">
        <span class="si-kicker">EXPLAINABLE SYNTHESIS · AI INTELLIGENCE</span>
        <h3>What does this mean for you?</h3>
        <p class="si-insight-lead">
          ${esc(explanation.whatItMeansForYou || skill.aiExplanation || `${skill.name} holds strong market relevance of ${skill.relevance}/100. Bridging key adjacent specializations will maximize career mobility.`)}
        </p>

        <div class="si-insight-points">
          <div class="si-point-card">
            <small>WHAT CHANGED</small>
            <p>${esc(explanation.whatChanged || `Demand for ${skill.name} grew by +${skill.growth}% in selected market.`)}</p>
          </div>
          <div class="si-point-card">
            <small>WHY IT MATTERS</small>
            <p>${esc(explanation.whyMatters || `Essential competency across top engineering teams and cloud architectures.`)}</p>
          </div>
          <div class="si-point-card">
            <small>YOUR POSITION</small>
            <p>${model.saved ? 'Confirmed in your My Skills profile' : 'Monitored capability'} · ${skill.health}/100 Health</p>
          </div>
          <div class="si-point-card">
            <small>STRATEGIC FOCUS</small>
            <p>Bridge depth in ${esc(targetGap)} to unlock leadership roles</p>
          </div>
        </div>
      </div>

      <aside class="si-recommendation">
        <span class="si-kicker">RECOMMENDED NEXT ACTION</span>
        <h4>Build Depth in ${esc(targetGap)}</h4>
        <p>${esc(next.rationale || `A structured roadmap bridging ${targetGap} aligns your profile with high-compensation requirements.`)}</p>

        <div class="si-signal-checks">
          <span><i data-lucide="check"></i> Verified market context</span>
          <span><i data-lucide="check"></i> Personalized profile match</span>
          <span><i data-lucide="check"></i> Development gap identified</span>
        </div>

        <button class="si-button si-button--primary si-roadmap-btn" type="button" data-action="build-roadmap">
          Build Roadmap <i data-lucide="arrow-right"></i>
        </button>

        <div class="si-rec-secondary-links">
          <a href="#/individual/assessment" data-action="assessment-click">Take Assessment</a>
          <i>·</i>
          <a href="#/individual/learning">Explore Learning</a>
        </div>
      </aside>
    </div>
  `;
}

function layerMarkup(model) {
  switch (ui.layer) {
    case 'Market Change': return renderMarketChangeLayer(model);
    case 'Relevance': return renderRelevanceLayer(model);
    case 'Health & Gap': return renderHealthAndGapLayer(model);
    case 'Evidence': return renderEvidenceLayer(model);
    case 'AI Insight': return renderInsightLayer(model);
    case 'Overview':
    default:
      return renderOverviewLayer(model);
  }
}

function render(model = context()) {
  const list = collectionSkillList();
  const growth = model.growth;
  const isUp = growth >= 0;

  const suggestions = [
    `Why is ${model.skill.name} demand changing?`,
    `Where is ${model.skill.name} demand growing?`,
    `How relevant is ${model.skill.name} to my career?`,
    `Which companies are using ${model.skill.name}?`,
    `What skills are adjacent to ${model.skill.name}?`,
    `What should I learn next?`
  ];

  // Context chips: up to 3-4 skills
  const contextChips = [
    ...new Set([
      model.skill.name,
      ...(dashboardState.favoriteSkills || []),
      ...(dashboardState.savedSkills || [])
    ])
  ].filter(name => !ui.quickRemoved.has(name) && skillList().some(s => s.name === name)).slice(0, 4);

  const activeFiltersCount = [
    (dashboardState.market && dashboardState.market !== 'Bangalore'),
    (dashboardState.timeRange && dashboardState.timeRange !== '30D'),
    (ui.categoryFilter && ui.categoryFilter !== 'All Categories'),
    (ui.trendFilter && ui.trendFilter !== 'All'),
    (ui.dateMode && ui.dateMode !== 'Recent')
  ].filter(Boolean).length;

  return `
    <div class="skill-intelligence-page" aria-labelledby="si-page-title">
      <!-- Page Header -->
      <header class="si-page-heading">
        <div>
          <span class="si-eyebrow"><i data-lucide="sparkles"></i> INDIVIDUAL INTELLIGENCE</span>
          <h1 id="si-page-title">Skill Intelligence</h1>
          <p>Understand how skills are changing, where your skills stand, and what to do next.</p>
        </div>
        <span class="si-demo-label">
          <i class="si-live-dot"></i>
          Simulated market signals
        </span>
      </header>

      <!-- 4-Part Structure: 1. YOUR SKILL COLLECTION & 2. LIVE SKILL TREND -->
      <section class="si-workspace" aria-label="Skill collection and trend monitor">
        <!-- 1. YOUR SKILL COLLECTION -->
        <div class="si-collection">
          <header class="si-section-heading">
            <div>
              <span class="si-kicker">YOUR SKILL COLLECTION</span>
              <h2>Choose a skill to investigate</h2>
            </div>
            <div class="si-collection-head-actions">
              <button type="button" class="si-filter-trigger" data-action="toggle-filter" aria-expanded="${ui.filterOpen}" aria-label="Open intelligence filters">
                <i data-lucide="sliders-horizontal"></i>
                <span>Filters</span>
                ${activeFiltersCount > 0 ? `<b class="si-filter-badge">${activeFiltersCount}</b>` : ''}
              </button>
              ${ui.collection !== 'All Skills' ? `
                <button type="button" class="si-add-trigger" data-action="toggle-add">
                  <i data-lucide="plus"></i> Add skill
                </button>
              ` : ''}
            </div>
          </header>

          <!-- 3-Segment Category Control -->
          <div class="si-collection-tabs" role="tablist" aria-label="Skill categories">
            <button type="button" role="tab" aria-selected="${ui.collection === 'My Skills'}" class="${ui.collection === 'My Skills' ? 'is-active' : ''}" data-collection="My Skills">
              My Skills
            </button>
            <button type="button" role="tab" aria-selected="${ui.collection === 'Favorite Skills'}" class="${ui.collection === 'Favorite Skills' ? 'is-active' : ''}" data-collection="Favorite Skills">
              Favorite Skills
            </button>
            <button type="button" role="tab" aria-selected="${ui.collection === 'All Skills'}" class="${ui.collection === 'All Skills' ? 'is-active' : ''}" data-collection="All Skills">
              All Skills
            </button>
          </div>

          <!-- Integrated search inside All Skills -->
          ${ui.collection === 'All Skills' ? `
            <label class="si-library-search">
              <i data-lucide="search"></i>
              <input id="si-library-search" placeholder="Search the complete skill library…" aria-label="Search skills" value="${esc(ui.search)}">
            </label>
          ` : ''}

          <!-- Skill list -->
          <div class="si-skill-list">
            ${list.map(s => skillRowMarkup(s, model)).join('') || `
              <div class="si-empty">
                <i data-lucide="inbox"></i>
                <p>${ui.collection === 'Favorite Skills' ? 'No favorites yet. Star a skill to monitor its live trend.' : ui.collection === 'My Skills' ? 'Your collection is empty. Add a skill to track your capability.' : 'No matching skills found.'}</p>
              </div>
            `}
          </div>

          ${addSkillModal()}
        </div>

        <!-- 2. LIVE SKILL TREND -->
        <aside class="si-monitor">
          <div class="si-monitor-head">
            <div>
              <span class="si-kicker"><i class="si-live-dot"></i> LIVE SKILL TREND</span>
              <h3>${esc(model.skill.name)}</h3>
              <span class="si-monitor-meta">${esc(model.skill.category)} · ${esc(dashboardState.market || 'Bangalore')}</span>
            </div>
            <span class="si-status-pill ${isUp ? 'is-up' : 'is-down'}">
              ${isUp ? 'Growing' : 'Declining'}
            </span>
          </div>

          <div class="si-monitor-value ${isUp ? 'is-up' : 'is-down'}">
            <strong data-growth>${growth > 0 ? '+' : ''}${growth.toFixed(1)}%</strong>
            <span>simulated movement <i data-lucide="${isUp ? 'trending-up' : 'trending-down'}"></i></span>
          </div>

          <!-- Main animated trend graph -->
          ${mainTrendChartSVG(model)}

          <p class="si-monitor-note">Illustrative market signal. No real-time external feed connected.</p>

          <!-- Company Signals (REQUIRED) -->
          <div class="si-company-signals">
            <div class="si-company-signals-head">
              <strong>Company signals · illustrative</strong>
              <small>Adoption velocity</small>
            </div>
            <div class="si-company-signals-list">
              ${model.companies.map(c => `
                <div class="si-company-row" data-company-name="${esc(c.name)}" role="button" tabindex="0">
                  <span class="si-company-mark">${esc(c.mark)}</span>
                  <span class="si-company-info">
                    <strong>${esc(c.name)}</strong>
                    <small>${esc(c.signal)}</small>
                  </span>
                  <b class="${c.growth >= 0 ? 'is-up' : 'is-down'}">
                    ${c.growth > 0 ? '+' : ''}${c.growth.toFixed(1)}% ${c.growth >= 0 ? '↑' : '↓'}
                  </b>
                </div>
              `).join('')}
            </div>
          </div>

          <button type="button" class="si-monitor-open" data-action="investigate-focus">
            <span>Investigate ${esc(model.skill.name)}</span>
            <i data-lucide="arrow-down-right"></i>
          </button>
        </aside>
      </section>

      <!-- 3. SKILL INTELLIGENCE CONSOLE -->
      <section class="si-console" aria-labelledby="si-console-title">
        <header>
          <div>
            <span class="si-kicker">SKILL INTELLIGENCE CONSOLE</span>
            <h2 id="si-console-title">What do you want to understand about a skill?</h2>
            <p>Explore demand, relevance, health and evidence in one intelligence workspace.</p>
          </div>
          <button type="button" class="si-filter-trigger" data-action="toggle-filter" aria-expanded="${ui.filterOpen}" aria-label="Open filters">
            <i data-lucide="sliders-horizontal"></i>
            <span>Filters</span>
            ${activeFiltersCount > 0 ? `<b class="si-filter-badge">${activeFiltersCount}</b>` : ''}
          </button>
        </header>

        <!-- Selected skill chips bar -->
        <div class="si-quick-context">
          <span class="si-quick-label">SELECTED SKILLS</span>
          ${contextChips.map(name => {
            const skill = skillList().find(s => s.name === name);
            if (!skill) return '';
            const isActive = name === model.skill.name;
            return `
              <span class="si-quick-chip ${isActive ? 'is-active' : ''}">
                <button type="button" data-skill="${esc(name)}" aria-pressed="${isActive}">
                  <i data-lucide="${esc(iconForSkill(skill))}"></i>
                  <span>${esc(name)}</span>
                </button>
                <button type="button" class="si-quick-remove" data-action="remove-chip" data-chip-target="${esc(name)}" aria-label="Remove ${esc(name)} from quick selection">×</button>
              </span>
            `;
          }).join('')}
        </div>

        <!-- Composer form -->
        <div class="si-console-composer">
          <label class="si-query-wrap">
            <i data-lucide="search"></i>
            <input id="si-query" value="${esc(ui.query)}" placeholder="Ask anything about ${esc(model.skill.name)}…" aria-label="Ask about selected skill">
            <button type="button" class="si-analyze-button si-button si-button--primary" data-action="analyze" ${ui.busy ? 'disabled' : ''}>
              <i data-lucide="${ui.busy ? 'loader-circle' : 'sparkles'}" class="${ui.busy ? 'si-spin' : ''}"></i>
              <span>${ui.busy ? 'Analyzing…' : 'Analyze skill'}</span>
            </button>
          </label>

          <!-- Suggested questions -->
          <div class="si-suggestions">
            <span>QUESTIONS</span>
            ${suggestions.map(q => `
              <button type="button" data-query="${esc(q)}">${esc(q)}</button>
            `).join('')}
          </div>
        </div>

        ${singleFilterModal()}
      </section>

      <!-- 4. INTELLIGENCE RESULT (Revealed after Analyze) -->
      ${ui.analyzed ? `
        <section class="si-result" aria-live="polite">
          <header class="si-result-head">
            <div>
              <span class="si-eyebrow"><i data-lucide="sparkles"></i> INTELLIGENCE RESULT</span>
              <h2>${esc(model.skill.name)} <span>· ${esc(dashboardState.market || 'Bangalore')}</span></h2>
            </div>
            <span class="si-demo-stamp">
              <i></i> Prototype analysis
            </span>
          </header>

          <!-- 6-Tab Investigation Path -->
          <div class="si-layer-tabs" role="tablist" aria-label="Intelligence layers">
            ${LAYERS.map(layer => `
              <button type="button" role="tab" aria-selected="${ui.layer === layer}" class="${ui.layer === layer ? 'is-active' : ''}" data-layer="${esc(layer)}">
                <i data-lucide="${esc(LAYER_ICONS[layer])}"></i>
                <span>${esc(layer)}</span>
              </button>
            `).join('')}
          </div>

          <p class="si-layer-description">${esc(LAYER_DESCRIPTIONS[ui.layer] || LAYER_DESCRIPTIONS.Overview)}</p>

          <div class="si-layer-content" role="tabpanel">
            ${layerMarkup(model)}
          </div>
        </section>
      ` : ''}

      <footer class="si-page-footnote">
        Market signals, half-life estimates, and evidence citations on this page are illustrative prototype data.
      </footer>
    </div>
  `;
}

function showToast(text) {
  let toast = document.querySelector('.si-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'si-toast';
    toast.setAttribute('role', 'status');
    document.body.append(toast);
  }
  toast.textContent = text;
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

function drawSimulation() {
  if (!document.querySelector('.skill-intelligence-page')) {
    if (timer) { clearInterval(timer); timer = null; }
    return;
  }
  if (document.visibilityState === 'hidden') return;

  const model = context();
  ui.tick += 1;
  const series = model.history;
  const prior = series.at(-1);
  const drift = (Math.sin(ui.tick * 0.7) * 0.32) + (ui.tick % 7 === 0 ? -0.4 : 0.1);
  const next = Number(clamp(prior + drift, 25, 96).toFixed(1));
  series.push(next);
  series.shift();
  model.skill.history = series;

  const direction = next >= prior;
  const growth = clamp(model.growth + (direction ? 0.08 : -0.1), -18, 45);

  const growthNode = document.querySelector('[data-growth]');
  if (growthNode) growthNode.textContent = `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;

  // Update SVG curve points if visible
  const multiChart = document.querySelector('.si-chart--multi');
  if (multiChart) {
    const momentum = series.map((v, i) => clamp(v + i * 1.2, 20, 96));
    const poly = points(momentum, 720, 200);
    multiChart.querySelector('polyline[data-series="0"]')?.setAttribute('points', poly);
    multiChart.querySelector('.si-chart-area')?.setAttribute('d', `M ${poly.replaceAll(' ', ' L ')} L 720 220 L 0 220 Z`);
  }
}

function rerender({ keepSearch = true } = {}) {
  const query = keepSearch ? (document.getElementById('si-query')?.value ?? ui.query) : '';
  ui.query = query;
  const container = document.getElementById('mainContent');
  if (!container) return;
  container.innerHTML = render();
  window.lucide?.createIcons();
  bindEvents();
}

function buildRoadmap() {
  intelligenceExplorerState.isRoadmapPreviewing = true;
  window.location.hash = '/individual/home';
}

function analyze() {
  if (ui.busy) return;
  ui.query = document.getElementById('si-query')?.value || ui.query;
  ui.busy = true;
  rerender();

  window.setTimeout(() => {
    if (!document.querySelector('.skill-intelligence-page')) return;
    ui.busy = false;
    ui.analyzed = true;
    ui.layer = 'Overview';
    rerender();
    document.querySelector('.si-result')?.scrollIntoView({
      behavior: reducedMotion() ? 'auto' : 'smooth',
      block: 'nearest'
    });
  }, reducedMotion() ? 0 : 550);
}

function bindEvents() {
  const root = document.querySelector('.skill-intelligence-page');
  if (!root) return;

  // Assessment links
  root.querySelectorAll('[data-action="assessment-click"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showToast('Assessment diagnostic module is connecting to prototype profile.');
    });
  });

  // Skill row click
  root.querySelectorAll('[data-skill]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.skill;
      if (target) {
        dashboardState.selectedSkill = target;
        ui.analyzed = false;
        ui.layer = 'Overview';
        ui.query = '';
        rerender({ keepSearch: false });
      }
    });
  });

  // Collection segmented tab click
  root.querySelectorAll('[data-collection]').forEach(btn => {
    btn.addEventListener('click', () => {
      ui.collection = btn.dataset.collection;
      dedicatedSkillState.skillScope = ui.collection;
      ui.addOpen = false;
      const list = collectionSkillList();
      if (list.length && !list.some(s => s.name === dashboardState.selectedSkill)) {
        dashboardState.selectedSkill = list[0].name;
      }
      ui.search = '';
      rerender({ keepSearch: false });
    });
  });

  // Layer tab click
  root.querySelectorAll('[data-layer]').forEach(btn => {
    btn.addEventListener('click', () => {
      ui.layer = btn.dataset.layer;
      ui.analyzed = true;
      rerender();
    });
  });

  // Suggested questions
  root.querySelectorAll('[data-query]').forEach(btn => {
    btn.addEventListener('click', () => {
      ui.query = btn.dataset.query;
      analyze();
    });
  });

  // General action buttons
  root.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', event => {
      const act = btn.dataset.action;
      const model = context();

      switch (act) {
        case 'analyze':
          analyze();
          break;
        case 'investigate-focus':
          ui.analyzed = true;
          ui.layer = 'Overview';
          rerender();
          document.querySelector('.si-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        case 'toggle-filter':
          ui.filterOpen = !ui.filterOpen;
          rerender();
          break;
        case 'filter-close':
          ui.filterOpen = false;
          rerender();
          break;
        case 'filter-apply':
          const skillVal = document.getElementById('si-filter-skill')?.value;
          const collVal = document.getElementById('si-filter-collection')?.value;
          const locVal = document.getElementById('si-filter-location')?.value;
          const rangeVal = document.getElementById('si-filter-range')?.value;
          const catVal = document.getElementById('si-filter-category')?.value;
          const trendVal = document.getElementById('si-filter-trend')?.value;
          const dateModeVal = document.getElementById('si-date-mode')?.value;

          if (skillVal) dashboardState.selectedSkill = skillVal;
          if (collVal) { ui.collection = collVal; dedicatedSkillState.skillScope = collVal; }
          if (locVal) dashboardState.market = locVal;
          if (rangeVal) dashboardState.timeRange = RANGE_KEYS[rangeVal] || '30D';
          if (catVal) ui.categoryFilter = catVal;
          if (trendVal) ui.trendFilter = trendVal;
          if (dateModeVal) {
            ui.dateMode = dateModeVal;
            if (dateModeVal === 'Custom Range') {
              ui.startDate = document.getElementById('si-date-start')?.value || '';
              ui.endDate = document.getElementById('si-date-end')?.value || '';
              dashboardState.timeRange = 'Custom';
            }
          }

          ui.filtersApplied = true;
          ui.filterOpen = false;
          rerender({ keepSearch: false });
          break;
        case 'filter-reset':
          dashboardState.market = 'Bangalore';
          dashboardState.timeRange = '30D';
          ui.collection = 'My Skills';
          ui.categoryFilter = 'All Categories';
          ui.trendFilter = 'All';
          ui.dateMode = 'Recent';
          ui.startDate = '';
          ui.endDate = '';
          ui.filtersApplied = false;
          dedicatedSkillState.skillScope = 'My Skills';
          ui.filterOpen = false;
          rerender({ keepSearch: false });
          break;
        case 'toggle-add':
          ui.addOpen = !ui.addOpen;
          ui.search = '';
          rerender({ keepSearch: false });
          document.getElementById('si-add-search')?.focus();
          break;
        case 'toggle-favorite':
          toggleFavoriteSkill(model.skill.name);
          showToast(`${model.skill.name} ${model.favorite ? 'removed from' : 'added to'} Favorites`);
          rerender();
          break;
        case 'reveal-add-choice':
          ui.addChoice = true;
          rerender();
          break;
        case 'add-my-skill':
          toggleSavedSkill(model.skill.name);
          ui.addChoice = false;
          showToast(`${model.skill.name} added to My Skills`);
          rerender();
          break;
        case 'add-favorite':
          toggleFavoriteSkill(model.skill.name);
          ui.addChoice = false;
          showToast(`${model.skill.name} added to Favorites`);
          rerender();
          break;
        case 'remove-my-skill':
          toggleSavedSkill(model.skill.name);
          if (ui.collection === 'My Skills') {
            ui.collection = 'All Skills';
            dedicatedSkillState.skillScope = 'All Skills';
          }
          showToast(`${model.skill.name} removed from My Skills`);
          rerender();
          break;
        case 'remove-favorite':
          const target = btn.dataset.skillTarget || model.skill.name;
          toggleFavoriteSkill(target);
          showToast(`${target} removed from Favorites`);
          rerender();
          break;
        case 'remove-chip':
          const chipTarget = btn.dataset.chipTarget;
          if (chipTarget) {
            ui.quickRemoved.add(chipTarget);
            rerender();
          }
          break;
        case 'build-roadmap':
          buildRoadmap();
          break;
        case 'view-evidence':
          const idx = Number(btn.dataset.evidenceIdx || 0);
          const item = (model.explanation.evidence || model.skill.evidence || [])[idx];
          showToast(`Citation verified: ${item?.title || 'Job Market Analysis'}. (Illustrative demo data)`);
          break;
      }
    });
  });

  // Adding skill from modal
  root.querySelectorAll('[data-add-skill]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.addSkill;
      const toType = btn.dataset.addTo;
      if (toType === 'fav') {
        toggleFavoriteSkill(name);
        ui.collection = 'Favorite Skills';
        dedicatedSkillState.skillScope = 'Favorite Skills';
        showToast(`${name} added to Favorites`);
      } else {
        toggleSavedSkill(name);
        ui.collection = 'My Skills';
        dedicatedSkillState.skillScope = 'My Skills';
        showToast(`${name} added to My Skills`);
      }
      dashboardState.selectedSkill = name;
      ui.addOpen = false;
      ui.search = '';
      rerender({ keepSearch: false });
    });
  });

  // Company row click
  root.querySelectorAll('.si-company-row').forEach(row => {
    row.addEventListener('click', () => {
      const comp = row.dataset.companyName;
      showToast(`Selected company signal: ${comp}. Connecting to market analytics.`);
    });
  });

  // Interactive toggle series in Multi-Signal chart
  root.querySelectorAll('[data-toggle-series]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sIdx = Number(btn.dataset.toggleSeries);
      if (ui.mutedSeries.has(sIdx)) {
        ui.mutedSeries.delete(sIdx);
      } else {
        ui.mutedSeries.add(sIdx);
      }
      root.querySelectorAll(`[data-series="${sIdx}"]`).forEach(line => {
        line.hidden = ui.mutedSeries.has(sIdx);
      });
      btn.classList.toggle('is-muted', ui.mutedSeries.has(sIdx));
      btn.setAttribute('aria-pressed', String(!ui.mutedSeries.has(sIdx)));
    });
  });

  // Interactive Chart Tooltips
  root.querySelectorAll('[data-si-chart]').forEach(chart => {
    const svg = chart.querySelector('svg');
    const tooltip = chart.querySelector('.si-chart-tooltip');
    const guide = chart.querySelector('.si-hover-guide');
    if (!svg || !tooltip) return;

    chart.addEventListener('pointermove', event => {
      const box = svg.getBoundingClientRect();
      const ratio = clamp((event.clientX - box.left) / Math.max(1, box.width), 0, 1);
      const sample = Math.round(ratio * 6) + 1;
      const model = context();

      if (chart.dataset.siChart === 'overview') {
        const momentum = clamp(model.history[sample - 1] + 4, 10, 99);
        tooltip.innerHTML = `
          <strong>Sample ${sample} · ${dashboardState.timeRange || '30D'}</strong>
          <span>Market Momentum: <b>+${(momentum * 0.2).toFixed(1)}%</b></span>
          <span>Skill Health: <b>${model.skill.health}/100</b></span>
          <span>Skill Gap: <b>${100 - model.skill.health}%</b></span>
          <span>Relevance: <b>${model.skill.relevance}/100</b></span>
        `;
      } else {
        const val = model.history[sample - 1] || 80;
        tooltip.innerHTML = `
          <strong>Sample ${sample} · ${dashboardState.market || 'Bangalore'}</strong>
          <span>Simulated Demand: <b>${val} / 100</b></span>
        `;
      }

      tooltip.hidden = false;
      tooltip.style.left = `${ratio * 100}%`;
      if (guide) {
        guide.hidden = false;
        guide.setAttribute('x1', String(ratio * 720));
        guide.setAttribute('x2', String(ratio * 720));
      }
    });

    chart.addEventListener('pointerleave', () => {
      tooltip.hidden = true;
      if (guide) guide.hidden = true;
    });
  });

  // Inputs
  const queryInput = document.getElementById('si-query');
  if (queryInput) {
    queryInput.addEventListener('input', e => { ui.query = e.target.value; });
    queryInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        analyze();
      }
    });
  }

  const libSearch = document.getElementById('si-library-search');
  if (libSearch) {
    libSearch.addEventListener('input', e => {
      ui.search = e.target.value;
      rerender({ keepSearch: false });
      const f = document.getElementById('si-library-search');
      f?.focus();
      f?.setSelectionRange(ui.search.length, ui.search.length);
    });
  }

  const addSearch = document.getElementById('si-add-search');
  if (addSearch) {
    addSearch.addEventListener('input', e => {
      ui.search = e.target.value;
      rerender({ keepSearch: false });
      const f = document.getElementById('si-add-search');
      f?.focus();
      f?.setSelectionRange(ui.search.length, ui.search.length);
    });
  }

  const dateModeSelect = document.getElementById('si-date-mode');
  if (dateModeSelect) {
    dateModeSelect.addEventListener('change', () => {
      ui.dateMode = dateModeSelect.value;
      const customDates = root.querySelector('.si-custom-filter-dates');
      if (customDates) customDates.hidden = ui.dateMode !== 'Custom Range';
    });
  }
}

export function renderDedicatedSkillsPage() {
  if (timer) clearInterval(timer);
  const main = document.getElementById('mainContent');
  if (!main) return;
  main.innerHTML = render();
  window.lucide?.createIcons();
  bindEvents();
  timer = window.setInterval(drawSimulation, 3800);
}
