/* =========================================================
   Arsh Sahay — Portfolio
   script.js  ·  interactions, animations, background
   ========================================================= */

(() => {
  "use strict";

  /* ----------------------------------------------------
     Footer year
     ---------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------
     Mobile nav toggle
     ---------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks  = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close on link click (mobile)
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ----------------------------------------------------
     Theme toggle (light / dark)
     ---------------------------------------------------- */
  const THEME_KEY = "arsh-portfolio-theme";
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");

  const getInitialTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    if (themeBtn) {
      themeBtn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  };

  // Apply the initial theme as early as possible to avoid a flash.
  applyTheme(getInitialTheme());

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  // Track OS-level changes only if the user hasn't picked manually
  const media = window.matchMedia("(prefers-color-scheme: light)");
  media.addEventListener?.("change", (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? "light" : "dark");
    }
  });

  /* ----------------------------------------------------
     Nav background on scroll
     ---------------------------------------------------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 12) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------
     Typing effect — hero role
     ---------------------------------------------------- */
  const roles = [
    "build ETL pipelines.",
    "orchestrate data flows.",
    "ship RAG systems.",
    "design schemas that scale.",
    "debug 2 AM production bugs."
  ];

  const typedEl = document.getElementById("typed");
  if (typedEl) {
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    const TYPING_SPEED = 75;
    const DELETING_SPEED = 35;
    const PAUSE_AFTER = 1400;
    const PAUSE_BEFORE = 400;

    const tick = () => {
      const current = roles[roleIdx];

      if (!deleting) {
        charIdx++;
        typedEl.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(tick, PAUSE_AFTER);
          return;
        }
        setTimeout(tick, TYPING_SPEED);
      } else {
        charIdx--;
        typedEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(tick, PAUSE_BEFORE);
          return;
        }
        setTimeout(tick, DELETING_SPEED);
      }
    };

    // kick off after a small delay
    setTimeout(tick, 600);
  }

  /* ----------------------------------------------------
     Typing effect — contact command line
     ---------------------------------------------------- */
  const typedCmdEl = document.getElementById("typedCmd");
  if (typedCmdEl) {
    const cmd = "ssh arsh@hands-on-data-engineer.dev";
    let i = 0;
    const typeCmd = () => {
      typedCmdEl.textContent = cmd.slice(0, i++);
      if (i <= cmd.length) setTimeout(typeCmd, 60);
    };
    // start when the contact section is in view
    const contactObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            typeCmd();
            contactObs.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    const contactSection = document.getElementById("contact");
    if (contactSection) contactObs.observe(contactSection);
  }

  /* ----------------------------------------------------
     Scroll reveal
     ---------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    ".section__head, .about__text p, .about__card, " +
    ".stack__group, .project, .pipeline__job, .contact__terminal, .hero__inner > *, " +
    ".skill"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  // Pre-set the --pct custom property for each skill bar from its data-pct
  document.querySelectorAll(".skill__fill").forEach((fill) => {
    const pct = fill.getAttribute("data-pct");
    if (pct) fill.style.setProperty("--pct", pct + "%");
  });

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // slight stagger for grouped items
          const delay = entry.target.dataset.delay || i * 60;
          setTimeout(() => entry.target.classList.add("is-visible"), Math.min(delay, 400));

          // Animate the skill bar fills if this is a skill row
          if (entry.target.classList.contains("skill")) {
            const fill = entry.target.querySelector(".skill__fill");
            if (fill) {
              setTimeout(() => fill.classList.add("in"), 200);
            }
          }

          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((el) => revealObs.observe(el));
  
  // Code by Arsh
  const initProjectTitleMarquee = () => {
  document.querySelectorAll(".project__title").forEach((title) => {
    const text = title.textContent.trim();

    if (!title.querySelector(".project__title-text")) {
      title.textContent = "";
      const inner = document.createElement("span");
      inner.className = "project__title-text";
      inner.textContent = text;
      title.appendChild(inner);
    }

    const inner = title.querySelector(".project__title-text");
    const overflow = inner.scrollWidth > title.clientWidth + 4;

    if (overflow) {
      const shift = title.clientWidth - inner.scrollWidth;
      title.style.setProperty("--project-title-shift", `${shift}px`);
      title.style.setProperty("--project-title-duration", `${Math.max(6, Math.abs(shift) / 18)}s`);
      title.classList.add("is-marquee");
    } else {
      title.classList.remove("is-marquee");
    }
  });
};

requestAnimationFrame(initProjectTitleMarquee);
window.addEventListener("resize", () => requestAnimationFrame(initProjectTitleMarquee), { passive: true });

  /* ----------------------------------------------------
     Active section highlight in nav
     ---------------------------------------------------- */
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll(".nav__links a");

  if (sections.length && navAnchors.length) {
    const sectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navAnchors.forEach((a) => {
              const match = a.getAttribute("href") === `#${id}`;
              a.style.color = match ? "var(--accent)" : "";
            });
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    sections.forEach((s) => sectionObs.observe(s));
  }

  /* ----------------------------------------------------
     Animated data-flow background canvas
     ---------------------------------------------------- */
  const canvas = document.getElementById("bg-canvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let w, h;
    let particles = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const COUNT_DIVISOR = 9000;   // lower = more particles
    const MAX_DIST = 140;         // connection distance
    const SPEED = 0.25;

    // Theme-aware color palettes.
    // Dark mode uses bright teal that pops on near-black.
    // Light mode uses deeper teal + slate for contrast on white.
    const themeColors = {
      dark: {
        particle: "94, 234, 212",   // teal-300
        particleA: 0.55,
        lineA: 0.18,
        bgOpacity: 0.55
      },
      light: {
        particle: "13, 148, 136",   // teal-600
        particleA: 0.55,
        lineA: 0.22,
        bgOpacity: 0.7
      }
    };

    const getColors = () =>
      themeColors[document.documentElement.getAttribute("data-theme") || "dark"];

    const resize = () => {
      w = canvas.width  = window.innerWidth  * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width  = window.innerWidth  + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);

      const count = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / COUNT_DIVISOR));
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const spawn = (initial = false) => {
      return {
        x: Math.random() * window.innerWidth,
        y: initial ? Math.random() * window.innerHeight : -10,
        vx: (Math.random() - 0.5) * SPEED,
        vy: Math.random() * SPEED * 0.6 + SPEED * 0.2,
        r: Math.random() * 1.4 + 0.4
      };
    };

    const step = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const colors = getColors();

      ctx.clearRect(0, 0, W, H);

      // particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y > H) {
          p.y = -10;
          p.x = Math.random() * W;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colors.particle}, ${colors.particleA})`;
        ctx.fill();
      }

      // connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * colors.lineA;
            ctx.strokeStyle = `rgba(${colors.particle}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(step);
    };

    // Sync the canvas wrapper opacity with the active theme
    const syncCanvasOpacity = () => {
      canvas.style.opacity = String(getColors().bgOpacity);
    };
    syncCanvasOpacity();

    // React to live theme toggles without a hard re-init
    const themeObserver = new MutationObserver(syncCanvasOpacity);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });

    window.addEventListener("resize", resize, { passive: true });

    // Respect reduced motion
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resize();
    if (!reduce) step();
  }
})();
