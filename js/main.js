/* =========================
   Tryneutera Global JS
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  revealOnScroll();
  initHeroTypewriter();
  initHeroParticles();
});

/* -------------------------
   Active Navigation
-------------------------- */
function setActiveNav() {
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = Array.from(links)
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setActiveLink = id => {
    links.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-40% 0px -55% 0px",
      threshold: 0
    }
  );

  sections.forEach(section => observer.observe(section));
  setActiveLink(window.location.hash.replace("#", "") || "home");
}

/* -------------------------
   Reveal on Scroll
-------------------------- */
function revealOnScroll() {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach(el => observer.observe(el));
}

/* -------------------------
   Hero Typewriter
-------------------------- */
function initHeroTypewriter() {
  const target = document.querySelector(".typing-text");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const taglines = [
    "Intelligence",
    "Infrastructure",
    "Innovation in Bharat 6G Mission"
  ];

  if (!target || reducedMotion) {
    if (target) {
      target.textContent = taglines[0];
    }
    return;
  }

  let taglineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const current = taglines[taglineIndex];
    target.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex < current.length) {
      charIndex += 1;
      window.setTimeout(type, 58);
      return;
    }

    if (!deleting) {
      deleting = true;
      window.setTimeout(type, 1400);
      return;
    }

    if (charIndex > 0) {
      charIndex -= 1;
      window.setTimeout(type, 28);
      return;
    }

    deleting = false;
    taglineIndex = (taglineIndex + 1) % taglines.length;
    window.setTimeout(type, 240);
  };

  type();
}

/* -------------------------
   Hero Particle Background
-------------------------- */
function initHeroParticles() {
  const particleTarget = document.getElementById("hero-particles");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!particleTarget || reducedMotion || typeof tsParticles === "undefined") {
    return;
  }

  tsParticles.load("hero-particles", {
    fpsLimit: 60,
    background: {
      color: "transparent"
    },
    particles: {
      number: {
        value: 72,
        density: {
          enable: true,
          area: 1000
        }
      },
      color: {
        value: "#ffffff"
      },
      opacity: {
        value: {
          min: 0.1,
          max: 0.28
        }
      },
      size: {
        value: {
          min: 0.8,
          max: 2
        }
      },
      links: {
        enable: true,
        color: "#ffffff",
        distance: 165,
        opacity: 0.12,
        width: 0.6
      },
      move: {
        enable: true,
        speed: 0.28,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out"
        }
      }
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: {
          enable: false
        },
        onClick: {
          enable: false
        },
        resize: true
      }
    },
    detectRetina: true,
    responsive: [
      {
        maxWidth: 768,
        options: {
          particles: {
            number: {
              value: 32
            },
            links: {
              distance: 120,
              opacity: 0.085
            },
            move: {
              speed: 0.2
            }
          }
        }
      }
    ]
  });
}
