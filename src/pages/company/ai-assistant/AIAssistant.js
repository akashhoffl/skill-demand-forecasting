// ============================================================================
// TALENTSCOPE.AI — COMPANY STRATEGIC AI COPILOT
// Grounded Executive Decision Copilot: Answer, Why, Evidence, Affected Teams & Actions (#874FFF)
// All data clearly marked as simulated prototype intelligence
// ============================================================================

import { companyProfile } from '../../../data/company/company-data.js';

const esc = str => String(str ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);

const exampleQuestions = [
  { label: 'Workforce Changes', query: 'What changed in our workforce?' },
  { label: 'Critical Skills', query: 'Which skills are becoming critical?' },
  { label: 'Team Gaps', query: 'Which teams have the largest skill gaps?' },
  { label: 'Future Role Fit', query: 'Which employees could fit this future role?' },
  { label: 'Reskilling Strategy', query: 'Where should we reskill or redeploy?' },
  { label: 'CUDA Importance', query: 'Why is CUDA becoming important?' }
];

let copilotMessages = [
  {
    sender: 'assistant',
    structured: {
      answer: `Welcome to the **Executive Strategic AI Copilot** for **${companyProfile.name}**. I am grounded directly in your organizational workforce intelligence data — including **29,600 employee records (Workday)**, **1,840 verified technical skill profiles (NVIDIA DLI)**, and **real-time market signals**.`,
      why: 'Help company administrators and workforce planners make data-backed talent decisions without wading through spreadsheets.',
      evidence: ['Workday HCM Enterprise', 'NVIDIA Deep Learning Institute (DLI)', 'Simulated Prototype Intelligence Feed'],
      affectedTeams: ['Autonomous Compute', 'Hyperscale Inference Services', 'NeMo Cloud Platform'],
      action: 'Select a strategic question above or enter an inquiry below.'
    }
  }
];

