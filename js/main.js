/* =========================
   Tryneutera Global JS
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  scrollHomeToTop();
  setActiveNav();
  initProductExplorer();
  initIndustrySlideshow();
  initContactFormRedirect();
  revealOnScroll();
  initHeroTypewriter();
  initHeroParticles();
});

/* -------------------------
   Mobile Navigation
-------------------------- */
function initMobileNav() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelectorAll(".nav-links a");

  if (!header || !toggle) {
    return;
  }

  const setOpen = isOpen => {
    header.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  };

  toggle.addEventListener("click", () => {
    setOpen(!header.classList.contains("nav-open"));
  });

  links.forEach(link => {
    link.addEventListener("click", () => setOpen(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      setOpen(false);
    }
  });
}

/* -------------------------
   Home Scroll
-------------------------- */
function scrollHomeToTop() {
  const homeLink = document.querySelector('.nav-links a[href="#home"]');
  const logoLink = document.querySelector('.logo[href="#home"]');

  if (!homeLink && !logoLink) {
    return;
  }

  const scrollToTop = event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);

    document.querySelectorAll(".nav-links a").forEach(link => {
      link.classList.toggle("active", link === homeLink);
    });
  };

  if (homeLink) {
    homeLink.addEventListener("click", scrollToTop);
  }

  if (logoLink) {
    logoLink.addEventListener("click", scrollToTop);
  }
}

/* -------------------------
   Product Explorer
-------------------------- */
function initProductExplorer() {
  const explorer = document.querySelector(".product-explorer");
  const menuToggle = document.querySelector(".product-menu-toggle");
  const menuLabel = document.querySelector(".product-menu-label");
  const tabs = document.querySelectorAll(".product-tab");
  const panels = document.querySelectorAll(".product-panel");

  if (!tabs.length || !panels.length) {
    return;
  }

  const setProductMenuOpen = isOpen => {
    if (!explorer || !menuToggle) {
      return;
    }

    explorer.classList.toggle("product-menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  };

  const setProductMenuLabel = tab => {
    if (menuLabel && tab.dataset.productName) {
      menuLabel.textContent = tab.dataset.productName;
    }
  };

  if (explorer && menuToggle) {
    menuToggle.addEventListener("click", () => {
      setProductMenuOpen(!explorer.classList.contains("product-menu-open"));
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        setProductMenuOpen(false);
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.productTarget;

      tabs.forEach(item => {
        const isActive = item === tab;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      panels.forEach(panel => {
        const isActive = panel.id === targetId;
        panel.classList.toggle("active", isActive);
        panel.hidden = !isActive;
      });

      setProductMenuLabel(tab);
      setProductMenuOpen(false);
    });
  });

  const activeTab = document.querySelector(".product-tab.active");
  if (activeTab) {
    setProductMenuLabel(activeTab);
  }
}

/* -------------------------
   Industry Slideshow
-------------------------- */
function initIndustrySlideshow() {
  const slideshow = document.querySelector(".industry-showcase");

  if (!slideshow) {
    return;
  }

  const slides = Array.from(slideshow.querySelectorAll(".slide"));
  const controls = slideshow.querySelectorAll("[data-slide-direction]");
  let activeIndex = 0;
  let timerId;

  const showSlide = index => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === activeIndex);
    });
  };

  const startTimer = () => {
    window.clearInterval(timerId);
    timerId = window.setInterval(() => showSlide(activeIndex + 1), 4500);
  };

  controls.forEach(control => {
    control.addEventListener("click", () => {
      const direction = control.dataset.slideDirection === "prev" ? -1 : 1;
      showSlide(activeIndex + direction);
      startTimer();
    });
  });

  showSlide(0);
  startTimer();
}

/* -------------------------
   Contact Form Redirect
-------------------------- */
function initContactFormRedirect() {
  const form = document.querySelector(".contact-form");
  const redirectInput = document.querySelector('.contact-form input[name="_next"]');
  const statusError = document.querySelector(".form-status-error");
  const submitButton = document.querySelector('.contact-form button[type="submit"]');
  const successUrl = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}thank-you.html`;

  if (!form) {
    return;
  }

  if (redirectInput && window.location.protocol !== "file:") {
    redirectInput.value = successUrl;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (statusError) {
      statusError.hidden = true;
    }

    if (window.location.protocol === "file:") {
      if (statusError) {
        statusError.hidden = false;
      }
      return;
    }

    const originalButtonText = submitButton ? submitButton.textContent : "";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      const response = await fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false || result.success === "false") {
        throw new Error(result.message || "Unable to submit form.");
      }

      window.location.href = successUrl;
    } catch (error) {
      if (statusError) {
        statusError.hidden = false;
      }

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}

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
