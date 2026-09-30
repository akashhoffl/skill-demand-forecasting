// ============================================================================
// TALENTSCOPE.AI — COMPANY PROFILE MANAGEMENT COMPONENT
// Foundation for Company Intelligence: Identity, Business, Technology, Workforce, Roles, Hiring & Signals
// Multi-tab setup with 82% completion tracking and live editing
// ============================================================================

import { companyProfile } from '../../../data/company/company-data.js';
import { openCompanyModal, closeCompanyModal } from './CompanyModal.js';

const esc = str => String(str ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);

let activeProfileTab = 'overview';

export function openCompanyProfileModal(initialTab = 'overview', onSaveCallback = null) {
  activeProfileTab = initialTab;
  const p = companyProfile;

  const renderContent = () => `
    <div class="cmp-profile-wizard" style="display: flex; flex-direction: column; gap: 16px;">
      <!-- Progress Bar & Completion Banner -->
      <div style="background: var(--cmp-very-light, #F8F6FC); padding: 14px 18px; border-radius: var(--cmp-radius-md, 12px); border: 1px solid var(--cmp-border, #E6DEF7); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: var(--cmp-primary, #874FFF); color: #FFFFFF; font-weight: 850; font-size: 16px; display: flex; align-items: center; justify-content: center;">
            ${esc(p.logoInitials)}
          </div>
          <div>
            <strong style="font-size: 15px; color: var(--cmp-text-primary, #241B32); display: block;">${esc(p.name)}</strong>
            <span style="font-size: 12px; color: var(--cmp-text-secondary, #70677C);">${esc(p.industry)} · ${esc(p.headquarters)}</span>
          </div>
        </div>
        <div style="min-width: 170px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
            <span style="color: var(--cmp-text-secondary, #70677C); font-weight: 600;">Profile Setup</span>
            <strong style="color: var(--cmp-primary, #874FFF);">${p.completionPercentage || 82}% Complete</strong>
          </div>
          <div class="cmp-meter-track" style="height: 6px;">
            <div class="cmp-meter-fill cmp-meter-fill--accent" style="width: ${p.completionPercentage || 82}%;"></div>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="cmp-profile-tabs" style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; border-bottom: 1px solid var(--cmp-border, #E6DEF7);">
        ${[
          { id: 'overview', label: 'Identity', icon: 'building' },
          { id: 'business', label: 'Business', icon: 'briefcase' },
          { id: 'technology', label: 'Technology', icon: 'cpu' },
          { id: 'workforce', label: 'Workforce', icon: 'users' },
          { id: 'roles', label: 'Roles', icon: 'git-branch' },
          { id: 'hiring', label: 'Hiring', icon: 'user-plus' },
          { id: 'signals', label: 'Intelligence', icon: 'radio' }
        ].map(t => `
          <button type="button" class="cmp-tab-btn ${t.id === activeProfileTab ? 'is-active' : ''}" data-profile-tab="${t.id}" style="
            display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 8px; font-size: 12.5px; font-weight: 700; border: none; cursor: pointer; transition: all 180ms ease;
            background: ${t.id === activeProfileTab ? 'var(--cmp-light-primary, #F0E9FF)' : 'transparent'};
            color: ${t.id === activeProfileTab ? 'var(--cmp-deep-primary, #5B2BBF)' : 'var(--cmp-text-secondary, #70677C)'};
          ">
            <i data-lucide="${t.icon}" style="width: 14px; height: 14px;"></i>
            <span>${t.label}</span>
          </button>
        `).join('')}
      </div>

      <!-- Tab Panels -->
      <div id="cmpProfileTabContent" style="min-height: 240px; max-height: 380px; overflow-y: auto; padding-right: 4px;">
        ${renderTabPanel(activeProfileTab, p)}
      </div>
    </div>
  `;

  openCompanyModal({
    title: 'Company Organization Profile',
    subtitle: 'Manage organizational baseline, business domains, tech stack, and intelligence foundation.',
    icon: 'building',
    maxWidth: '740px',
    contentHtml: renderContent(),
    cancelText: 'Close',
    confirmText: 'Save Profile Changes',
    confirmIcon: 'check',
    onConfirm: () => {
      // Gather inputs
      const nameInput = document.querySelector('#cmpEditName');
      const hqInput = document.querySelector('#cmpEditHq');
      const indInput = document.querySelector('#cmpEditIndustry');
      if (nameInput) p.name = nameInput.value;
      if (hqInput) p.headquarters = hqInput.value;
      if (indInput) p.industry = indInput.value;
      if (typeof onSaveCallback === 'function') onSaveCallback();
      return true;
    },
    onOpen: (modalRoot) => {
      bindTabEvents(modalRoot, renderContent, onSaveCallback);
    }
  });
}

