/**
 * STERLING & CO. TAX ADVISORS - CLIENT PORTAL SCRIPT
 * Manages 3D Flip Card for Sign-in / Registration,
 * Password Visibility Toggle, Password Strength Meter,
 * SSO Simulation, and Security Validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPortal();
});

function initPortal() {
  const flipWrapper = document.querySelector('.flip-card-wrapper');
  const flipToRegisterBtn = document.getElementById('flip-to-register');
  const flipToLoginBtn = document.getElementById('flip-to-login');

  const loginForm = document.getElementById('portal-login-form');
  const registerForm = document.getElementById('portal-register-form');

  // 1. 3D Flip Card Toggle
  if (flipWrapper) {
    if (flipToRegisterBtn) {
      flipToRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        flipWrapper.classList.add('flipped');
      });
    }

    if (flipToLoginBtn) {
      flipToLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        flipWrapper.classList.remove('flipped');
      });
    }
  }

  // 2. Password Visibility Toggles
  const togglePassBtns = document.querySelectorAll('.password-toggle-btn');
  togglePassBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      // Toggle Eye Icon SVG
      btn.innerHTML = isPassword
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    });
  });

  // 3. Password Strength Meter on Registration
  const regPassword = document.getElementById('reg-password');
  const strengthFill = document.querySelector('.strength-fill');
  const strengthText = document.querySelector('.strength-text');

  if (regPassword && strengthFill && strengthText) {
    regPassword.addEventListener('input', () => {
      const val = regPassword.value;
      let score = 0;

      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      strengthFill.className = 'strength-fill';

      if (val.length === 0) {
        strengthFill.style.width = '0%';
        strengthText.textContent = 'Minimum 8 characters with numbers & symbols';
      } else if (score <= 1) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Weak password';
      } else if (score <= 3) {
        strengthFill.classList.add('medium');
        strengthText.textContent = 'Moderate strength';
      } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Strong client portal encryption standard';
      }
    });
  }

  // 4. Account Type Toggle (Individual vs Enterprise)
  const accountTypeOptions = document.querySelectorAll('.account-type-option');
  accountTypeOptions.forEach((opt) => {
    opt.addEventListener('click', () => {
      accountTypeOptions.forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // 5. Form Submissions
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('#login-email').value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      submitBtn.innerHTML = `<span>Authenticating 256-bit Vault...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = `<span>Access Granted. Redirecting...</span>`;
        if (typeof showToast === 'function') {
          showToast(`Welcome back, ${email}. Redirecting to Secure Client Dashboard.`, 'success');
        }
        setTimeout(() => {
          submitBtn.innerHTML = `<span>Sign In to Vault</span>`;
          submitBtn.disabled = false;
        }, 2000);
      }, 1200);
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = registerForm.querySelector('button[type="submit"]');

      submitBtn.innerHTML = `<span>Provisioning Vault...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        if (typeof showToast === 'function') {
          showToast(`Application submitted. Our Private Client Desk will contact you for identity verification.`, 'success');
        }
        submitBtn.innerHTML = `<span>Complete Registration</span>`;
        submitBtn.disabled = false;
        registerForm.reset();
        if (flipWrapper) flipWrapper.classList.remove('flipped');
      }, 1500);
    });
  }

  // 6. SSO Mock Trigger
  const ssoBtns = document.querySelectorAll('.sso-btn');
  ssoBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const provider = btn.textContent.trim();
      if (typeof showToast === 'function') {
        showToast(`Connecting to ${provider} Enterprise Identity Provider...`, 'info');
      }
    });
  });

  // 7. Forgot Password Trigger
  const forgotLink = document.querySelector('.forgot-pass-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      const email = prompt('Enter your registered email address for secure 2FA reset link:');
      if (email && email.includes('@')) {
        if (typeof showToast === 'function') {
          showToast(`Encrypted reset instructions dispatched to ${email}.`, 'success');
        }
      }
    });
  }
}
