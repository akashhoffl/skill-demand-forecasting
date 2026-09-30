// ============================================================================
// TALENTSCOPE.AI — EMPLOYEE MY SKILLS
// Accessible, scannable skill intelligence with direct contribution hooks
// ============================================================================

import {
  getEmployeeProfile,
  employeeSkillsData,
  isCompanyEmployee
} from '../../../data/employee/employee-data.js';
import { openEmployeeModal } from '../components/EmployeeModal.js';

let selectedSkillId = 'sk-cuda';
let activeCategory = 'All';
let activeStatus = 'All';

const esc = str => String(str ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);

function sparklineSVG(trend = [40, 44, 48, 52, 55, 58, 62], isGap = false) {
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const span = Math.max(1, max - min);
  const points = trend.map((v, i) => {
    const x = (i / (trend.length - 1)) * 120;
    const y = 32 - ((v - min) / span) * 24;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const strokeColor = isGap ? '#F59E0B' : '#2735F5';
  const fillColor = isGap ? 'rgba(245, 158, 11, 0.12)' : 'rgba(39, 53, 245, 0.12)';

  return `
    <svg viewBox="0 0 120 36" style="width: 100%; height: 36px; overflow: visible;">
      <polyline points="${points}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <polygon points="0,36 ${points} 120,36" fill="${fillColor}" />
    </svg>
  `;
}

export function renderEmployeeMySkills() {
  const p = getEmployeeProfile();
  const allSkills = employeeSkillsData;
  const isCompany = isCompanyEmployee();

  const categories = ['All', 'Core Programming', 'Hardware Acceleration', 'AI Frameworks', 'Systems Architecture', 'Inference Acceleration'];
  const statuses = ['All', 'Strong', 'Developing', 'Gap', 'Mentor Eligible'];

  let filtered = allSkills;
  if (activeCategory !== 'All') {
    filtered = filtered.filter(s => s.category.toLowerCase().includes(activeCategory.toLowerCase()));
  }
  if (activeStatus === 'Mentor Eligible') {
    filtered = filtered.filter(s => s.mentorEligible);
  } else if (activeStatus !== 'All') {
    filtered = filtered.filter(s => s.status === activeStatus);
  }

  const selectedSkill = allSkills.find(s => s.id === selectedSkillId) || allSkills[0];

  return `
    <div class="employee-page">
      <!-- Page Header -->
      <section class="emp-hero">
        <div class="emp-hero-content">
          <span class="emp-eyebrow">
            <i data-lucide="layers-3"></i>
            ${isCompany ? 'COMPANY & ROLE SKILL BENCHMARK' : 'MARKET & CAREER SKILL BENCHMARK'}
          </span>
          <h1 class="emp-hero-title">My Skills Portfolio</h1>
          <p class="emp-hero-desc">
            ${isCompany 
              ? `Benchmarked against <strong>${esc(p.role)}</strong> and upcoming <strong>${esc(p.targetRole)}</strong> requirements at <strong>${esc(p.company)}</strong>.`
              : `Benchmarked against global market standards for <strong>${esc(p.targetRole)}</strong> in high-throughput distributed systems.`}
          </p>
        </div>
        <div class="emp-hero-actions">
          <button type="button" class="emp-btn-primary" id="btnRequestSkillAssessment">
            <i data-lucide="award"></i>
            <span>Assess New Skill</span>
          </button>
        </div>
      </section>

      <!-- 2-Column Responsive Layout -->
      <div style="display: grid; grid-template-columns: 1fr 420px; gap: 24px; align-items: start;">
        
        <!-- LEFT COLUMN: Skills Table & Filters -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Category & Status Filters -->
          <div class="emp-card" style="padding: 14px 18px; display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 11.5px; font-weight: 750; color: var(--emp-text-muted); text-transform: uppercase; margin-right: 4px;">Category:</span>
                ${categories.map(c => `
                  <button type="button" class="emp-btn-ghost ${activeCategory === c ? 'emp-btn-secondary' : ''}" data-category-filter="${esc(c)}" style="height: 30px; font-size: 12px; padding: 0 10px;">
                    ${esc(c)}
                  </button>
                `).join('')}
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; border-top: 1px solid var(--emp-border-subtle); padding-top: 10px;">
              <span style="font-size: 11.5px; font-weight: 750; color: var(--emp-text-muted); text-transform: uppercase; margin-right: 4px;">Status:</span>
              ${statuses.map(st => `
                <button type="button" class="emp-btn-ghost ${activeStatus === st ? 'emp-btn-secondary' : ''}" data-status-filter="${esc(st)}" style="height: 28px; font-size: 11.5px; padding: 0 9px;">
                  ${esc(st)}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Skills Table Card -->
          <div class="emp-card" style="padding: 0; overflow: hidden;">
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left;">
                <thead>
                  <tr style="background: var(--emp-soft); border-bottom: 1px solid var(--emp-border); color: var(--emp-text-muted); font-size: 11.5px; font-weight: 750; text-transform: uppercase; letter-spacing: 0.04em;">
                    <th style="padding: 14px 18px;">Skill Name</th>
                    <th style="padding: 14px 16px;">Skill Health</th>
                    <th style="padding: 14px 16px;">Relevance</th>
                    <th style="padding: 14px 16px;">Momentum</th>
                    <th style="padding: 14px 18px;">Target Fit</th>
                  </tr>
                </thead>
                <tbody>
                  ${filtered.map(sk => `
                    <tr class="emp-skill-interactive-row" data-select-skill="${esc(sk.id)}" style="border-bottom: 1px solid var(--emp-border-subtle); cursor: pointer; transition: background 140ms ease; ${selectedSkillId === sk.id ? 'background: #EEF1FF;' : ''}">
                      <td style="padding: 14px 18px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <div class="emp-icon-box" style="${selectedSkillId === sk.id ? 'background: var(--emp-primary); color: #FFF;' : ''}">
                            <i data-lucide="${esc(sk.icon)}"></i>
                          </div>
                          <div>
                            <div style="font-weight: 750; color: var(--emp-text-primary); font-size: 14px;">${esc(sk.name)}</div>
                            <div style="font-size: 12px; color: var(--emp-text-muted);">${esc(sk.proficiency)} · ${esc(sk.category)}</div>
                          </div>
                        </div>
                      </td>
                      <td style="padding: 14px 16px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <div class="emp-progress-bar" style="width: 72px;">
                            <div class="emp-progress-fill ${sk.status === 'Gap' ? 'emp-progress-fill--warning' : 'emp-progress-fill--success'}" style="width: ${sk.healthScore}%;"></div>
                          </div>
                          <span style="font-weight: 750; font-size: 12px; color: var(--emp-text-primary);">${sk.healthScore}%</span>
                        </div>
                      </td>
                      <td style="padding: 14px 16px;">
                        <span style="font-weight: 700; color: var(--emp-text-primary);">${sk.relevance}%</span>
                      </td>
                      <td style="padding: 14px 16px;">
                        <span style="font-weight: 700; color: var(--emp-success);">${esc(sk.momentum)}</span>
                      </td>
                      <td style="padding: 14px 18px;">
                        <span class="emp-badge ${sk.status === 'Strong' ? 'emp-badge-success' : 'emp-badge-warning'}">
                          ${sk.status === 'Strong' ? '✓ Aligned' : '! Priority Gap'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Deep Dive Detail & Contribution Hooks -->
        <div class="emp-card" style="position: sticky; top: 96px; display: flex; flex-direction: column; gap: 18px; border-color: rgba(39, 53, 245, 0.2);">
          
          <!-- Detail Header -->
          <div style="display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 1px solid var(--emp-border-subtle); padding-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="emp-icon-box" style="width: 42px; height: 42px; background: var(--emp-primary); color: #FFFFFF;">
                <i data-lucide="${esc(selectedSkill.icon)}" style="width: 20px; height: 20px;"></i>
              </div>
              <div>
                <span class="emp-eyebrow">SKILL DETAIL</span>
                <h3 style="font-size: 18px; font-weight: 850; color: var(--emp-text-primary); margin: 0;">${esc(selectedSkill.name)}</h3>
                <small style="color: var(--emp-text-muted); font-size: 12px;">${esc(selectedSkill.category)}</small>
              </div>
            </div>
            <span class="emp-badge ${selectedSkill.status === 'Strong' ? 'emp-badge-success' : 'emp-badge-warning'}">
              ${esc(selectedSkill.status)}
            </span>
          </div>

          <!-- Description -->
          <p style="font-size: 13px; color: var(--emp-text-secondary); line-height: 1.5; margin: 0;">
            ${esc(selectedSkill.description)}
          </p>

          <!-- 4 Stats in 2x2 Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: var(--emp-soft); border: 1px solid var(--emp-border-subtle); border-radius: 12px; padding: 12px;">
              <span style="font-size: 11px; font-weight: 750; color: var(--emp-text-muted); text-transform: uppercase;">Health Score</span>
              <div style="font-size: 20px; font-weight: 850; color: var(--emp-primary); margin-top: 2px;">
                ${selectedSkill.healthScore} <small style="font-size: 11px; font-weight: 600; color: var(--emp-text-muted);">/ 100</small>
              </div>
            </div>
            <div style="background: var(--emp-soft); border: 1px solid var(--emp-border-subtle); border-radius: 12px; padding: 12px;">
              <span style="font-size: 11px; font-weight: 750; color: var(--emp-text-muted); text-transform: uppercase;">Relevance</span>
              <div style="font-size: 20px; font-weight: 850; color: var(--emp-text-primary); margin-top: 2px;">
                ${selectedSkill.relevance}%
              </div>
            </div>
            <div style="background: var(--emp-soft); border: 1px solid var(--emp-border-subtle); border-radius: 12px; padding: 12px;">
              <span style="font-size: 11px; font-weight: 750; color: var(--emp-text-muted); text-transform: uppercase;">Half-Life</span>
              <div style="font-size: 16px; font-weight: 800; color: var(--emp-text-primary); margin-top: 4px;">
                ${esc(selectedSkill.halfLife)}
              </div>
            </div>
            <div style="background: var(--emp-soft); border: 1px solid var(--emp-border-subtle); border-radius: 12px; padding: 12px;">
              <span style="font-size: 11px; font-weight: 750; color: var(--emp-text-muted); text-transform: uppercase;">Momentum</span>
              <div style="font-size: 16px; font-weight: 800; color: var(--emp-success); margin-top: 4px;">
                ${esc(selectedSkill.momentum)}
              </div>
            </div>
          </div>

          <!-- Trend Chart -->
          <div style="background: #FFFFFF; border: 1px solid var(--emp-border); border-radius: 12px; padding: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 11.5px; font-weight: 750; color: var(--emp-text-muted); text-transform: uppercase;">6-Month Momentum Trend</span>
              <span style="font-size: 12px; font-weight: 700; color: var(--emp-success);">${esc(selectedSkill.momentum)}</span>
            </div>
            ${sparklineSVG(selectedSkill.trend, selectedSkill.status === 'Gap')}
          </div>

          <!-- Evidence & Alignment -->
          <div style="background: var(--emp-soft); border-radius: 12px; padding: 14px; font-size: 12.5px; line-height: 1.45; border: 1px solid var(--emp-border-subtle);">
            <div style="font-weight: 750; color: var(--emp-primary); margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              <i data-lucide="shield-check"></i>
              Target Requirement Alignment
            </div>
            <div style="color: var(--emp-text-secondary);">
              ${esc(selectedSkill.roleRequirement)} · ${esc(selectedSkill.gap)}
            </div>
            <div style="font-size: 11px; color: var(--emp-text-muted); margin-top: 6px;">
              Evidence: <strong>${esc(selectedSkill.evidenceBadge || selectedSkill.verifiedDate)}</strong>
            </div>
          </div>

          <!-- Action Box: Dual Path (If Gap: Learn & Assess. If Strong: Contribute & Mentor) -->
          <div style="border-top: 1px solid var(--emp-border-subtle); padding-top: 14px; display: flex; flex-direction: column; gap: 10px;">
            ${selectedSkill.mentorEligible ? `
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span class="emp-badge emp-badge-primary"><i data-lucide="award"></i> Mentor Eligible</span>
                <span style="font-size: 12px; color: var(--emp-text-muted);">${selectedSkill.questionsAuthoredCount || 0} questions authored</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button type="button" class="emp-btn-primary emp-btn-sm" id="btnSkillCreateQuestion" data-skill="${esc(selectedSkill.name)}">
                  <i data-lucide="file-question"></i>
                  <span>Add Question</span>
                </button>
                <button type="button" class="emp-btn-secondary emp-btn-sm" id="btnSkillHostMock" data-skill="${esc(selectedSkill.name)}">
                  <i data-lucide="video"></i>
                  <span>Host Mock</span>
                </button>
              </div>
            ` : `
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span class="emp-badge emp-badge-warning"><i data-lucide="target"></i> Focus Area</span>
                <span style="font-size: 12px; color: var(--emp-text-muted);">Required for Target Role</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <a href="#/employee/growth" class="emp-btn-primary emp-btn-sm">
                  <i data-lucide="book-open"></i>
                  <span>Start Lab</span>
                </a>
                <button type="button" class="emp-btn-secondary emp-btn-sm" id="btnSkillRunAssessment" data-skill="${esc(selectedSkill.name)}">
                  <i data-lucide="award"></i>
                  <span>Take Quiz</span>
                </button>
              </div>
            `}
          </div>

        </div>
      </div>
    </div>
  `;
}

export function bindEmployeeSkillsEvents(rerender) {
  // Row selection
  document.querySelectorAll('[data-select-skill]').forEach(row => {
    row.addEventListener('click', () => {
      selectedSkillId = row.dataset.selectSkill;
      rerender();
    });
  });

  // Category filters
  document.querySelectorAll('[data-category-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.categoryFilter;
      rerender();
    });
  });

  // Status filters
  document.querySelectorAll('[data-status-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeStatus = btn.dataset.statusFilter;
      rerender();
    });
  });

  // Request Skill Assessment Modal
  const requestAssessBtn = document.querySelector('#btnRequestSkillAssessment');
  if (requestAssessBtn) {
    requestAssessBtn.addEventListener('click', () => {
      openEmployeeModal({
        title: 'Request Technical Assessment',
        subtitle: 'Validate your competencies to update your health score and unlock mentor eligibility',
        badge: 'Assessment Gateway',
        contentHtml: `
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <p>Select which skill category you wish to benchmark against current standards:</p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label style="display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid var(--emp-border); border-radius: 10px; cursor: pointer;">
                <input type="radio" name="skillToAssess" checked style="accent-color: var(--emp-primary);" />
                <div>
                  <strong>CUDA & GPU Optimization</strong>
                  <div style="font-size: 12px; color: var(--emp-text-muted);">20 questions · 35 mins · Kernel memory profiling</div>
                </div>
              </label>
              <label style="display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid var(--emp-border); border-radius: 10px; cursor: pointer;">
                <input type="radio" name="skillToAssess" style="accent-color: var(--emp-primary);" />
                <div>
                  <strong>Distributed Systems & NCCL</strong>
                  <div style="font-size: 12px; color: var(--emp-text-muted);">15 questions · 30 mins · Interconnect latency & ring reduce</div>
                </div>
              </label>
            </div>
          </div>
        `,
        footerHtml: `
          <button type="button" class="emp-btn-ghost" onclick="document.getElementById('empModalCloseBtn').click()">Cancel</button>
          <button type="button" class="emp-btn-primary" onclick="alert('Assessment initiated! Opening testing console...'); document.getElementById('empModalCloseBtn').click();">
            <span>Begin Assessment</span>
          </button>
        `
      });
    });
  }

  // Direct action button: Add Question
  const createQBtn = document.querySelector('#btnSkillCreateQuestion');
  if (createQBtn) {
    createQBtn.addEventListener('click', () => {
      const skillName = createQBtn.dataset.skill;
      openEmployeeModal({
        title: `Contribute to ${skillName} Question Bank`,
        subtitle: 'Help peer engineers benchmark their capabilities and earn contributor reputation',
        badge: '+25 Rep Points',
        contentHtml: `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <label style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 650;">
              Scenario / Question Concept
              <input type="text" placeholder="e.g. Asynchronous Ring Buffers in high-load inference" style="padding: 10px; border: 1px solid var(--emp-border); border-radius: 10px;" />
            </label>
            <label style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 650;">
              Explanation / Solution Standard
              <textarea rows="3" placeholder="Provide test cases or expected architectural approach..." style="padding: 10px; border: 1px solid var(--emp-border); border-radius: 10px; resize: vertical;"></textarea>
            </label>
          </div>
        `,
        footerHtml: `
          <button type="button" class="emp-btn-ghost" onclick="document.getElementById('empModalCloseBtn').click()">Cancel</button>
          <button type="button" class="emp-btn-primary" onclick="alert('Question submitted to Question Bank!'); document.getElementById('empModalCloseBtn').click();">
            <span>Publish Question</span>
          </button>
        `
      });
    });
  }

  // Direct action button: Host Mock
  const hostMockBtn = document.querySelector('#btnSkillHostMock');
  if (hostMockBtn) {
    hostMockBtn.addEventListener('click', () => {
      const skillName = hostMockBtn.dataset.skill;
      openEmployeeModal({
        title: `Host Mock Technical Interview: ${skillName}`,
        subtitle: 'Provide a 45-min peer mock interview slot',
        badge: 'Peer Coaching',
        contentHtml: `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <p style="font-size: 13.5px; color: var(--emp-text-secondary); margin: 0;">
              Your rating in ${skillName} is <strong>4.9 / 5.0</strong>. Junior engineers frequently request practical architecture reviews.
            </p>
            <label style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 650;">
              Session Date
              <input type="date" value="2026-10-02" style="padding: 10px; border: 1px solid var(--emp-border); border-radius: 10px;" />
            </label>
          </div>
        `,
        footerHtml: `
          <button type="button" class="emp-btn-ghost" onclick="document.getElementById('empModalCloseBtn').click()">Cancel</button>
          <button type="button" class="emp-btn-primary" onclick="alert('Mock interview slot added to community board!'); document.getElementById('empModalCloseBtn').click();">
            <span>Publish Slot</span>
          </button>
        `
      });
    });
  }

  // Direct action button: Take Quiz
  const runAssessBtn = document.querySelector('#btnSkillRunAssessment');
  if (runAssessBtn) {
    runAssessBtn.addEventListener('click', () => {
      const skillName = runAssessBtn.dataset.skill;
      openEmployeeModal({
        title: `Take ${skillName} Practice Quiz`,
        subtitle: '10 quick questions designed by internal systems architects',
        badge: 'Skill Gap Closer',
        contentHtml: `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <p style="font-size: 13.5px; color: var(--emp-text-secondary); margin: 0;">
              Score 75% or above to boost your verified skill health score and reduce role evolution gap.
            </p>
            <div style="background: var(--emp-soft); padding: 12px; border-radius: 10px; border: 1px solid var(--emp-border-subtle); font-size: 13px;">
              ⏱ <strong>Duration:</strong> 15 minutes<br>
              🎯 <strong>Format:</strong> Code snippet debugging & multiple-choice
            </div>
          </div>
        `,
        footerHtml: `
          <button type="button" class="emp-btn-ghost" onclick="document.getElementById('empModalCloseBtn').click()">Close</button>
          <button type="button" class="emp-btn-primary" onclick="alert('Starting practice quiz in sandbox...'); document.getElementById('empModalCloseBtn').click();">
            <span>Start Practice Quiz</span>
          </button>
        `
      });
    });
  }
}