function bindTabEvents(modalRoot, renderContent, onSaveCallback) {
  modalRoot.querySelectorAll('.cmp-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeProfileTab = btn.dataset.profileTab;
      const content = modalRoot.querySelector('.cmp-modal-body');
      if (content) {
        content.innerHTML = renderContent();
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
        bindTabEvents(modalRoot, renderContent, onSaveCallback);
      }
    });
  });
}

function renderTabPanel(tab, p) {
  if (tab === 'overview') {
    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div>
          <label style="font-size: 12px; font-weight: 700; color: var(--cmp-text-primary); display: block; margin-bottom: 4px;">Company Name</label>
          <input type="text" id="cmpEditName" value="${esc(p.name)}" style="width: 100%; height: 36px; padding: 0 10px; border-radius: 8px; border: 1px solid var(--cmp-border); font-size: 13px;" />
        </div>
        <div>
          <label style="font-size: 12px; font-weight: 700; color: var(--cmp-text-primary); display: block; margin-bottom: 4px;">Industry Classification</label>
          <input type="text" id="cmpEditIndustry" value="${esc(p.industry)}" style="width: 100%; height: 36px; padding: 0 10px; border-radius: 8px; border: 1px solid var(--cmp-border); font-size: 13px;" />
        </div>
        <div>
          <label style="font-size: 12px; font-weight: 700; color: var(--cmp-text-primary); display: block; margin-bottom: 4px;">Global Headquarters</label>
          <input type="text" id="cmpEditHq" value="${esc(p.headquarters)}" style="width: 100%; height: 36px; padding: 0 10px; border-radius: 8px; border: 1px solid var(--cmp-border); font-size: 13px;" />
        </div>
        <div>
          <label style="font-size: 12px; font-weight: 700; color: var(--cmp-text-primary); display: block; margin-bottom: 4px;">Company Type / Model</label>
          <input type="text" value="Enterprise Public Corporation (Nasdaq: NVDA)" style="width: 100%; height: 36px; padding: 0 10px; border-radius: 8px; border: 1px solid var(--cmp-border); font-size: 13px;" />
        </div>
        <div style="grid-column: 1 / -1;">
          <label style="font-size: 12px; font-weight: 700; color: var(--cmp-text-primary); display: block; margin-bottom: 4px;">Operating Locations & Key Engineering Hubs</label>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${p.primaryHubs.map(h => `<span class="cmp-badge cmp-badge--neutral" style="font-size: 12px; padding: 4px 10px;"><i data-lucide="map-pin" style="width: 11px; height: 11px; vertical-align: middle;"></i> ${esc(h)}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  if (tab === 'business') {
    return `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="background: var(--cmp-very-light); padding: 12px; border-radius: 8px; border: 1px solid var(--cmp-border);">
          <strong style="font-size: 13px; color: var(--cmp-text-primary); display: block; margin-bottom: 4px;">Core Business Areas & Units</strong>
          <span style="font-size: 12.5px; color: var(--cmp-text-secondary);">Hyperscale AI Cloud Infrastructure, Autonomous Driving Systems, High-Performance Compute (HPC), Omniverse Simulation, and Enterprise Microservices.</span>
        </div>
        <div style="background: var(--cmp-very-light); padding: 12px; border-radius: 8px; border: 1px solid var(--cmp-border);">
          <strong style="font-size: 13px; color: var(--cmp-text-primary); display: block; margin-bottom: 4px;">Flagship Enterprise Products & Platforms</strong>
          <span style="font-size: 12.5px; color: var(--cmp-text-secondary);">Blackwell B200 Compute Clusters, DGX Cloud, TensorRT-LLM, Triton Inference Server, CUDA-X Libraries, and NeMo Guardrails.</span>
        </div>
      </div>
    `;
  }

  if (tab === 'technology') {
    return `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label style="font-size: 12px; font-weight: 700; color: var(--cmp-text-primary); display: block; margin-bottom: 6px;">Primary Core Tech Stack & Tooling</label>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <span class="cmp-badge cmp-badge--accent">CUDA & C++</span>
            <span class="cmp-badge cmp-badge--accent">TensorRT-LLM</span>
            <span class="cmp-badge cmp-badge--accent">Triton Inference Server</span>
            <span class="cmp-badge cmp-badge--neutral">PyTorch 2.4</span>
            <span class="cmp-badge cmp-badge--neutral">InfiniBand RDMA</span>
            <span class="cmp-badge cmp-badge--neutral">Kubernetes & Slurm</span>
            <span class="cmp-badge cmp-badge--neutral">NCCL 2.22</span>
            <span class="cmp-badge cmp-badge--neutral">FP4 / FP8 Quantization</span>
          </div>
        </div>
        <div style="background: var(--cmp-very-light); padding: 12px; border-radius: 8px; border: 1px solid var(--cmp-border); font-size: 12.5px; color: var(--cmp-text-secondary);">
          <strong>Engineering Infrastructure:</strong> 480+ Blackwell nodes deployed across US and APAC test clusters for continuous kernel profiling.
        </div>
      </div>
    `;
  }

  if (tab === 'workforce') {
    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div style="background: var(--cmp-very-light); padding: 12px; border-radius: 8px; border: 1px solid var(--cmp-border);">
          <span style="font-size: 11px; color: var(--cmp-text-muted); text-transform: uppercase;">Global Headcount</span>
          <div style="font-size: 20px; font-weight: 850; color: var(--cmp-text-primary);">${(p.globalHeadcount).toLocaleString()}</div>
        </div>
        <div style="background: var(--cmp-very-light); padding: 12px; border-radius: 8px; border: 1px solid var(--cmp-border);">
          <span style="font-size: 11px; color: var(--cmp-text-muted); text-transform: uppercase;">Engineering Headcount</span>
          <div style="font-size: 20px; font-weight: 850; color: var(--cmp-primary);">${(p.engineeringHeadcount).toLocaleString()}</div>
        </div>
        <div style="background: var(--cmp-very-light); padding: 12px; border-radius: 8px; border: 1px solid var(--cmp-border);">
          <span style="font-size: 11px; color: var(--cmp-text-muted); text-transform: uppercase;">APAC Hub Headcount</span>
          <div style="font-size: 20px; font-weight: 850; color: var(--cmp-deep-primary);">${(p.apacHeadcount).toLocaleString()}</div>
        </div>
        <div style="background: var(--cmp-very-light); padding: 12px; border-radius: 8px; border: 1px solid var(--cmp-border);">
          <span style="font-size: 11px; color: var(--cmp-text-muted); text-transform: uppercase;">Core Delivery Pods</span>
          <div style="font-size: 20px; font-weight: 850; color: var(--cmp-success);">4 Pods</div>
        </div>
      </div>
    `;
  }

  if (tab === 'roles') {
    return `
      <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12.5px;">
        <div style="background: var(--cmp-very-light); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--cmp-border); display: flex; justify-content: space-between; align-items: center;">
          <span><strong>AI Engineer (L4)</strong> → Model tuning, kernel profiling</span>
          <span class="cmp-badge cmp-badge--accent">84 Headcount</span>
        </div>
        <div style="background: var(--cmp-very-light); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--cmp-border); display: flex; justify-content: space-between; align-items: center;">
          <span><strong>Senior AI Platform Engineer (L5)</strong> → Cluster orchestration</span>
          <span class="cmp-badge cmp-badge--warning">Critical Demand (+26)</span>
        </div>
        <div style="background: var(--cmp-very-light); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--cmp-border); display: flex; justify-content: space-between; align-items: center;">
          <span><strong>Distributed Systems Architect (L6)</strong> → InfiniBand fabrics</span>
          <span class="cmp-badge cmp-badge--danger">High Deficit (+10)</span>
        </div>
      </div>
    `;
  }

  if (tab === 'hiring') {
    return `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="background: var(--cmp-very-light); padding: 12px; border-radius: 8px; border: 1px solid var(--cmp-border);">
          <strong style="font-size: 13px; color: var(--cmp-text-primary); display: block; margin-bottom: 2px;">Active Talent Acquisition Requisitions</strong>
          <span style="font-size: 12.5px; color: var(--cmp-text-secondary);">82 priority requisitions active across Bangalore, Santa Clara, and Taipei. Priority on L5+ technical leadership.</span>
        </div>
        <div style="background: var(--cmp-very-light); padding: 12px; border-radius: 8px; border: 1px solid var(--cmp-border);">
          <strong style="font-size: 13px; color: var(--cmp-text-primary); display: block; margin-bottom: 2px;">Internal First Hiring Policy</strong>
          <span style="font-size: 12.5px; color: var(--cmp-text-secondary);">31.4% of requisitions closed via internal mobility bench before opening external agency requisitions.</span>
        </div>
      </div>
    `;
  }

  // signals
  return `
    <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12.5px;">
      <div style="background: var(--cmp-light-primary); padding: 10px 12px; border-radius: 8px; border-left: 3px solid var(--cmp-primary);">
        <strong>Technology Trigger:</strong> Blackwell B200 rollout (+34.2% demand) requires CUDA memory profiling.
      </div>
      <div style="background: var(--cmp-very-light); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--cmp-border);">
        <strong>Market Regulation:</strong> Sovereign AI mandates require zero offshore data egress across 8 regional public sector deals.
      </div>
    </div>
  `;
}
