/* =========================
   Tryneutera Global JS
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  handleHeaderOnScroll();
  revealOnScroll();
});

/* -------------------------
   Active Navigation
-------------------------- */
function setActiveNav() {
  const links = document.querySelectorAll(".nav-links a");
  const currentPath = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const linkPath = link.getAttribute("href").split("/").pop();
    if (linkPath === currentPath || (currentPath === "" && linkPath === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* -------------------------
   Header Scroll Behavior
-------------------------- */
function handleHeaderOnScroll() {
  const header = document.querySelector(".site-header");
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        header.classList.toggle("scrolled", window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  });
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
