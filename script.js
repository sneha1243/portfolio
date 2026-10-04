"use strict";

document.documentElement.classList.add("js-ready");

// Restore the saved theme, falling back to the visitor's system preference.
const themeToggle = document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#111916" : "#f6f8f7";
}

applyTheme(savedTheme || preferredTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("portfolio-theme", nextTheme);
  applyTheme(nextTheme);
});

// Keep the small-screen menu usable by pointer and keyboard.
const menuToggle = document.querySelector("#menu-toggle");
const primaryMenu = document.querySelector("#primary-menu");

function setMenuOpen(isOpen) {
  primaryMenu.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

primaryMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

// Highlight the visible section in the navigation.
const sectionLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    sectionLinks.forEach((link) => {
      const isCurrent = link.hash === `#${entry.target.id}`;
      link.classList.toggle("active", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  });
}, { rootMargin: "-30% 0px -60% 0px" });

observedSections.forEach((section) => sectionObserver.observe(section));

// Reveal content gently as it enters the viewport; reduced-motion users see it immediately.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// Build a mailto draft without needing a server-side contact form.
const contactForm = document.querySelector("#contact-form");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get("name")).trim();
  const email = String(formData.get("email")).trim();
  const message = String(formData.get("message")).trim();
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
  document.querySelector("#form-status").textContent = "Opening your email app with a draft message.";
  window.location.href = `mailto:snehasivi123@gmail.com?subject=${subject}&body=${body}`;
});

// Keep the footer year current without a build step.
document.querySelector("#current-year").textContent = new Date().getFullYear();