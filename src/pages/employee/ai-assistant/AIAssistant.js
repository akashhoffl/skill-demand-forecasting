// ============================================================================
// TALENTSCOPE.AI — EMPLOYEE AI ASSISTANT
// Workforce intelligence assistant grounded in role, skills, and growth context
// Adapts dynamically to Company Employee vs Independent Employee
// ============================================================================

import {
  getEmployeeProfile,
  isCompanyEmployee,
  employeeSkillsData,
  roleEvolutionData,
  internalRolesData
} from '../../../data/employee/employee-data.js';

let chatHistory = [
  {
    sender: 'assistant',
    text: `Good morning. I am your **Workforce Intelligence Assistant**. I monitor your role evolution, skill health, career readiness, and community contributions. How can I assist you today?`
  }
];

let isAnalyzing = false;
let currentAnalysisStep = 0;

const esc = str => String(str ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);

function getSmartResponse(query) {
  const q = query.toLowerCase();
  const p = getEmployeeProfile();
  const isCompany = isCompanyEmployee();

  if (q.includes('company') || q.includes('change') || q.includes('blackwell') || q.includes('market')) {
    if (isCompany) {
      return `### Key Company Shifts at NVIDIA (APAC / Bangalore)
1. **Blackwell Architecture Cluster Rollout (+32.4%)**: NVIDIA is scaling B200 compute pods for hyperscale enterprise inference workloads.
2. **Bangalore Systems Engineering Expansion (+24.8%)**: 55 open requisitions in autonomous machines and edge platforms.
3. **Sovereign AI Infrastructure (+41.0%)**: High demand for localized model fine-tuning and strict data residency compliance.
4. **TensorRT-LLM Microservices (92% adoption)**: Standardized containerized inference across engineering pods.`;
    } else {
      return `### Key Market Technology Shifts
1. **Decentralized High-Throughput Inference (+38.5%)**: High industry demand for engineers optimizing Triton, vLLM, and low-latency KV-caching.
2. **GPU Kernel Optimization Demand (+29.0%)**: Specialized attention layers require custom CUDA and Triton kernels.
3. **Open Weights Foundation Models (+45.2%)**: Accelerated adoption of self-hosted open models requiring local quantization.`;
    }
  }

  if (q.includes('cuda') || q.includes('recommended') || q.includes('learn')) {
    return `### Why CUDA Acceleration is Recommended for You
- **Target Role Requirement**: CUDA optimization is required in **68%** of target ${p.targetRole} openings.
- **Current Proficiency**: Your CUDA health score is currently **62/100**; target benchmark is **85/100**.
- **Action Item**: Complete Module 9 of the *"CUDA Kernel Tuning for AI Platform Engineers"* track to master shared memory bank conflicts and WMMA tensor cores.`;
  }

  if (q.includes('role') || q.includes('changing') || q.includes('evolution') || q.includes('promotion')) {
    return `### Role Evolution: ${p.role} → ${p.targetRole}
Your role trajectory is **Stable → Evolving**. Automated workflows are shifting routine modeling tasks toward hardware-level optimization:
- **Current Core**: Fine-tuning open weights LLMs, model evaluation benchmarks, and Triton packaging.
- **Target Competencies**: Custom CUDA kernels, 128+ GPU node NCCL latency profiling, and FP4 quantization.`;
  }

  if (q.includes('internal') || q.includes('match') || q.includes('opportunity') || q.includes('job')) {
    if (isCompany) {
      return `### Top Internal Role Matches for You
1. **Senior AI Platform Engineer (Autonomous Systems)**: **84% Match** — Matches Python, PyTorch, and TensorRT; requires closing CUDA and NCCL gap.
2. **Generative AI Systems Lead (NeMo Cloud)**: **91% Match** — Direct fit with your RAG and inference experience.
3. **ML Compiler & Optimization Specialist**: **76% Match** — Open requisition in Deep Learning Software.`;
    } else {
      return `### Top Industry Opportunities for You
1. **Staff ML Infrastructure Engineer (AI Research Lab)**: **88% Match** — Large-scale distributed inference cluster management.
2. **Technical Mentor & Code Reviewer (Fellowship Guild)**: **96% Match** — Selective technical mentoring in PyTorch and async systems.
3. **Open Source Kernel Optimizer Grant**: **82% Match** — Funded research project for PyTorch compiler extensions.`;
    }
  }

  return `### Workforce Intelligence Recommendation
Based on your profile as an **${p.role}**, your strongest career accelerator is completing the **CUDA Kernel Tuning** and **NCCL Distributed Interconnect** modules. This directly unlocks qualification for **${p.targetRole}** while increasing your community mentoring value.`;
}

