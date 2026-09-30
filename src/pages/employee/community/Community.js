// ============================================================================
// TALENTSCOPE.AI — EMPLOYEE COMMUNITY
// Skill-to-contribution engine: Question Banks, Mock Interviews, Mentorship & Guilds
// ============================================================================

import {
  getEmployeeProfile,
  isCompanyEmployee,
  questionBanksData,
  mockInterviewsData,
  employeeCommunitiesData
} from '../../../data/employee/employee-data.js';
import { openEmployeeModal } from '../components/EmployeeModal.js';

let activeCommunityTab = 'questions'; // 'questions', 'interviews', 'mentorship', 'guilds'

const esc = str => String(str ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);

export function renderEmployeeCommunity() {
  const p = getEmployeeProfile();
  const isCompany = isCompanyEmployee();
  const qBanks = questionBanksData;
  const mockData = mockInterviewsData;
  const guilds = employeeCommunitiesData;

  return `
    <div class="employee-page">
      <!-- HERO -->
      <section class="emp-hero">
        <div class="emp-hero-content">
          <span class="emp-eyebrow">
            <i data-lucide="users-round"></i>
            SKILL-TO-CONTRIBUTION PLATFORM
          </span>
          <h1 class="emp-hero-title">Community & Knowledge Exchange</h1>
          <p class="emp-hero-desc">
            Contribute technical question banks, conduct peer mock interviews, mentor aspiring engineers, and build verified reputation.
          </p>
        </div>
        <div class="emp-hero-actions">
          <button type="button" class="emp-btn-primary" id="btnAuthorQuestionModal">
            <i data-lucide="file-question"></i>
            <span>Author Question</span>
          </button>
          <button type="button" class="emp-btn-secondary" id="btnAddMockSlotModal">
            <i data-lucide="calendar-plus"></i>
            <span>Offer Mock Slot</span>
          </button>
        </div>
      </section>

      <!-- REPUTATION BANNER -->
      <div class="emp-reputation-banner">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; font-size: 24px;">
            <i data-lucide="trophy"></i>
          </div>
          <div>
            <div style="font-size: 20px; font-weight: 850;">${p.reputationPoints.toLocaleString()} Reputation Points</div>
            <div style="font-size: 13px; opacity: 0.9;">
              Top 5% Contributor · ${p.mentorStatus} · 4.9 ★ (24 Reviews)
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <div class="emp-stat-pill">
            <strong>${qBanks.filter(q => q.createdByMe).length} Banks</strong>
            <small>Authored by you</small>
          </div>
          <div class="emp-stat-pill">
            <strong>${mockData.availableSlots.length} Slots</strong>
            <small>Mock interviews open</small>
          </div>
          <div class="emp-stat-pill">
            <strong>${p.menteesCount}</strong>
            <small>Active mentees</small>
          </div>
          <div class="emp-stat-pill">
            <strong>142</strong>
            <small>Learners assisted</small>
          </div>
        </div>
      </div>

      <!-- NAVIGATION TABS -->
      <div class="emp-card" style="padding: 12px 16px;">
        <div style="display: flex; align-items: center; gap: 10px; overflow-x: auto;">
          <button type="button" class="emp-btn-ghost ${activeCommunityTab === 'questions' ? 'emp-btn-secondary' : ''}" data-community-tab="questions">
            <i data-lucide="file-question"></i>
            <span>Question Banks (${qBanks.length})</span>
          </button>
          <button type="button" class="emp-btn-ghost ${activeCommunityTab === 'interviews' ? 'emp-btn-secondary' : ''}" data-community-tab="interviews">
            <i data-lucide="video"></i>
            <span>Mock Technical Interviews</span>
          </button>
          <button type="button" class="emp-btn-ghost ${activeCommunityTab === 'mentorship' ? 'emp-btn-secondary' : ''}" data-community-tab="mentorship">
            <i data-lucide="users"></i>
            <span>Peer Mentorship</span>
          </button>
          <button type="button" class="emp-btn-ghost ${activeCommunityTab === 'guilds' ? 'emp-btn-secondary' : ''}" data-community-tab="guilds">
            <i data-lucide="cpu"></i>
            <span>Guilds & Challenges</span>
          </button>
        </div>
      </div>

      <!-- TAB CONTENT PANELS -->
      ${renderCommunityTabContent(activeCommunityTab, qBanks, mockData, guilds, p)}
    </div>
  `;
}

