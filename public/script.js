"use strict";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

// Mobile nav toggle
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;
  var body = document.body;
  var links = menu.querySelectorAll("a");
  var mobileQuery = window.matchMedia("(max-width: 640px)");

  function setMenuState(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (body) {
      body.classList.toggle("mobile-nav-open", open);
    }
  }

  toggle.addEventListener("click", function () {
    var open = !menu.classList.contains("open");
    setMenuState(open);
  });

  // Close menu when a link is clicked (for in-page nav on mobile)
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuState(false);
    });
  });

  window.addEventListener("resize", function () {
    if (!mobileQuery.matches) {
      setMenuState(false);
    }
  });

  document.addEventListener("click", function (event) {
    if (!menu.classList.contains("open")) return;
    if (!mobileQuery.matches) return;
    if (menu.contains(event.target) || toggle.contains(event.target)) return;
    setMenuState(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (!menu.classList.contains("open")) return;
    setMenuState(false);
  });
})();

// Copy email button (only on contact page)
(function () {
  var btn = document.getElementById("emailbutton");
  if (!btn) return;

  btn.addEventListener("click", function () {
    navigator.clipboard.writeText("olimasad@gmail.com").then(
      function () {
        var label = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(function () {
          btn.textContent = label;
        }, 2000);
      }
    );
  });
})();

// Smooth reveal-on-load + on-scroll interactions
(function () {
  var revealObserver = null;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var REVEAL_TRANSITION_MS = 560;
  /* A hair past the end of the transition, so `reveal-done` never lands mid-frame. */
  var REVEAL_DONE_BUFFER_MS = 20;
  var revealSelectors =
    ".section, .card:not(.project-item):not(.achievement-card), .contact-block, .form-section, .fact-card, .mini-card, .experience-card, .achievement-banner, .award-mini, .timeline-card, .chip, .skill-cloud span, .skill-cloud-tag, .expandable-block:not(.win-card-link), .bento, .bento-row, .win-card, .year-bar, .stats-band, .dock-anchor, .home-head, .track-heading, .skill-detail, .msg-success, .msg-error, .footer-links, footer p";
  /* Cards inside a shared parent cascade instead of all landing at once. */
  var STAGGER_STEP_MS = 65;
  var STAGGER_MAX_MS = 420;

  function parseDelayMs(value) {
    if (!value) return 0;
    var numeric = parseFloat(String(value).replace("ms", "").trim());
    return Number.isFinite(numeric) ? numeric : 0;
  }

  function setupPageReveals() {
    var revealTargets = document.querySelectorAll(revealSelectors);
    if (!revealTargets.length) return;

    if (revealObserver) {
      revealObserver.disconnect();
    }

    // Reset state first so animations replay whenever a new page loads.
    var groupCounts = new Map();
    revealTargets.forEach(function (el) {
      el.classList.remove("reveal", "in-view", "reveal-done");

      // Delay is per sibling group, so each row/grid cascades on its own.
      var parent = el.parentElement;
      var position = groupCounts.get(parent) || 0;
      groupCounts.set(parent, position + 1);
      el.style.setProperty("--reveal-delay", Math.min(position * STAGGER_STEP_MS, STAGGER_MAX_MS) + "ms");
    });

    // Two-frame setup:
    // 1) add hidden reveal state
    // 2) start observing so entering-view transition always has a pre-state
    window.requestAnimationFrame(function () {
      revealTargets.forEach(function (el) {
        el.classList.add("reveal");
      });

      window.requestAnimationFrame(function () {
        revealObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                if (prefersReducedMotion) {
                  entry.target.classList.add("reveal-done");
                } else {
                  // Counted from the element's own stagger delay, so the handover waits for
                  // this entrance to finish rather than for the first one in the group.
                  var ownDelay = parseDelayMs(entry.target.style.getPropertyValue("--reveal-delay"));
                  window.setTimeout(function () {
                    // Hands transitions back to the element's own rules so hover feels instant.
                    entry.target.classList.add("reveal-done");
                  }, ownDelay + REVEAL_TRANSITION_MS + REVEAL_DONE_BUFFER_MS);
                }
                revealObserver.unobserve(entry.target);
              }
            });
          },
          // Pre-trigger just below the fold so content has settled by the time it is read.
          // A negative bottom margin would leave anything pinned to the bottom of the page
          // (the footer at max scroll) permanently unrevealed.
          { threshold: 0.02, rootMargin: "0px 0px 10% 0px" }
        );

        revealTargets.forEach(function (el) {
          revealObserver.observe(el);
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupPageReveals, { once: true });
  } else {
    setupPageReveals();
  }

  // Also retrigger when a page is restored from cache.
  window.addEventListener("pageshow", function () {
    setupPageReveals();
  });
})();

