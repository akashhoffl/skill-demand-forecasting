// AIAssistant.js — Dedicated Central Intelligence Workspace
// Connects Cross-Domain Platform Intelligence: Skills, Market, Jobs, Learning, Community, Career

import {
  defaultAiContext,
  intelligenceScenarios,
  synthesizeIntelligenceResponse,
  loadAiSession,
  saveAiSession,
  loadSavedInsights,
  saveInsight
} from '../../../data/ai-assistant-data.js';

import { dashboardState } from '../../../app/state.js';

// Page-level active state
let activeSession = null;
let currentAiState = 'idle'; // 'idle' | 'typing' | 'analyzing' | 'thinking' | 'ready'
let currentToastTimer = null;

// Initialize or recover session
function initSession() {
  if (!activeSession) {
    activeSession = loadAiSession();
    if (!activeSession.context) {
      activeSession.context = { ...defaultAiContext };
    }
    if (!Array.isArray(activeSession.history)) {
      activeSession.history = [];
    }
  }
}

// ----------------------------------------------------------------------------
// Render Main Page
// ----------------------------------------------------------------------------
export function renderDedicatedAIAssistantPage() {
  const container = document.getElementById('mainContent');
  if (!container) return;

  initSession();

  // Check URL query parameters for contextual entry (e.g., from Learning)
  const hash = window.location.hash || '';
  if (hash.includes('?')) {
    const queryParams = new URLSearchParams(hash.split('?')[1]);
    const incomingTopic = queryParams.get('topic');
    const incomingSkill = queryParams.get('skill');
    const incomingRole = queryParams.get('role');
    const incomingQuery = queryParams.get('q');

    if (incomingTopic) {
      activeSession.context.skill = incomingTopic;
      activeSession.context.learningGoal = `Mastering ${incomingTopic}`;
    } else if (incomingSkill) {
      activeSession.context.skill = incomingSkill;
    }
    if (incomingRole) {
      activeSession.context.role = incomingRole;
    }
    saveAiSession(activeSession);

    if (incomingQuery && activeSession.history.length === 0) {
      // Execute incoming query immediately
      executeAiQuery(incomingQuery);
      return;
    }
  }

  container.innerHTML = generatePageHTML();
  attachEventListeners(container);

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

export function renderAIAssistantPage() {
  return renderDedicatedAIAssistantPage();
}

// ----------------------------------------------------------------------------
// HTML Generation
// ----------------------------------------------------------------------------
function generatePageHTML() {
  const ctx = activeSession.context;
  const hasHistory = activeSession.history.length > 0;

  return `
    <div class="ai-assistant-page">
      <!-- Page Header -->
      <header class="ai-page-header">
        <div class="ai-header-left">
          <span class="ai-eyebrow">
            <i data-lucide="sparkles" style="width:13px; height:13px;"></i>
            WORKSPACE / CENTRAL INTELLIGENCE
          </span>
          <div class="ai-title-row">
            <h1 class="ai-page-title">Your Intelligence, Connected</h1>
            <span class="ai-status-badge">
              <span class="ai-pulse-dot"></span> Active Assistant
            </span>
          </div>
          <p class="ai-subtitle">
            Cross-domain intelligence answering what to learn, where demand is accelerating, and what action to take next.
          </p>
        </div>

        <div class="ai-header-actions">
          <button class="ai-glass-btn" id="btnOpenSavedInsights" title="View Saved Insights">
            <i data-lucide="bookmark" style="width:15px; height:15px;"></i>
            Saved Insights
          </button>
          <button class="ai-glass-btn" id="btnClearAiSession" title="Reset Conversation History">
            <i data-lucide="rotate-ccw" style="width:14px; height:14px;"></i>
            Clear Session
          </button>
        </div>
      </header>

      <!-- Context Bar -->
      <section class="ai-context-bar" aria-label="Active Context Control">
        <div class="ai-context-pills">
          <span class="ai-context-label">
            <i data-lucide="sliders-horizontal" style="width:13px; height:13px;"></i> Active Context:
          </span>
          <div class="ai-context-pill" id="pillLocation">
            <i data-lucide="map-pin" style="width:12px; height:12px;"></i>
            <span>${ctx.location}</span>
          </div>
          <div class="ai-context-pill" id="pillRole">
            <i data-lucide="briefcase-business" style="width:12px; height:12px;"></i>
            <span>${ctx.role}</span>
          </div>
          <div class="ai-context-pill" id="pillSkill">
            <i data-lucide="layers-3" style="width:12px; height:12px;"></i>
            <span>${ctx.skill}</span>
          </div>
          <div class="ai-context-pill" id="pillProfile">
            <i data-lucide="user-round" style="width:12px; height:12px;"></i>
            <span class="pill-meta">${ctx.userProfile}</span>
          </div>
        </div>
        <button class="ai-context-edit-btn" id="btnEditAiContext">
          <i data-lucide="pencil" style="width:12px; height:12px;"></i> Edit Context
        </button>
      </section>

      <!-- Central Hero & Intelligence Visual Object -->
      <section class="ai-hero-workspace ${hasHistory ? 'has-responses' : ''}" id="aiHeroWorkspace">
        <!-- Liquid Intelligence Orb Object -->
        <div class="ai-orb-stage" id="aiOrbStage" data-state="${currentAiState}">
          <div class="ai-orb-ambient-glow"></div>
          <div class="ai-orbiting-ring">
            <div class="ai-orbit-node node-1" title="Skill Intelligence"></div>
            <div class="ai-orbit-node node-2" title="Market Intelligence"></div>
            <div class="ai-orbit-node node-3" title="Job Intelligence"></div>
            <div class="ai-orbit-node node-4" title="Learning Intelligence"></div>
          </div>
          <div class="ai-orb-core" id="aiOrbCore" title="TalentScope Liquid Intelligence Core">
            <div class="ai-orb-liquid-layer"></div>
            <div class="ai-orb-glass-highlight"></div>
            <div class="ai-orb-scan-ring"></div>
          </div>
        </div>

        <!-- Dynamic Kinetic State Indicator -->
        <div class="ai-state-indicator" id="aiStateIndicator">
          <i data-lucide="cpu" style="width:14px; height:14px; color: var(--ai-primary);"></i>
          <span class="ai-state-text" id="aiStateText">${getStateLabel(currentAiState)}</span>
        </div>

        <!-- Floating Satellite Cards (Restrained Scattered Gallery - Hidden when history active) -->
        <div class="ai-satellite-cards">
          <div class="ai-satellite-card" data-query="How is Python changing?">
            <span class="satellite-tag">Skill</span>
            <span>Python</span>
            <span class="satellite-val">+18.4%</span>
          </div>
          <div class="ai-satellite-card" data-query="Why is NVIDIA relevant to AI?">
            <span class="satellite-tag">Market</span>
            <span>NVIDIA</span>
            <span class="satellite-val">1,320 Jobs</span>
          </div>
          <div class="ai-satellite-card" data-query="Which companies are hiring AI engineers?">
            <span class="satellite-tag">Job</span>
            <span>AI Engineer</span>
            <span class="satellite-val">88 Demand</span>
          </div>
          <div class="ai-satellite-card" data-query="What should I learn next?">
            <span class="satellite-tag">Learning</span>
            <span>Active Roadmap</span>
            <span class="satellite-val">64% Sync</span>
          </div>
          <div class="ai-satellite-card" data-query="Where can I practice Python?">
            <span class="satellite-tag">Community</span>
            <span>Challenges</span>
            <span class="satellite-val">18 Open</span>
          </div>
        </div>

        <!-- Central Glass Composer -->
        <div class="ai-composer-wrapper">
          <form class="ai-composer" id="aiComposerForm">
            <input
              type="text"
              class="ai-composer-input"
              id="aiComposerInput"
              placeholder="Ask anything about your skills, market, jobs or learning..."
              autocomplete="off"
            />
            <div class="ai-composer-tools">
              <button type="button" class="ai-tool-btn" id="btnComposerClear" title="Clear input" style="display:none;">
                <i data-lucide="x" style="width:16px; height:16px;"></i>
              </button>
              <button type="button" class="ai-tool-btn voice-prototype" id="btnVoicePrototype" title="Voice Input (Prototype)">
                <i data-lucide="mic" style="width:16px; height:16px;"></i>
              </button>
              <button type="submit" class="ai-send-btn" id="btnComposerSend" title="Send question">
                <i data-lucide="arrow-up" style="width:18px; height:18px;"></i>
              </button>
            </div>
          </form>

          <!-- Contextual Suggested Prompt Chips -->
          <div class="ai-suggested-prompts">
            <button class="ai-prompt-chip" data-prompt="What skills are growing fastest?">
              <i data-lucide="sparkles" style="width:12px; height:12px;"></i>
              What skills are growing fastest?
            </button>
            <button class="ai-prompt-chip" data-prompt="How is Python changing?">
              <i data-lucide="layers-3" style="width:12px; height:12px;"></i>
              How is Python changing?
            </button>
            <button class="ai-prompt-chip" data-prompt="Which companies are hiring AI engineers?">
              <i data-lucide="briefcase-business" style="width:12px; height:12px;"></i>
              Who is hiring AI Engineers?
            </button>
            <button class="ai-prompt-chip" data-prompt="What should I learn next?">
              <i data-lucide="book-open" style="width:12px; height:12px;"></i>
              What should I learn next?
            </button>
            <button class="ai-prompt-chip" data-prompt="Am I ready for AI Engineer roles?">
              <i data-lucide="target" style="width:12px; height:12px;"></i>
              Am I ready for AI Engineer roles?
            </button>
            <button class="ai-prompt-chip" data-prompt="Python or Java for backend development?">
              <i data-lucide="columns-2" style="width:12px; height:12px;"></i>
              Python or Java?
            </button>
            <button class="ai-prompt-chip" data-prompt="Should I learn CUDA?">
              <i data-lucide="cpu" style="width:12px; height:12px;"></i>
              Should I learn CUDA?
            </button>
          </div>
        </div>
      </section>

      <!-- Multi-Turn Conversation Stream Workspace -->
      <section class="ai-conversation-stream" id="aiConversationStream">
        ${activeSession.history.map((turn, index) => renderTurnHTML(turn, index)).join('')}
      </section>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// Render Turn & Structured Response Card
// ----------------------------------------------------------------------------
function renderTurnHTML(turn, index) {
  return `
    <article class="ai-turn-item" data-turn-id="${turn.id || index}">
      <!-- User Query Pill -->
      <div class="ai-user-query-row">
        <div class="ai-user-query-pill">
          <span>${escapeHTML(turn.userQuestion)}</span>
          <span class="timestamp">${turn.timestamp || 'Just now'}</span>
        </div>
      </div>

      <!-- AI Structured Intelligence Workspace Card -->
      <div class="ai-response-card">
        <!-- Card Domain Header -->
        <div class="ai-card-meta">
          <span class="ai-domain-badge ${turn.badgeClass || 'badge-skill'}">
            <i data-lucide="${turn.domainIcon || 'sparkles'}" style="width:13px; height:13px;"></i>
            ${turn.domain}
          </span>
          <div class="ai-card-actions">
            <button class="ai-icon-action-btn" data-action="save_insight" data-turn-index="${index}" title="Save Insight">
              <i data-lucide="bookmark" style="width:14px; height:14px;"></i>
            </button>
            <button class="ai-icon-action-btn" data-action="share_insight" data-turn-index="${index}" title="Copy Summary">
              <i data-lucide="share-2" style="width:14px; height:14px;"></i>
            </button>
          </div>
        </div>

        <!-- 1. Executive Finding -->
        <div class="ai-section-block">
          <span class="ai-section-heading">
            <i data-lucide="compass" style="width:12px; height:12px;"></i> What I Found
          </span>
          <div class="ai-finding-text">${escapeHTML(turn.finding)}</div>
        </div>

        <!-- 2. Root Cause / Market Logic -->
        ${turn.why ? `
          <div class="ai-section-block">
            <span class="ai-section-heading">
              <i data-lucide="activity" style="width:12px; height:12px;"></i> Why
            </span>
            <div class="ai-why-text">${escapeHTML(turn.why)}</div>
          </div>
        ` : ''}

        <!-- 3. Personal Impact -->
        ${turn.personalImpact ? `
          <div class="ai-section-block">
            <span class="ai-section-heading">
              <i data-lucide="user-check" style="width:12px; height:12px;"></i> What This Means For You
            </span>
            <div class="ai-impact-text">${escapeHTML(turn.personalImpact)}</div>
          </div>
        ` : ''}

        <!-- 4. Interactive Visual Answers -->
        ${renderVisualBlockHTML(turn.visualType, turn.visualData)}

        <!-- 5. Evidence Section (Expandable Drawer) -->
        ${renderEvidenceBlockHTML(turn.evidence, index)}

        <!-- 6. Recommendation & Action Strip -->
        <div class="ai-action-strip">
          ${(turn.actions || []).map(action => renderActionBtnHTML(action, turn)).join('')}
        </div>

        <!-- 7. Follow-up Question Chips -->
        ${turn.followUps && turn.followUps.length > 0 ? `
          <div class="ai-followup-strip">
            <span class="ai-followup-label">Suggested follow-ups:</span>
            ${turn.followUps.map(fu => `
              <button class="ai-followup-chip" data-followup="${escapeHTML(fu)}">
                <i data-lucide="corner-down-right" style="width:11px; height:11px;"></i>
                ${escapeHTML(fu)}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </article>
  `;
}

// ----------------------------------------------------------------------------
// Render Visual Types (Bars, Radials, Comparisons, Companies, Roadmaps)
// ----------------------------------------------------------------------------
function renderVisualBlockHTML(type, data) {
  if (!type || !data) return '';

  if (type === 'metrics_bar') {
    return `
      <div class="ai-visual-workspace">
        <span class="ai-visual-title">${data.title || 'Market Metrics'}</span>
        <div class="ai-bars-container">
          ${(data.items || []).map(item => `
            <div class="ai-bar-row">
              <div class="ai-bar-header">
                <span>${item.label} <small style="color:#625a69; font-weight:normal;">(${item.category})</small></span>
                <span class="ai-bar-growth">${item.growth}</span>
              </div>
              <div class="ai-bar-track">
                <div class="ai-bar-fill" style="width: ${item.score}%; background: ${item.color || '#B22DEF'};"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (type === 'skill_health_radar') {
    return `
      <div class="ai-visual-workspace">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="ai-visual-title">${data.skillName} Diagnostic Signals</span>
          <span style="font-size:12px; font-weight:700; color:var(--ai-positive);">Velocity: ${data.momentum}</span>
        </div>
        <div class="ai-radar-grid">
          <div class="ai-factor-card">
            <span class="factor-name">Skill Health Score</span>
            <div class="factor-score-row">
              <span class="factor-score">${data.healthScore}/100</span>
              <span class="factor-status">${data.decayRisk}</span>
            </div>
          </div>
          <div class="ai-factor-card">
            <span class="factor-name">Market Relevance</span>
            <div class="factor-score-row">
              <span class="factor-score">${data.relevanceScore}/100</span>
              <span class="factor-status">High Demand</span>
            </div>
          </div>
          <div class="ai-factor-card">
            <span class="factor-name">Estimated Half-Life</span>
            <div class="factor-score-row">
              <span class="factor-score">${data.halfLifeYears} yrs</span>
              <span class="factor-status">Stable Core</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'company_breakdown') {
    return `
      <div class="ai-visual-workspace">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="ai-visual-title">${data.companyName} Hiring & Architecture Signals</span>
          <span style="font-size:12px; font-weight:700; color:var(--ai-primary);">${data.growth}</span>
        </div>
        <div class="ai-hiring-grid">
          ${(data.keyRoles || []).map(r => `
            <div class="ai-hiring-card">
              <div class="hiring-card-top">
                <span class="hiring-co-name">${r.title}</span>
                <span class="hiring-co-match">${r.openings} Openings</span>
              </div>
              <div class="hiring-co-meta">Comp: <strong>${r.comp}</strong></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (type === 'hiring_companies_list') {
    return `
      <div class="ai-visual-workspace">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="ai-visual-title">Top Employers for ${data.roleTitle} (${data.openRoles.toLocaleString()} Live Roles)</span>
          <span style="font-size:12px; font-weight:700; color:var(--ai-primary);">Salary: ${data.medianSalary}</span>
        </div>
        <div class="ai-hiring-grid">
          ${(data.companies || []).map(c => `
            <div class="ai-hiring-card">
              <div class="hiring-card-top">
                <span class="hiring-co-name">${c.name}</span>
                <span class="hiring-co-match">${c.match}</span>
              </div>
              <div class="hiring-co-meta">${c.openRoles} roles · ${c.location}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (type === 'comparison_table') {
    return `
      <div class="ai-visual-workspace">
        <span class="ai-visual-title">Trade-Off Analysis: ${data.leftTitle} vs ${data.rightTitle}</span>
        <div class="ai-comparison-container">
          <table class="ai-comparison-table">
            <thead>
              <tr>
                <th style="width:30%;">Evaluation Pillar</th>
                <th style="width:35%;">${data.leftTitle}</th>
                <th style="width:35%;">${data.rightTitle}</th>
              </tr>
            </thead>
            <tbody>
              ${(data.criteria || []).map(c => `
                <tr>
                  <td><strong>${c.label}</strong></td>
                  <td class="${c.winner === 'left' ? 'cell-winner' : ''}">${c.left}</td>
                  <td class="${c.winner === 'right' ? 'cell-winner' : ''}">${c.right}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  if (type === 'readiness_breakdown') {
    return `
      <div class="ai-visual-workspace">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="ai-visual-title">Role Readiness Diagnostic: ${data.targetRole}</span>
          <span style="font-size:13px; font-weight:700; color:var(--ai-positive); background:rgba(25,183,122,0.1); padding:3px 8px; border-radius:6px;">
            Overall: ${data.overallScore}% (${data.status})
          </span>
        </div>
        <div class="ai-bars-container">
          ${(data.pillars || []).map(p => `
            <div class="ai-bar-row">
              <div class="ai-bar-header">
                <span>${p.name}</span>
                <span style="font-size:11px; font-weight:700; color:${p.coverage < 50 ? 'var(--ai-attention)' : 'var(--ai-positive)'};">
                  ${p.coverage}% Match (${p.status})
                </span>
              </div>
              <div class="ai-bar-track">
                <div class="ai-bar-fill" style="width: ${p.coverage}%; background: ${p.coverage < 50 ? 'var(--ai-attention)' : 'var(--ai-primary)'};"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (type === 'community_cards') {
    return `
      <div class="ai-visual-workspace">
        <span class="ai-visual-title">${data.communityName} · Recommended Practice</span>
        <div class="ai-hiring-grid">
          ${(data.items || []).map(item => `
            <div class="ai-hiring-card">
              <div class="hiring-card-top">
                <span class="hiring-co-name">${item.title}</span>
                <span class="hiring-co-match">${item.difficulty || item.date}</span>
              </div>
              <div class="hiring-co-meta">Outcome: ${item.outcome}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (type === 'roadmap_preview') {
    return `
      <div class="ai-visual-workspace">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="ai-visual-title">${data.roadmapTitle}</span>
          <span style="font-size:12px; font-weight:700; color:var(--ai-primary);">Duration: ${data.duration}</span>
        </div>
        <div class="ai-bars-container">
          ${(data.stages || []).map(st => `
            <div style="display:flex; align-items:center; gap:12px; padding:8px 12px; background:#FFFFFF; border-radius:8px; border:1px solid rgba(178,45,239,0.12);">
              <span style="width:24px; height:24px; border-radius:50%; background:var(--ai-light-purple); color:var(--ai-deep); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700;">
                ${st.step}
              </span>
              <div style="flex:1;">
                <div style="font-size:13px; font-weight:600; color:#171321;">${st.name} <small style="color:#625a69;">(${st.time})</small></div>
                <div style="font-size:11px; color:#625a69;">${st.focus}</div>
              </div>
              <span style="font-size:11px; font-weight:600; color:var(--ai-primary); background:rgba(178,45,239,0.08); padding:2px 8px; border-radius:4px;">
                ${st.status}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return '';
}

// ----------------------------------------------------------------------------
// Render Evidence Block & Expandable Drawer
// ----------------------------------------------------------------------------
function renderEvidenceBlockHTML(evidence, turnIndex) {
  if (!evidence || evidence.length === 0) return '';

  return `
    <div class="ai-evidence-box">
      <button class="ai-evidence-toggle" data-toggle="evidence" data-turn-index="${turnIndex}">
        <span><i data-lucide="file-check-2" style="width:13px; height:13px;"></i> Verified Evidence & Methodology (${evidence.length} Sources)</span>
        <i data-lucide="chevron-down" style="width:14px; height:14px;"></i>
      </button>
      <div class="ai-evidence-list" id="evidenceList_${turnIndex}" style="display:none;">
        ${evidence.map(ev => `
          <div class="ai-evidence-item">
            <div class="evidence-header">
              <span><strong>${escapeHTML(ev.title)}</strong></span>
              <span class="evidence-type-badge">${escapeHTML(ev.type)} · ${escapeHTML(ev.date)}</span>
            </div>
            <p class="evidence-text">${escapeHTML(ev.text)}</p>
            ${ev.isDemo ? '<span class="evidence-disclaimer">Illustrative prototype signal aggregated across platform intelligence datasets.</span>' : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// Render Cross-Page Action Buttons
// ----------------------------------------------------------------------------
function renderActionBtnHTML(action, turn) {
  const isPrimary = action.primary ? 'primary' : 'secondary';

  return `
    <button
      class="ai-action-btn ${isPrimary}"
      data-action-route="${action.route || ''}"
      data-action-type="${action.action || ''}"
      data-action-skill="${action.skill || ''}"
      data-action-company="${action.company || ''}"
      data-action-role="${action.role || ''}"
      data-action-community="${action.community || ''}"
      data-action-goal="${action.goal || ''}"
    >
      <i data-lucide="${action.icon || 'arrow-up-right'}" style="width:14px; height:14px;"></i>
      ${escapeHTML(action.label)}
    </button>
  `;
}

// ----------------------------------------------------------------------------
// Event Handlers & User Actions
// ----------------------------------------------------------------------------
function attachEventListeners(container) {
  const form = container.querySelector('#aiComposerForm');
  const input = container.querySelector('#aiComposerInput');
  const clearBtn = container.querySelector('#btnComposerClear');
  const voiceBtn = container.querySelector('#btnVoicePrototype');
  const orbCore = container.querySelector('#aiOrbCore');
  const editContextBtn = container.querySelector('#btnEditAiContext');
  const savedInsightsBtn = container.querySelector('#btnOpenSavedInsights');
  const clearSessionBtn = container.querySelector('#btnClearAiSession');

  // Input typing feedback
  if (input) {
    input.addEventListener('input', () => {
      const val = input.value.trim();
      if (clearBtn) clearBtn.style.display = val.length > 0 ? 'inline-flex' : 'none';
      if (val.length > 0 && currentAiState === 'idle') {
        updateAiState('typing');
      } else if (val.length === 0 && currentAiState === 'typing') {
        updateAiState('idle');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitComposer();
      }
    });
  }

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      updateAiState('idle');
      input.focus();
    });
  }

  // Submit composer
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitComposer();
    });
  }

  function submitComposer() {
    if (!input) return;
    const query = input.value.trim();
    if (!query) return;
    input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    executeAiQuery(query);
  }

  // Suggested Prompts & Satellite Cards Click
  container.querySelectorAll('[data-prompt], [data-query]').forEach(el => {
    el.addEventListener('click', () => {
      const q = el.getAttribute('data-prompt') || el.getAttribute('data-query');
      if (q) executeAiQuery(q);
    });
  });

  // Follow-up chip click
  container.querySelectorAll('[data-followup]').forEach(el => {
    el.addEventListener('click', () => {
      const fu = el.getAttribute('data-followup');
      if (fu) executeAiQuery(fu);
    });
  });

  // Evidence Drawer Toggles
  container.querySelectorAll('[data-toggle="evidence"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const turnIndex = btn.getAttribute('data-turn-index');
      const list = container.querySelector(`#evidenceList_${turnIndex}`);
      if (list) {
        const isHidden = list.style.display === 'none';
        list.style.display = isHidden ? 'flex' : 'none';
        btn.querySelector('i[data-lucide="chevron-down"]')?.classList.toggle('rotate-180', isHidden);
      }
    });
  });

  // Cross-Page Action Buttons
  container.querySelectorAll('.ai-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      handleActionClick(btn);
    });
  });

  // Save / Share buttons
  container.querySelectorAll('[data-action="save_insight"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-turn-index'), 10);
      const turn = activeSession.history[idx];
      if (turn) {
        const saved = saveInsight(turn);
        showToast(saved ? 'Insight saved to your workspace library' : 'Insight already saved');
      }
    });
  });

  container.querySelectorAll('[data-action="share_insight"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-turn-index'), 10);
      const turn = activeSession.history[idx];
      if (turn) {
        const text = `TalentScope AI Insight:\n${turn.userQuestion}\n\nFinding:\n${turn.finding}\n\nRecommendation:\n${turn.recommendation}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
          showToast('Insight summary copied to clipboard');
        } else {
          showToast('Insight summary ready');
        }
      }
    });
  });

  // Voice Prototype Button
  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      showVoiceModal();
    });
  }

  // Edit Context Modal Trigger
  if (editContextBtn) {
    editContextBtn.addEventListener('click', () => {
      showEditContextModal();
    });
  }

  // Saved Insights Modal Trigger
  if (savedInsightsBtn) {
    savedInsightsBtn.addEventListener('click', () => {
      showSavedInsightsModal();
    });
  }

  // Clear Session Button
  if (clearSessionBtn) {
    clearSessionBtn.addEventListener('click', () => {
      activeSession.history = [];
      saveAiSession(activeSession);
      updateAiState('idle');
      renderDedicatedAIAssistantPage();
      showToast('Session conversation cleared');
    });
  }

  // Orb click animation
  if (orbCore) {
    orbCore.addEventListener('click', () => {
      showToast('Liquid Intelligence Engine Active');
      updateAiState('analyzing');
      setTimeout(() => updateAiState('idle'), 1600);
    });
  }
}

// ----------------------------------------------------------------------------
// Execute Query with Staggered Kinetic Transitions
// ----------------------------------------------------------------------------
function executeAiQuery(question) {
  initSession();

  // 1. Kinetic Transition: Analyzing
  updateAiState('analyzing');

  setTimeout(() => {
    // 2. Kinetic Transition: Thinking / Connecting
    updateAiState('thinking');

    setTimeout(() => {
      // 3. Synthesize structured response
      const response = synthesizeIntelligenceResponse(question, activeSession.context);

      // Prepend or Append to history
      activeSession.history.push(response);
      saveAiSession(activeSession);

      // 4. Kinetic Transition: Ready & Settle
      updateAiState('ready');
      renderDedicatedAIAssistantPage();

      // Scroll smoothly to the newly rendered turn
      const stream = document.getElementById('aiConversationStream');
      if (stream && stream.lastElementChild) {
        stream.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      setTimeout(() => {
        updateAiState('idle');
      }, 2500);

    }, 380);
  }, 420);
}

// ----------------------------------------------------------------------------
// Cross-Page Action Router
// ----------------------------------------------------------------------------
function handleActionClick(btn) {
  const route = btn.getAttribute('data-action-route');
  const actionType = btn.getAttribute('data-action-type');
  const skill = btn.getAttribute('data-action-skill');
  const company = btn.getAttribute('data-action-company');
  const role = btn.getAttribute('data-action-role');
  const community = btn.getAttribute('data-action-community');
  const goal = btn.getAttribute('data-action-goal');

  // Handle open evidence
  if (actionType === 'open_evidence') {
    const parentCard = btn.closest('.ai-response-card');
    const toggle = parentCard?.querySelector('[data-toggle="evidence"]');
    if (toggle) toggle.click();
    return;
  }

  // Set shared application state before navigating
  if (skill) {
    dashboardState.selectedSkill = skill;
  }
  if (company) {
    dashboardState.marketCompanyScope = company;
  }

  // Build Roadmap flow
  if (actionType === 'build_roadmap' || route === '/individual/learning') {
    if (goal) {
      // Direct roadmap intent
      localStorage.setItem('talentscope-pending-roadmap-intent', JSON.stringify({
        goalType: goal,
        targetSkill: skill || 'CUDA',
        targetRole: role || 'AI Engineer'
      }));
    }
  }

  // Navigate to designated route
  if (route) {
    window.location.hash = `#${route}`;
  }
}

