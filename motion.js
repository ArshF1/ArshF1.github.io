/* =========================================================
   Arsh Sahay — Portfolio
   motion.js  ·  scroll-driven animation layer
   GSAP + ScrollTrigger for scroll-linked motion, Lenis for smooth scroll.

   Progressive enhancement: all content is already visible in the HTML.
   If the libraries fail to load, or the visitor prefers reduced motion,
   this file exits early and the page stays static.
   ========================================================= */

(() => {
  "use strict";

  const root = document.documentElement;
  const releaseHero = () => root.classList.remove("motion-pending");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    releaseHero();
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  root.classList.add("has-motion");

  /* ---------- tiny DOM helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const make = (tag, className, attrs = {}, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    if (text != null) el.textContent = text;
    return el;
  };

  /* ----------------------------------------------------
     Smooth scroll (Lenis) wired into GSAP's ticker
     ---------------------------------------------------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", (instance) => {
      ScrollTrigger.update();
      // read by the background canvas in script.js for a light parallax drift
      window.__scrollVelocity = instance.velocity;
    });
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Resolve the real scroll target for an element (pinned sections live inside a pin-spacer)
  const scrollAnchor = (el) =>
    el.parentElement && el.parentElement.classList.contains("pin-spacer") ? el.parentElement : el;

  const scrollToEl = (el, immediate = false) => {
    if (el.id === "home") {
      lenis ? lenis.scrollTo(0, { immediate }) : window.scrollTo(0, 0);
      return;
    }
    const target = scrollAnchor(el);
    if (lenis) lenis.scrollTo(target, { duration: 1.3, immediate });
    else target.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  };

  // In-page anchor links: smooth scroll + move focus for keyboard / screen-reader users
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href").slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      scrollToEl(target);
      history.replaceState(null, "", `#${id}`);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* ----------------------------------------------------
     One-time DOM prep (runs once, not per breakpoint)
     ---------------------------------------------------- */

  // Hero name → characters. A visually hidden copy keeps it readable for screen readers.
  const splitChars = (el) => {
    const text = el.textContent.trim();
    el.textContent = "";
    el.appendChild(make("span", "sr-only", {}, text));
    const visual = make("span", "split", { "aria-hidden": "true" });
    text.split(" ").forEach((word, i, arr) => {
      const w = make("span", "word");
      Array.from(word).forEach((ch) => w.appendChild(make("span", "char", {}, ch)));
      visual.appendChild(w);
      if (i < arr.length - 1) visual.appendChild(document.createTextNode(" "));
    });
    el.appendChild(visual);
    return $$(".char", visual);
  };

  // Paragraph text → words, preserving inline elements such as .hl highlights
  const splitWords = (el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
        else frag.appendChild(make("span", "word", {}, part));
      });
      node.replaceWith(frag);
    });
    return $$(".word", el);
  };

  const heroName = $(".hero__name");
  const nameChars = heroName ? splitChars(heroName) : [];
  const aboutWords = $$(".about__text p").flatMap(splitWords);

  // Real elements for the experience rail so it can be drawn on scroll
  const pipeline = $(".pipeline");
  let railProgress = null;
  let railPulse = null;
  if (pipeline) {
    const rail = make("li", "pipeline__rail", { "aria-hidden": "true", role: "presentation" });
    railProgress = make("span", "pipeline__progress");
    railPulse = make("span", "pipeline__pulse");
    rail.append(railProgress, railPulse);
    pipeline.prepend(rail);
  }

  // Thin reading-progress bar along the top of the viewport
  const progressBar = make("div", "scroll-progress", { "aria-hidden": "true" });
  document.body.appendChild(progressBar);
  gsap.to(progressBar, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 }
  });

  /* ----------------------------------------------------
     Hero intro (time-based, plays once on load)
     ---------------------------------------------------- */
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".hero__greeting", { y: 18, opacity: 0, duration: 0.6 })
    .from(nameChars, {
      yPercent: 60,
      rotateX: -75,
      opacity: 0,
      transformOrigin: "50% 100%",
      stagger: 0.035,
      duration: 0.8
    }, "-=0.3")
    .from([".hero__role", ".hero__tagline"], { y: 22, opacity: 0, stagger: 0.12, duration: 0.7 }, "-=0.5")
    .from(".hero__cta .btn", { y: 14, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.4")
    .from(".hero__scroll", { opacity: 0, duration: 0.6 }, "-=0.2");
  releaseHero();

  /* ----------------------------------------------------
     Shared scroll helpers
     ---------------------------------------------------- */

  // Scrubbed "rise into place" for individual elements; reverses on scroll up
  const rise = (targets, vars = {}, trigger = {}) => {
    gsap.utils.toArray(targets).forEach((el) => {
      gsap.from(el, {
        y: 36,
        opacity: 0,
        ease: "power2.out",
        ...vars,
        scrollTrigger: { trigger: el, start: "top 92%", end: "top 70%", scrub: 0.6, ...trigger }
      });
    });
  };

  // Section heading: number + title slide in, divider line draws across
  const animateHead = (section) => {
    const head = section && $(".section__head", section);
    if (!head) return;
    gsap.timeline({
      scrollTrigger: { trigger: head, start: "top 90%", end: "top 62%", scrub: 0.6 }
    })
      .from($(".section__num", head), { x: -18, opacity: 0, ease: "power2.out" })
      .from($(".section__title", head), { x: -28, opacity: 0, ease: "power2.out" }, "<0.1")
      .from($(".section__line", head), { scaleX: 0, transformOrigin: "left center", ease: "power2.out" }, "<");
  };

  /* ----------------------------------------------------
     Scroll scenes, rebuilt per breakpoint.
     Created in page order so the pinned projects section
     pushes later triggers down correctly.
     ---------------------------------------------------- */
  const mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop: "(min-width: 861px) and (min-height: 700px)",
      isCompact: "(max-width: 860px), (max-height: 699px)"
    },
    (ctx) => {
      const { isDesktop } = ctx.conditions;
      const cleanups = [];

      /* ---- Hero: drifts up and fades as you scroll away ---- */
      gsap.timeline({
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      })
        .to(".hero__inner", { yPercent: isDesktop ? -18 : -10, opacity: 0, ease: "none" }, 0)
        .to(".hero__name", { scale: 0.94, transformOrigin: "left center", ease: "none" }, 0)
        .to(".hero__scroll", { opacity: 0, duration: 0.3, ease: "none" }, 0);

      /* ---- About: text lights up word by word ---- */
      const about = $("#about");
      animateHead(about);
      if (aboutWords.length) {
        gsap.fromTo(aboutWords, { opacity: 0.15 }, {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger: ".about__text",
            start: "top 78%",
            end: isDesktop ? "bottom 62%" : "bottom 80%",
            scrub: 0.5
          }
        });
      }
      rise(".about__card", { y: 80, rotate: isDesktop ? 1.5 : 0 }, { start: "top 95%", end: "top 55%" });

      /* ---- Impact: cards rise, numbers count with the scroll ---- */
      const impact = $("#impact");
      animateHead(impact);
      const metrics = $$(".metric");
      if (metrics.length) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".impact__grid", start: "top 88%", end: "top 45%", scrub: 0.6 }
        });
        tl.from(metrics, { y: 50, opacity: 0, stagger: 0.15, ease: "power2.out" }, 0);
        metrics.forEach((metric, i) => {
          const num = $("[data-count]", metric);
          if (!num) return;
          const target = parseInt(num.dataset.count, 10);
          const counter = { v: 0 };
          num.textContent = "0";
          tl.to(counter, {
            v: target,
            duration: 1,
            ease: "power1.out",
            onUpdate: () => { num.textContent = String(Math.round(counter.v)); }
          }, i * 0.15);
          cleanups.push(() => { num.textContent = String(target); });
        });
      }

      /* ---- Experience: the pipeline draws itself ---- */
      const experience = $("#experience");
      animateHead(experience);
      if (pipeline && railProgress && railPulse) {
        gsap.timeline({
          scrollTrigger: {
            trigger: pipeline,
            start: "top 65%",
            end: "bottom 65%",
            scrub: 0.5,
            invalidateOnRefresh: true
          }
        })
          .fromTo(railProgress, { scaleY: 0 }, { scaleY: 1, ease: "none" }, 0)
          .fromTo(railPulse, { y: 0 }, { y: () => pipeline.offsetHeight, ease: "none" }, 0);

        $$(".pipeline__job").forEach((job) => {
          // node lights up when the data pulse reaches it
          ScrollTrigger.create({
            trigger: job,
            start: "top 65%",
            onEnter: () => job.classList.add("is-active"),
            onLeaveBack: () => job.classList.remove("is-active")
          });
          rise($$(".pipeline__year, .pipeline__title, .pipeline__desc", job), { y: 24 });
          rise($$(".pipeline__points li", job), { x: 28, y: 0 }, { start: "top 94%", end: "top 74%" });
          rise($$(".pipeline__tags", job), { y: 16 });
          cleanups.push(() => job.classList.remove("is-active"));
        });
      }

      /* ---- Projects: horizontal film strip on desktop ---- */
      const projects = $("#projects");
      animateHead(projects);
      const grid = projects && $(".projects__grid", projects);
      const cards = grid ? $$(".project", grid) : [];

      if (isDesktop && grid && cards.length > 1) {
        projects.classList.add("is-strip");
        const meter = make("div", "projects__meter", { "aria-hidden": "true" });
        const meterFill = make("span");
        meter.appendChild(meterFill);
        grid.after(meter);

        // Distance the track travels so the last card lands on the content edge
        const visibleWidth = () => $(".section__head", projects).offsetWidth;
        const distance = () => Math.max(0, grid.scrollWidth - visibleWidth());

        const strip = gsap.timeline({
          scrollTrigger: {
            trigger: projects,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });
        strip
          .to(grid, { x: () => -distance(), ease: "none" }, 0)
          .to(meterFill, { scaleX: 1, ease: "none" }, 0);

        // Cards brighten and settle as they slide into frame
        cards.forEach((card) => {
          gsap.fromTo(card, { opacity: 0.35, "--enter": 0.94 }, {
            opacity: 1,
            "--enter": 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: strip,
              start: "left 92%",
              end: "left 62%",
              scrub: true
            }
          });
        });

        // Keyboard users: tabbing into an off-screen card scrolls the strip to it
        const onFocus = (e) => {
          const card = e.target.closest(".project");
          const st = strip.scrollTrigger;
          if (!card || !st) return;
          const offset = card.offsetLeft - cards[0].offsetLeft;
          const p = gsap.utils.clamp(0, 1, offset / Math.max(1, distance()));
          const y = st.start + (st.end - st.start) * p;
          lenis ? lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y);
        };
        grid.addEventListener("focusin", onFocus);

        cleanups.push(() => {
          grid.removeEventListener("focusin", onFocus);
          meter.remove();
          projects.classList.remove("is-strip");
        });
      } else {
        rise(cards, { y: 50 }, { start: "top 95%", end: "top 65%" });
      }

      /* ---- Stack: tags drift in and gather into their groups ---- */
      const skills = $("#skills");
      animateHead(skills);
      $$(".stack__group").forEach((group, i) => {
        const lag = isDesktop ? (i % 3) * 4 : 0; // slight column stagger on desktop
        gsap.timeline({
          scrollTrigger: {
            trigger: group,
            start: `top ${94 - lag}%`,
            end: `top ${58 - lag}%`,
            scrub: 0.6
          }
        })
          .from(group, { y: 50, opacity: 0, ease: "power2.out" })
          .from($$(".stack__list li", group), {
            x: () => gsap.utils.random(-36, 36),
            y: () => gsap.utils.random(-24, 24),
            scale: 0.85,
            opacity: 0,
            stagger: 0.04,
            ease: "power2.out"
          }, 0.15);
      });

      /* ---- Education: cards slide in from opposite sides ---- */
      const education = $("#education");
      animateHead(education);
      $$(".edu").forEach((card, i) => {
        gsap.from(card, {
          x: isDesktop ? (i % 2 ? 60 : -60) : 0,
          y: isDesktop ? 0 : 40,
          opacity: 0,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 92%", end: "clamp(top 60%)", scrub: 0.6 }
        });
      });

      /* ---- Contact: terminal settles in, links follow ---- */
      const contact = $("#contact");
      animateHead(contact);
      gsap.timeline({
        scrollTrigger: { trigger: ".contact__terminal", start: "top 95%", end: "clamp(top 50%)", scrub: 0.6 }
      })
        .from(".contact__terminal", { y: 70, scale: 0.95, opacity: 0, ease: "power2.out" })
        .from(".contact__link", { y: 20, opacity: 0, stagger: 0.08, ease: "power2.out" }, 0.3);

      return () => cleanups.forEach((fn) => fn());
    }
  );

  /* ----------------------------------------------------
     Layout settles after fonts and images load
     ---------------------------------------------------- */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
    // Deep links (e.g. /#projects) need re-targeting once pin spacing exists
    const id = location.hash.slice(1);
    const target = id && document.getElementById(id);
    if (target) scrollToEl(target, true);
  });
})();
