/* Shared UI: theme, reading size, resilient images.
   The tiny inline script in <head> applies the saved theme and text size
   before first paint; this file wires up the visible controls. */
(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "pa-theme";
  var SIZE_KEY = "pa-size";
  var SIZES = [100, 112, 125, 140];
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  var themeIsExplicit = false;

  try {
    themeIsExplicit =
      localStorage.getItem(THEME_KEY) === "light" ||
      localStorage.getItem(THEME_KEY) === "dark";
  } catch (error) {
    /* Storage can be unavailable in private modes. */
  }

  function syncTheme(theme) {
    root.setAttribute("data-theme", theme);

    var toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      var isDark = theme === "dark";
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
      toggle.setAttribute(
        "title",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
    }

    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", theme === "dark" ? "#15110d" : "#f6f1e7");
    }
  }

  syncTheme(
    root.getAttribute("data-theme") || (darkQuery.matches ? "dark" : "light")
  );

  var themeToggle = document.querySelector("[data-theme-toggle]");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      themeIsExplicit = true;
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      syncTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (error) {
        /* Ignore storage failures. */
      }
    });
  }

  function onSystemThemeChange(event) {
    if (!themeIsExplicit) {
      syncTheme(event.matches ? "dark" : "light");
    }
  }

  if (typeof darkQuery.addEventListener === "function") {
    darkQuery.addEventListener("change", onSystemThemeChange);
  } else if (typeof darkQuery.addListener === "function") {
    darkQuery.addListener(onSystemThemeChange);
  }

  /* --- Reading size ----------------------------------------------------- */
  var sizeUp = document.querySelector('[data-size="up"]');
  var sizeDown = document.querySelector('[data-size="down"]');
  var sizeStatus = document.querySelector("[data-size-status]");

  function storedSizeIndex() {
    var current = parseInt(root.style.fontSize, 10);
    if (!current || current === 100) {
      return 0;
    }
    var index = SIZES.indexOf(current);
    return index === -1 ? 0 : index;
  }

  function applySize(index, persist) {
    index = Math.max(0, Math.min(SIZES.length - 1, index));
    var percent = SIZES[index];

    root.style.fontSize = percent === 100 ? "" : percent + "%";
    if (sizeUp) {
      sizeUp.disabled = index === SIZES.length - 1;
    }
    if (sizeDown) {
      sizeDown.disabled = index === 0;
    }
    if (sizeStatus) {
      sizeStatus.textContent = "Text size: " + percent + " percent.";
    }

    if (persist) {
      try {
        if (percent === 100) {
          localStorage.removeItem(SIZE_KEY);
        } else {
          localStorage.setItem(SIZE_KEY, String(percent));
        }
      } catch (error) {
        /* Ignore storage failures. */
      }
    }
  }

  applySize(storedSizeIndex(), false);

  if (sizeUp) {
    sizeUp.addEventListener("click", function () {
      applySize(storedSizeIndex() + 1, true);
    });
  }

  if (sizeDown) {
    sizeDown.addEventListener("click", function () {
      applySize(storedSizeIndex() - 1, true);
    });
  }

  /* --- Images that fail to load ---------------------------------------- */
  var FALLBACK_IMAGE = "assets/img/image-unavailable.svg";

  function useFallback(image) {
    if (image.dataset.fallbackApplied === "true") {
      return;
    }
    image.dataset.fallbackApplied = "true";
    image.src = FALLBACK_IMAGE;
    image.classList.add("is-fallback");
  }

  Array.prototype.forEach.call(
    document.querySelectorAll("img[data-fallback]"),
    function (image) {
      if (image.complete && image.naturalWidth === 0) {
        useFallback(image);
      }
      image.addEventListener("error", function () {
        useFallback(image);
      });
    }
  );
})();