// ----------------------------------------------------------------------------
// Kinetic State Helpers
// ----------------------------------------------------------------------------
function updateAiState(state) {
  currentAiState = state;
  const stage = document.getElementById('aiOrbStage');
  const label = document.getElementById('aiStateText');
  if (stage) stage.setAttribute('data-state', state);
  if (label) label.textContent = getStateLabel(state);
}

function getStateLabel(state) {
  switch (state) {
    case 'typing': return 'Formulating intelligent query...';
    case 'analyzing': return 'Scanning skill, market & job signals...';
    case 'thinking': return 'Synthesizing evidence & personal impact...';
    case 'ready': return 'Insight ready & connected';
    case 'idle':
    default:
      return 'Connected to Skills, Market, Jobs, Learning & Community';
  }
}

// ----------------------------------------------------------------------------
// Modals: Edit Context, Saved Insights, Voice Prototype
// ----------------------------------------------------------------------------
function showEditContextModal() {
  const existing = document.getElementById('aiModalOverlay');
  if (existing) existing.remove();

  const ctx = activeSession.context;

  const modal = document.createElement('div');
  modal.className = 'ai-modal-overlay';
  modal.id = 'aiModalOverlay';
  modal.innerHTML = `
    <div class="ai-modal-box">
      <div class="ai-modal-header">
        <h3>Edit Workspace Context</h3>
        <button class="ai-icon-action-btn" id="btnCloseModal">
          <i data-lucide="x" style="width:16px; height:16px;"></i>
        </button>
      </div>
      <form id="aiContextForm">
        <div class="ai-modal-body">
          <div class="ai-form-group">
            <label class="ai-form-label">Location / Regional Market</label>
            <select class="ai-form-select" id="ctxLocation">
              ${['Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Global', 'Remote', 'United States', 'United Kingdom'].map(l => `
                <option value="${l}" ${ctx.location === l ? 'selected' : ''}>${l}</option>
              `).join('')}
            </select>
          </div>
          <div class="ai-form-group">
            <label class="ai-form-label">Target Role</label>
            <select class="ai-form-select" id="ctxRole">
              ${['AI Engineer', 'Backend Engineer', 'Data Engineer', 'Cloud Architect', 'Cybersecurity Lead'].map(r => `
                <option value="${r}" ${ctx.role === r ? 'selected' : ''}>${r}</option>
              `).join('')}
            </select>
          </div>
          <div class="ai-form-group">
            <label class="ai-form-label">Primary Skill Focus</label>
            <select class="ai-form-select" id="ctxSkill">
              ${['Python', 'Machine Learning', 'CUDA', 'Generative AI', 'Cloud Computing', 'SQL'].map(s => `
                <option value="${s}" ${ctx.skill === s ? 'selected' : ''}>${s}</option>
              `).join('')}
            </select>
          </div>
          <div class="ai-form-group">
            <label class="ai-form-label">Profile Identity</label>
            <input type="text" class="ai-form-input" id="ctxProfile" value="${escapeHTML(ctx.userProfile)}" />
          </div>
        </div>
        <div class="ai-modal-footer">
          <button type="button" class="ai-glass-btn" id="btnCancelContext">Cancel</button>
          <button type="submit" class="ai-action-btn primary">Save & Update Context</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  if (window.lucide) window.lucide.createIcons();

  modal.querySelector('#btnCloseModal').addEventListener('click', () => modal.remove());
  modal.querySelector('#btnCancelContext').addEventListener('click', () => modal.remove());
  modal.querySelector('#aiContextForm').addEventListener('submit', (e) => {
    e.preventDefault();
    activeSession.context.location = modal.querySelector('#ctxLocation').value;
    activeSession.context.role = modal.querySelector('#ctxRole').value;
    activeSession.context.skill = modal.querySelector('#ctxSkill').value;
    activeSession.context.userProfile = modal.querySelector('#ctxProfile').value.trim() || 'Arun Sharma';
    saveAiSession(activeSession);
    modal.remove();
    renderDedicatedAIAssistantPage();
    showToast('Context updated. Recommendations will reflect these settings.');
  });
}

function showSavedInsightsModal() {
  const existing = document.getElementById('aiModalOverlay');
  if (existing) existing.remove();

  const saved = loadSavedInsights();

  const modal = document.createElement('div');
  modal.className = 'ai-modal-overlay';
  modal.id = 'aiModalOverlay';
  modal.innerHTML = `
    <div class="ai-modal-box">
      <div class="ai-modal-header">
        <h3>Saved Intelligence Insights (${saved.length})</h3>
        <button class="ai-icon-action-btn" id="btnCloseModal">
          <i data-lucide="x" style="width:16px; height:16px;"></i>
        </button>
      </div>
      <div class="ai-modal-body">
        ${saved.length === 0 ? `
          <div style="text-align:center; padding:30px 10px; color:#625a69;">
            <i data-lucide="bookmark" style="width:32px; height:32px; color:var(--ai-primary); margin-bottom:8px;"></i>
            <p style="margin:0; font-weight:600;">No saved insights yet</p>
            <small style="color:#8d8395;">Bookmark any response card in the assistant to reference it here anytime.</small>
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${saved.map(item => `
              <div style="padding:12px 14px; background:#F8F6FC; border:1px solid rgba(178,45,239,0.15); border-radius:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <span style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--ai-primary);">${escapeHTML(item.domain)}</span>
                  <small style="color:#8d8395;">${item.savedAt}</small>
                </div>
                <div style="font-size:13px; font-weight:600; color:#171321; margin-bottom:4px;">${escapeHTML(item.userQuestion)}</div>
                <div style="font-size:12px; color:#625a69; line-height:1.4;">${escapeHTML(item.finding)}</div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
      <div class="ai-modal-footer">
        <button type="button" class="ai-glass-btn" id="btnCloseSaved">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  if (window.lucide) window.lucide.createIcons();

  modal.querySelector('#btnCloseModal').addEventListener('click', () => modal.remove());
  modal.querySelector('#btnCloseSaved').addEventListener('click', () => modal.remove());
}

function showVoiceModal() {
  const existing = document.getElementById('aiModalOverlay');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'ai-modal-overlay';
  modal.id = 'aiModalOverlay';
  modal.innerHTML = `
    <div class="ai-modal-box">
      <div class="ai-modal-header">
        <h3>Voice Intelligence Interface</h3>
        <button class="ai-icon-action-btn" id="btnCloseModal">
          <i data-lucide="x" style="width:16px; height:16px;"></i>
        </button>
      </div>
      <div class="ai-modal-body" style="text-align:center; padding:32px 20px;">
        <div style="width:64px; height:64px; border-radius:50%; background:var(--ai-light-purple); color:var(--ai-primary); display:inline-flex; align-items:center; justify-content:center; margin-bottom:12px;">
          <i data-lucide="mic" style="width:32px; height:32px;"></i>
        </div>
        <h4 style="margin:0 0 8px; font-size:16px; color:#171321;">Prototype Voice Interaction</h4>
        <p style="margin:0 0 16px; font-size:13px; color:#625a69; line-height:1.5;">
          Voice dictation and audio question processing is displayed as a prototype design feature. In the production deployment, real microphone audio will be streamed to the speech-to-text pipeline.
        </p>
        <span style="display:inline-block; font-size:11px; font-weight:700; background:rgba(178,45,239,0.1); color:var(--ai-deep); padding:4px 10px; border-radius:999px;">
          Demonstration Mode Active
        </span>
      </div>
      <div class="ai-modal-footer">
        <button type="button" class="ai-action-btn primary" id="btnCloseVoice">Understood</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  if (window.lucide) window.lucide.createIcons();

  modal.querySelector('#btnCloseModal').addEventListener('click', () => modal.remove());
  modal.querySelector('#btnCloseVoice').addEventListener('click', () => modal.remove());
}

function showToast(message) {
  if (currentToastTimer) clearTimeout(currentToastTimer);
  const existing = document.getElementById('aiToastNotification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'ai-toast-container';
  toast.id = 'aiToastNotification';
  toast.innerHTML = `
    <i data-lucide="check-circle-2" style="width:16px; height:16px; color:var(--ai-positive);"></i>
    <span>${escapeHTML(message)}</span>
  `;

  document.body.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  currentToastTimer = setTimeout(() => {
    toast.remove();
  }, 3200);
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
