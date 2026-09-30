// ============================================================================
// TALENTSCOPE.AI — SIGN UP COMPONENT
// Progressive Disclosure Flow:
// Step 1: Create Account (Email, Password, Confirm)
// Step 1.5: Email Verification Code (Friendly simulation)
// Step 2: Role Selection (Individual, Employee [Connected/Independent], Company)
// Direct transition to Onboarding
// ============================================================================

import { registerUser, saveOnboardingDraft } from './auth-state.js';

let signupState = {
  step: 1, // 1: credentials, 1.5: email-verify, 2: role-select
  email: '',
  password: '',
  confirmPassword: '',
  userType: 'individual', // 'individual' | 'employee' | 'company'
  employeeType: 'company-connected', // 'company-connected' | 'independent'
  companyName: 'TechCorp Global',
  verificationCode: '123456'
};

export function renderSignupPage(container) {
  const root = container || document.getElementById('mainContent') || document.getElementById('appShell') || document.body;
  renderCurrentSignupStep(root);
}

function renderCurrentSignupStep(root) {
  root.innerHTML = `
    <div class="ts-auth-viewport">
      <!-- LEFT VISUAL AREA -->
      <section class="ts-auth-visual" aria-label="TalentScope Vision">
        <div class="ts-auth-visual-top">
          <a class="ts-auth-brand" href="#/individual/home" aria-label="TalentScope.ai">
            <span class="ts-auth-brand-mark">
              <img src="assets/logo.png" alt="TalentScope Logo">
            </span>
            <span class="ts-auth-brand-name">TalentScope<span>.ai</span></span>
          </a>
        </div>

        <div class="ts-auth-visual-center">
          <div class="ts-auth-visual-headline">
            <span class="ts-auth-visual-kicker">
              <i data-lucide="compass"></i>
              Future-Ready Workforce Platform
            </span>
            <h1>Intelligence designed around your actual trajectory.</h1>
            <p>Whether you're developing high-demand skills as an individual, advancing within your organization, or planning enterprise workforce capabilities.</p>
          </div>

          <!-- Feature Highlights Stack -->
          <div class="ts-auth-signals-stack">
            <div class="ts-auth-signal-card">
              <div class="ts-auth-signal-left">
                <div class="ts-auth-signal-icon is-purple">
                  <i data-lucide="layers-3"></i>
                </div>
                <div class="ts-auth-signal-text">
                  <strong>Personalized Skill Graphs</strong>
                  <small>Live competency mapping calibrated against real industry openings</small>
                </div>
              </div>
              <span class="ts-auth-signal-badge is-positive">Active</span>
            </div>

            <div class="ts-auth-signal-card">
              <div class="ts-auth-signal-left">
                <div class="ts-auth-signal-icon is-blue">
                  <i data-lucide="building-2"></i>
                </div>
                <div class="ts-auth-signal-text">
                  <strong>Connected Workforce Ecosystem</strong>
                  <small>Bridges personal career growth directly with company capability planning</small>
                </div>
              </div>
              <span class="ts-auth-signal-badge is-purple">Verified</span>
            </div>
          </div>
        </div>

        <div class="ts-auth-visual-footer">
          <i data-lucide="lock"></i>
          <span>Secure, role-tailored intelligence profile generation</span>
        </div>
      </section>

      <!-- RIGHT FORM AREA -->
      <section class="ts-auth-form-area" aria-label="Sign up for TalentScope">
        <div class="ts-auth-card ${signupState.step === 2 ? 'ts-usertype-container' : ''}">
          ${getStepContentHtml()}
        </div>
      </section>
    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  bindStepEvents(root);
}

function getStepContentHtml() {
  if (signupState.step === 1) {
    // Step 1: Account Credentials
    return `
      <header class="ts-auth-header">
        <h2>Create your account</h2>
        <p>Let's get you set up for a more personalized experience.</p>
      </header>

      <div id="authAlertArea"></div>

      <button type="button" class="ts-auth-btn-google" id="googleSignupBtn">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
        </svg>
        <span>Continue with Google</span>
      </button>

      <div class="ts-auth-divider">OR</div>

      <form class="ts-auth-form" id="signupForm" novalidate>
        <div class="ts-auth-field">
          <label for="signupEmail">Work or personal email</label>
          <div class="ts-auth-input-wrap">
            <i data-lucide="mail" class="prefix-icon"></i>
            <input
              type="email"
              id="signupEmail"
              class="ts-auth-input"
              placeholder="name@example.com"
              value="${signupState.email}"
              required
            />
          </div>
        </div>

        <div class="ts-auth-field">
          <label for="signupPassword">Password</label>
          <div class="ts-auth-input-wrap">
            <i data-lucide="lock" class="prefix-icon"></i>
            <input
              type="password"
              id="signupPassword"
              class="ts-auth-input"
              placeholder="At least 8 characters"
              value="${signupState.password}"
              required
            />
            <button type="button" class="ts-auth-toggle-pwd" id="togglePwdBtn" aria-label="Show password">
              <i data-lucide="eye" id="togglePwdIcon"></i>
            </button>
          </div>
        </div>

        <div class="ts-auth-field">
          <label for="signupConfirmPassword">Confirm password</label>
          <div class="ts-auth-input-wrap">
            <i data-lucide="shield-check" class="prefix-icon"></i>
            <input
              type="password"
              id="signupConfirmPassword"
              class="ts-auth-input"
              placeholder="Re-enter your password"
              value="${signupState.confirmPassword}"
              required
            />
          </div>
        </div>

        <button type="submit" class="ts-auth-btn-primary" id="step1SubmitBtn">
          <span>Continue</span>
          <i data-lucide="arrow-right"></i>
        </button>
      </form>

      <div class="ts-auth-footer-prompt">
        Already have an account?
        <a href="#/login">Sign in</a>
      </div>
    `;
  }

  if (signupState.step === 1.5) {
    // Step 1.5: Email Verification
    return `
      <header class="ts-auth-header">
        <div style="width: 48px; height: 48px; border-radius: 14px; background: #F3EEFF; color: #874FFF; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <i data-lucide="mail-check" style="width: 24px; height: 24px;"></i>
        </div>
        <h2>Verify your email</h2>
        <p>We sent a 6-digit confirmation code to <strong>${signupState.email || 'your email'}</strong>.</p>
      </header>

      <div id="authAlertArea"></div>

      <form class="ts-auth-form" id="verifyForm">
        <div class="ts-auth-field">
          <label for="verifyCode">Enter 6-digit verification code</label>
          <div class="ts-auth-input-wrap">
            <i data-lucide="key" class="prefix-icon"></i>
            <input
              type="text"
              id="verifyCode"
              class="ts-auth-input"
              placeholder="123456"
              maxlength="6"
              style="letter-spacing: 0.25em; font-size: 18px; font-weight: 700;"
              value="${signupState.verificationCode}"
              required
            />
          </div>
          <small style="color: #6C6078; font-size: 12px; margin-top: 4px;">
            Demo mode: Use code <strong>123456</strong> or click Continue below.
          </small>
        </div>

        <button type="submit" class="ts-auth-btn-primary" id="verifySubmitBtn">
          <span>Verify & Continue</span>
          <i data-lucide="check"></i>
        </button>

        <button type="button" class="ts-auth-btn-google" id="resendCodeBtn" style="margin-top: 8px;">
          <i data-lucide="rotate-cw"></i>
          <span>Resend Code</span>
        </button>
      </form>
    `;
  }

  // Step 2: "How will you use the platform?"
  return `
    <header class="ts-auth-header">
      <h2>How will you use the platform?</h2>
      <p>Choose the experience tailored to your workforce and career goals.</p>
    </header>

    <div id="authAlertArea"></div>

    <div class="ts-usertype-grid" role="radiogroup" aria-label="Select user type">
      <!-- 1. INDIVIDUAL -->
      <article
        class="ts-usertype-card ${signupState.userType === 'individual' ? 'is-selected' : ''}"
        data-type="individual"
        role="radio"
        aria-checked="${signupState.userType === 'individual'}"
        tabindex="0"
      >
        <span class="ts-usertype-check" aria-hidden="true">
          <i data-lucide="check"></i>
        </span>
        <div class="ts-usertype-icon is-individual">
          <i data-lucide="user-round" style="width: 28px; height: 28px;"></i>
        </div>
        <h3 class="ts-usertype-title">Individual</h3>
        <p class="ts-usertype-desc">Build skills, map market opportunities, and prepare for your future career.</p>
        <span class="ts-usertype-arrow">Select Individual <i data-lucide="arrow-right"></i></span>
      </article>

      <!-- 2. EMPLOYEE -->
      <article
        class="ts-usertype-card ${signupState.userType === 'employee' ? 'is-selected' : ''}"
        data-type="employee"
        role="radio"
        aria-checked="${signupState.userType === 'employee'}"
        tabindex="0"
      >
        <span class="ts-usertype-check" aria-hidden="true">
          <i data-lucide="check"></i>
        </span>
        <div class="ts-usertype-icon is-employee">
          <i data-lucide="briefcase" style="width: 28px; height: 28px;"></i>
        </div>
        <h3 class="ts-usertype-title">Employee</h3>
        <p class="ts-usertype-desc">Grow your skills, explore internal mobility, and advance your career at or beyond your company.</p>
        <span class="ts-usertype-arrow">Select Employee <i data-lucide="arrow-right"></i></span>
      </article>

      <!-- 3. COMPANY -->
      <article
        class="ts-usertype-card ${signupState.userType === 'company' ? 'is-selected' : ''}"
        data-type="company"
        role="radio"
        aria-checked="${signupState.userType === 'company'}"
        tabindex="0"
      >
        <span class="ts-usertype-check" aria-hidden="true">
          <i data-lucide="check"></i>
        </span>
        <div class="ts-usertype-icon is-company">
          <i data-lucide="building-2" style="width: 28px; height: 28px;"></i>
        </div>
        <h3 class="ts-usertype-title">Company Admin</h3>
        <p class="ts-usertype-desc">Build, plan, reskill, and forecast the workforce capabilities your enterprise needs next.</p>
        <span class="ts-usertype-arrow">Select Company <i data-lucide="arrow-right"></i></span>
      </article>
    </div>

    <!-- Conditional Employee Connection Sub-Step -->
    ${signupState.userType === 'employee' ? `
      <div class="ts-emp-connection-box" id="empConnectionBox">
        <strong style="display: block; font-size: 15px; color: #1E172B; margin-bottom: 4px;">
          Are you currently connected to a company?
        </strong>
        <p style="font-size: 13px; color: #6C6078; margin: 0 0 12px;">
          Choose whether to link your profile to an employer or advance independently.
        </p>

        <div class="ts-emp-connection-options">
          <button
            type="button"
            class="ts-emp-connection-btn ${signupState.employeeType === 'company-connected' ? 'is-active' : ''}"
            id="btnConnectedEmployee"
          >
            <strong>Yes, I work at a company</strong>
            <small>I want to understand and improve my career within my organization.</small>
          </button>

          <button
            type="button"
            class="ts-emp-connection-btn ${signupState.employeeType === 'independent' ? 'is-active' : ''}"
            id="btnIndependentEmployee"
          >
            <strong>Not yet</strong>
            <small>I want to build and manage my career independently.</small>
          </button>
        </div>

        ${signupState.employeeType === 'company-connected' ? `
          <div style="margin-top: 18px; padding-top: 16px; border-top: 1px solid #E4DAEC;">
            <label style="display: block; font-size: 13px; font-weight: 700; color: #2A1F3B; margin-bottom: 6px;">
              Which company do you work for?
            </label>
            <div class="ts-auth-input-wrap">
              <i data-lucide="building" class="prefix-icon"></i>
              <input
                type="text"
                id="employeeCompanyInput"
                class="ts-auth-input"
                placeholder="Search or enter company name (e.g. TechCorp Global)"
                value="${signupState.companyName}"
              />
            </div>
            <div style="margin-top: 10px; display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #15803D; background: #F0FDF4; padding: 8px 12px; border-radius: 8px;">
              <i data-lucide="check-circle" style="width: 16px; height: 16px;"></i>
              <span>Company workspace detected: <strong>TechCorp Global</strong></span>
            </div>
          </div>
        ` : ''}
      </div>
    ` : ''}

    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 32px; gap: 16px;">
      <button type="button" class="ts-auth-btn-google" id="btnBackToCreds" style="width: auto; padding: 0 20px;">
        <i data-lucide="arrow-left"></i>
        <span>Back</span>
      </button>

      <button type="button" class="ts-auth-btn-primary" id="btnFinalSignupContinue" style="flex: 1; max-width: 320px; margin: 0;">
        <span>Continue to Onboarding</span>
        <i data-lucide="arrow-right"></i>
      </button>
    </div>
  `;
}

function bindStepEvents(root) {
  const alertArea = document.getElementById('authAlertArea');

  // STEP 1 Events
  if (signupState.step === 1) {
    const form = document.getElementById('signupForm');
    const emailInput = document.getElementById('signupEmail');
    const pwdInput = document.getElementById('signupPassword');
    const confirmPwdInput = document.getElementById('signupConfirmPassword');
    const toggleBtn = document.getElementById('togglePwdBtn');
    const toggleIcon = document.getElementById('togglePwdIcon');
    const googleBtn = document.getElementById('googleSignupBtn');

    if (toggleBtn && pwdInput) {
      toggleBtn.addEventListener('click', () => {
        const isPwd = pwdInput.getAttribute('type') === 'password';
        pwdInput.setAttribute('type', isPwd ? 'text' : 'password');
        toggleIcon.setAttribute('data-lucide', isPwd ? 'eye-off' : 'eye');
        if (window.lucide) window.lucide.createIcons();
      });
    }

    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        signupState.email = 'alex.user@gmail.com';
        signupState.password = 'password123';
        signupState.confirmPassword = 'password123';
        signupState.step = 2; // Fast track for Google OAuth
        renderCurrentSignupStep(root);
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAlert();

        const email = emailInput.value.trim();
        const pwd = pwdInput.value;
        const confirmPwd = confirmPwdInput.value;

        if (!email || !email.includes('@')) {
          showAlert('Please enter a valid email address.', 'error');
          emailInput.focus();
          return;
        }

        if (!pwd || pwd.length < 8) {
          showAlert('Password must contain at least 8 characters.', 'error');
          pwdInput.focus();
          return;
        }

        if (pwd !== confirmPwd) {
          showAlert('Passwords do not match. Please re-check.', 'error');
          confirmPwdInput.focus();
          return;
        }

        signupState.email = email;
        signupState.password = pwd;
        signupState.confirmPassword = confirmPwd;
        signupState.step = 1.5; // Go to verification
        renderCurrentSignupStep(root);
      });
    }
  }

  // STEP 1.5 Verification Events
  if (signupState.step === 1.5) {
    const verifyForm = document.getElementById('verifyForm');
    const codeInput = document.getElementById('verifyCode');
    const resendBtn = document.getElementById('resendCodeBtn');

    if (resendBtn) {
      resendBtn.addEventListener('click', () => {
        showAlert(`A fresh code has been sent to ${signupState.email}.`, 'success');
      });
    }

    if (verifyForm) {
      verifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = codeInput.value.trim();
        if (!code || code.length < 6) {
          showAlert('Please enter the 6-digit code.', 'error');
          return;
        }

        showAlert('Email verified successfully!', 'success');
        setTimeout(() => {
          signupState.step = 2; // Proceed to role selection
          renderCurrentSignupStep(root);
        }, 300);
      });
    }
  }

  // STEP 2 Role Selection Events
  if (signupState.step === 2) {
    document.querySelectorAll('.ts-usertype-card').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.getAttribute('data-type');
        signupState.userType = type;
        renderCurrentSignupStep(root);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    const btnConnected = document.getElementById('btnConnectedEmployee');
    const btnIndependent = document.getElementById('btnIndependentEmployee');
    const companyInput = document.getElementById('employeeCompanyInput');

    if (btnConnected) {
      btnConnected.addEventListener('click', () => {
        signupState.employeeType = 'company-connected';
        renderCurrentSignupStep(root);
      });
    }

    if (btnIndependent) {
      btnIndependent.addEventListener('click', () => {
        signupState.employeeType = 'independent';
        renderCurrentSignupStep(root);
      });
    }

    if (companyInput) {
      companyInput.addEventListener('input', (e) => {
        signupState.companyName = e.target.value.trim();
      });
    }

    const btnBack = document.getElementById('btnBackToCreds');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        signupState.step = 1;
        renderCurrentSignupStep(root);
      });
    }

    const btnContinue = document.getElementById('btnFinalSignupContinue');
    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        const result = registerUser({
          email: signupState.email || 'user_' + Date.now() + '@example.com',
          password: signupState.password || 'password123',
          userType: signupState.userType,
          employeeType: signupState.userType === 'employee' ? signupState.employeeType : null,
          companyName: signupState.userType === 'employee' && signupState.employeeType === 'company-connected'
            ? signupState.companyName
            : null
        });

        if (!result.success) {
          showAlert(result.error, 'error');
          return;
        }

        // Initialize draft onboarding state
        saveOnboardingDraft({
          userType: signupState.userType,
          employeeType: signupState.employeeType,
          companyName: signupState.companyName,
          stepIndex: 0,
          answers: {}
        });

        // Navigate to Onboarding
        window.location.hash = '#/onboarding';
      });
    }
  }

  function showAlert(msg, type = 'error') {
    if (!alertArea) return;
    alertArea.innerHTML = `
      <div class="ts-auth-alert is-${type}" role="alert">
        <i data-lucide="${type === 'error' ? 'alert-circle' : 'check-circle-2'}"></i>
        <span>${msg}</span>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  function clearAlert() {
    if (alertArea) alertArea.innerHTML = '';
  }
}
