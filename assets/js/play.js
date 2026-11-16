/* Interactive page: lightbox, fact cabinet, memory lab, clockwork surprise. */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function openDialog(dialog) {
    if (!dialog) {
      return;
    }
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closeDialog(dialog) {
    if (!dialog) {
      return;
    }
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  /* --- Image lightbox --------------------------------------------------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImage = document.getElementById("lightbox-image");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var fallbackImage = "assets/img/image-unavailable.svg";

  if (lightbox && lightboxImage) {
    lightboxImage.addEventListener("error", function () {
      lightboxImage.src = fallbackImage;
    });

    Array.prototype.forEach.call(
      document.querySelectorAll("[data-lightbox]"),
      function (link) {
        link.addEventListener("click", function (event) {
          var image = link.querySelector("img");
          event.preventDefault();
          lightboxImage.src = link.getAttribute("href");
          lightboxImage.alt = (image && image.alt) || "";
          lightboxCaption.textContent =
            link.getAttribute("data-caption") || lightboxImage.alt;
          openDialog(lightbox);
        });
      }
    );

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeDialog(lightbox);
      }
    });

    var lightboxClose = lightbox.querySelector(".dialog-close");
    if (lightboxClose) {
      lightboxClose.addEventListener("click", function () {
        closeDialog(lightbox);
      });
    }
  }

  /* --- Random facts cabinet -------------------------------------------- */
  var facts = [
    "The Mechanical Monk from 1560 was created to pray continuously, blending faith and mechanics.",
    "Al-Jazari's inventions in 1206 included programmable automata, early precursors to modern AI.",
    "Vaucanson's Digesting Duck amazed 18th-century audiences by simulating eating and digestion.",
    "The Silver Swan automaton from 1773 still performs in museums, captivating with its graceful motions.",
    "Peacock clocks used intricate gears to animate birds, evoking wonder and curiosity.",
    "Jaquet-Droz's 1774 automata included The Draughtsman, a boy who draws pictures, showcasing early programmable creativity that inspires modern AI art generators.",
    "Archytas' Dove from around 400 BCE was a steam-powered flying bird, one of the earliest known automata, blending engineering with mythical wonder.",
    "The Lambert Clown Magician Automaton from 1890 performs magic tricks with hidden gears, evoking surprise and laughter through illusory play.",
    "Maillardet's Automaton (1805) is a drawing and writing machine that \u201cremembers\u201d poems, linking to reminiscence through mechanical memory.",
    "Jean-Eug\u00e8ne Robert-Houdin's automata in the 1800s included orange trees that bloomed on command, using magic and mechanics to delight audiences.",
    "Apple's 2025 prototype tabletop robot, inspired by Pixar's Luxo Jr., uses AI for expressive movements like dancing to music or adjusting to user gestures."
  ];

  var factButton = document.getElementById("fact-button");
  var factText = document.getElementById("random-fact");
  var factCount = document.getElementById("fact-count");
  var factBag = [];
  var factsShown = 0;

  function drawFact() {
    if (!factBag.length) {
      factBag = facts.slice();
    }
    return factBag.splice(Math.floor(Math.random() * factBag.length), 1)[0];
  }

  if (factButton && factText) {
    factButton.addEventListener("click", function () {
      factsShown += 1;
      factText.textContent = drawFact();
      factText.classList.remove("fact-text--empty");

      if (factCount) {
        factCount.textContent =
          "Fact " +
          (((factsShown - 1) % facts.length) + 1) +
          " of " +
          facts.length;
      }

      factButton.textContent = "Another antique fact";

      if (!reducedMotion.matches) {
        factText.classList.remove("fade-in");
        void factText.offsetWidth; /* Restart the short fade. */
        factText.classList.add("fade-in");
      }
    });
  }

  /* --- Memory lab ------------------------------------------------------- */
  var form = document.getElementById("memory-form");
  var memoryField = document.getElementById("memory");
  var memoryCount = document.getElementById("memory-count");
  var memoryError = document.getElementById("memory-error");
  var keepsake = document.getElementById("keepsake");
  var keepsakeEmpty = document.getElementById("keepsake-empty");
  var keepsakeActions = document.getElementById("keepsake-actions");
  var printButton = document.getElementById("print-keepsake");
  var anotherButton = document.getElementById("another-twist");
  var labStatus = document.getElementById("lab-status");
  var MAX_LENGTH = 280;
  var lastMemory = "";
  var lastTwist = -1;
  var lastPrompt = -1;

  var twists = [
    "Suddenly, a mischievous talking animal joined the adventure.",
    "It turned into a spontaneous dance party with your favourite tunes.",
    "A dash of magic made everything glow in rainbow colours.",
    "You stepped into a whimsical parallel world where gravity was optional.",
    "Unexpected guests arrived from your favourite childhood stories.",
    "Hidden treasures appeared, each with a silly riddle to solve.",
    "Ancient clockwork began to turn, gears whirring mysteriously.",
    "A medieval automaton came to life in surprising ways.",
    "A little robotic lamp danced along to the rhythm, like Apple\u2019s 2025 prototype."
  ];

  var prompts = [
    "How did that make you feel? Want to add more details?",
    "What if we explore a different ending? Tell me more.",
    "Reflect on this: what surprising connection does it have to today?",
    "Imagine it as an antique machine: what mechanism would power it?"
  ];

  function pickIndex(length, previous) {
    if (length < 2) {
      return 0;
    }
    var index = Math.floor(Math.random() * length);
    while (index === previous) {
      index = Math.floor(Math.random() * length);
    }
    return index;
  }

  function announce(message) {
    if (labStatus) {
      labStatus.textContent = message;
    }
  }

  function block(label, text, className) {
    var wrapper = document.createElement("div");
    wrapper.className = "keepsake__block";

    var labelElement = document.createElement("span");
    labelElement.className = "keepsake__label";
    labelElement.textContent = label;

    var textElement = document.createElement("p");
    textElement.className = className;
    textElement.textContent = text;

    wrapper.appendChild(labelElement);
    wrapper.appendChild(textElement);
    return wrapper;
  }

  function renderKeepsake(memory) {
    lastTwist = pickIndex(twists.length, lastTwist);
    lastPrompt = pickIndex(prompts.length, lastPrompt);

    if (!keepsake) {
      return;
    }

    keepsake.replaceChildren(
      block("Your memory", memory, "keepsake__memory"),
      block("The playful twist", twists[lastTwist], "keepsake__twist"),
      Object.assign(document.createElement("p"), {
        className: "keepsake__prompt",
        textContent: prompts[lastPrompt],
      })
    );

    if (keepsakeEmpty) {
      keepsakeEmpty.hidden = true;
    }
    if (keepsakeActions) {
      keepsakeActions.hidden = false;
    }
    announce(
      "A playful version of your memory is ready. Try another twist, or print the card."
    );
  }

  function showError(message) {
    if (memoryError) {
      memoryError.textContent = message;
      memoryError.hidden = false;
    }
    if (memoryField) {
      memoryField.setAttribute("aria-invalid", "true");
      memoryField.focus();
    }
  }

  function clearError() {
    if (memoryError) {
      memoryError.hidden = true;
      memoryError.textContent = "";
    }
    if (memoryField) {
      memoryField.removeAttribute("aria-invalid");
    }
  }

  function updateCount() {
    if (memoryField && memoryCount) {
      memoryCount.textContent =
        memoryField.value.length + " / " + MAX_LENGTH + " characters";
    }
  }

  if (memoryField) {
    memoryField.addEventListener("input", function () {
      updateCount();
      if (memoryError && !memoryError.hidden) {
        clearError();
      }
    });
    updateCount();
  }

  if (form && memoryField) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var memory = memoryField.value.trim();

      if (!memory) {
        showError("Please describe a memory first \u2014 even a few words are enough.");
        announce("Your memory is empty. Please describe a memory first.");
        return;
      }

      clearError();
      lastMemory = memory;
      renderKeepsake(memory);

      if (window.innerWidth < 861 && keepsake) {
        keepsake.scrollIntoView({
          behavior: reducedMotion.matches ? "auto" : "smooth",
          block: "nearest",
        });
      }
    });
  }

  if (anotherButton && memoryField) {
    anotherButton.addEventListener("click", function () {
      var memory = memoryField.value.trim() || lastMemory;
      if (!memory) {
        showError("Please describe a memory first.");
        return;
      }
      clearError();
      lastMemory = memory;
      renderKeepsake(memory);
    });
  }

  Array.prototype.forEach.call(
    document.querySelectorAll("[data-example]"),
    function (example) {
      example.addEventListener("click", function () {
        if (!memoryField) {
          return;
        }
        memoryField.value = example.getAttribute("data-example") || "";
        updateCount();
        clearError();
        memoryField.focus();
      });
    }
  );

  var clearButton = document.getElementById("clear-button");
  if (clearButton && memoryField && keepsake) {
    clearButton.addEventListener("click", function () {
      memoryField.value = "";
      lastMemory = "";
      updateCount();
      clearError();
      keepsake.replaceChildren();
      if (keepsakeEmpty) {
        keepsake.appendChild(keepsakeEmpty);
        keepsakeEmpty.hidden = false;
      }
      if (keepsakeActions) {
        keepsakeActions.hidden = true;
      }
      announce("Cleared. Describe another memory whenever you like.");
      memoryField.focus();
    });
  }

  var printRoot = document.getElementById("print-root");

  if (printButton) {
    printButton.addEventListener("click", function () {
      if (!printRoot || !keepsake) {
        return;
      }

      printRoot.replaceChildren();
      var heading = document.createElement("p");
      heading.className = "print-root__eyebrow";
      heading.textContent = "Antique Intuition Quest \u00b7 memory keepsake";
      printRoot.appendChild(heading);
      var clone = keepsake.cloneNode(true);
      clone.removeAttribute("id");
      printRoot.appendChild(clone);

      document.body.classList.add("is-printing");
      window.print();
      window.setTimeout(function () {
        document.body.classList.remove("is-printing");
      }, 1000);
    });

    window.addEventListener("afterprint", function () {
      document.body.classList.remove("is-printing");
    });
  }

  /* --- Clockwork surprise ---------------------------------------------- */
  var gear = document.getElementById("gear-element");
  var secretDialog = document.getElementById("secret-dialog");
  var gearStatus = document.getElementById("gear-status");
  var turns = 0;

  if (gear) {
    gear.addEventListener("click", function () {
      var page = document.querySelector("main");
      turns += 1;

      if (!reducedMotion.matches && page) {
        page.classList.remove("is-shaking");
        void page.offsetWidth;
        page.classList.add("is-shaking");
        window.setTimeout(function () {
          page.classList.remove("is-shaking");
        }, 650);
      }

      if (turns >= 12) {
        turns = 0;
        if (gearStatus) {
          gearStatus.textContent =
            "You found the hidden mechanism. The clockwork opens a door.";
        }
        openDialog(secretDialog);
      } else if (turns >= 8 && gearStatus) {
        gearStatus.textContent =
          "The gear turns. " + (12 - turns) + " turns to go.";
      }
    });
  }

  var secretClose = document.getElementById("secret-close");
  if (secretClose && secretDialog) {
    secretClose.addEventListener("click", function () {
      closeDialog(secretDialog);
    });
    secretDialog.addEventListener("click", function (event) {
      if (event.target === secretDialog) {
        closeDialog(secretDialog);
      }
    });
  }
})();
