/**
 * Chaima Oppas - Lightweight UI Animation Engine
 * Standard Vanilla JS / Native Web APIs
 */
document.documentElement.classList.add("js");

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
      rootMargin: "0% 0% -5% 0%"
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
    if (content) {
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      content.style.maxHeight = `${content.scrollHeight / rootFontSize}rem`;
    }
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
  const languageSwitchers = document.querySelectorAll(".language-switcher");
  const mobileNavMediaQuery = window.matchMedia("(max-width: 40rem)");
  let lastScrollY = Math.max(window.scrollY, 0);
  let scrollDirection = null;
  let directionDistance = 0;
  let headerStateTimer = null;
  let headerFrameRequested = false;

  const isHeaderPinned = () => (
    navToggle?.getAttribute("aria-expanded") === "true"
    || Array.from(languageSwitchers).some((switcher) => switcher.hasAttribute("open"))
  );

  const setHeaderHidden = (hidden) => {
    const shouldHide = hidden && !prefersReducedMotion && !isHeaderPinned();
    header?.classList.toggle("is-hidden", shouldHide);
  };

  const keepHeaderVisible = () => {
    window.clearTimeout(headerStateTimer);
    setHeaderHidden(false);
  };

  const queueHeaderState = (hidden, delay) => {
    window.clearTimeout(headerStateTimer);
    headerStateTimer = window.setTimeout(() => setHeaderHidden(hidden), delay);
  };

  const syncHeader = () => {
    const nextScrollY = Math.max(window.scrollY, 0);
    const delta = nextScrollY - lastScrollY;

    header?.classList.toggle("is-scrolled", nextScrollY > 12);

    if (prefersReducedMotion || nextScrollY <= 24) {
      keepHeaderVisible();
      scrollDirection = null;
      directionDistance = 0;
      lastScrollY = nextScrollY;
      return;
    }

    if (Math.abs(delta) < 2) return;

    const nextDirection = delta > 0 ? "down" : "up";
    if (nextDirection !== scrollDirection) {
      scrollDirection = nextDirection;
      directionDistance = 0;
      window.clearTimeout(headerStateTimer);
    }

    directionDistance += Math.abs(delta);

    if (nextDirection === "down" && nextScrollY > (header?.offsetHeight || 0) + 32 && directionDistance >= 64) {
      queueHeaderState(true, 220);
      directionDistance = 0;
    } else if (nextDirection === "up" && directionDistance >= 14) {
      queueHeaderState(false, 45);
      directionDistance = 0;
    }

    lastScrollY = nextScrollY;
  };

  syncHeader();
  window.addEventListener("scroll", () => {
    if (headerFrameRequested) return;

    headerFrameRequested = true;
    window.requestAnimationFrame(() => {
      syncHeader();
      headerFrameRequested = false;
    });
  }, { passive: true });

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navMenu?.classList.toggle("is-open", !isOpen);
    keepHeaderVisible();
  });

  const closeNavigation = () => {
    navToggle?.setAttribute("aria-expanded", "false");
    navMenu?.classList.remove("is-open");
  };

  navMenu?.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    closeNavigation();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });

  mobileNavMediaQuery.addEventListener?.("change", (event) => {
    if (!event.matches) closeNavigation();
  });

  languageSwitchers.forEach((switcher) => {
    switcher.addEventListener("toggle", () => {
      if (!switcher.hasAttribute("open")) return;

      languageSwitchers.forEach((otherSwitcher) => {
        if (otherSwitcher !== switcher) otherSwitcher.removeAttribute("open");
      });
      keepHeaderVisible();
    });
  });

  document.addEventListener("click", (event) => {
    languageSwitchers.forEach((switcher) => {
      if (switcher.hasAttribute("open") && !switcher.contains(event.target)) {
        switcher.removeAttribute("open");
      }
    });
  });

  // Tablet and mobile keep the career story available without making the first read feel like a CV.
  const aboutMediaQuery = window.matchMedia("(max-width: 65rem)");
  const aboutToggles = document.querySelectorAll(".about-toggle");

  const syncAboutDisclosure = () => {
    aboutToggles.forEach((button) => {
      const target = document.getElementById(button.getAttribute("aria-controls"));
      if (!target) return;

      const isExpanded = button.getAttribute("aria-expanded") === "true";
      target.hidden = aboutMediaQuery.matches ? !isExpanded : false;
    });
  };

  aboutToggles.forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.getAttribute("aria-controls"));
      if (!target) return;

      const willExpand = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(willExpand));
      button.textContent = willExpand ? button.dataset.lessLabel : button.dataset.moreLabel;
      target.hidden = !willExpand;
    });
  });

  syncAboutDisclosure();
  aboutMediaQuery.addEventListener?.("change", syncAboutDisclosure);

  // Mobile shows three representative stories first and keeps the full proof one tap away.
  document.querySelectorAll(".reviews-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const grid = document.getElementById(button.getAttribute("aria-controls"));
      if (!grid) return;

      const willExpand = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(willExpand));
      button.textContent = willExpand ? button.dataset.lessLabel : button.dataset.moreLabel;
      grid.classList.toggle("is-expanded", willExpand);
    });
  });

  // ==========================================================================
  // 4. WHATSAPP INTAKE LINK GENERATOR
  // ==========================================================================
  const whatsappNumber = "31648703092";
  const locale = document.documentElement.lang.slice(0, 2);
  const whatsappMessagesByLocale = {
    nl: {
      kennismaking: [
        "Hi Chaima, ik wil graag kennismaken voor oppas aan huis.", "", "Mijn naam:", "Plaats:",
        "Huisdieren in huis: ja/nee, welke:", "Aantal kinderen + leeftijden:", "Wanneer heb ik ongeveer oppas nodig:",
        "Ik hoor graag wanneer je beschikbaar bent.", "", "Bedankt!"
      ],
      afspraak: [
        "Hi Chaima, ik wil graag oppas op afspraak aanvragen.", "", "Datum:", "Tijd van - tot:",
        "Plaats:", "Huisdieren in huis: ja/nee, welke:", "Aantal kinderen + leeftijden:", "Slaapritme / eten / bijzonderheden:",
        "Wil ik eerst kennismaken: ja/nee", "", "Bedankt!"
      ],
      lastminute: [
        "Hi Chaima, ik zoek last-minute oppas en wil graag checken of je beschikbaar bent.", "",
        "Datum:", "Tijd van - tot:", "Plaats:", "Huisdieren in huis: ja/nee, welke:", "Aantal kinderen + leeftijden:",
        "Wat is belangrijk om direct te weten:", "", "Bedankt!"
      ],
      kindprofiel: [
        "Hi Chaima, hierbij alvast het kindprofiel voor de oppasafspraak.", "", "Naam kind(eren):",
        "Leeftijd(en):", "Huisdieren in huis: ja/nee, welke:", "Slaapritme:", "Eten / drinken:", "Allergieën:",
        "Schermtijd / afspraken thuis:", "Troosten helpt met:", "Noodcontact:",
        "Overige bijzonderheden:", "", "Bedankt!"
      ]
    },
    en: {
      kennismaking: [
        "Hi Chaima, I would like to arrange an introduction for babysitting at home.", "", "My name:",
        "Location:", "Pets at home: yes/no, which:", "Number of children + ages:", "When I may need a babysitter:",
        "Please let me know when you are available.", "", "Thank you!"
      ],
      afspraak: [
        "Hi Chaima, I would like to request babysitting by appointment.", "", "Date:", "Time from - to:",
        "Location:", "Pets at home: yes/no, which:", "Number of children + ages:", "Sleep / meals / anything important:",
        "Would I like an introduction first: yes/no", "", "Thank you!"
      ],
      lastminute: [
        "Hi Chaima, I need a last-minute babysitter and would like to check your availability.", "",
        "Date:", "Time from - to:", "Location:", "Pets at home: yes/no, which:", "Number of children + ages:",
        "Important information:", "", "Thank you!"
      ],
      kindprofiel: [
        "Hi Chaima, here is the child profile for our babysitting appointment.", "", "Child name(s):",
        "Age(s):", "Pets at home: yes/no, which:", "Sleep routine:", "Food / drinks:", "Allergies:", "Screen time / home rules:",
        "What helps when comforting:", "Emergency contact:", "Anything else:", "", "Thank you!"
      ]
    },
    fr: {
      kennismaking: [
        "Bonjour Chaima, j’aimerais organiser une première rencontre pour une garde d’enfants à domicile.",
        "", "Mon nom :", "Ville :", "Animaux à la maison : oui/non, lesquels :", "Nombre d’enfants + âges :", "Période de garde souhaitée :",
        "Pouvez-vous me dire quand vous êtes disponible ?", "", "Merci !"
      ],
      afspraak: [
        "Bonjour Chaima, j’aimerais réserver une garde d’enfants sur rendez-vous.", "", "Date :",
        "Horaire de - à :", "Ville :", "Animaux à la maison : oui/non, lesquels :", "Nombre d’enfants + âges :",
        "Sommeil / repas / informations importantes :", "Souhaitons-nous une rencontre d’abord : oui/non",
        "", "Merci !"
      ],
      lastminute: [
        "Bonjour Chaima, je cherche une garde de dernière minute et j’aimerais connaître vos disponibilités.",
        "", "Date :", "Horaire de - à :", "Ville :", "Animaux à la maison : oui/non, lesquels :", "Nombre d’enfants + âges :",
        "Informations importantes :", "", "Merci !"
      ],
      kindprofiel: [
        "Bonjour Chaima, voici le profil de notre enfant pour la garde.", "", "Nom de l’enfant / des enfants :",
        "Âge(s) :", "Animaux à la maison : oui/non, lesquels :", "Rythme de sommeil :", "Repas / boissons :", "Allergies :",
        "Écrans / règles à la maison :", "Ce qui aide à le/la rassurer :", "Contact d’urgence :",
        "Autres informations :", "", "Merci !"
      ]
    }
  };
  const whatsappMessages = whatsappMessagesByLocale[locale] || whatsappMessagesByLocale.nl;

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const type = link.getAttribute("data-whatsapp");
    const message = whatsappMessages[type] || whatsappMessages.kennismaking;
    const encodedMessage = encodeURIComponent(message.join("\n"));

    link.setAttribute("href", `https://wa.me/${whatsappNumber}?text=${encodedMessage}`);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });
});
