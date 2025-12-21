document.addEventListener('DOMContentLoaded', () => {
  /* ================= PARALLAX LABELS ================= */
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

  /* ================= TITLE LETTER FADE ================= */
  const titleSpans = document.querySelectorAll('.curved-title span');
  titleSpans.forEach((s, i) => {
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

function animateClose(popup) {
  popup.classList.add("closing");
  setTimeout(() => {
    popup.style.display = "none";
    popup.classList.remove("closing");
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%) scale(0.8)";
    popup.style.opacity = "0";
    delete popup.dataset.moved;
  }, 300);
}

function closeAboutPopups() {
  aboutPopups.forEach(p => p.style.display === "block" && animateClose(p));
}

if (aboutBtn) {
  aboutBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    aboutPopups.forEach((p, i) => {
      setTimeout(() => {
        p.style.display = "block";
        p.style.left = 100 + i * 300 + "px";
        p.style.top = 10 + i * 100 + "px";
      }, i * 150);
    });
  });
}

// Close About Me popups when clicking outside
document.addEventListener("click", (e) => {
  if (!aboutPopups.some(p => p.contains(e.target)) && !aboutBtn.contains(e.target)) {
    closeAboutPopups();
  }
});

/* ================= DRAG FUNCTION ================= */
function makeDraggable(el) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  el.addEventListener("mousedown", (e) => {
    if (e.target.closest("button")) return;

    isDragging = true;
    el.dataset.moved = "true";

    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    el.style.position = "fixed";
    el.style.left = rect.left + "px";
    el.style.top = rect.top + "px";
    el.style.margin = "0";
    el.style.transform = "none";
    el.style.zIndex = 9999;
    el.style.cursor = "grabbing";
    el.style.transition = "none";

    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    el.style.left = `${e.clientX - offsetX}px`;
    el.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    el.style.cursor = "grab";
    el.style.transition = "";
  });
}

/* ================= ARTWORK POPUP ================= */
const artworkPopup = document.getElementById("popup-artwork");
const artworkBtn = document.getElementById("artwork-btn");

if (artworkBtn && artworkPopup) {
  artworkBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (artworkPopup.style.display === "block") return;

    artworkPopup.style.display = "block";
    requestAnimationFrame(() => {
      artworkPopup.classList.remove("closing");
      artworkPopup.style.opacity = "1";
      artworkPopup.style.transform = "translate(-50%, -50%) scale(1)";
    });
  });

  // Prevent internal clicks from closing
  artworkPopup.addEventListener("click", (e) => e.stopPropagation());
}

// Close artwork popup when clicking outside
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

const contactBtn = document.getElementById("contact-label"); // corrected
const contactPopup = document.getElementById("popup-contact");

if (contactBtn && contactPopup) {
  // Open contact popup
  contactBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    contactPopup.style.display = "block";
    requestAnimationFrame(() => {
      contactPopup.classList.add("show");
    });
  });

  // Prevent internal clicks from closing
  contactPopup.addEventListener("click", (e) => e.stopPropagation());

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (
      contactPopup.style.display === "block" &&
      !contactPopup.contains(e.target) &&
      !contactBtn.contains(e.target)
    ) {
      contactPopup.classList.remove("show");
      setTimeout(() => {
        contactPopup.style.display = "none";
      }, 250); // match CSS transition
    }
  });

  // Optional: Make draggable if makeDraggable exists
  if (typeof makeDraggable === "function") makeDraggable(contactPopup);
}

const cardInner = document.querySelector("#contact-card .card-inner");

cardInner.addEventListener("dblclick", () => {
  cardInner.classList.toggle("flipped");
});





/* ================= MAKE POPUPS DRAGGABLE ================= */
aboutPopups.forEach(popup => makeDraggable(popup));
if (artworkPopup) makeDraggable(artworkPopup);
if (contactPopup) makeDraggable(contactPopup);
