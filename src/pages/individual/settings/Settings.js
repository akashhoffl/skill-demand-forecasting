/**
 * TalentScope.ai - Dedicated Settings Page
 * Full configuration for account, career matching, notifications, privacy, AI, and security
 */

const SETTINGS_STORAGE_KEY = 'talentscope-user-settings-v1';

const defaultSettings = {
  activeTab: 'account',
  account: {
    fullName: 'Arun Sharma',
    email: 'arun.sharma@example.com',
    username: 'arun_sharma',
    timezone: 'Asia/Kolkata (IST, UTC+5:30)',
    language: 'English (US)',
    bio: 'Lead AI/ML Developer specializing in high-throughput LLM pipelines, RAG systems, and autonomous agent orchestration.'
  },
  career: {
    targetRole: 'Principal Applied AI Engineer',
    workPreference: 'Remote / Hybrid',
    targetComp: '₹45L - ₹60L / $145,000+',
    geography: 'India, Remote Worldwide, US West Coast',
    relocate: true,
    recruiterContact: true
  },
  notifications: {
    marketSurge: true,
    benchmarkAlerts: true,
    learningReminders: true,
    recruiterViews: true,
    communityMentions: true,
    weeklyDigest: false,
    frequency: 'instant'
  },
  privacy: {
    discoveryMode: 'public', // 'public', 'anonymous', 'private'
    showSalary: false,
    allowAiIndexing: true,
    allowTelemetry: true
  },
  ai: {
    personaStyle: 'technical', // 'technical', 'advisory', 'concise'
    autoRoadmapTune: true,
    includeGitRepos: true,
    includeAssessments: true
  },
  security: {
    twoFactorEnabled: true,
    activeSessions: [
      { device: 'MacBook Pro 16" (Chrome 128)', ip: '49.207.214.12', location: 'Bengaluru, India', current: true },
      { device: 'iPhone 15 Pro (Safari)', ip: '49.207.214.12', location: 'Bengaluru, India', current: false }
    ]
  }
};

function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...defaultSettings };
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch (e) {
    return { ...defaultSettings };
  }
}

function saveSettings(data) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

let activeSettings = getSettings();
let rootContainer = null;
let currentActions = {};

export function renderSettingsPage({ context = {}, actions = {} } = {}) {
  currentActions = actions;
  rootContainer = document.getElementById('mainContent');
  if (!rootContainer) return;

  drawSettings();
}

