// ============================================================================
// TALENTSCOPE.AI — COMPANY INTERNAL MOBILITY
// Find internal people who may fit future roles & support promotion readiness (#874FFF)
// "The final decision remains with the company"
// ============================================================================

import { companyProfile, companyEmployees } from '../../../data/company/company-data.js';
import { openCompanyModal } from '../components/CompanyModal.js';

const esc = str => String(str ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);

const mobilityRoles = [
  {
    roleTitle: 'Senior AI Platform Engineer (L5)',
    team: 'Autonomous Compute',
    location: 'Bangalore, India',
    urgency: 'Critical Q3',
    openSlots: 4,
    requiredSkills: ['Python', 'PyTorch', 'CUDA Kernels', 'Distributed Clusters'],
    matches: [
      {
        id: 'EMP-88291',
        name: 'Arun Sharma',
        initials: 'AS',
        currentRole: 'AI Engineer (L4)',
        readiness: 86,
        strengths: ['Python', 'PyTorch', 'Distributed Systems'],
        developmentAreas: ['CUDA Systems Optimization', 'Multi-Node NCCL'],
        learningProgress: 68,
        note: 'Potential fit for Senior AI Platform Engineer. Completing DLI kernel tuning modules.'
      },
      {
        id: 'EMP-94512',
        name: 'Sunita Rao',
        initials: 'SR',
        currentRole: 'Autonomous Inference Engineer (L3)',
        readiness: 64,
        strengths: ['Python', 'Linux Kernel', 'OpenCV'],
        developmentAreas: ['CUDA Kernels', 'Triton Server'],
        learningProgress: 42,
        note: 'High technical potential; 90-day mentorship assigned with Staff Architect.'
      }
    ]
  },
  {
    roleTitle: 'Triton Microservices Specialist (L4)',
    team: 'Inference Services',
    location: 'Bangalore, India / Santa Clara',
    urgency: 'Redeployment Priority',
    openSlots: 14,
    requiredSkills: ['Go / C++', 'Triton Server', 'Docker / K8s', 'gRPC Streaming'],
    matches: [
      {
        id: 'EMP-85210',
        name: 'Vikram Patel',
        initials: 'VP',
        currentRole: 'Cloud Backend Engineer (L4)',
        readiness: 75,
        strengths: ['REST APIs', 'Go', 'Microservices', 'PostgreSQL'],
        developmentAreas: ['Triton Server', 'C++ Inference'],
        learningProgress: 64,
        note: 'Potential fit for Triton Microservices Specialist. Active in Week 3 of transition cohort.'
      },
      {
        id: 'EMP-81023',
        name: 'Marcus Vance',
        initials: 'MV',
        currentRole: 'ML Platform Engineer (L4)',
        readiness: 72,
        strengths: ['Docker / K8s', 'Python', 'Model Packaging'],
        developmentAreas: ['FP4 Quantization', 'gRPC Streaming'],
        learningProgress: 55,
        note: 'Ready for production cluster shadowing.'
      }
    ]
  },
  {
    roleTitle: 'Principal Distributed Systems Architect (L7)',
    team: 'Cloud Infrastructure & Clusters',
    location: 'Bangalore / Santa Clara',
    urgency: 'Succession Bench',
    openSlots: 2,
    requiredSkills: ['NCCL Architecture', 'InfiniBand RDMA', 'Kernel Profiling', 'Technical Mentorship'],
    matches: [
      {
        id: 'EMP-90412',
        name: 'Ananya Sharma',
        initials: 'AS',
        currentRole: 'Staff Distributed Systems Engineer (L6)',
        readiness: 92,
        strengths: ['NCCL', 'C++', 'InfiniBand', 'Distributed GPU'],
        developmentAreas: ['Executive Guild Sponsorship'],
        learningProgress: 94,
        note: 'Potential fit for Principal Architect. Executive promotion review scheduled for Q4.'
      }
    ]
  }
];