export function renderCompanyAIAssistant() {
  const p = companyProfile;

  return `
    <div class="company-page company-ai-assistant">
      <!-- 1. HERO -->
      <section class="cmp-hero">
        <div class="cmp-hero__content">
          <div class="cmp-hero__greeting">
            <span class="cmp-eyebrow">
              <i data-lucide="sparkles" class="cmp-icon-inline"></i>
              STRATEGIC DECISION COPILOT
            </span>
            <h1>Strategic Workforce AI Copilot</h1>
            <p>Interrogate enterprise capability data, model redeployment scenarios, and generate board-level talent recommendations.</p>
          </div>

          <div class="cmp-hero__context-badge">
            <div class="cmp-hero__company-logo">${esc(p.logoInitials)}</div>
            <div class="cmp-hero__context-info">
              <strong>${esc(p.name)}</strong>
              <span>Enterprise Grounding Active</span>
              <div class="cmp-hero__context-meta">
                <span><i data-lucide="shield-check"></i> SOC-2 Compliant</span>
                <span>·</span>
                <span class="cmp-badge cmp-badge--neutral">Simulated Demo Data</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. QUICK EXECUTIVE INQUIRY CHIPS (Section 21) -->
      <section class="cmp-section" style="margin-bottom: 16px;">
        <span style="font-size: 11px; font-weight: 750; color: var(--cmp-text-muted); text-transform: uppercase; display: block; margin-bottom: 8px;">
          Strategic Questions
        </span>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${exampleQuestions.map(q => `
            <button type="button" class="cmp-btn-secondary cmp-copilot-chip-btn" data-query="${esc(q.query)}" style="height: 32px; padding: 0 12px; font-size: 12px;">
              <i data-lucide="sparkles" style="width: 13px; height: 13px;"></i>
              <span>${esc(q.query)}</span>
            </button>
          `).join('')}
        </div>
      </section>

      <!-- 3. CHAT WORKSPACE -->
      <section class="cmp-section">
        <div class="cmp-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; min-height: 540px;">
          <!-- Top bar -->
          <div style="padding: 12px 18px; background: var(--cmp-very-light); border-bottom: 1px solid var(--cmp-border); display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--cmp-primary); color: #FFF; display: flex; align-items: center; justify-content: center; font-size: 12px;">
                <i data-lucide="sparkles" style="width: 12px; height: 12px;"></i>
              </div>
              <strong style="font-size: 13px; color: var(--cmp-text-primary);">TalentScope Strategic Copilot</strong>
              <span class="cmp-badge cmp-badge--success" style="font-size: 10.5px;">Grounded</span>
            </div>
            <button type="button" class="cmp-btn-ghost" id="cmpClearChatBtn" style="padding: 2px 8px; font-size: 11.5px;">
              <i data-lucide="trash-2"></i>
              <span>Reset</span>
            </button>
          </div>

          <!-- Messages Area -->
          <div id="cmpCopilotChatArea" style="flex: 1; padding: 18px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; max-height: 480px;">
            ${copilotMessages.map(msg => renderCopilotMessage(msg)).join('')}
          </div>

          <!-- Thinking Indicator -->
          <div id="cmpCopilotThinkingIndicator" style="display: none; padding: 10px 18px; background: var(--cmp-light-primary); border-top: 1px solid var(--cmp-border-accent); font-size: 12px; color: var(--cmp-deep-primary);">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div class="cmp-spinner" style="width: 14px; height: 14px; border: 2px solid var(--cmp-border); border-top-color: var(--cmp-primary); border-radius: 50%; animation: cmpSpin 0.7s linear infinite;"></div>
              <span id="cmpThinkingText">Grounding inquiry against Workday and DLI benchmarks...</span>
            </div>
          </div>

          <!-- Input Bar -->
          <div style="padding: 14px 18px; background: #FFFFFF; border-top: 1px solid var(--cmp-border);">
            <form id="cmpCopilotForm" style="display: flex; gap: 8px; align-items: center;">
              <input
                type="text"
                id="cmpCopilotInputField"
                placeholder="Ask about workforce health, critical skills, redeployment, or scenario forecasts..."
                style="flex: 1; height: 40px; padding: 0 14px; border-radius: 8px; border: 1px solid var(--cmp-border); font-size: 13px; outline: none;"
                autocomplete="off"
              />
              <button type="submit" class="cmp-btn-primary" style="height: 40px; padding: 0 16px;">
                <i data-lucide="send"></i>
                <span>Ask</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderCopilotMessage(msg) {
  if (msg.sender === 'user') {
    return `
      <div style="display: flex; justify-content: flex-end;">
        <div style="max-width: 75%; background: var(--cmp-primary); color: #FFFFFF; padding: 10px 14px; border-radius: 12px; font-size: 13.5px; font-weight: 500;">
          ${esc(msg.text)}
        </div>
      </div>
    `;
  }

  // Structured response (Section 21: ANSWER, WHY, EVIDENCE, AFFECTED TEAMS, RECOMMENDED ACTION)
  const s = msg.structured;
  return `
    <div style="display: flex; gap: 10px; align-items: flex-start;">
      <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--cmp-light-primary); color: var(--cmp-deep-primary); display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; border: 1px solid var(--cmp-border-accent);">
        <i data-lucide="sparkles" style="width: 16px; height: 16px;"></i>
      </div>
      <div style="max-width: 85%; background: var(--cmp-very-light); border: 1px solid var(--cmp-border); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 12px;">
        <!-- Answer -->
        <div style="font-size: 13.5px; color: var(--cmp-text-primary); line-height: 1.55;">
          ${s.answer}
        </div>

        ${s.why ? `
          <div style="background: #FFFFFF; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--cmp-border-subtle); font-size: 12.5px;">
            <strong style="color: var(--cmp-text-muted); text-transform: uppercase; font-size: 10.5px; display: block; margin-bottom: 2px;">Why It Matters:</strong>
            <span style="color: var(--cmp-text-secondary);">${esc(s.why)}</span>
          </div>
        ` : ''}

        ${s.affectedTeams && s.affectedTeams.length ? `
          <div style="font-size: 12px; color: var(--cmp-text-muted);">
            <strong style="text-transform: uppercase; font-size: 10.5px; color: var(--cmp-text-muted);">Affected Teams:</strong>
            <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px;">
              ${s.affectedTeams.map(t => `<span class="cmp-badge cmp-badge--neutral" style="font-size: 11px;">${esc(t)}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${s.action ? `
          <div style="background: var(--cmp-light-primary); border-left: 3px solid var(--cmp-primary); padding: 8px 12px; border-radius: 0 8px 8px 0; font-size: 12.5px; color: var(--cmp-deep-primary);">
            <strong>Recommended Action:</strong> ${esc(s.action)}
          </div>
        ` : ''}

        ${s.evidence && s.evidence.length ? `
          <div style="padding-top: 8px; border-top: 1px solid var(--cmp-border-subtle); display: flex; gap: 6px; align-items: center; flex-wrap: wrap; font-size: 10.5px; color: var(--cmp-text-muted);">
            <strong>Grounded Citations:</strong>
            ${s.evidence.map(e => `<span class="cmp-badge cmp-badge--neutral" style="font-size: 10px;">${esc(e)}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function bindCompanyAIAssistantEvents(rerender) {
  // Query chips
  document.querySelectorAll('.cmp-copilot-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.query;
      handleCopilotInquiry(q, rerender);
    });
  });

  // Form submit
  document.querySelector('#cmpCopilotForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.querySelector('#cmpCopilotInputField');
    const q = input?.value.trim();
    if (q) {
      input.value = '';
      handleCopilotInquiry(q, rerender);
    }
  });

  // Clear chat
  document.querySelector('#cmpClearChatBtn')?.addEventListener('click', () => {
    copilotMessages = [
      {
        sender: 'assistant',
        structured: {
          answer: `Session reset. Grounded directly in **${companyProfile.name}** active data sources. How can I help your workforce strategy?`,
          why: 'Clear context for next strategic inquiry.',
          evidence: ['Workday HCM Enterprise', 'NVIDIA DLI API', 'Simulated Prototype Intelligence Feed'],
          affectedTeams: ['Autonomous Compute', 'Hyperscale Inference Services'],
          action: 'Select a question or ask anything.'
        }
      }
    ];
    rerender();
  });

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function handleCopilotInquiry(query, rerender) {
  copilotMessages.push({ sender: 'user', text: query });
  rerender();

  const indicator = document.querySelector('#cmpCopilotThinkingIndicator');
  if (indicator) indicator.style.display = 'block';

  setTimeout(() => {
    if (indicator) indicator.style.display = 'none';

    let structured = {
      answer: `Based on current enterprise models for "${query}":`,
      why: 'Workforce requirements are shifting rapidly.',
      evidence: ['Workday HCM Enterprise', 'NVIDIA DLI API', 'Simulated Prototype Intelligence Feed'],
      affectedTeams: ['Autonomous Compute', 'Inference Services'],
      action: 'Review Skill Intelligence'
    };

    const q = query.toLowerCase();

    if (q.includes('what changed') || q.includes('workforce changes')) {
      structured.answer = `### Workforce Health & Strategic Shifts\n\n- **Overall Health:** 86/100 (Stable across APAC and US pods).\n- **Headcount Allocation:** 29,600 global records with 14,200 in engineering.\n- **Major Change:** Deployment of Blackwell B200 pods has increased high-throughput memory profiling demand by +34.2%.`;
      structured.why = 'External hardware advancements require immediate software optimization capabilities.';
      structured.evidence = ['Engineering All-Hands Whitepaper #882', 'Workday Headcount Log'];
      structured.affectedTeams = ['Autonomous Compute', 'Hyperscale Inference'];
      structured.action = 'Enroll 42 AI Engineers into NVIDIA DLI Advanced Kernel Academy.';
    } else if (q.includes('cuda')) {
      structured.answer = `### Why CUDA & Kernel Optimization Is Becoming Critical\n\n- **Current Deficit:** 27% gap (142 qualified vs 218 needed for Q4 deliverables).\n- **Strategic Value:** Proprietary CUDA kernels are NVIDIA's primary software moat against competitors (AMD ROCm 6.2 and Cerebras).\n- **Cost Exposure:** Hiring externally for 76 Senior CUDA engineers would cost ~$1.4M with an 84-day onboarding ramp.`;
      structured.why = 'Software performance defines customer hardware ROI.';
      structured.evidence = ['Benchmark Suite v4.2', 'Market Supply Report'];
      structured.affectedTeams = ['Autonomous Compute', 'Inference Services', 'Core Silicon Compilers'];
      structured.action = 'Upskill internal L4 AI Engineers (e.g. Arun Sharma, 86% readiness).';
    } else if (q.includes('future role') || q.includes('employees could fit')) {
      structured.answer = `### Internal Talent Matching for Senior L5 Roles\n\n- **Candidate Match:** Arun Sharma (AI Engineer L4) matches **86%** of requirements for **Senior AI Platform Engineer (L5)**.\n- **Strengths:** Python, PyTorch, Distributed Systems.\n- **Development Gap:** CUDA Systems Optimization & Multi-Node NCCL.\n- **Other Matches:** Sunita Rao (64% readiness, mentorship assigned); Vikram Patel (75% readiness for Triton Specialist).`;
      structured.why = 'Internal promotions increase retention and cut search agency fees.';
      structured.evidence = ['Verified DLI Learning Logs', 'Workday Talent Bench'];
      structured.affectedTeams = ['Autonomous Compute', 'Cloud Infrastructure'];
      structured.action = 'Open Mobility Studio to review promotion dossiers.';
    } else if (q.includes('reskill') || q.includes('redeploy')) {
      structured.answer = `### Redeployment Cohort: REST API Developers → Triton Microservices\n\n- **Cohort Status:** 14 developers actively in Week 3 of transition sprint.\n- **Curriculum Mastery:** 64% completed (9 of 14 engineers certified).\n- **Benefit:** Zero layoffs required; preserves core domain knowledge and avoids $420K in recruiting and severance friction.`;
      structured.why = 'Legacy REST monoliths are sunsetting across all cloud products.';
      structured.evidence = ['Architecture Guild Directive v3.8', 'Cohort Tracker'];
      structured.affectedTeams = ['Core Platform API', 'Hyperscale Inference'];
      structured.action = 'Continue Week 4 production cluster deployment milestone.';
    } else {
      structured.answer = `### Strategic Synthesis for "${query}"\n\n- **Workforce Baseline:** 29,600 employees; 14% critical skill gap across 3 priority competencies.\n- **Mobility Benchmark:** 31.4% internal placement velocity (24 placements this quarter).\n- **Next Horizon:** Multi-horizon forecast projects a 530-engineer deficit at 12 months unless internal academies cover 60% of demand.`;
      structured.why = 'Aligning talent capability with upcoming product architecture milestones.';
      structured.evidence = ['FY26 Headcount Model', 'DLI Skills Architecture'];
      structured.affectedTeams = ['All Engineering Pods'];
      structured.action = 'Inspect Workforce Planning Forecast or test sensitivity sandbox.';
    }

    copilotMessages.push({
      sender: 'assistant',
      structured
    });

    rerender();
  }, 900);
}