// Hero intro choreography (home page)
(function () {
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function finishInstantly(hero, items) {
    items.forEach(function (item) {
      item.classList.add("intro-in");
    });
    hero.classList.add("hero-complete");
  }

  function playIntro(hero) {
    var introItems = hero.querySelectorAll(".intro-item");
    if (!introItems.length) return;

    hero.classList.remove("hero-complete");
    introItems.forEach(function (item) {
      item.classList.remove("intro-in");
    });

    if (prefersReducedMotion) {
      finishInstantly(hero, introItems);
      return;
    }

    var elapsed = 130;
    introItems.forEach(function (item, index) {
      window.setTimeout(function () {
        item.classList.add("intro-in");
      }, elapsed);

      elapsed += index === introItems.length - 2 ? 210 : 140;
    });

    window.setTimeout(function () {
      hero.classList.add("hero-complete");
    }, elapsed + 120);
  }

  // Every page opens with the same choreography: the home hero plus any .intro-scope header.
  function runHeroIntro() {
    document.querySelectorAll(".hero-flat, .intro-scope").forEach(playIntro);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runHeroIntro, { once: true });
  } else {
    runHeroIntro();
  }

  // Trigger again when restoring from bfcache.
  window.addEventListener("pageshow", function () {
    runHeroIntro();
  });
})();

// Modern custom cursor (desktop only)
(function () {
  var root = document.documentElement;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (prefersReducedMotion || coarsePointer) return;

  // Hide native cursor as soon as this script executes.
  root.classList.add("modern-cursor-enabled");

  function initModernCursor() {
    var body = document.body;
    if (!body) return;

    var blur = document.createElement("div");
    blur.className = "cursor-blur";
    body.appendChild(blur);

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var blurX = mouseX;
    var blurY = mouseY;
    var rafId = null;
    var idleTimer = null;

    function setActiveCursorState() {
      body.classList.add("cursor-active");
      if (idleTimer) {
        window.clearTimeout(idleTimer);
      }
      idleTimer = window.setTimeout(function () {
        body.classList.remove("cursor-active");
      }, 1600);
    }

    function render() {
      blurX += (mouseX - blurX) * 0.2;
      blurY += (mouseY - blurY) * 0.2;

      blur.style.left = blurX + "px";
      blur.style.top = blurY + "px";
      rafId = window.requestAnimationFrame(render);
    }

    function startRenderLoop() {
      if (rafId) return;
      rafId = window.requestAnimationFrame(render);
    }

    function stopRenderLoop() {
      if (!rafId) return;
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }

    window.addEventListener("mousemove", function (event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
      setActiveCursorState();
      startRenderLoop();
    }, { passive: true });

    window.addEventListener("mouseleave", function () {
      body.classList.remove("cursor-active");
      stopRenderLoop();
    });

    window.addEventListener("blur", function () {
      body.classList.remove("cursor-active");
    });

    window.addEventListener("pageshow", function () {
      startRenderLoop();
    });

    startRenderLoop();
  }

  if (document.readyState === "loading" && !document.body) {
    document.addEventListener("DOMContentLoaded", initModernCursor, { once: true });
  } else {
    initModernCursor();
  }
})();