function drawSettings() {
  if (!rootContainer) return;

  rootContainer.innerHTML = `
    <div class="ts-settings-page">
      <!-- Header -->
      <section class="settings-header-card" aria-label="Settings Header">
        <div class="settings-title-group">
          <h1>Account & System Settings</h1>
          <p>Configure personal details, intelligence preferences, alerts, and security controls</p>
        </div>
      </section>

      <!-- Settings Layout -->
      <div class="settings-grid">
        <!-- Left Navigation -->
        <nav class="settings-nav-card" role="tablist" aria-label="Settings Navigation">
          <button type="button" class="settings-nav-item ${activeSettings.activeTab === 'account' ? 'is-active' : ''}" data-tab="account">
            <i data-lucide="user"></i>
            <span>Account & Profile</span>
          </button>
          <button type="button" class="settings-nav-item ${activeSettings.activeTab === 'career' ? 'is-active' : ''}" data-tab="career">
            <i data-lucide="briefcase"></i>
            <span>Career Preferences</span>
          </button>
          <button type="button" class="settings-nav-item ${activeSettings.activeTab === 'notifications' ? 'is-active' : ''}" data-tab="notifications">
            <i data-lucide="bell"></i>
            <span>Notifications & Alerts</span>
          </button>
          <button type="button" class="settings-nav-item ${activeSettings.activeTab === 'privacy' ? 'is-active' : ''}" data-tab="privacy">
            <i data-lucide="shield"></i>
            <span>Privacy & Visibility</span>
          </button>
          <button type="button" class="settings-nav-item ${activeSettings.activeTab === 'ai' ? 'is-active' : ''}" data-tab="ai">
            <i data-lucide="sparkles"></i>
            <span>AI & Personalization</span>
          </button>
          <button type="button" class="settings-nav-item ${activeSettings.activeTab === 'security' ? 'is-active' : ''}" data-tab="security">
            <i data-lucide="lock"></i>
            <span>Security & Auth</span>
          </button>
          <button type="button" class="settings-nav-item ${activeSettings.activeTab === 'data' ? 'is-active' : ''}" data-tab="data">
            <i data-lucide="database"></i>
            <span>Data & Exports</span>
          </button>
        </nav>

        <!-- Right Content Pane -->
        <div class="settings-content-card">
          ${renderTabContent(activeSettings.activeTab)}
        </div>
      </div>
    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  attachListeners();
}

function renderTabContent(tab) {
  if (tab === 'career') {
    const c = activeSettings.career;
    return `
      <div class="settings-section-head">
        <div>
          <h2>Career & Opportunity Matching</h2>
          <p>Control the criteria TalentScope uses to match your skills with job openings</p>
        </div>
      </div>

      <div class="settings-form-grid">
        <div class="settings-field">
          <label for="cfgTargetRole">Target Role</label>
          <input type="text" id="cfgTargetRole" value="${c.targetRole}" />
        </div>
        <div class="settings-field">
          <label for="cfgWorkPref">Work Arrangement</label>
          <select id="cfgWorkPref">
            <option value="Remote / Hybrid" ${c.workPreference === 'Remote / Hybrid' ? 'selected' : ''}>Remote / Hybrid</option>
            <option value="Remote Only" ${c.workPreference === 'Remote Only' ? 'selected' : ''}>Remote Only</option>
            <option value="Onsite Preferred" ${c.workPreference === 'Onsite Preferred' ? 'selected' : ''}>Onsite Preferred</option>
          </select>
        </div>
        <div class="settings-field">
          <label for="cfgTargetComp">Target Compensation Band</label>
          <input type="text" id="cfgTargetComp" value="${c.targetComp}" />
        </div>
        <div class="settings-field">
          <label for="cfgGeography">Preferred Markets & Regions</label>
          <input type="text" id="cfgGeography" value="${c.geography}" />
        </div>
        <div class="settings-field full-width">
          <div class="settings-toggle-row">
            <div class="settings-toggle-info">
              <strong>Open to Global Relocation</strong>
              <span>Show opportunities that offer international sponsorship or relocation support</span>
            </div>
            <label class="switch-box">
              <input type="checkbox" id="cfgRelocate" ${c.relocate ? 'checked' : ''} />
              <span class="switch-slider"></span>
            </label>
          </div>
          <div class="settings-toggle-row">
            <div class="settings-toggle-info">
              <strong>Direct Recruiter Inquiries</strong>
              <span>Allow vetted tech companies to contact you directly based on skill benchmarks</span>
            </div>
            <label class="switch-box">
              <input type="checkbox" id="cfgRecruiterContact" ${c.recruiterContact ? 'checked' : ''} />
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-footer-actions">
        <button type="button" class="btn-settings-primary" id="btnSaveCareer">Save Career Preferences</button>
      </div>
    `;
  }

  if (tab === 'notifications') {
    const n = activeSettings.notifications;
    return `
      <div class="settings-section-head">
        <div>
          <h2>Notifications & Intelligence Alerts</h2>
          <p>Choose which market movements and learning events notify you</p>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div class="settings-toggle-row">
          <div class="settings-toggle-info">
            <strong>Market Demand Surge Alerts</strong>
            <span>Notify when skills in your profile experience >15% demand spikes</span>
          </div>
          <label class="switch-box">
            <input type="checkbox" id="cfgNotifMarket" ${n.marketSurge ? 'checked' : ''} />
            <span class="switch-slider"></span>
          </label>
        </div>

        <div class="settings-toggle-row">
          <div class="settings-toggle-info">
            <strong>Benchmark & Skill Refresh Reminders</strong>
            <span>Alert when a new version of a skill benchmark is released</span>
          </div>
          <label class="switch-box">
            <input type="checkbox" id="cfgNotifBenchmark" ${n.benchmarkAlerts ? 'checked' : ''} />
            <span class="switch-slider"></span>
          </label>
        </div>

        <div class="settings-toggle-row">
          <div class="settings-toggle-info">
            <strong>Learning Roadmap Milestones & Streaks</strong>
            <span>Daily progress nudges and active streak maintenance notifications</span>
          </div>
          <label class="switch-box">
            <input type="checkbox" id="cfgNotifLearning" ${n.learningReminders ? 'checked' : ''} />
            <span class="switch-slider"></span>
          </label>
        </div>

        <div class="settings-toggle-row">
          <div class="settings-toggle-info">
            <strong>Recruiter & Employer Profile Signals</strong>
            <span>Notify when an employer inspects your verified capability telemetry</span>
          </div>
          <label class="switch-box">
            <input type="checkbox" id="cfgNotifRecruiter" ${n.recruiterViews ? 'checked' : ''} />
            <span class="switch-slider"></span>
          </label>
        </div>

        <div class="settings-toggle-row">
          <div class="settings-toggle-info">
            <strong>Community Replies & Mentions</strong>
            <span>Notify when members respond to your questions or collaborative projects</span>
          </div>
          <label class="switch-box">
            <input type="checkbox" id="cfgNotifCommunity" ${n.communityMentions ? 'checked' : ''} />
            <span class="switch-slider"></span>
          </label>
        </div>

        <div class="settings-toggle-row">
          <div class="settings-toggle-info">
            <strong>Weekly Executive Intelligence Brief</strong>
            <span>Curated summary of macro AI shifts, compensation benchmarks, and hiring volume</span>
          </div>
          <label class="switch-box">
            <input type="checkbox" id="cfgNotifWeekly" ${n.weeklyDigest ? 'checked' : ''} />
            <span class="switch-slider"></span>
          </label>
        </div>
      </div>

      <div class="settings-footer-actions">
        <button type="button" class="btn-settings-primary" id="btnSaveNotifs">Save Notification Settings</button>
      </div>
    `;
  }

  if (tab === 'privacy') {
    const p = activeSettings.privacy;
    return `
      <div class="settings-section-head">
        <div>
          <h2>Privacy & Signal Visibility</h2>
          <p>Control what recruiters and platform algorithms can see about your profile</p>
        </div>
      </div>

      <div class="settings-form-grid">
        <div class="settings-field full-width">
          <label for="cfgDiscoveryMode">Profile Visibility Mode</label>
          <select id="cfgDiscoveryMode">
            <option value="public" ${p.discoveryMode === 'public' ? 'selected' : ''}>Public to Verified Employers (Recommended)</option>
            <option value="anonymous" ${p.discoveryMode === 'anonymous' ? 'selected' : ''}>Anonymous Capability Signal (Stealth Mode)</option>
            <option value="private" ${p.discoveryMode === 'private' ? 'selected' : ''}>Private (Only visible to you)</option>
          </select>
          <p class="settings-hint">Stealth mode obscures your current employer and name while showcasing your verified benchmark scores.</p>
        </div>

        <div class="settings-field full-width">
          <div class="settings-toggle-row">
            <div class="settings-toggle-info">
              <strong>Allow AI Matching Algorithms to Index Capability Profile</strong>
              <span>Permits high-precision matching models to suggest your profile for role openings</span>
            </div>
            <label class="switch-box">
              <input type="checkbox" id="cfgAiIndexing" ${p.allowAiIndexing ? 'checked' : ''} />
              <span class="switch-slider"></span>
            </label>
          </div>
          <div class="settings-toggle-row">
            <div class="settings-toggle-info">
              <strong>Contribute Anonymized Assessment Telemetry to Market Benchmarks</strong>
              <span>Helps calibrate global score distributions without exposing identity</span>
            </div>
            <label class="switch-box">
              <input type="checkbox" id="cfgTelemetry" ${p.allowTelemetry ? 'checked' : ''} />
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-footer-actions">
        <button type="button" class="btn-settings-primary" id="btnSavePrivacy">Save Privacy Settings</button>
      </div>
    `;
  }

  if (tab === 'ai') {
    const a = activeSettings.ai;
    return `
      <div class="settings-section-head">
        <div>
          <h2>AI Assistant & Personalization</h2>
          <p>Fine-tune how the AI assistant interprets your career goals and delivers analysis</p>
        </div>
      </div>

      <div class="settings-form-grid">
        <div class="settings-field full-width">
          <label for="cfgPersona">AI Interaction Depth</label>
          <select id="cfgPersona">
            <option value="technical" ${a.personaStyle === 'technical' ? 'selected' : ''}>Technical Deep Dive (Architectural analysis, code, mathematical reasoning)</option>
            <option value="advisory" ${a.personaStyle === 'advisory' ? 'selected' : ''}>Strategic Career Advisory (Market demand, timing, compensation)</option>
            <option value="concise" ${a.personaStyle === 'concise' ? 'selected' : ''}>Concise & Direct (Brief bullets, high-signal summaries)</option>
          </select>
        </div>

        <div class="settings-field full-width">
          <div class="settings-toggle-row">
            <div class="settings-toggle-info">
              <strong>Dynamic Roadmap Adaptation</strong>
              <span>Automatically recommend roadmap modules based on weekly hiring shifts</span>
            </div>
            <label class="switch-box">
              <input type="checkbox" id="cfgAutoRoadmap" ${a.autoRoadmapTune ? 'checked' : ''} />
              <span class="switch-slider"></span>
            </label>
          </div>
          <div class="settings-toggle-row">
            <div class="settings-toggle-info">
              <strong>Include GitHub Activity in Capability Analysis</strong>
              <span>Derive code complexity signals from connected repositories</span>
            </div>
            <label class="switch-box">
              <input type="checkbox" id="cfgGitRepos" ${a.includeGitRepos ? 'checked' : ''} />
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-footer-actions">
        <button type="button" class="btn-settings-primary" id="btnSaveAI">Save AI Preferences</button>
      </div>
    `;
  }

  if (tab === 'security') {
    return `
      <div class="settings-section-head">
        <div>
          <h2>Security & Authentication</h2>
          <p>Manage credentials, two-factor authentication, and active sessions</p>
        </div>
      </div>

      <div class="settings-form-grid">
        <div class="settings-field">
          <label for="cfgCurPass">Current Password</label>
          <input type="password" id="cfgCurPass" placeholder="••••••••••••" />
        </div>
        <div class="settings-field">
          <label for="cfgNewPass">New Password</label>
          <input type="password" id="cfgNewPass" placeholder="Minimum 10 characters" />
        </div>
      </div>

      <div style="margin-top: 10px;">
        <button type="button" class="btn-settings-secondary" id="btnChangePassword">
          <i data-lucide="key"></i> Update Password
        </button>
      </div>

      <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #F1ECF5;">
        <h3 style="font-size: 16px; margin: 0 0 12px 0;">Active Login Sessions</h3>
        <table class="sessions-table">
          <thead>
            <tr>
              <th>Device / Browser</th>
              <th>IP Address</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MacBook Pro 16" (Chrome 128)</td>
              <td>49.207.214.12</td>
              <td>Bengaluru, India</td>
              <td><span style="color: #10B981; font-weight: 700;">Active Now</span></td>
            </tr>
            <tr>
              <td>iPhone 15 Pro (Safari)</td>
              <td>49.207.214.12</td>
              <td>Bengaluru, India</td>
              <td><span style="color: #796B88;">2 days ago</span></td>
            </tr>
          </tbody>
        </table>
        <button type="button" class="btn-settings-secondary" id="btnRevokeSessions" style="margin-top: 14px;">
          Revoke Other Sessions
        </button>
      </div>
    `;
  }

  if (tab === 'data') {
    return `
      <div class="settings-section-head">
        <div>
          <h2>Data Portability & Account Zone</h2>
          <p>Download full copies of your assessment records or permanently close your account</p>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div class="target-stat-tile" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div>
            <h4 style="margin: 0 0 4px 0; font-size: 15px; color: #1a1126;">Export Full TalentScope Profile (JSON)</h4>
            <p style="margin: 0; font-size: 13px; color: #6E6277;">Includes all verified skills, roadmaps, benchmark percentiles, and activity logs.</p>
          </div>
          <button type="button" class="btn-settings-secondary" id="btnExportData">
            <i data-lucide="download"></i> Export Data
          </button>
        </div>

        <div class="target-stat-tile" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div>
            <h4 style="margin: 0 0 4px 0; font-size: 15px; color: #1a1126;">Download Verified Skills Transcript (PDF)</h4>
            <p style="margin: 0; font-size: 13px; color: #6E6277;">Official verifiable PDF containing credentials and cryptographic verification links.</p>
          </div>
          <button type="button" class="btn-settings-secondary" id="btnDownloadTranscript">
            <i data-lucide="file-text"></i> Download Transcript
          </button>
        </div>

        <!-- Danger Zone -->
        <div class="danger-zone-box">
          <div class="danger-zone-info">
            <h4>Delete Account & Erase Telemetry</h4>
            <p>Once deleted, all assessment records, benchmark standings, and custom learning plans cannot be recovered.</p>
          </div>
          <button type="button" class="btn-settings-secondary btn-danger" id="btnDeleteAccount">
            <i data-lucide="trash-2"></i> Delete Account
          </button>
        </div>
      </div>
    `;
  }

  // Default: Account Tab
  const acc = activeSettings.account;
  return `
    <div class="settings-section-head">
      <div>
        <h2>Account & Profile Information</h2>
        <p>Manage basic personal identity details across the TalentScope portal</p>
      </div>
    </div>

    <div class="settings-form-grid">
      <div class="settings-field">
        <label for="cfgFullName">Full Name</label>
        <input type="text" id="cfgFullName" value="${acc.fullName}" />
      </div>
      <div class="settings-field">
        <label for="cfgUsername">Username</label>
        <input type="text" id="cfgUsername" value="${acc.username}" />
      </div>
      <div class="settings-field">
        <label for="cfgEmail">Primary Email</label>
        <input type="email" id="cfgEmail" value="${acc.email}" />
      </div>
      <div class="settings-field">
        <label for="cfgTimezone">Timezone</label>
        <input type="text" id="cfgTimezone" value="${acc.timezone}" />
      </div>
      <div class="settings-field full-width">
        <label for="cfgLanguage">Interface Language</label>
        <select id="cfgLanguage">
          <option value="English (US)" ${acc.language === 'English (US)' ? 'selected' : ''}>English (US)</option>
          <option value="English (UK)" ${acc.language === 'English (UK)' ? 'selected' : ''}>English (UK)</option>
          <option value="Spanish" ${acc.language === 'Spanish' ? 'selected' : ''}>Spanish</option>
          <option value="German" ${acc.language === 'German' ? 'selected' : ''}>German</option>
        </select>
      </div>
      <div class="settings-field full-width">
        <label for="cfgBio">Public Bio</label>
        <textarea id="cfgBio" rows="3">${acc.bio}</textarea>
      </div>
    </div>

    <div class="settings-footer-actions">
      <button type="button" class="btn-settings-primary" id="btnSaveAccount">Save Account Settings</button>
    </div>
  `;
}

function attachListeners() {
  // Navigation tabs
  document.querySelectorAll('.settings-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) {
        activeSettings.activeTab = tab;
        drawSettings();
      }
    });
  });

  // Save Account
  document.getElementById('btnSaveAccount')?.addEventListener('click', () => {
    const fn = document.getElementById('cfgFullName')?.value?.trim();
    const un = document.getElementById('cfgUsername')?.value?.trim();
    const em = document.getElementById('cfgEmail')?.value?.trim();
    const tz = document.getElementById('cfgTimezone')?.value?.trim();
    const lg = document.getElementById('cfgLanguage')?.value;
    const bio = document.getElementById('cfgBio')?.value?.trim();

    if (fn) activeSettings.account.fullName = fn;
    if (un) activeSettings.account.username = un;
    if (em) activeSettings.account.email = em;
    if (tz) activeSettings.account.timezone = tz;
    if (lg) activeSettings.account.language = lg;
    if (bio) activeSettings.account.bio = bio;

    saveSettings(activeSettings);
    showToast('Account details saved successfully');
  });

  // Save Career
  document.getElementById('btnSaveCareer')?.addEventListener('click', () => {
    const tr = document.getElementById('cfgTargetRole')?.value?.trim();
    const wp = document.getElementById('cfgWorkPref')?.value;
    const tc = document.getElementById('cfgTargetComp')?.value?.trim();
    const geo = document.getElementById('cfgGeography')?.value?.trim();
    const rel = document.getElementById('cfgRelocate')?.checked;
    const rc = document.getElementById('cfgRecruiterContact')?.checked;

    if (tr) activeSettings.career.targetRole = tr;
    if (wp) activeSettings.career.workPreference = wp;
    if (tc) activeSettings.career.targetComp = tc;
    if (geo) activeSettings.career.geography = geo;
    activeSettings.career.relocate = Boolean(rel);
    activeSettings.career.recruiterContact = Boolean(rc);

    saveSettings(activeSettings);
    showToast('Career matching criteria saved');
  });

  // Save Notifications
  document.getElementById('btnSaveNotifs')?.addEventListener('click', () => {
    activeSettings.notifications.marketSurge = Boolean(document.getElementById('cfgNotifMarket')?.checked);
    activeSettings.notifications.benchmarkAlerts = Boolean(document.getElementById('cfgNotifBenchmark')?.checked);
    activeSettings.notifications.learningReminders = Boolean(document.getElementById('cfgNotifLearning')?.checked);
    activeSettings.notifications.recruiterViews = Boolean(document.getElementById('cfgNotifRecruiter')?.checked);
    activeSettings.notifications.communityMentions = Boolean(document.getElementById('cfgNotifCommunity')?.checked);
    activeSettings.notifications.weeklyDigest = Boolean(document.getElementById('cfgNotifWeekly')?.checked);

    saveSettings(activeSettings);
    showToast('Notification preferences saved');
  });

  // Save Privacy
  document.getElementById('btnSavePrivacy')?.addEventListener('click', () => {
    const dm = document.getElementById('cfgDiscoveryMode')?.value;
    if (dm) activeSettings.privacy.discoveryMode = dm;
    activeSettings.privacy.allowAiIndexing = Boolean(document.getElementById('cfgAiIndexing')?.checked);
    activeSettings.privacy.allowTelemetry = Boolean(document.getElementById('cfgTelemetry')?.checked);

    saveSettings(activeSettings);
    showToast('Privacy & discovery settings updated');
  });

  // Save AI
  document.getElementById('btnSaveAI')?.addEventListener('click', () => {
    const persona = document.getElementById('cfgPersona')?.value;
    if (persona) activeSettings.ai.personaStyle = persona;
    activeSettings.ai.autoRoadmapTune = Boolean(document.getElementById('cfgAutoRoadmap')?.checked);
    activeSettings.ai.includeGitRepos = Boolean(document.getElementById('cfgGitRepos')?.checked);

    saveSettings(activeSettings);
    showToast('AI Assistant preferences saved');
  });

  // Password update
  document.getElementById('btnChangePassword')?.addEventListener('click', () => {
    const cur = document.getElementById('cfgCurPass')?.value;
    const n = document.getElementById('cfgNewPass')?.value;
    if (!cur || !n) {
      alert('Please fill out both current and new password fields.');
      return;
    }
    showToast('Password updated successfully');
    document.getElementById('cfgCurPass').value = '';
    document.getElementById('cfgNewPass').value = '';
  });

  // Revoke sessions
  document.getElementById('btnRevokeSessions')?.addEventListener('click', () => {
    showToast('All other sessions revoked');
  });

  // Export Data JSON
  document.getElementById('btnExportData')?.addEventListener('click', () => {
    const jsonStr = JSON.stringify(activeSettings, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talentscope-profile-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Profile data export downloaded');
  });

  // Download Transcript PDF stub
  document.getElementById('btnDownloadTranscript')?.addEventListener('click', () => {
    showToast('Generating signed skills transcript PDF...');
    setTimeout(() => {
      showToast('Transcript downloaded');
    }, 1500);
  });

  // Delete account confirmation
  document.getElementById('btnDeleteAccount')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      showToast('Account scheduled for deactivation.');
    }
  });
}

function showToast(message) {
  const existing = document.querySelector('.ts-toast-banner');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'ts-toast-banner';
  toast.innerHTML = `<i data-lucide="check-circle" style="color: #10B981; width: 18px; height: 18px;"></i> <span>${message}</span>`;
  document.body.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
