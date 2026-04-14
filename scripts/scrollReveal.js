document.addEventListener("DOMContentLoaded", function () {
  const observerOptions = { threshold: 0.15 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".scroll-reveal")
    .forEach((el) => observer.observe(el));
});
