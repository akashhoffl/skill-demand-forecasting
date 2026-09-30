// ============================================================================
// TALENTSCOPE.AI — LOGIN COMPONENT
// Screen: Left Storytelling Visual + Right Form Area
// Direct portal routing based on user type & company connection
// ============================================================================

import { authenticateUser, getAllUsers, determineUserRedirect } from './auth-state.js';

export function renderLoginPage(container) {
  const root = container || document.getElementById('mainContent') || document.getElementById('appShell') || document.body;

  root.innerHTML = `
    <div class="ts-auth-viewport">
      <!-- LEFT / MAIN VISUAL AREA -->
      <section class="ts-auth-visual" aria-label="TalentScope Overview">
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
              <i data-lucide="sparkles"></i>
              Strategic Workforce Intelligence
            </span>
            <h1>Forecast skills. Shape your career and workforce.</h1>
            <p>Predict role evolution, align capabilities with market signals, and bridge skill gaps in real time.</p>
          </div>

          <!-- Animated Live Signal Cards -->
          <div class="ts-auth-signals-stack">
            <div class="ts-auth-signal-card">
              <div class="ts-auth-signal-left">
                <div class="ts-auth-signal-icon is-purple">
                  <i data-lucide="brain"></i>
                </div>
                <div class="ts-auth-signal-text">
                  <strong>AI Infrastructure & GPU Systems</strong>
                  <small>Hiring acceleration +28.4% across 2,400+ tech employers</small>
                </div>
              </div>
              <span class="ts-auth-signal-badge is-positive">+28.4%</span>
            </div>

            <div class="ts-auth-signal-card">
              <div class="ts-auth-signal-left">
                <div class="ts-auth-signal-icon is-blue">
                  <i data-lucide="git-pull-request"></i>
                </div>
                <div class="ts-auth-signal-text">
                  <strong>Internal Workforce Mobility</strong>
                  <small>86% talent match rate across enterprise departments</small>
                </div>
              </div>
              <span class="ts-auth-signal-badge is-purple">86% Fit</span>
            </div>
          </div>
        </div>

        <div class="ts-auth-visual-footer">
          <i data-lucide="shield-check"></i>
          <span>Enterprise-grade encryption & calibrated workforce analytics</span>
        </div>
      </section>

      <!-- RIGHT / FORM AREA -->
      <section class="ts-auth-form-area" aria-label="Sign in to your account">
        <div class="ts-auth-card">
          <header class="ts-auth-header">
            <h2>Welcome back</h2>
            <p>Continue where you left off.</p>
          </header>

          <div id="authAlertArea"></div>

          <form class="ts-auth-form" id="loginForm" novalidate>
            <div class="ts-auth-field">
              <label for="loginEmail">Email address</label>
              <div class="ts-auth-input-wrap">
                <i data-lucide="mail" class="prefix-icon"></i>
                <input
                  type="email"
                  id="loginEmail"
                  class="ts-auth-input"
                  placeholder="name@example.com"
                  autocomplete="email"
                  required
                />
              </div>
            </div>

            <div class="ts-auth-field">
              <label for="loginPassword">
                <span>Password</span>
                <a href="#/auth/login" id="forgotPasswordLink">Forgot password?</a>
              </label>
              <div class="ts-auth-input-wrap">
                <i data-lucide="lock" class="prefix-icon"></i>
                <input
                  type="password"
                  id="loginPassword"
                  class="ts-auth-input"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  required
                />
                <button type="button" class="ts-auth-toggle-pwd" id="togglePasswordBtn" aria-label="Show password">
                  <i data-lucide="eye" id="togglePwdIcon"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="ts-auth-btn-primary" id="loginSubmitBtn">
              <span>Sign In</span>
              <i data-lucide="arrow-right"></i>
            </button>
          </form>

          <div class="ts-auth-divider">OR</div>

          <button type="button" class="ts-auth-btn-google" id="googleLoginBtn">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <!-- Quick Seed Demo Accounts for Effortless Testing -->
          <div class="ts-auth-demo-bar">
            <span class="ts-auth-demo-label">
              <i data-lucide="key-round"></i>
              Demo accounts (click to test):
            </span>
            <div class="ts-auth-demo-pills">
              <button type="button" class="ts-auth-demo-pill" data-demo-email="alex@example.com">
                <span>Alex M.</span>
                <span class="badge">Individual</span>
              </button>
              <button type="button" class="ts-auth-demo-pill" data-demo-email="sarah@techcorp.com">
                <span>Sarah J.</span>
                <span class="badge">Connected</span>
              </button>
              <button type="button" class="ts-auth-demo-pill" data-demo-email="david@dev.io">
                <span>David C.</span>
                <span class="badge">Independent</span>
              </button>
              <button type="button" class="ts-auth-demo-pill" data-demo-email="admin@novatech.com">
                <span>NovaTech</span>
                <span class="badge">Company</span>
              </button>
            </div>
          </div>

          <div class="ts-auth-footer-prompt">
            Don't have an account?
            <a href="#/signup" id="linkToSignup">Create account</a>
          </div>
        </div>
      </section>
    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  bindLoginEvents();
}

function bindLoginEvents() {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const alertArea = document.getElementById('authAlertArea');
  const submitBtn = document.getElementById('loginSubmitBtn');
  const togglePwdBtn = document.getElementById('togglePasswordBtn');
  const togglePwdIcon = document.getElementById('togglePwdIcon');
  const googleBtn = document.getElementById('googleLoginBtn');
  const forgotLink = document.getElementById('forgotPasswordLink');

  // Toggle Password Visibility
  if (togglePwdBtn && passwordInput) {
    togglePwdBtn.addEventListener('click', () => {
      const isPwd = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPwd ? 'text' : 'password');
      togglePwdIcon.setAttribute('data-lucide', isPwd ? 'eye-off' : 'eye');
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Quick Demo Account Pill Fill
  document.querySelectorAll('[data-demo-email]').forEach(pill => {
    pill.addEventListener('click', () => {
      const email = pill.getAttribute('data-demo-email');
      emailInput.value = email;
      passwordInput.value = 'password123';
      clearAlert();
    });
  });

  // Forgot Password Toast
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim() || 'your email';
      showAlert(`Password reset link sent to ${email}. Check your inbox.`, 'success');
    });
  }

  // Google OAuth Simulation
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      emailInput.value = 'alex@example.com';
      passwordInput.value = 'password123';
      form.requestSubmit();
    });
  }

  // Form Submit Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAlert();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email) {
        showAlert('Please enter your email.', 'error');
        emailInput.focus();
        return;
      }

      if (!password) {
        showAlert('Please enter your password.', 'error');
        passwordInput.focus();
        return;
      }

      if (password.length < 8) {
        showAlert('Password must contain at least 8 characters.', 'error');
        passwordInput.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Signing in...</span>`;

      // Short smooth transition
      setTimeout(() => {
        const result = authenticateUser(email, password);

        if (!result.success) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Sign In</span><i data-lucide="arrow-right"></i>`;
          if (window.lucide) window.lucide.createIcons();
          showAlert(result.error || "We couldn't sign you in. Check your details and try again.", 'error');
          return;
        }

        // Successful login
        showAlert(`Welcome back, ${result.user.name}! Redirecting...`, 'success');
        submitBtn.innerHTML = `<span>Authenticated</span><i data-lucide="check"></i>`;
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
          window.location.hash = result.redirectTo;
        }, 500);
      }, 350);
    });
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
