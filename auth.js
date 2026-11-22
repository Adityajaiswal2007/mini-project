// SkillBridge Authentication Interactive Logic (Sign In & Sign Up)

document.addEventListener('DOMContentLoaded', () => {
  // 1. Generate Ambient Floating Particles in background
  const particlesContainer = document.getElementById('auth-particles');
  if (particlesContainer) {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3.5 + 2;
      const color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.65)' : 'rgba(6, 182, 212, 0.65)';
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const opacity = Math.random() * 0.6 + 0.2;
      const dur = Math.random() * 10 + 8;

      p.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        top: ${top}%;
        left: ${left}%;
        opacity: ${opacity};
        pointer-events: none;
        box-shadow: 0 0 8px currentColor;
        animation: floatParticle ${dur}s ease-in-out infinite alternate;
      `;
      particlesContainer.appendChild(p);
    }
  }

  // 2. Role Selector Switcher
  const roleChips = document.querySelectorAll('.role-chip');
  const roleHint = document.getElementById('role-hint');
  const roleInput = document.getElementById('selected-role');

  const roleDescriptions = {
    learner: 'Learner Account: Personalized gap reports, AI learning paths & competency badges.',
    trainer: 'Trainer Account: Cohort analytics, smart quiz creation & course management.',
    admin: 'Administrator Account: Org-wide benchmarking, skill frameworks & user governance.'
  };

  const selectRole = (role) => {
    roleChips.forEach(chip => {
      if (chip.getAttribute('data-role') === role) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
    if (roleInput) roleInput.value = role;
    if (roleHint && roleDescriptions[role]) {
      roleHint.textContent = roleDescriptions[role];
    }
  };

  roleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const role = chip.getAttribute('data-role');
      selectRole(role);
    });
  });

  // Check URL query parameters for pre-selected role (e.g. ?role=trainer)
  const urlParams = new URLSearchParams(window.location.search);
  const paramRole = urlParams.get('role');
  if (paramRole && ['learner', 'trainer', 'admin'].includes(paramRole.toLowerCase())) {
    selectRole(paramRole.toLowerCase());
  }

  // 3. Password Show / Hide Toggles
  const toggleButtons = document.querySelectorAll('.btn-password-toggle');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');

      // Update SVG icon
      if (isPassword) {
        btn.innerHTML = `
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
          </svg>
        `;
        btn.setAttribute('aria-label', 'Hide password');
      } else {
        btn.innerHTML = `
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
        `;
        btn.setAttribute('aria-label', 'Show password');
      }
    });
  });

  // 4. Password Strength Meter (Signup Page)
  const passwordInput = document.getElementById('signup-password');
  const strengthStatus = document.getElementById('strength-status');
  const strengthSteps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
    document.getElementById('step-4')
  ];

  if (passwordInput && strengthStatus && strengthSteps[0]) {
    passwordInput.addEventListener('input', () => {
      const val = passwordInput.value;
      let score = 0;

      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const levels = [
        { label: 'Too Weak', color: 'rgba(255, 255, 255, 0.1)', textColor: 'var(--text-muted)' },
        { label: 'Weak', color: '#f43f5e', textColor: '#f43f5e' },
        { label: 'Fair', color: '#f59e0b', textColor: '#f59e0b' },
        { label: 'Good', color: '#06b6d4', textColor: '#06b6d4' },
        { label: 'Strong', color: '#10b981', textColor: '#10b981' }
      ];

      const current = val.length === 0 ? levels[0] : levels[score];
      strengthStatus.textContent = current.label;
      strengthStatus.style.color = current.textColor;

      strengthSteps.forEach((step, index) => {
        if (!step) return;
        if (index < score && val.length > 0) {
          step.style.background = current.color;
          step.style.boxShadow = `0 0 8px ${current.color}`;
        } else {
          step.style.background = 'transparent';
          step.style.boxShadow = 'none';
        }
      });
    });
  }

  // 5. Toast Notification System
  const showToast = (message, type = 'success') => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✓' : '⚠';
    toast.innerHTML = `<span style="font-weight:700; color:${type === 'success' ? '#10b981' : '#f43f5e'}">${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3800);
  };

  // 6. Demo Account Quick Fill (Login Page)
  const demoButtons = document.querySelectorAll('.btn-demo-pill');
  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-demo-role');
      const emailInput = document.getElementById('login-email');
      const passwordInput = document.getElementById('login-password');

      if (emailInput && passwordInput) {
        if (role === 'learner') {
          emailInput.value = 'learner@skillbridge.io';
          passwordInput.value = 'SkillLearner@2026';
          selectRole('learner');
          showToast('Loaded demo credentials for Learner');
        } else if (role === 'trainer') {
          emailInput.value = 'trainer@skillbridge.io';
          passwordInput.value = 'MasterTrainer#2026';
          selectRole('trainer');
          showToast('Loaded demo credentials for Trainer');
        } else if (role === 'admin') {
          emailInput.value = 'admin@skillbridge.io';
          passwordInput.value = 'EnterpriseAdmin!2026';
          selectRole('admin');
          showToast('Loaded demo credentials for Admin');
        }
      }
    });
  });

  // 7. Sign In Form Submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const alertBox = document.getElementById('login-alert');
      const submitBtn = document.getElementById('btn-login-submit');

      if (!email || !password) {
        if (alertBox) {
          alertBox.className = 'auth-alert auth-alert-error show';
          alertBox.innerHTML = '<span>⚠ Please enter both your email and password.</span>';
        }
        return;
      }

      // Start loading simulation
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        const role = roleInput ? roleInput.value : 'learner';
        // Save user simulation state in sessionStorage
        sessionStorage.setItem('skillbridge_user', JSON.stringify({
          email: email,
          role: role,
          isLoggedIn: true,
          timestamp: new Date().toISOString()
        }));

        if (alertBox) {
          alertBox.className = 'auth-alert auth-alert-success show';
          alertBox.innerHTML = `<span>✓ Welcome back! Authentication successful. Redirecting to your ${role.toUpperCase()} dashboard...</span>`;
        }

        showToast(`Signed in successfully as ${role}!`, 'success');

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1200);
      }, 1100);
    });
  }

  // 8. Sign Up Form Submission
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm-password').value;
      const terms = document.getElementById('signup-terms').checked;
      const alertBox = document.getElementById('signup-alert');
      const submitBtn = document.getElementById('btn-signup-submit');

      if (!name || !email || !password || !confirmPassword) {
        if (alertBox) {
          alertBox.className = 'auth-alert auth-alert-error show';
          alertBox.innerHTML = '<span>⚠ Please fill in all required fields.</span>';
        }
        return;
      }

      if (password.length < 8) {
        if (alertBox) {
          alertBox.className = 'auth-alert auth-alert-error show';
          alertBox.innerHTML = '<span>⚠ Password must be at least 8 characters long.</span>';
        }
        return;
      }

      if (password !== confirmPassword) {
        if (alertBox) {
          alertBox.className = 'auth-alert auth-alert-error show';
          alertBox.innerHTML = '<span>⚠ Passwords do not match. Please verify and re-enter.</span>';
        }
        return;
      }

      if (!terms) {
        if (alertBox) {
          alertBox.className = 'auth-alert auth-alert-error show';
          alertBox.innerHTML = '<span>⚠ You must agree to the Terms of Service & Privacy Policy.</span>';
        }
        return;
      }

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        const role = roleInput ? roleInput.value : 'learner';
        sessionStorage.setItem('skillbridge_user', JSON.stringify({
          name: name,
          email: email,
          role: role,
          isLoggedIn: true,
          timestamp: new Date().toISOString()
        }));

        if (alertBox) {
          alertBox.className = 'auth-alert auth-alert-success show';
          alertBox.innerHTML = `<span>✓ Welcome to SkillBridge, ${name}! Your ${role.toUpperCase()} account is ready. Redirecting...</span>`;
        }

        showToast(`Account created successfully! Welcome, ${name}.`, 'success');

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1400);
      }, 1200);
    });
  }

  // 9. Forgot Password Modal Logic
  const forgotModal = document.getElementById('forgot-modal');
  const openForgotBtn = document.getElementById('link-forgot-password');
  const closeForgotBtn = document.getElementById('btn-close-modal');
  const forgotForm = document.getElementById('forgot-form');

  if (forgotModal && openForgotBtn) {
    openForgotBtn.addEventListener('click', (e) => {
      e.preventDefault();
      forgotModal.classList.add('active');
    });

    if (closeForgotBtn) {
      closeForgotBtn.addEventListener('click', () => {
        forgotModal.classList.remove('active');
      });
    }

    forgotModal.addEventListener('click', (e) => {
      if (e.target === forgotModal) {
        forgotModal.classList.remove('active');
      }
    });

    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const resetEmail = document.getElementById('reset-email').value.trim();
        const modalAlert = document.getElementById('modal-alert');
        const resetBtn = document.getElementById('btn-reset-submit');

        if (!resetEmail) {
          modalAlert.className = 'auth-alert auth-alert-error show';
          modalAlert.innerHTML = '<span>⚠ Please enter your email address.</span>';
          return;
        }

        resetBtn.disabled = true;
        resetBtn.textContent = 'Sending link...';

        setTimeout(() => {
          modalAlert.className = 'auth-alert auth-alert-success show';
          modalAlert.innerHTML = `<span>✓ Password reset link sent to <strong>${resetEmail}</strong>. Check your inbox.</span>`;
          resetBtn.disabled = false;
          resetBtn.textContent = 'Sent! Check Inbox';

          setTimeout(() => {
            forgotModal.classList.remove('active');
            showToast('Recovery link sent! Please check your email.');
          }, 2000);
        }, 1000);
      });
    }
  }

  // 10. Social Login Button Simulation
  const socialButtons = document.querySelectorAll('.btn-social');
  socialButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const provider = btn.getAttribute('data-provider') || 'Provider';
      showToast(`Connecting with ${provider}... (Demo Mode)`);
    });
  });
});