export function renderEmployeeAIAssistant() {
  const p = getEmployeeProfile();
  const isCompany = isCompanyEmployee();

  const samplePrompts = isCompany ? [
    "What changed in my company?",
    "Which skills do I need for Senior AI Platform Engineer?",
    "Why is CUDA recommended for me?",
    "Which internal roles match my current skills?",
    "How does Blackwell technology affect my role?"
  ] : [
    "What are the top market trends in AI infrastructure?",
    "What capabilities are required for Staff ML Infra Engineer?",
    "Why is CUDA recommended for me?",
    "Which industry opportunities match my profile?",
    "How can I turn my verified skills into reputation?"
  ];

  return `
    <div class="employee-page">
      <!-- Header -->
      <section class="emp-hero">
        <div class="emp-hero-content">
          <span class="emp-eyebrow">
            <i data-lucide="sparkles"></i>
            WORKFORCE INTELLIGENCE COPILOT
          </span>
          <h1 class="emp-hero-title">Employee AI Assistant</h1>
          <p class="emp-hero-desc">
            Grounded in your role (${esc(p.role)}), verified skill health, target career goals (${esc(p.targetRole)}), and community contributions.
          </p>
        </div>
        <div class="emp-hero-actions">
          <div class="emp-stat-pill" style="background: var(--emp-light); border: 1px solid rgba(39, 53, 245, 0.2);">
            <strong style="color: var(--emp-primary);">Context Active</strong>
            <small style="color: var(--emp-text-muted);">${isCompany ? 'NVIDIA APAC L4' : 'Independent ML Lead'}</small>
          </div>
        </div>
      </section>

      <!-- Main Chat Area & Suggested Prompts -->
      <div style="display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start;">
        
        <!-- Chat Surface -->
        <div class="emp-card" style="display: flex; flex-direction: column; height: 580px; padding: 20px;">
          <!-- Messages Scroll View -->
          <div id="empChatMessages" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; padding-right: 8px;">
            ${chatHistory.map(msg => `
              <div style="display: flex; gap: 12px; align-items: flex-start; ${msg.sender === 'user' ? 'flex-direction: row-reverse;' : ''}">
                <div style="width: 34px; height: 34px; border-radius: 10px; background: ${msg.sender === 'assistant' ? 'var(--emp-primary)' : 'var(--emp-deep-primary)'}; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0;">
                  ${msg.sender === 'assistant' ? '<i data-lucide="sparkles" style="width: 16px; height: 16px;"></i>' : esc(p.initials)}
                </div>
                <div style="max-width: 82%; background: ${msg.sender === 'assistant' ? '#FFFFFF' : 'var(--emp-light)'}; border: 1px solid var(--emp-border); padding: 14px 18px; border-radius: 14px; font-size: 13.5px; line-height: 1.55; color: var(--emp-text-primary); box-shadow: var(--emp-shadow-sm);">
                  ${msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/### (.*?)(<br\/>|$)/g, '<h4 style="margin: 0 0 6px; font-size: 14.5px; color: var(--emp-primary); font-weight: 800;">$1</h4>')}
                </div>
              </div>
            `).join('')}

            ${isAnalyzing ? `
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <div style="width: 34px; height: 34px; border-radius: 10px; background: var(--emp-primary); color: #FFF; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0;">
                  <i data-lucide="sparkles" style="width: 16px; height: 16px;"></i>
                </div>
                <div style="flex: 1; max-width: 82%; background: #FAFAFF; border: 1px solid var(--emp-border); padding: 14px 18px; border-radius: 14px;">
                  <div style="font-weight: 750; color: var(--emp-primary); font-size: 13px; margin-bottom: 8px;">
                    Synthesizing workforce intelligence...
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: var(--emp-text-secondary);">
                    <div>Step ${currentAnalysisStep}/4: Inspecting verified skill profile and role benchmarks</div>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Input Bar -->
          <form id="empChatForm" style="display: flex; gap: 10px; padding-top: 14px; border-top: 1px solid var(--emp-border-subtle); margin-top: 8px;">
            <input type="text" id="empChatInput" placeholder="Ask about role shifts, CUDA requirements, internal mobility, or mentoring..." style="flex: 1; height: 42px; border-radius: 10px; border: 1px solid var(--emp-border); padding: 0 16px; font-size: 13.5px; background: #FFF; color: var(--emp-text-primary);" ${isAnalyzing ? 'disabled' : ''} />
            <button type="submit" class="emp-btn-primary" style="height: 42px; padding: 0 18px;" ${isAnalyzing ? 'disabled' : ''}>
              <i data-lucide="send"></i>
              <span>Ask</span>
            </button>
          </form>
        </div>

        <!-- Right Side: Grounded Context & Sample Prompts -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Active Context Card -->
          <div class="emp-card" style="padding: 20px;">
            <h4 style="font-size: 11.5px; font-weight: 800; color: var(--emp-text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px;">
              Active Profile Context
            </h4>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12.5px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--emp-text-secondary);">Employee:</span>
                <strong style="color: var(--emp-text-primary);">${esc(p.name)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--emp-text-secondary);">Role:</span>
                <strong style="color: var(--emp-text-primary);">${esc(p.role)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--emp-text-secondary);">Target:</span>
                <strong style="color: var(--emp-primary);">${esc(p.targetRole)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--emp-text-secondary);">Top Gap:</span>
                <strong style="color: var(--emp-attention);">CUDA Kernel Tuning</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--emp-text-secondary);">Reputation:</span>
                <strong style="color: var(--emp-success);">${p.reputationPoints.toLocaleString()} Points</strong>
              </div>
            </div>
          </div>

          <!-- Suggested Questions -->
          <div class="emp-card" style="padding: 20px;">
            <h4 style="font-size: 11.5px; font-weight: 800; color: var(--emp-text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px;">
              Suggested Questions
            </h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${samplePrompts.map(prompt => `
                <button type="button" class="emp-btn-ghost" data-quick-prompt="${esc(prompt)}" style="justify-content: flex-start; text-align: left; height: auto; padding: 9px 12px; font-size: 12px; line-height: 1.35; border-radius: 8px;">
                  <i data-lucide="help-circle" style="width: 14px; height: 14px; flex-shrink: 0; color: var(--emp-primary);"></i>
                  <span>${esc(prompt)}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function runAnalysisAndRespond(query, rerenderFn) {
  isAnalyzing = true;
  currentAnalysisStep = 1;
  rerenderFn();

  const stepInterval = setInterval(() => {
    currentAnalysisStep += 1;
    if (currentAnalysisStep <= 4) {
      rerenderFn();
    } else {
      clearInterval(stepInterval);
      setTimeout(() => {
        isAnalyzing = false;
        currentAnalysisStep = 0;
        const resp = getSmartResponse(query);
        chatHistory.push({ sender: 'assistant', text: resp });
        rerenderFn();

        const box = document.querySelector('#empChatMessages');
        if (box) {
          box.scrollTop = box.scrollHeight;
        }
      }, 350);
    }
  }, 220);
}

export function bindEmployeeAIAssistantEvents(rerenderFn) {
  const form = document.querySelector('#empChatForm');
  const input = document.querySelector('#empChatInput');

  const box = document.querySelector('#empChatMessages');
  if (box) {
    box.scrollTop = box.scrollHeight;
  }

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (isAnalyzing) return;
      const val = input.value.trim();
      if (!val) return;

      chatHistory.push({ sender: 'user', text: val });
      input.value = '';
      runAnalysisAndRespond(val, rerenderFn);
    });
  }

  document.querySelectorAll('[data-quick-prompt]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAnalyzing) return;
      const prompt = btn.dataset.quickPrompt;
      chatHistory.push({ sender: 'user', text: prompt });
      runAnalysisAndRespond(prompt, rerenderFn);
    });
  });
}