// Pointer-reactive soft highlight on cards and sections
(function () {
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Bento rows are excluded: a tilt reads as noise on a thin list row, and tracking the
  // pointer would fight the slide transition as you move along the row.
  var selector =
    ".section:not(.skill-cloud-panel), .card, .skill-group, .contact-block, .fact-card, .mini-card, .experience-card, .chip, .expandable-block:not(.skill-cloud-tag):not(.bento-row), .bento";

  function bindInteractiveCard(el) {
    if (!el || el.dataset.chromaBound === "1") return;
    el.dataset.chromaBound = "1";

    if (prefersReducedMotion) {
      return;
    }

    // The entrance transform reads --rx/--ry, so writing them while the element is still
    // arriving would retarget that transition and stall the entrance under the cursor.
    function isRevealing() {
      return el.classList.contains("reveal") && !el.classList.contains("reveal-done");
    }

    el.addEventListener("mousemove", function (event) {
      var rect = el.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width) * 100;
      var y = ((event.clientY - rect.top) / rect.height) * 100;
      var dx = (x - 50) / 50;
      var dy = (y - 50) / 50;
      el.style.setProperty("--mx", x + "%");
      el.style.setProperty("--my", y + "%");
      el.style.setProperty("--mouse-x", event.clientX - rect.left + "px");
      el.style.setProperty("--mouse-y", event.clientY - rect.top + "px");
      if (isRevealing()) return;
      el.style.setProperty("--ry", (dx * 3).toFixed(2) + "deg");
      el.style.setProperty("--rx", (-dy * 3).toFixed(2) + "deg");
    });

    el.addEventListener("mouseleave", function () {
      el.style.setProperty("--mx", "-20%");
      el.style.setProperty("--my", "-20%");
      el.style.setProperty("--mouse-x", "50%");
      el.style.setProperty("--mouse-y", "50%");
      if (isRevealing()) return;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  }

  function setupInteractiveCards() {
    var interactiveEls = document.querySelectorAll(selector);
    if (!interactiveEls.length) return;

    interactiveEls.forEach(function (el) {
      bindInteractiveCard(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupInteractiveCards, { once: true });
  } else {
    setupInteractiveCards();
  }

  // Re-bind for client-side route transitions and bfcache restores.
  window.addEventListener("pageshow", setupInteractiveCards);
})();

// Subtle scroll parallax for hero block
(function () {
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  var hero = document.querySelector(".hero-flat");
  if (!hero) return;

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = Math.min(window.scrollY, 500);
      hero.style.setProperty("--hero-parallax", y * -0.02 + "px");
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// Animate long paragraphs word-by-word on scroll (About Me)
(function () {
  // Header copy marked .intro-item is already driven by the hero intro; splitting it into
  // words would layer a second entrance on top of that one.
  var autoAnimateTargets = document.querySelectorAll(
    ".page-header p:not(.intro-item), .card:not(.project-item):not(.achievement-card) p, .card:not(.project-item):not(.achievement-card) .meta, .achievement-banner"
  );
  autoAnimateTargets.forEach(function (el) {
    el.classList.add("long-animate");
  });

  var longParagraphs = document.querySelectorAll(".long-animate");
  if (!longParagraphs.length) return;

  longParagraphs.forEach(function (paragraph) {
    if (paragraph.dataset.longAnimated === "1") return;
    // Preserve structured markup (e.g., links/forms) by only animating plain-text nodes.
    if (paragraph.children.length > 0) return;

    var text = paragraph.textContent.trim();
    if (!text) return;

    var words = text.split(/\s+/);
    paragraph.textContent = "";
    paragraph.dataset.longAnimated = "1";

    words.forEach(function (word, index) {
      var span = document.createElement("span");
      span.className = "long-word";
      span.textContent = word;
      span.style.setProperty("--d", index * 24 + "ms");
      paragraph.appendChild(span);

      if (index !== words.length - 1) {
        paragraph.appendChild(document.createTextNode(" "));
      }
    });
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("play");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  longParagraphs.forEach(function (paragraph) {
    observer.observe(paragraph);
  });
})();

