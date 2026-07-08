/* ════════════════════════════════════════
   SCRIPT.JS - Tisha Chawlani Portfolio v2
   ════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════
     1. PARTICLE / STAR FIELD CANVAS
     ══════════════════════════════════ */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : -10;
      this.r = Math.random() * 1.6 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = Math.random() * 0.4 + 0.1;
      this.alpha = Math.random() * 0.7 + 0.2;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;
      if (this.y > H + 10) this.reset();
      if (this.x < -10 || this.x > W + 10) this.reset();
    }
    draw() {
      const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const color = isDark
        ? `rgba(165,180,252,${a})`
        : `rgba(99,102,241,${a * 0.5})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  // Shooting stars
  class ShootingStar {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H * 0.5;
      this.len = Math.random() * 80 + 40;
      this.speed = Math.random() * 6 + 4;
      this.angle = Math.PI / 4;
      this.alpha = 1;
      this.active = false;
      this.timer = Math.random() * 8000 + 4000;
    }
    activate() { this.active = true; this.alpha = 1; }
    update() {
      if (!this.active) return;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.alpha -= 0.025;
      if (this.alpha <= 0 || this.x > W || this.y > H) this.reset();
    }
    draw() {
      if (!this.active) return;
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.save();
      ctx.globalAlpha = this.alpha * (isDark ? 0.85 : 0.4);
      const grad = ctx.createLinearGradient(
        this.x, this.y,
        this.x - Math.cos(this.angle) * this.len,
        this.y - Math.sin(this.angle) * this.len
      );
      grad.addColorStop(0, '#a78bfa');
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - Math.cos(this.angle) * this.len, this.y - Math.sin(this.angle) * this.len);
      ctx.stroke();
      ctx.restore();
    }
  }

  function initParticles() {
    particles = Array.from({ length: 160 }, () => new Particle());
  }
  initParticles();

  const shootingStars = Array.from({ length: 3 }, () => new ShootingStar());
  // Randomly activate shooting stars
  setInterval(() => {
    const idle = shootingStars.find(s => !s.active);
    if (idle) idle.activate();
  }, 3500);

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    shootingStars.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();


  /* ══════════════════════════════════
     2. DARK / LIGHT THEME TOGGLE
     ══════════════════════════════════ */
  const html = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('tc-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('tc-theme', next);
  });


  /* ══════════════════════════════════
     3. NAVBAR SCROLL + ACTIVE LINKS
     ══════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveNav();
  });
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const pos = window.scrollY + 130;
    sections.forEach(sec => {
      const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (!link) return;
      link.classList.toggle('active', pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight);
    });
  }


  /* ══════════════════════════════════
     4. HAMBURGER MENU
     ══════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    const [s1, s2, s3] = hamburger.querySelectorAll('span');
    if (open) {
      s1.style.transform = 'translateY(7px) rotate(45deg)';
      s2.style.opacity = '0';
      s3.style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      [s1, s2, s3].forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });


  /* ══════════════════════════════════
     5. SCROLL REVEAL
     ══════════════════════════════════ */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 90);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));


  /* ══════════════════════════════════
     6. ANIMATED SKILL BARS
     ══════════════════════════════════ */
  const skillBarObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
          const pct = bar.getAttribute('data-pct');
          setTimeout(() => {
            bar.style.width = pct + '%';
          }, i * 100 + 200);
        });
        skillBarObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skill-bars').forEach(el => skillBarObs.observe(el));


  /* ══════════════════════════════════
     7. COUNTER ANIMATION (hero stats)
     ══════════════════════════════════ */
  function animateCounter(el, target, decimals, suffix) {
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (eased * target).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(el => {
          const raw = parseFloat(el.getAttribute('data-target') || el.textContent.replace(/[^0-9.]/g, ''));
          const suffix = el.getAttribute('data-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals') || '0');
          animateCounter(el, raw, decimals, suffix);
        });
        statsObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObs.observe(heroStats);


  /* ══════════════════════════════════
     8. TYPING EFFECT (hero subtitle)
     ══════════════════════════════════ */
  const subtitle = document.getElementById('hero-subtitle');
  if (subtitle) {
    const text = subtitle.textContent.trim();
    subtitle.textContent = '';
    subtitle.style.borderRight = '2.5px solid #6366f1';
    let i = 0;
    const type = setInterval(() => {
      if (i < text.length) {
        // Handle HTML entity
        if (text.slice(i, i + 5) === '&amp;') {
          subtitle.textContent += '&';
          i += 5;
        } else {
          subtitle.textContent += text[i++];
        }
      } else {
        clearInterval(type);
        setTimeout(() => { subtitle.style.borderRight = '2.5px solid transparent'; }, 500);
        setTimeout(() => { subtitle.style.borderRight = 'none'; }, 1000);
      }
    }, 55);
  }


  /* ══════════════════════════════════
     9. PARALLAX ORBS ON MOUSEMOVE
     ══════════════════════════════════ */
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });
  function updateOrbs() {
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    const orb3 = document.querySelector('.orb-3');
    if (orb1) orb1.style.transform = `translate(${mouseX * 30}px, ${mouseY * 30}px)`;
    if (orb2) orb2.style.transform = `translate(${-mouseX * 20}px, ${-mouseY * 20}px)`;
    if (orb3) orb3.style.transform = `translate(${mouseX * 15}px, ${mouseY * 15}px)`;
    requestAnimationFrame(updateOrbs);
  }
  updateOrbs();


  /* ══════════════════════════════════
     10. PROJECT CARD 3D TILT
     ══════════════════════════════════ */
  document.querySelectorAll('.project-card:not(.view-all-card)').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
      card.style.transform = `translateY(-5px) rotateX(${-y}deg) rotateY(${x}deg)`;
      card.style.transition = 'transform 0.08s ease, box-shadow 0.08s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.25s ease';
    });
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange = 'transform';
  });


  /* ══════════════════════════════════
     11. CONTACT FORM
     ══════════════════════════════════ */
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      emailjs.send("service_64yrcag", "template_iu8n6s4", {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value
      })
        .then(() => {
          alert("Message sent successfully!");
          form.reset();
        })
        .catch((error) => {
          alert("Failed to send message.");
          console.error(error);
        });
    });
  }


  /* ══════════════════════════════════
     12. SMOOTH SCROLL
     ══════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  /* ══════════════════════════════════
     13. BLOG CARD HOVER - ripple
     ══════════════════════════════════ */
  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect = card.getBoundingClientRect();
      Object.assign(ripple.style, {
        position: 'absolute',
        width: '6px', height: '6px',
        borderRadius: '50%',
        background: 'rgba(99,102,241,0.35)',
        left: `${e.clientX - rect.left - 3}px`,
        top: `${e.clientY - rect.top - 3}px`,
        transform: 'scale(0)',
        animation: 'ripple 0.6s ease-out forwards',
        pointerEvents: 'none',
      });
      card.style.overflow = 'hidden';
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
  // Inject ripple keyframe
  const styleEl = document.createElement('style');
  styleEl.textContent = `@keyframes ripple { to { transform: scale(60); opacity: 0; } }`;
  document.head.appendChild(styleEl);


  // Initial call
  updateActiveNav();
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});
