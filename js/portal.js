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
  function syncCardHeight() {
    const front = document.querySelector('.portal-card-front');
    const back = document.querySelector('.portal-card-back');
    const inner = document.querySelector('.flip-card-inner');
    if (!inner || !front || !back || !flipWrapper) return;
    const isFlipped = flipWrapper.classList.contains('flipped');
    const targetHeight = isFlipped ? back.scrollHeight : front.scrollHeight;
    inner.style.minHeight = (targetHeight + 10) + 'px';
  }

  if (flipWrapper) {
    window.addEventListener('resize', syncCardHeight);
    setTimeout(syncCardHeight, 200);

    if (flipToRegisterBtn) {
      flipToRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        flipWrapper.classList.add('flipped');
        setTimeout(syncCardHeight, 50);
      });
    }

    if (flipToLoginBtn) {
      flipToLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        flipWrapper.classList.remove('flipped');
        setTimeout(syncCardHeight, 50);
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

      // Toggle Eye Icon
      btn.innerHTML = isPassword
        ? `<i class="fa-solid fa-eye-slash"></i>`
        : `<i class="fa-solid fa-eye"></i>`;
    });
  });

  // Strict email validation regex
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 3. Email Validation, Password Strength (Min 6 Chars) & Confirm Match
  const regEmail = document.getElementById('reg-email');
  const emailFormatStatus = document.getElementById('email-format-status');
  const regPassword = document.getElementById('reg-password');
  const regConfirmPassword = document.getElementById('reg-confirm-password');
  const strengthFill = document.querySelector('.strength-fill');
  const strengthText = document.querySelector('.strength-text');
  const matchStatus = document.getElementById('password-match-status');

  // Real-time Email Validation
  function checkEmailFormat() {
    if (!regEmail || !emailFormatStatus) return;
    const emailVal = regEmail.value.trim();

    if (!emailVal) {
      emailFormatStatus.style.display = 'none';
      regEmail.style.borderColor = '';
      return;
    }

    emailFormatStatus.style.display = 'block';
    if (EMAIL_REGEX.test(emailVal)) {
      emailFormatStatus.textContent = '✓ Valid dynamic email format';
      emailFormatStatus.style.color = '#10b981';
      regEmail.style.borderColor = 'rgba(16, 185, 129, 0.6)';
    } else {
      emailFormatStatus.textContent = '✗ Invalid email format (e.g. name@domain.com)';
      emailFormatStatus.style.color = '#ef4444';
      regEmail.style.borderColor = 'rgba(239, 68, 68, 0.6)';
    }
    syncCardHeight();
  }

  if (regEmail) {
    regEmail.addEventListener('input', checkEmailFormat);
  }

  // Real-time Confirm Password Matching
  function checkPasswordMatch() {
    if (!regPassword || !regConfirmPassword || !matchStatus) return;
    const p1 = regPassword.value;
    const p2 = regConfirmPassword.value;

    if (!p2) {
      matchStatus.style.display = 'none';
      regConfirmPassword.style.borderColor = '';
      return;
    }

    matchStatus.style.display = 'block';
    if (p1 === p2) {
      matchStatus.textContent = '✓ Passwords match';
      matchStatus.style.color = '#10b981';
      regConfirmPassword.style.borderColor = 'rgba(16, 185, 129, 0.6)';
    } else {
      matchStatus.textContent = '✗ Passwords do not match';
      matchStatus.style.color = '#ef4444';
      regConfirmPassword.style.borderColor = 'rgba(239, 68, 68, 0.6)';
    }
    syncCardHeight();
  }

  // Real-time Password Strength (6 characters minimum)
  if (regPassword && strengthFill && strengthText) {
    regPassword.addEventListener('input', () => {
      const val = regPassword.value;

      strengthFill.className = 'strength-fill';

      if (val.length === 0) {
        strengthFill.style.width = '0%';
        strengthText.textContent = 'Minimum 6 characters required';
        strengthText.style.color = '';
      } else if (val.length < 6) {
        strengthFill.classList.add('weak');
        strengthFill.style.width = Math.min(25, (val.length / 6) * 30) + '%';
        const remaining = 6 - val.length;
        strengthText.textContent = `Too short: ${remaining} more character${remaining === 1 ? '' : 's'} required (minimum 6)`;
        strengthText.style.color = '#ef4444';
      } else {
        // Minimum 6 met! Calculate additional security score
        let score = 1; // 1 for passing min 6 chars
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        strengthText.style.color = '';
        if (score <= 2) {
          strengthFill.classList.add('medium');
          strengthFill.style.width = '60%';
          strengthText.textContent = 'Moderate security key (6+ characters)';
        } else {
          strengthFill.classList.add('strong');
          strengthFill.style.width = '100%';
          strengthText.textContent = 'Strong client portal encryption standard';
        }
      }

      checkPasswordMatch();
      syncCardHeight();
    });
  }

  if (regConfirmPassword) {
    regConfirmPassword.addEventListener('input', checkPasswordMatch);
  }

  // 4. Form Submissions
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = loginForm.querySelector('#login-email');
      const passInput = loginForm.querySelector('#login-password');
      const email = emailInput ? emailInput.value.trim() : '';
      const pass = passInput ? passInput.value : '';

      // Validate email format
      if (!EMAIL_REGEX.test(email)) {
        if (typeof showToast === 'function') {
          showToast('Please enter a valid email address (e.g. name@domain.com).', 'error');
        } else {
          alert('Please enter a valid email address (e.g. name@domain.com).');
        }
        if (emailInput) {
          emailInput.focus();
          emailInput.style.borderColor = '#ef4444';
        }
        return;
      }

      // Validate password length (min 6 characters)
      if (pass.length < 6) {
        if (typeof showToast === 'function') {
          showToast('Password must be at least 6 characters long.', 'error');
        } else {
          alert('Password must be at least 6 characters long.');
        }
        if (passInput) {
          passInput.focus();
          passInput.style.borderColor = '#ef4444';
        }
        return;
      }

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.innerHTML = `<span>Authenticating 256-bit Vault...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        const isAdmin = /admin|partner|sterling/i.test(email);
        localStorage.setItem("stacklyUserEmail", email);
        localStorage.setItem("stacklyUserRole", isAdmin ? "admin" : "user");
        const targetUrl = isAdmin ? 'admin.html' : 'user.html';
        const roleLabel = isAdmin ? 'Admin Dashboard' : 'User Dashboard';

        submitBtn.innerHTML = `<span>Access Granted. Redirecting...</span>`;
        if (typeof showToast === 'function') {
          showToast(`Welcome back, ${email}. Redirecting to ${roleLabel}...`, 'success');
        }
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 800);
      }, 1000);
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = registerForm.querySelector('#reg-email');
      const email = emailInput ? emailInput.value.trim() : '';
      const p1Input = registerForm.querySelector('#reg-password');
      const p2Input = registerForm.querySelector('#reg-confirm-password');
      const p1 = p1Input ? p1Input.value : '';
      const p2 = p2Input ? p2Input.value : '';

      // 1. Strict Email Format Check
      if (!EMAIL_REGEX.test(email)) {
        if (typeof showToast === 'function') {
          showToast('Please enter a valid executive email address (e.g. name@domain.com).', 'error');
        } else {
          alert('Please enter a valid executive email address (e.g. name@domain.com).');
        }
        if (emailInput) {
          emailInput.focus();
          emailInput.style.borderColor = '#ef4444';
        }
        return;
      }

      // 2. Minimum 6 Characters Password Check
      if (p1.length < 6) {
        if (typeof showToast === 'function') {
          showToast('Vault password must be at least 6 characters long.', 'error');
        } else {
          alert('Vault password must be at least 6 characters long.');
        }
        if (p1Input) {
          p1Input.focus();
          p1Input.style.borderColor = '#ef4444';
        }
        return;
      }

      // 3. Confirm Password Match Check
      if (p1 !== p2) {
        if (typeof showToast === 'function') {
          showToast('Passwords do not match. Please verify your confirm password.', 'error');
        } else {
          alert('Passwords do not match. Please re-enter your confirm password.');
        }
        if (p2Input) {
          p2Input.focus();
          p2Input.style.borderColor = '#ef4444';
        }
        return;
      }

      const firstName = registerForm.querySelector('#reg-first-name')?.value?.trim() || '';
      const lastName = registerForm.querySelector('#reg-last-name')?.value?.trim() || '';
      const fullName = `${firstName} ${lastName}`.trim();
      const submitBtn = registerForm.querySelector('button[type="submit"]');

      submitBtn.innerHTML = `<span>Provisioning Vault...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        // Save valid dynamic email and user profile
        localStorage.setItem("stacklyUserEmail", email);
        if (fullName) {
          localStorage.setItem("stacklyUserName", fullName);
        }
        localStorage.setItem("stacklyUserRole", "user");

        if (typeof showToast === 'function') {
          showToast(`Vault provisioned for ${email}. Redirecting...`, 'success');
        }
        submitBtn.innerHTML = `<span>Vault Activated. Redirecting...</span>`;
        setTimeout(() => {
          window.location.href = 'user.html';
        }, 800);
      }, 1200);
    });
  }

  // 6. SSO Mock Trigger
  const ssoBtns = document.querySelectorAll('.sso-btn');
  ssoBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isGoogle = btn.id.includes('google');
      const provider = isGoogle ? 'Google Workspace' : 'Microsoft SSO';
      const defaultEmail = isGoogle ? 'samyuktha.tax@gmail.com' : 'executive.director@microsoft.com';
      const email = prompt(`Sign in with ${provider}.\nEnter dynamic email:`, defaultEmail);
      if (email && email.includes('@')) {
        const isAdmin = /admin|partner|sterling/i.test(email);
        localStorage.setItem("stacklyUserEmail", email.trim());
        localStorage.setItem("stacklyUserRole", isAdmin ? "admin" : "user");
        const targetUrl = isAdmin ? 'admin.html' : 'user.html';
        if (typeof showToast === 'function') {
          showToast(`Connected as ${email}. Redirecting...`, 'success');
        }
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 600);
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
