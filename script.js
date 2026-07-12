/**
 * Chaima Oppas - Lightweight UI Animation Engine
 * Standard Vanilla JS / Native Web APIs
 */
document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ==========================================================================
  // 1. AUTOMATED STAGGERED SCROLL-REVEAL OBSERVATION SYSTEM
  // ==========================================================================
  const revealItems = document.querySelectorAll(".reveal-item");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const container = entry.target;
          const items = container.querySelectorAll(".reveal-item");

          items.forEach((item, index) => {
            window.setTimeout(() => {
              item.classList.add("is-visible");
            }, index * 80);
          });

          observer.unobserve(container);
        }
      });
    }, revealOptions);

    document.querySelectorAll(".animate-section").forEach((container) => {
      scrollObserver.observe(container);
    });
  }

  // ==========================================================================
  // 2. STRUCTURALLY SAFE ACCORDION TRANSITIONS
  // ==========================================================================
  const accordionHeaders = document.querySelectorAll(".faq-header");

  const closeFaqItem = (item) => {
    const header = item.querySelector(".faq-header");
    const content = item.querySelector(".faq-content");

    item.classList.remove("is-open");
    header?.setAttribute("aria-expanded", "false");
    if (content) content.style.maxHeight = null;
  };

  const openFaqItem = (item) => {
    const header = item.querySelector(".faq-header");
    const content = item.querySelector(".faq-content");

    item.classList.add("is-open");
    header?.setAttribute("aria-expanded", "true");
    if (content) content.style.maxHeight = `${content.scrollHeight}px`;
  };

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const currentItem = header.parentElement;
      const isOpen = currentItem.classList.contains("is-open");

      document.querySelectorAll(".faq-item").forEach(closeFaqItem);

      if (!isOpen) {
        openFaqItem(currentItem);
      }
    });
  });

  document.querySelectorAll(".faq-item.is-open").forEach(openFaqItem);

  window.addEventListener("resize", () => {
    document.querySelectorAll(".faq-item.is-open").forEach(openFaqItem);
  });

  // ==========================================================================
  // 3. NAVIGATION AND HEADER MICRO-STATE
  // ==========================================================================
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");

  const syncHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navMenu?.classList.toggle("is-open", !isOpen);
  });

  navMenu?.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    navToggle?.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
  });

  // ==========================================================================
  // 4. WHATSAPP INTAKE LINK GENERATOR
  // ==========================================================================
  const whatsappNumber = "31648703092";
  const whatsappMessages = {
    kennismaking: [
      "Hi Chaima, ik wil graag kennismaken voor oppas aan huis.",
      "",
      "Mijn naam:",
      "Plaats:",
      "Aantal kinderen + leeftijden:",
      "Wanneer heb ik ongeveer oppas nodig:",
      "Ik hoor graag wanneer je beschikbaar bent.",
      "",
      "Bedankt!"
    ],
    afspraak: [
      "Hi Chaima, ik wil graag oppas op afspraak aanvragen.",
      "",
      "Datum:",
      "Tijd van - tot:",
      "Plaats:",
      "Aantal kinderen + leeftijden:",
      "Slaapritme / eten / bijzonderheden:",
      "Wil ik eerst kennismaken: ja/nee",
      "",
      "Bedankt!"
    ],
    lastminute: [
      "Hi Chaima, ik zoek last-minute oppas en wil graag checken of je beschikbaar bent.",
      "",
      "Datum:",
      "Tijd van - tot:",
      "Plaats:",
      "Aantal kinderen + leeftijden:",
      "Wat is belangrijk om direct te weten:",
      "",
      "Bedankt!"
    ],
    kindprofiel: [
      "Hi Chaima, hierbij alvast het kindprofiel voor de oppasafspraak.",
      "",
      "Naam kind(eren):",
      "Leeftijd(en):",
      "Slaapritme:",
      "Eten / drinken:",
      "Allergieen:",
      "Schermtijd / afspraken thuis:",
      "Troosten helpt met:",
      "Noodcontact:",
      "Overige bijzonderheden:",
      "",
      "Bedankt!"
    ]
  };

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const type = link.getAttribute("data-whatsapp");
    const message = whatsappMessages[type] || whatsappMessages.kennismaking;
    const encodedMessage = encodeURIComponent(message.join("\n"));

    link.setAttribute("href", `https://wa.me/${whatsappNumber}?text=${encodedMessage}`);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });
});