export function renderCompanyInternalMobility() {
  const p = companyProfile;

  return `
    <div class="company-page company-mobility">
      <!-- 1. HERO -->
      <section class="cmp-hero">
        <div class="cmp-hero__content">
          <div class="cmp-hero__greeting">
            <span class="cmp-eyebrow">
              <i data-lucide="git-pull-request" class="cmp-icon-inline"></i>
              TALENT REDEPLOYMENT & SUCCESSION
            </span>
            <h1>Find Internal People for Future Roles</h1>
            <p>Unlock internal bench strength before external hiring, track role readiness, and manage promotion pipelines.</p>
          </div>

          <div class="cmp-hero__context-badge">
            <div class="cmp-hero__company-logo">${esc(p.logoInitials)}</div>
            <div class="cmp-hero__context-info">
              <strong>${esc(p.name)}</strong>
              <span>Internal Mobility Studio</span>
              <div class="cmp-hero__context-meta">
                <span><i data-lucide="repeat"></i> Placements: 24 this Quarter</span>
                <span>·</span>
                <span><i data-lucide="dollar-sign"></i> Recruiter Fees Avoided: $1.82M</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. HIGH-LEVEL MOBILITY STATS (Section 18) -->
      <section class="cmp-section">
        <div class="cmp-overview-grid" style="grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));">
          <div class="cmp-metric-card">
            <div>
              <div class="cmp-metric-card__header">
                <span class="cmp-metric-card__label">Internal Placement Rate</span>
                <div class="cmp-metric-card__icon"><i data-lucide="git-pull-request"></i></div>
              </div>
              <div class="cmp-metric-card__value" style="color: var(--cmp-primary);">31.4%</div>
              <div class="cmp-metric-card__headline">Healthy Internal Velocity</div>
              <p class="cmp-metric-card__summary">Proportion of senior engineering roles filled internally.</p>
            </div>
            <div class="cmp-metric-card__footer">
              <span class="cmp-badge cmp-badge--success">+6.8% YoY</span>
            </div>
          </div>

          <div class="cmp-metric-card">
            <div>
              <div class="cmp-metric-card__header">
                <span class="cmp-metric-card__label">Ramp-up Time</span>
                <div class="cmp-metric-card__icon"><i data-lucide="zap"></i></div>
              </div>
              <div class="cmp-metric-card__value" style="color: var(--cmp-success);">22 Days</div>
              <div class="cmp-metric-card__headline">Internal Bench Advantage</div>
              <p class="cmp-metric-card__summary">Compared to 84 days average for external recruitment.</p>
            </div>
            <div class="cmp-metric-card__footer">
              <span class="cmp-badge cmp-badge--success">3.8x Faster</span>
            </div>
          </div>

          <div class="cmp-metric-card">
            <div>
              <div class="cmp-metric-card__header">
                <span class="cmp-metric-card__label">Recruitment Cost Saved</span>
                <div class="cmp-metric-card__icon"><i data-lucide="shield-check"></i></div>
              </div>
              <div class="cmp-metric-card__value" style="color: var(--cmp-deep-primary);">$1.82M</div>
              <div class="cmp-metric-card__headline">Direct Agency Savings</div>
              <p class="cmp-metric-card__summary">Avoided search commissions and recruiter onboarding friction.</p>
            </div>
            <div class="cmp-metric-card__footer">
              <span class="cmp-badge cmp-badge--neutral">FY26 Cumulative</span>
            </div>
          </div>

          <div class="cmp-metric-card">
            <div>
              <div class="cmp-metric-card__header">
                <span class="cmp-metric-card__label">Internal Bench Candidates</span>
                <div class="cmp-metric-card__icon"><i data-lucide="users"></i></div>
              </div>
              <div class="cmp-metric-card__value" style="color: var(--cmp-warning);">18 Ready</div>
              <div class="cmp-metric-card__headline">High Skill Alignment</div>
              <p class="cmp-metric-card__summary">Qualified employees with &ge;70% match for open roles.</p>
            </div>
            <div class="cmp-metric-card__footer">
              <span class="cmp-badge cmp-badge--info">Action Ready</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. FUTURE ROLES & MATCHED INTERNAL CANDIDATES (Section 12 & 18) -->
      <section class="cmp-section">
        <div style="margin-bottom: 14px;">
          <span class="cmp-eyebrow"><i data-lucide="crosshair" class="cmp-icon-inline"></i> ROLE MATCHING BENCH</span>
          <h2 class="cmp-title">Future Roles & Potential Internal Matches</h2>
          <p class="cmp-subtitle">AI-matched internal candidates with verified technical capabilities ready for promotion or redeployment.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 20px;">
          ${mobilityRoles.map(r => `
            <div class="cmp-card" style="border-top: 4px solid var(--cmp-primary);">
              <!-- Role Header -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                <div>
                  <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
                    <span class="cmp-badge ${r.urgency.includes('Critical') ? 'cmp-badge--danger' : r.urgency.includes('Redeployment') ? 'cmp-badge--warning' : 'cmp-badge--accent'}">${esc(r.urgency)}</span>
                    <span style="font-size: 12px; color: var(--cmp-text-muted); font-weight: 700;">${r.openSlots} Open Slots</span>
                  </div>
                  <h3 style="font-size: 17.5px; font-weight: 850; color: var(--cmp-text-primary); margin: 0;">${esc(r.roleTitle)}</h3>
                  <span style="font-size: 12.5px; color: var(--cmp-text-secondary);">${esc(r.team)} · ${esc(r.location)}</span>
                </div>
                
                <div style="font-size: 12px; color: var(--cmp-text-muted); text-align: right;">
                  <strong style="display: block; color: var(--cmp-text-primary);">Required Capabilities:</strong>
                  <span>${r.requiredSkills.join(' · ')}</span>
                </div>
              </div>

              <!-- Matched Candidate Cards Grid (Equal Panels - Section 32) -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px;">
                ${r.matches.map(c => `
                  <div style="background: var(--cmp-very-light); border-radius: var(--cmp-radius-md); border: 1px solid var(--cmp-border); padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                          <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--cmp-light-primary); color: var(--cmp-deep-primary); font-weight: 850; font-size: 13px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--cmp-border-accent);">
                            ${esc(c.initials)}
                          </div>
                          <div>
                            <strong style="color: var(--cmp-text-primary); font-size: 14px; display: block;">${esc(c.name)}</strong>
                            <small style="color: var(--cmp-text-secondary);">${esc(c.currentRole)}</small>
                          </div>
                        </div>
                        <span class="cmp-badge cmp-badge--success" style="font-weight: 850; font-size: 12.5px;">${c.readiness}% Readiness</span>
                      </div>

                      <!-- Readiness Meter -->
                      <div style="margin-bottom: 10px;">
                        <div class="cmp-meter-track" style="height: 5px;">
                          <div class="cmp-meter-fill cmp-meter-fill--accent" style="width: ${c.readiness}%;"></div>
                        </div>
                      </div>

                      <div style="font-size: 12px; margin-bottom: 6px;">
                        <span style="color: var(--cmp-text-muted); font-weight: 700; text-transform: uppercase; font-size: 10.5px;">Strengths:</span>
                        <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 2px;">
                          ${c.strengths.map(s => `<span class="cmp-badge cmp-badge--neutral" style="font-size: 11px;">${esc(s)}</span>`).join('')}
                        </div>
                      </div>

                      <div style="font-size: 12px; margin-bottom: 8px;">
                        <span style="color: var(--cmp-danger); font-weight: 700; text-transform: uppercase; font-size: 10.5px;">Development Areas:</span>
                        <span style="color: var(--cmp-text-primary); font-weight: 600; display: block;">${c.developmentAreas.join(', ')}</span>
                      </div>

                      <div style="background: var(--cmp-surface); padding: 8px 10px; border-radius: 6px; font-size: 11.5px; color: var(--cmp-text-secondary); border: 1px solid var(--cmp-border-subtle); margin-bottom: 12px;">
                        <i data-lucide="info" style="width: 13px; height: 13px; color: var(--cmp-primary); vertical-align: middle;"></i>
                        <span>${esc(c.note)}</span>
                      </div>
                    </div>

                    <!-- Actions (Section 12) -->
                    <div style="display: flex; gap: 6px; align-items: center; padding-top: 10px; border-top: 1px solid var(--cmp-border); flex-wrap: wrap;">
                      <button type="button" class="cmp-btn-secondary plan-dev-btn" data-cand-name="${esc(c.name)}" data-target-role="${esc(r.roleTitle)}" data-gaps="${esc(c.developmentAreas.join(', '))}" style="height: 30px; font-size: 11.5px; padding: 0 10px; flex: 1;">
                        <i data-lucide="book-open"></i>
                        <span>Development Plan</span>
                      </button>
                      <button type="button" class="cmp-btn-primary review-promo-btn" data-cand-name="${esc(c.name)}" data-target-role="${esc(r.roleTitle)}" data-fit="${c.readiness}" style="height: 30px; font-size: 11.5px; padding: 0 12px;">
                        <i data-lucide="award"></i>
                        <span>Review Promotion</span>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- 4. ACTIVE RESKILLING COHORT PROGRESS TRACKER -->
      <section class="cmp-section">
        <div class="cmp-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
            <div>
              <span class="cmp-eyebrow"><i data-lucide="users" class="cmp-icon-inline"></i> COHORT SPRINT TRACKER</span>
              <h3 style="font-size: 17.5px; font-weight: 850; color: var(--cmp-text-primary); margin: 0 0 2px;">14 REST Developers → Triton Microservices Reskilling</h3>
              <p style="font-size: 12.5px; color: var(--cmp-text-secondary); margin: 0;">Weekly curriculum milestone tracker for engineering pod transitioning away from legacy REST monoliths.</p>
            </div>
            <span class="cmp-badge cmp-badge--success" style="font-size: 12px; padding: 6px 12px;">Week 3 of 4 · On Track</span>
          </div>

          <div style="background: var(--cmp-very-light); padding: 14px; border-radius: var(--cmp-radius-md); border: 1px solid var(--cmp-border); margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12.5px;">
              <span style="font-weight: 700; color: var(--cmp-text-primary);">Overall Cohort Mastery</span>
              <strong style="color: var(--cmp-primary);">64% (9 of 14 Engineers Certified)</strong>
            </div>
            <div class="cmp-meter-track" style="height: 7px;">
              <div class="cmp-meter-fill cmp-meter-fill--accent" style="width: 64%;"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

export function bindCompanyMobilityEvents() {
  // Review Promotion modal
  document.querySelectorAll('.review-promo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.candName;
      const role = btn.dataset.targetRole;
      const fit = btn.dataset.fit;

      openCompanyModal({
        title: `Promotion Review: ${name}`,
        subtitle: `Potential fit for ${role} · ${fit}% Readiness`,
        icon: 'award',
        maxWidth: '560px',
        contentHtml: `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <p style="font-size: 13.5px; color: var(--cmp-text-primary); margin: 0;">
              Our workforce intelligence engine identified <strong>${esc(name)}</strong> as a strong potential candidate for advancement into:
            </p>
            <div style="background: var(--cmp-light-primary); padding: 12px 14px; border-radius: 8px; font-weight: 750; color: var(--cmp-deep-primary);">
              ${esc(role)}
            </div>
            <div style="background: var(--cmp-very-light); padding: 12px; border-radius: 8px; border: 1px solid var(--cmp-border); font-size: 12.5px; color: var(--cmp-text-secondary);">
              <strong>Company Decision Notice:</strong> The final promotion decision remains with the hiring manager and people operations committee. Submitting triggers an internal dossier for Q4 review.
            </div>
          </div>
        `,
        cancelText: 'Cancel',
        confirmText: 'Submit Promotion Dossier',
        confirmIcon: 'check',
        onConfirm: () => {
          alert(`Promotion review dossier submitted for ${name} into ${role}!`);
          return true;
        }
      });
    });
  });

  // Development Plan modal
  document.querySelectorAll('.plan-dev-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.candName;
      const role = btn.dataset.targetRole;
      const gaps = btn.dataset.gaps;

      openCompanyModal({
        title: `Development Plan: ${name}`,
        subtitle: `Target Role: ${role}`,
        icon: 'book-open',
        maxWidth: '560px',
        contentHtml: `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <p style="font-size: 13.5px; color: var(--cmp-text-primary); margin: 0;">
              Structured upskilling plan to resolve target gaps before Q4 qualification:
            </p>
            <div style="background: var(--cmp-very-light); padding: 12px; border-radius: 8px; border: 1px solid var(--cmp-border); font-size: 13px;">
              <strong style="color: var(--cmp-danger); display: block; margin-bottom: 4px;">Identified Development Gaps:</strong>
              <span>${esc(gaps)}</span>
            </div>
            <div style="background: var(--cmp-light-primary); padding: 12px; border-radius: 8px; font-size: 12.5px; color: var(--cmp-deep-primary);">
              <strong>Curriculum Track:</strong> NVIDIA DLI Advanced Accelerated Kernel Tuning Track (4 modules, self-paced + pod shadowing).
            </div>
          </div>
        `,
        cancelText: 'Close',
        confirmText: 'Assign Curriculum to Employee',
        confirmIcon: 'check',
        onConfirm: () => {
          alert(`DLI Curriculum assigned to ${name}! The module now appears in the employee's portal learning sprint.`);
          return true;
        }
      });
    });
  });

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}
