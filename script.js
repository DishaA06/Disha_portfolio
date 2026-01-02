let activeDrag = null;
let offsetX = 0;
let offsetY = 0;
let isDraggingGlobal = false;

document.addEventListener("mousemove", (e) => {
  if (!activeDrag) return;

  activeDrag.style.left = `${e.clientX - offsetX}px`;
  activeDrag.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener("mouseup", () => {
  if (!activeDrag) return;

  activeDrag.style.cursor = "grab";
  activeDrag = null;

  setTimeout(() => {
    isDraggingGlobal = false;
  }, 0);
});

function makeDraggable(el, handle = el) {
  handle.style.cursor = "grab";

  handle.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    isDraggingGlobal = true;

    const rect = el.getBoundingClientRect();

    // 🔥 CRITICAL RESET
    el.style.transform = "none";
    el.style.margin = "0";
    el.style.position = "fixed";
    el.style.left = rect.left + "px";
    el.style.top = rect.top + "px";
    el.style.transition = "none";

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    activeDrag = el;
    handle.style.cursor = "grabbing";
  });

  el.addEventListener("click", e => e.stopPropagation());
}



/* ================= PARALLAX LABELS ================= */
document.addEventListener('DOMContentLoaded', () => {
  const labels = document.querySelectorAll('.labels .label');

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    labels.forEach((label, i) => {
      const depth = (i + 1) * 0.05;
      const x = (e.clientX - cx) * depth / 15;
      const y = (e.clientY - cy) * depth / 15;
      label.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  });

  /* ================= TITLE FADE ================= */
  document.querySelectorAll('.curved-title span').forEach((s, i) => {
    s.style.opacity = 0;
    setTimeout(() => {
      s.style.transition = 'opacity 1.5s ease';
      s.style.opacity = 1;
    }, 50 * i);
  });
});

/* ================= STICKY NOTE ================= */
window.addEventListener('load', () => {
  const note = document.getElementById('sticky-note');
  if (note) setTimeout(() => note.classList.add('show'), 500);
});

/* ================= ABOUT ME POPUPS ================= */
const aboutBtn = document.querySelector("#more-about-me");
const aboutPopups = [
  document.getElementById("popup-text"),
  document.getElementById("popup-photo-2")
].filter(Boolean);

let aboutPopupOpen = false;

function animateClose(popup) {
  popup.classList.add("closing");
  setTimeout(() => {
    popup.style.display = "none";
    popup.classList.remove("closing");
    popup.style.opacity = "0";
    popup.style.transform = "scale(0.8)";
  }, 300);
}

function closeAboutPopups() {
  aboutPopups.forEach(p => {
    if (p.style.display === "block") animateClose(p);
  });
  aboutPopupOpen = false;
}

if (aboutBtn) {
  aboutBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (aboutPopupOpen) return;
    aboutPopupOpen = true;

    aboutPopups.forEach((p, i) => {
      p.style.display = "block";
      p.style.opacity = "1";
      p.style.position = "fixed";
      p.style.left = 100 + i * 300 + "px";
      p.style.top = 10 + i * 100 + "px";
      p.style.transform = "none";
    });
  });
}

document.addEventListener("click", (e) => {
  if (isDraggingGlobal) return;

  if (
    aboutPopupOpen &&
    !aboutPopups.some(p => p.contains(e.target)) &&
    !aboutBtn.contains(e.target)
  ) {
    closeAboutPopups();
  }

  if (
    artworkPopup &&
    artworkPopup.style.display === "block" &&
    !artworkPopup.contains(e.target) &&
    !artworkBtn.contains(e.target)
  ) {
    animateClose(artworkPopup);
  }

  if (
    contactPopup &&
    contactPopup.style.display === "block" &&
    !contactPopup.contains(e.target) &&
    !contactBtn.contains(e.target)
  ) {
    contactPopup.classList.remove("show");
    setTimeout(() => contactPopup.style.display = "none", 250);
  }
});


/* ================= ARTWORK POPUP ================= */
const artworkPopup = document.getElementById("popup-artwork");
const artworkBtn = document.getElementById("artwork-btn");
artworkPopup.style.position = "fixed";
artworkPopup.style.left = "30%";
artworkPopup.style.top = "10%";
artworkPopup.style.transform = "translate(-50%, -50%) scale(1)"; 


if (artworkBtn && artworkPopup) {
  artworkBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (artworkPopup.style.display === "block") return;

    artworkPopup.style.display = "block";
    requestAnimationFrame(() => {
      artworkPopup.style.opacity = "1";
      artworkPopup.style.transform = "scale(1)";
    });
  });

  artworkPopup.addEventListener("click", e => e.stopPropagation());
}

document.addEventListener("click", (e) => {
  if (
    artworkPopup &&
    artworkPopup.style.display === "block" &&
    !artworkPopup.contains(e.target) &&
    !artworkBtn.contains(e.target)
  ) {
    animateClose(artworkPopup);
  }
});

/* ================= CONTACT POPUP ================= */
const contactBtn = document.getElementById("contact-label");
const contactPopup = document.getElementById("popup-contact");

if (contactBtn && contactPopup) {
  contactBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    contactPopup.style.display = "block";
    requestAnimationFrame(() => contactPopup.classList.add("show"));
  });

  contactPopup.addEventListener("click", e => e.stopPropagation());

  document.addEventListener("click", (e) => {
    if (
      contactPopup.style.display === "block" &&
      !contactPopup.contains(e.target) &&
      !contactBtn.contains(e.target)
    ) {
      contactPopup.classList.remove("show");
      setTimeout(() => contactPopup.style.display = "none", 250);
    }
  });
}



/* ================= DRAG ENABLE ================= */
aboutPopups.forEach(p => makeDraggable(p, p.querySelector(".titlebar") || p));
makeDraggable(artworkPopup, artworkPopup.querySelector(".titlebar") || artworkPopup);
makeDraggable(contactPopup, contactPopup.querySelector(".titlebar") || contactPopup);
