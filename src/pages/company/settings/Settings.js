// ============================================================================
// TALENTSCOPE.AI — COMPANY ENTERPRISE SETTINGS
// Technical System Settings: Security, Sync Intervals, Alerts & Portal Shortcuts (#874FFF)
// Kept strictly technical and separate from workforce intelligence
// ============================================================================

import { companyProfile } from '../../../data/company/company-data.js';

const esc = str => String(str ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);

export function renderCompanySettings() {
  const p = companyProfile;

  return `
    <div class="company-page company-settings">
      <!-- 1. HERO -->
      <section class="cmp-hero">
        <div class="cmp-hero__content">
          <div class="cmp-hero__greeting">
            <span class="cmp-eyebrow">
              <i data-lucide="settings-2" class="cmp-icon-inline"></i>
              SYSTEM CONFIGURATION
            </span>
            <h1>Enterprise Settings & System Preferences</h1>
            <p>Configure automated sync frequencies, alert thresholds, workspace security, and cross-portal shortcuts.</p>
          </div>

          <div class="cmp-hero__context-badge">
            <div class="cmp-hero__company-logo">${esc(p.logoInitials)}</div>
            <div class="cmp-hero__context-info">
              <strong>${esc(p.name)}</strong>
              <span>Technical Settings Console</span>
              <div class="cmp-hero__context-meta">
                <span><i data-lucide="shield-check"></i> SOC-2 Enforced</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. TECHNICAL SETTINGS PANELS (Section 23) -->
      <section class="cmp-section">
        <div class="cmp-card" style="display: flex; flex-direction: column; gap: 22px;">
          <!-- 1. Notification & Alert Thresholds -->
          <div>
            <h3 style="font-size: 16px; font-weight: 850; color: var(--cmp-text-primary); margin: 0 0 4px;">Automated Alert Thresholds</h3>
            <p style="font-size: 12.5px; color: var(--cmp-text-secondary); margin: 0 0 12px;">Trigger automated alerts when organizational skill gaps exceed defined limits.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
              <div style="background: var(--cmp-very-light); padding: 14px; border-radius: 8px; border: 1px solid var(--cmp-border);">
                <label style="font-size: 12px; font-weight: 700; color: var(--cmp-text-primary); display: block; margin-bottom: 4px;">Critical Gap Threshold</label>
                <select style="width: 100%; height: 36px; border-radius: 6px; border: 1px solid var(--cmp-border); background: #FFF; font-size: 13px; padding: 0 8px;">
                  <option selected>&gt; 15% Skill Deficit (High Urgency)</option>
                  <option>&gt; 20% Skill Deficit</option>
                  <option>&gt; 25% Skill Deficit</option>
                </select>
              </div>

              <div style="background: var(--cmp-very-light); padding: 14px; border-radius: 8px; border: 1px solid var(--cmp-border);">
                <label style="font-size: 12px; font-weight: 700; color: var(--cmp-text-primary); display: block; margin-bottom: 4px;">Recruitment Cost Modeling Baseline</label>
                <select style="width: 100%; height: 36px; border-radius: 6px; border: 1px solid var(--cmp-border); background: #FFF; font-size: 13px; padding: 0 8px;">
                  <option selected>25% of First Year Base Salary</option>
                  <option>20% of First Year Base Salary</option>
                  <option>30% of First Year Base Salary</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 2. Security & SSO -->
          <div style="padding-top: 16px; border-top: 1px solid var(--cmp-border);">
            <h3 style="font-size: 16px; font-weight: 850; color: var(--cmp-text-primary); margin: 0 0 4px;">Workspace Security & Authentication</h3>
            <p style="font-size: 12.5px; color: var(--cmp-text-secondary); margin: 0 0 12px;">Enforce SAML 2.0 single sign-on and biometric verification for authorized administrators.</p>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: var(--cmp-very-light); border-radius: 8px; border: 1px solid var(--cmp-border);">
                <div>
                  <strong style="font-size: 13px; color: var(--cmp-text-primary); display: block;">Enforce NVIDIA Enterprise Okta SSO</strong>
                  <span style="font-size: 12px; color: var(--cmp-text-secondary);">Require all executive administrators to authenticate via corporate identity provider.</span>
                </div>
                <input type="checkbox" checked style="width: 18px; height: 18px; accent-color: var(--cmp-primary);" />
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: var(--cmp-very-light); border-radius: 8px; border: 1px solid var(--cmp-border);">
                <div>
                  <strong style="font-size: 13px; color: var(--cmp-text-primary); display: block;">Session Inactivity Timeout (30 Mins)</strong>
                  <span style="font-size: 12px; color: var(--cmp-text-secondary);">Automatically lock confidential workforce compensation and planning views when idle.</span>
                </div>
                <input type="checkbox" checked style="width: 18px; height: 18px; accent-color: var(--cmp-primary);" />
              </div>
            </div>
          </div>

          <!-- 3. Portal Switcher Shortcuts -->
          <div style="padding-top: 16px; border-top: 1px solid var(--cmp-border);">
            <h3 style="font-size: 16px; font-weight: 850; color: var(--cmp-text-primary); margin: 0 0 4px;">Portal Navigation Shortcuts</h3>
            <p style="font-size: 12.5px; color: var(--cmp-text-secondary); margin: 0 0 12px;">Switch seamlessly between individual market exploration, employee workforce view, and company executive planning.</p>

            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <a href="#/individual/home" class="cmp-btn-secondary" style="height: 36px; padding: 0 14px; font-size: 12.5px;">
                <i data-lucide="user"></i>
                <span>Switch to Individual Portal</span>
              </a>
              <a href="#/employee/home" class="cmp-btn-secondary" style="height: 36px; padding: 0 14px; font-size: 12.5px;">
                <i data-lucide="shield"></i>
                <span>Switch to Employee Portal</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

export function bindCompanySettingsEvents() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}
