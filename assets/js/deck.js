/* Deck navigation: progress bar, active slide, arrow-key movement. */
(function () {
  "use strict";

  var slides = Array.prototype.slice.call(
    document.querySelectorAll("[data-slide]")
  );
  if (!slides.length) {
    return;
  }

  var dots = Array.prototype.slice.call(
    document.querySelectorAll(".slide-dock a")
  );
  var progress = document.querySelector(".progress");
  var currentLabel = document.querySelector("[data-slide-current]");
  var totalLabel = document.querySelector("[data-slide-total]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var activeIndex = -1;
  var frameRequested = false;

  if (totalLabel) {
    totalLabel.textContent = String(slides.length).padStart(2, "0");
  }

  function setActive(index) {
    if (index === activeIndex) {
      return;
    }
    activeIndex = index;

    dots.forEach(function (dot, dotIndex) {
      if (dotIndex === index) {
        dot.setAttribute("aria-current", "location");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    if (currentLabel) {
      currentLabel.textContent = String(index + 1).padStart(2, "0");
    }
  }

  function update() {
    frameRequested = false;

    var documentElement = document.documentElement;
    var scrollable = documentElement.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    ratio = Math.min(1, Math.max(0, ratio));

    if (progress) {
      progress.value = Math.round(ratio * 100);
    }

    var line = window.innerHeight * 0.32;
    var index = 0;
    slides.forEach(function (slide, slideIndex) {
      if (slide.getBoundingClientRect().top <= line) {
        index = slideIndex;
      }
    });
    setActive(index);
  }

  function requestUpdate() {
    if (!frameRequested) {
      frameRequested = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("hashchange", requestUpdate);
  update();

  function goTo(index) {
    var target = slides[Math.max(0, Math.min(slides.length - 1, index))];
    if (!target) {
      return;
    }
    target.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start",
    });
  }

  document.addEventListener("keydown", function (event) {
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return;
    }

    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    var target = event.target;
    if (
      target instanceof Element &&
      target.closest("input, textarea, select, [contenteditable='true'], dialog")
    ) {
      return;
    }

    event.preventDefault();
    goTo(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
  });
})();
