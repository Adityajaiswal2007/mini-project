// SkillBridge — Learner Panel Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Session State & User Profile Initialization
  const userDataStr = sessionStorage.getItem('skillbridge_user');
  let user = { name: 'Learner Member', email: 'learner@skillbridge.io', role: 'learner' };
  
  if (userDataStr) {
    try {
      const parsed = JSON.parse(userDataStr);
      if (parsed) user = Object.assign(user, parsed);
    } catch (e) {
      console.error('Error reading session user', e);
    }
  }

  const userNameEl = document.getElementById('dash-user-name');
  const userAvatarEl = document.getElementById('dash-user-avatar');
  const heroGreetingEl = document.getElementById('dash-hero-greeting');

  if (userNameEl) {
    const displayName = user.name ? user.name : user.email.split('@')[0];
    userNameEl.textContent = displayName;
  }

  if (userAvatarEl) {
    const initial = user.name ? user.name.charAt(0).toUpperCase() : 'L';
    userAvatarEl.textContent = initial;
  }

  if (heroGreetingEl) {
    const firstName = user.name ? user.name.split(' ')[0] : 'Learner';
    heroGreetingEl.textContent = `Welcome back, ${firstName}! 👋`;
  }

  // 2. Sidebar Navigation & Tab Switching
  const navLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute('data-tab');

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      tabPanes.forEach(pane => {
        if (pane.id === `tab-${targetTab}`) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });

      // Close mobile sidebar if open
      const sidebar = document.getElementById('dash-sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // 3. Mobile Sidebar Toggle
  const btnMobileSidebar = document.getElementById('btn-mobile-sidebar');
  const sidebar = document.getElementById('dash-sidebar');

  if (btnMobileSidebar && sidebar) {
    btnMobileSidebar.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !btnMobileSidebar.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // 4. Toast Notification System
  const showToast = (message, type = 'success') => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✓' : 'ℹ';
    toast.innerHTML = `<span style="font-weight:700; color:${type === 'success' ? '#10b981' : '#06b6d4'}">${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  };

  // 5. Course Filter Buttons
  const filterBtns = document.querySelectorAll('.course-filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      courseCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-status') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Interactive Course Resume & Action Buttons
  const courseActionBtns = document.querySelectorAll('.btn-course-action');
  courseActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const courseTitle = btn.getAttribute('data-course') || 'Course';
      showToast(`Loading: ${courseTitle}... Opening lecture player.`);
    });
  });

  // 7. Interactive Adaptive Assessment Modal
  const modalOverlay = document.getElementById('quiz-modal-overlay');
  const btnStartQuiz = document.getElementById('btn-start-gap-assessment');
  const btnCloseModal = document.getElementById('btn-close-quiz-modal');
  const quizForm = document.getElementById('adaptive-quiz-form');
  const quizResultArea = document.getElementById('quiz-result-area');

  if (btnStartQuiz && modalOverlay) {
    btnStartQuiz.addEventListener('click', () => {
      modalOverlay.classList.add('active');
    });
  }

  if (btnCloseModal && modalOverlay) {
    btnCloseModal.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('btn-submit-quiz');
      submitBtn.textContent = 'Analyzing Performance...';
      submitBtn.disabled = true;

      setTimeout(() => {
        quizForm.style.display = 'none';
        if (quizResultArea) {
          quizResultArea.style.display = 'block';
        }
        showToast('Assessment completed! Competency radar updated (+6% score).', 'success');
      }, 1200);
    });
  }

  // 8. Sign Out Handler
  const signOutBtns = document.querySelectorAll('.action-signout');
  signOutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('skillbridge_user');
      showToast('Signed out successfully. Returning to home...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 900);
    });
  });
});
