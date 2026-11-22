// SkillBridge Landing Page Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky / Scrolled Navbar
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Mobile Hamburger Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close when clicking nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 3. Stats Counter Animation using IntersectionObserver
  const statNumbers = document.querySelectorAll('.stat-num');
  let animated = false;

  const countUp = (element, target) => {
    let start = 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start).toLocaleString();
      }
    }, stepTime);
  };

  const statsSection = document.getElementById('hero-stats');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            if (!isNaN(target)) {
              countUp(stat, target);
            }
          });
        }
      });
    }, { threshold: 0.5 });
    observer.observe(statsSection);
  }

  // 4. Subtle Floating Particles in Hero
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    const particleCount = 28;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      const color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.7)' : 'rgba(6, 182, 212, 0.7)';
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const opacity = Math.random() * 0.7 + 0.2;
      const dur = Math.random() * 10 + 8;

      p.style.cssText = 'position:absolute; width:' + size + 'px; height:' + size + 'px; background:' + color + '; border-radius:50%; top:' + top + '%; left:' + left + '%; opacity:' + opacity + '; pointer-events:none; box-shadow:0 0 8px currentColor; animation:floatParticle ' + dur + 's ease-in-out infinite alternate;';
      particlesContainer.appendChild(p);
    }

    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes floatParticle {
        0% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
        50% { transform: translateY(-25px) translateX(15px); opacity: 0.8; }
        100% { transform: translateY(-50px) translateX(-15px); opacity: 0.2; }
      }
      .particles {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
        z-index: 2;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // 5. Scroll Fade In Effect on Cards
  const cards = document.querySelectorAll('.feature-card, .step-item, .role-card, .price-card, .testimonial-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(25px)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    cardObserver.observe(card);
  });

  // 6. User Authentication State Check in Navbar
  const userData = sessionStorage.getItem('skillbridge_user');
  const navActions = document.querySelector('.nav-actions');
  if (userData && navActions) {
    try {
      const user = JSON.parse(userData);
      const displayName = user.name ? user.name.split(' ')[0] : (user.email ? user.email.split('@')[0] : 'Member');
      const roleCapitalized = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Learner';
      
      navActions.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div style="display:flex; align-items:center; gap:0.5rem; background:rgba(255,255,255,0.06); padding:0.4rem 0.9rem; border-radius:var(--radius-full); border:1px solid rgba(139,92,246,0.35); font-size:0.85rem; color:var(--text-primary); backdrop-filter:blur(8px);">
            <span style="width:8px; height:8px; border-radius:50%; background:var(--accent-emerald); box-shadow:0 0 6px var(--accent-emerald);"></span>
            <span>${displayName} <strong style="color:var(--accent-cyan-light)">(${roleCapitalized})</strong></span>
          </div>
          <button id="btn-logout" class="btn-ghost" style="padding:0.4rem 0.85rem; font-size:0.82rem; cursor:pointer; background:none; border:1px solid var(--border-color); border-radius:var(--radius-full);">Sign Out</button>
        </div>
      `;

      const logoutBtn = document.getElementById('btn-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          sessionStorage.removeItem('skillbridge_user');
          window.location.reload();
        });
      }
    } catch (e) {
      console.error('Error parsing session user', e);
    }
  }
});
