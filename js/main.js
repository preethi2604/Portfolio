/* =========================================================================
   PREETHI P J — PORTFOLIO SCRIPT
   Modules: Loading Screen, Custom Cursor, Network Canvas, Navbar/ScrollSpy,
   Mobile Menu, Typewriter, Animated Stats, Timeline Reveal, Project Filter,
   Smooth Anchor Nav, Contact Form Validation, Footer Year / Back-to-top.
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initLoadingScreen();
  initCustomCursor();
  initNetworkCanvas();
  initNavbar();
  initMobileMenu();
  initTypewriter();
  initAnimatedStats();
  initTimelineReveal();
  initScrollReveal();
  initProjectFilter();
  initSmoothAnchors();
  initContactForm();
  initFooter();
});

/* ---------- LOADING SCREEN (boot sequence) ---------- */
function initLoadingScreen() {
  const screen = document.getElementById("loading-screen");
  const log = document.getElementById("boot-log");
  const bar = document.getElementById("boot-bar-fill");
  if (!screen || !log || !bar) return;

  const lines = [
    "Initializing interface...",
    "Establishing LAN handshake...",
    "Loading skill modules [Java, Spring Boot]...",
    "Calibrating AI pipelines...",
    "Rendering portfolio.exe"
  ];

  let delay = 0;
  lines.forEach((text, i) => {
    const span = document.createElement("span");
    span.textContent = "> " + text;
    if (i === lines.length - 1) span.classList.add("ok");
    span.style.animationDelay = `${delay}ms`;
    log.appendChild(span);
    delay += 260;
  });

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => screen.classList.add("hidden"), 350);
    }
    bar.style.width = progress + "%";
  }, 180);

  // Safety net: never trap the user behind the loader
  setTimeout(() => screen.classList.add("hidden"), 3200);
}

/* ---------- CUSTOM CURSOR + MOUSE GLOW ---------- */
function initCustomCursor() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  const glow = document.getElementById("mouse-glow");
  if (!dot || !ring || !glow) return;
  if (window.matchMedia("(hover: none)").matches) return;

  let ringX = 0, ringY = 0, targetX = 0, targetY = 0;

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    dot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
    glow.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = "a, button, .glass-card, input, textarea";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverTargets)) ring.classList.add("cursor-hover");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverTargets)) ring.classList.remove("cursor-hover");
  });
}

/* ---------- NETWORK TOPOLOGY BACKGROUND CANVAS ---------- */
/* Signature element: nodes representing the stack, connected like a LAN,
   with data packets traveling the traces — echoes the resume's networking
   background instead of a generic particle field. */
function initNetworkCanvas() {
  const canvas = document.getElementById("network-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width, height, nodes, packets;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    buildNodes();
  }

  function buildNodes() {
    const count = Math.max(14, Math.floor((width * height) / 65000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 1.2
    }));
    packets = [];
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // move nodes
    nodes.forEach((n) => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    // connect nearby nodes
    const maxDist = 170;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.35;
          ctx.strokeStyle = `rgba(79, 209, 232, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          // occasionally spawn a data packet along this edge
          if (!reduceMotion && Math.random() < 0.0009) {
            packets.push({ a, b, t: 0, speed: 0.006 + Math.random() * 0.006 });
          }
        }
      }
    }

    // draw nodes
    nodes.forEach((n) => {
      ctx.fillStyle = "rgba(79, 209, 232, 0.55)";
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // draw + advance packets
    packets = packets.filter((p) => p.t <= 1);
    packets.forEach((p) => {
      const x = p.a.x + (p.b.x - p.a.x) * p.t;
      const y = p.a.y + (p.b.y - p.a.y) * p.t;
      ctx.fillStyle = "rgba(255, 158, 94, 0.9)";
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      p.t += p.speed;
    });

    requestAnimationFrame(step);
  }

  resize();
  window.addEventListener("resize", resize);
  step();
}

/* ---------- NAVBAR SCROLL STATE + SCROLL SPY ---------- */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main .section, .hero");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  });

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          links.forEach((link) => {
            link.classList.toggle("active-link", link.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((sec) => spy.observe(sec));
}

/* ---------- MOBILE MENU TOGGLE ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- HERO TYPEWRITER ---------- */
function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const roles = [
    "AI Specialist",
    "Full-Stack Engineer (Java / SpringBoot)",
    "Network Security Professional"
  ];

  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }
  tick();
}

/* ---------- ANIMATED STATISTICS (count-up on view) ---------- */
function initAnimatedStats() {
  const stats = document.querySelectorAll(".stat-number");
  if (!stats.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );
  stats.forEach((s) => observer.observe(s));

  function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const isDecimal = target % 1 !== 0;
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
}

/* ---------- TIMELINE SCROLL-TRIGGERED ANIMATION ---------- */
function initTimelineReveal() {
  const timeline = document.querySelector(".timeline");
  const items = document.querySelectorAll(".timeline-item");
  if (!timeline || !items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    },
    { threshold: 0.25 }
  );
  observer.observe(timeline);
  items.forEach((item) => observer.observe(item));
}

/* ---------- GENERIC SCROLL REVEAL (cards / grids) ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    ".stat-card, .skill-card, .project-card, .edu-item, .lang-pill, .contact-line, .contact-form"
  );
  targets.forEach((t) => t.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("in-view"), i * 40);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((t) => observer.observe(t));
}

/* ---------- PROJECT FILTER ---------- */
function initProjectFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card:not(.project-card--placeholder)");
  const placeholder = document.querySelector(".project-card--placeholder");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      let visibleCount = 0;
      cards.forEach((card) => {
        const tags = card.dataset.tags.split(" ");
        const match = filter === "all" || tags.includes(filter);
        card.classList.toggle("hide", !match);
        if (match) visibleCount++;
      });

      if (placeholder) placeholder.hidden = visibleCount > 0;
    });
  });
}

/* ---------- SMOOTH ANCHOR NAVIGATION ---------- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"], .anchor-link[data-target]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetSelector = link.getAttribute("href") || link.dataset.target;
      if (!targetSelector || targetSelector === "#") return;
      const target = document.querySelector(targetSelector);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById("navbar")?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ---------- CONTACT FORM: CLIENT-SIDE EMAIL VALIDATION ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(fieldId, message) {
    const row = document.getElementById(fieldId).closest(".form-row");
    const errorEl = document.getElementById(fieldId + "-error");
    row.classList.toggle("invalid", Boolean(message));
    errorEl.textContent = message || "";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name) { setError("name", "Please enter your name."); valid = false; }
    else setError("name", "");

    if (!email) { setError("email", "Please enter your email."); valid = false; }
    else if (!emailRegex.test(email)) { setError("email", "Enter a valid email address."); valid = false; }
    else setError("email", "");

    if (!message) { setError("message", "Please add a short message."); valid = false; }
    else setError("message", "");

    if (!valid) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("error");
      return;
    }

    // No backend is connected in this static build — confirm locally.
    status.classList.remove("error");
    status.textContent = `Thanks, ${name.split(" ")[0]}! Your message is ready — connect a backend or mailto action to deliver it.`;
    form.reset();
  });

  // live-clear errors while typing
  ["name", "email", "message"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => setError(id, ""));
  });
}

/* ---------- FOOTER: YEAR + BACK TO TOP ---------- */
function initFooter() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