function renderCommunityTabContent(tab, qBanks, mockData, guilds, p) {
  if (tab === 'questions') {
    return `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h3 style="font-size: 17px; font-weight: 800; color: var(--emp-text-primary); margin: 0;">Verified Technical Question Banks</h3>
            <p style="font-size: 13px; color: var(--emp-text-secondary); margin: 2px 0 0;">
              High-quality scenarios authored by verified engineers to test practical systems proficiency.
            </p>
          </div>
          <button type="button" class="emp-btn-primary emp-btn-sm" id="btnAuthorNewQInline">
            <i data-lucide="plus"></i>
            <span>New Question</span>
          </button>
        </div>

        <div class="emp-grid-auto">
          ${qBanks.map(qb => `
            <div class="emp-card emp-qb-card">
              <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;">
                <div>
                  <span class="emp-badge ${qb.createdByMe ? 'emp-badge-primary' : 'emp-badge-neutral'}">
                    ${qb.createdByMe ? 'Authored by You' : 'Guild Standard'}
                  </span>
                  <h4 style="font-size: 15.5px; font-weight: 750; color: var(--emp-text-primary); margin: 8px 0 2px; line-height: 1.35;">
                    ${esc(qb.title)}
                  </h4>
                  <small style="color: var(--emp-text-muted); font-size: 12px;">Target Skill: ${esc(qb.skill)} · Difficulty: ${esc(qb.difficulty)}</small>
                </div>
                <div class="emp-icon-box"><i data-lucide="file-check-2"></i></div>
              </div>

              <p style="font-size: 13px; color: var(--emp-text-secondary); margin: 6px 0; line-height: 1.45;">
                ${esc(qb.description)}
              </p>

              <!-- Stats row -->
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: var(--emp-soft); padding: 10px; border-radius: 10px; text-align: center;">
                <div>
                  <div style="font-size: 15px; font-weight: 800; color: var(--emp-text-primary);">${qb.totalAttempts}</div>
                  <div style="font-size: 10.5px; color: var(--emp-text-muted);">Attempts</div>
                </div>
                <div>
                  <div style="font-size: 15px; font-weight: 800; color: var(--emp-primary);">${qb.averageScore}%</div>
                  <div style="font-size: 10.5px; color: var(--emp-text-muted);">Avg Score</div>
                </div>
                <div>
                  <div style="font-size: 15px; font-weight: 800; color: var(--emp-success);">${qb.passRate}</div>
                  <div style="font-size: 10.5px; color: var(--emp-text-muted);">Pass Rate</div>
                </div>
              </div>

              <div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--emp-border-subtle); padding-top: 12px;">
                <span style="font-size: 11.5px; color: var(--emp-text-muted);">${qb.totalQuestions} Questions</span>
                <button type="button" class="emp-btn-secondary emp-btn-sm" onclick="alert('Viewing question items for: ${esc(qb.title)}');">
                  <span>Manage Questions</span>
                  <i data-lucide="chevron-right"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (tab === 'interviews') {
    return `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h3 style="font-size: 17px; font-weight: 800; color: var(--emp-text-primary); margin: 0;">Mock Technical Interview Sessions</h3>
            <p style="font-size: 13px; color: var(--emp-text-secondary); margin: 2px 0 0;">
              Conduct realistic 45-minute architectural problem-solving sessions for team peers.
            </p>
          </div>
          <button type="button" class="emp-btn-primary emp-btn-sm" id="btnAddSlotInline">
            <i data-lucide="plus"></i>
            <span>Add Availability Slot</span>
          </button>
        </div>

        <div class="emp-grid-2">
          <!-- Upcoming Sessions -->
          <div class="emp-card">
            <div class="emp-card-header">
              <div>
                <span class="emp-badge emp-badge-primary">Upcoming Bookings</span>
                <h4 class="emp-card-title" style="margin-top: 6px;">Confirmed Mock Sessions</h4>
              </div>
              <div class="emp-icon-box"><i data-lucide="video"></i></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${mockData.upcomingSessions.map(s => `
                <div style="background: var(--emp-soft); border: 1px solid var(--emp-border-subtle); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 6px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: var(--emp-text-primary); font-size: 14px;">${esc(s.menteeName)}</strong>
                    <span class="emp-badge emp-badge-success">${esc(s.status)}</span>
                  </div>
                  <div style="font-size: 12px; color: var(--emp-text-muted);">${esc(s.menteeRole)}</div>
                  <div style="font-size: 13px; color: var(--emp-text-secondary); margin-top: 4px;">
                    🎯 <strong>Focus:</strong> ${esc(s.focus)}
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 12px; color: var(--emp-primary); font-weight: 650;">
                    <span><i data-lucide="clock"></i> ${esc(s.date)} · ${esc(s.time)}</span>
                    <button type="button" class="emp-btn-secondary emp-btn-sm" onclick="alert('Joining virtual room...');">
                      <i data-lucide="video"></i>
                      <span>Join Room</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Open Slots -->
          <div class="emp-card">
            <div class="emp-card-header">
              <div>
                <span class="emp-badge emp-badge-success">Open Slots</span>
                <h4 class="emp-card-title" style="margin-top: 6px;">Slots Published on Guild Calendar</h4>
              </div>
              <div class="emp-icon-box emp-icon-box--success"><i data-lucide="calendar"></i></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${mockData.availableSlots.map(slot => `
                <div style="background: #FFFFFF; border: 1px solid var(--emp-border); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 6px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: var(--emp-text-primary); font-size: 14px;">${esc(slot.date)}</strong>
                    <span class="emp-badge emp-badge-primary">${esc(slot.status)}</span>
                  </div>
                  <div style="font-size: 12.5px; color: var(--emp-primary); font-weight: 650;">${esc(slot.time)}</div>
                  <div style="font-size: 13px; color: var(--emp-text-secondary); margin-top: 2px;">
                    ${esc(slot.format)} · ${esc(slot.focusArea)}
                  </div>
                  <div style="margin-top: 6px; display: flex; justify-content: flex-end;">
                    <button type="button" class="emp-btn-ghost emp-btn-sm" onclick="alert('Slot cancelled.');">
                      <i data-lucide="trash-2"></i>
                      <span>Withdraw Slot</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Feedback from past mock interviews -->
        <div class="emp-card">
          <h4 style="font-size: 15px; font-weight: 750; color: var(--emp-text-primary); margin: 0 0 14px;">
            Candidate Feedback on Your Mock Interviews
          </h4>
          <div class="emp-grid-2">
            ${mockData.recentFeedback.map(fb => `
              <div style="background: var(--emp-soft); border: 1px solid var(--emp-border-subtle); border-radius: 12px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <strong style="font-size: 13.5px; color: var(--emp-text-primary);">${esc(fb.mentee)}</strong>
                  <span style="color: var(--emp-attention); font-size: 13px; font-weight: 750;">★★★★★</span>
                </div>
                <div style="font-size: 11.5px; color: var(--emp-text-muted); margin-bottom: 6px;">${esc(fb.role)} · ${esc(fb.date)}</div>
                <p style="font-size: 12.5px; color: var(--emp-text-secondary); margin: 0; line-height: 1.45;">
                  "${esc(fb.comment)}"
                </p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  if (tab === 'mentorship') {
    return `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h3 style="font-size: 17px; font-weight: 800; color: var(--emp-text-primary); margin: 0;">Peer Technical Mentorship Network</h3>
            <p style="font-size: 13px; color: var(--emp-text-secondary); margin: 2px 0 0;">
              Managing active 1-on-1 mentorship pairings and discovering senior technical advisors.
            </p>
          </div>
          <button type="button" class="emp-btn-primary emp-btn-sm" onclick="alert('Mentorship intake capacity set to 3 weekly slots.');">
            <i data-lucide="user-plus"></i>
            <span>Adjust Mentorship Capacity</span>
          </button>
        </div>

        <div class="emp-grid-2">
          <!-- Active Mentees -->
          <div class="emp-card">
            <div class="emp-card-header">
              <div>
                <span class="emp-badge emp-badge-primary">Your Mentees</span>
                <h4 class="emp-card-title" style="margin-top: 6px;">Engineers You Are Mentoring (${p.menteesCount})</h4>
              </div>
              <div class="emp-icon-box"><i data-lucide="users"></i></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--emp-soft); border-radius: 10px; border: 1px solid var(--emp-border-subtle);">
                <div>
                  <strong style="font-size: 13.5px; color: var(--emp-text-primary);">Kavita Nair</strong>
                  <div style="font-size: 12px; color: var(--emp-text-muted);">Associate ML Engineer · Goal: PyTorch DDP Mastery</div>
                </div>
                <button type="button" class="emp-btn-secondary emp-btn-sm" onclick="alert('Opening notes for Kavita Nair');">Notes</button>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--emp-soft); border-radius: 10px; border: 1px solid var(--emp-border-subtle);">
                <div>
                  <strong style="font-size: 13.5px; color: var(--emp-text-primary);">Rohan Mehra</strong>
                  <div style="font-size: 12px; color: var(--emp-text-muted);">Backend Engineer · Goal: Triton Model Serving Transition</div>
                </div>
                <button type="button" class="emp-btn-secondary emp-btn-sm" onclick="alert('Opening notes for Rohan Mehra');">Notes</button>
              </div>
            </div>
          </div>

          <!-- Your Advisor -->
          <div class="emp-card">
            <div class="emp-card-header">
              <div>
                <span class="emp-badge emp-badge-success">Your Advisor</span>
                <h4 class="emp-card-title" style="margin-top: 6px;">Senior Technical Advisor</h4>
              </div>
              <div class="emp-icon-box emp-icon-box--success"><i data-lucide="shield-check"></i></div>
            </div>
            <div style="background: var(--emp-soft); border: 1px solid var(--emp-border-subtle); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: #1823A8; color: #FFF; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 16px;">DC</div>
                <div>
                  <strong style="font-size: 15px; color: var(--emp-text-primary);">${esc(p.mentor)}</strong>
                  <div style="font-size: 12px; color: var(--emp-text-muted);">Distinguished Systems Architect · 8 Years Tenure</div>
                </div>
              </div>
              <p style="font-size: 13px; color: var(--emp-text-secondary); margin: 6px 0 0; line-height: 1.45;">
                Bi-weekly sync on CUDA kernel profiling progress and architectural sign-off for L5 promotion portfolio.
              </p>
              <div style="margin-top: 8px; display: flex; justify-content: flex-end;">
                <button type="button" class="emp-btn-primary emp-btn-sm" onclick="alert('Scheduling next advisory 1-on-1...');">
                  <i data-lucide="calendar"></i>
                  <span>Schedule 1-on-1</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Guilds tab
  return `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: var(--emp-text-primary); margin: 0;">Technical Guilds & Special Interest Groups</h3>
          <p style="font-size: 13px; color: var(--emp-text-secondary); margin: 2px 0 0;">
            Connect with domain guilds, read architectural RFCs, and join regional hackathons.
          </p>
        </div>
      </div>

      <div class="emp-grid-2">
        ${guilds.map(g => `
          <div class="emp-card">
            <div class="emp-card-header">
              <div>
                <span class="emp-badge emp-badge-primary">${esc(g.type)}</span>
                <h4 class="emp-card-title" style="margin-top: 6px;">${esc(g.name)}</h4>
                <small style="color: var(--emp-text-muted); font-size: 12px;">${g.membersCount} Members · Your Role: ${esc(g.myRole || 'Member')}</small>
              </div>
              <div class="emp-icon-box"><i data-lucide="${esc(g.icon)}"></i></div>
            </div>
            <div style="background: var(--emp-soft); border-radius: 10px; padding: 12px; border: 1px solid var(--emp-border-subtle); margin: 4px 0 12px;">
              <div style="font-size: 11px; font-weight: 750; color: var(--emp-primary); text-transform: uppercase;">Active Guild Discussion:</div>
              <div style="font-size: 13px; font-weight: 650; color: var(--emp-text-primary); margin-top: 2px;">
                "${esc(g.activeTopic)}"
              </div>
              <div style="font-size: 11px; color: var(--emp-text-muted); margin-top: 4px;">Last activity: ${esc(g.lastActivity)}</div>
            </div>
            <div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between;">
              <span class="emp-badge emp-badge-success">Joined ✓</span>
              <button type="button" class="emp-btn-secondary emp-btn-sm" onclick="alert('Opening discussions for: ${esc(g.name)}');">
                <span>View Discussions</span>
                <i data-lucide="chevron-right"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function bindEmployeeCommunityEvents(rerender) {
  // Tab buttons
  document.querySelectorAll('[data-community-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCommunityTab = btn.dataset.communityTab;
      rerender();
    });
  });

  // Author Question Modal
  const authorBtns = [document.querySelector('#btnAuthorQuestionModal'), document.querySelector('#btnAuthorNewQInline')];
  authorBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        openEmployeeModal({
          title: 'Author New Question Bank Item',
          subtitle: 'Create practical technical assessment scenarios and earn +25 Reputation Points',
          badge: '+25 Rep Points',
          contentHtml: `
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <label style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 650;">
                Target Competency
                <select style="padding: 10px; border: 1px solid var(--emp-border); border-radius: 10px;">
                  <option>Python Asynchronous Concurrency</option>
                  <option>PyTorch Distributed Data Parallel (DDP)</option>
                  <option>TensorRT Optimization & Triton Serving</option>
                  <option>CUDA Kernel Memory Coalescing</option>
                </select>
              </label>
              <label style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 650;">
                Question Title
                <input type="text" placeholder="e.g. Mitigating NVLink Ring Latency on 64-Node DDP" style="padding: 10px; border: 1px solid var(--emp-border); border-radius: 10px;" />
              </label>
              <label style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 650;">
                Code Scenario & Test Cases
                <textarea rows="4" placeholder="Provide reproducing code snippet and verification test assertions..." style="padding: 10px; border: 1px solid var(--emp-border); border-radius: 10px; resize: vertical;"></textarea>
              </label>
            </div>
          `,
          footerHtml: `
            <button type="button" class="emp-btn-ghost" onclick="document.getElementById('empModalCloseBtn').click()">Cancel</button>
            <button type="button" class="emp-btn-primary" onclick="alert('Question successfully published to peer review!'); document.getElementById('empModalCloseBtn').click();">
              <span>Publish Question</span>
            </button>
          `
        });
      });
    }
  });

  // Add Mock Slot Modal
  const mockSlotBtns = [document.querySelector('#btnAddMockSlotModal'), document.querySelector('#btnAddSlotInline')];
  mockSlotBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        openEmployeeModal({
          title: 'Offer Mock Technical Interview Slot',
          subtitle: 'Open availability for peer technical coaching',
          badge: 'Peer Coaching',
          contentHtml: `
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <label style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 650;">
                Interview Focus Area
                <select style="padding: 10px; border: 1px solid var(--emp-border); border-radius: 10px;">
                  <option>Distributed ML Architecture & Inference</option>
                  <option>Python Concurrency & Async Optimization</option>
                  <option>PyTorch Dynamic Graph Profiling</option>
                </select>
              </label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <label style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 650;">
                  Date
                  <input type="date" value="2026-10-02" style="padding: 10px; border: 1px solid var(--emp-border); border-radius: 10px;" />
                </label>
                <label style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 650;">
                  Time Slot
                  <input type="text" value="6:00 PM — 6:45 PM IST" style="padding: 10px; border: 1px solid var(--emp-border); border-radius: 10px;" />
                </label>
              </div>
            </div>
          `,
          footerHtml: `
            <button type="button" class="emp-btn-ghost" onclick="document.getElementById('empModalCloseBtn').click()">Cancel</button>
            <button type="button" class="emp-btn-primary" onclick="alert('Mock interview slot added to calendar!'); document.getElementById('empModalCloseBtn').click();">
              <span>Publish Slot</span>
            </button>
          `
        });
      });
    }
  });
}
