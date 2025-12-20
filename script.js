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

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!aboutPopups.some(p => p.contains(e.target)) && !aboutBtn.contains(e.target)) {
    closeAboutPopups();
  }
});

/* ================= DRAG FUNCTION ================= */
function makeDraggable(el) {
  let dragging = false, offsetX = 0, offsetY = 0;

  el.addEventListener("mousedown", (e) => {
    if (e.target.closest("button")) return; // ignore buttons inside popup
    dragging = true;

    const rect = el.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(el);

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    el.style.position = "absolute";
    el.style.left = rect.left - parseFloat(computedStyle.marginLeft || 0) + "px";
    el.style.top = rect.top - parseFloat(computedStyle.marginTop || 0) + "px";
    el.style.zIndex = Date.now();
    el.style.cursor = "grabbing";
    el.style.transition = "none";

    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    el.style.left = e.clientX - offsetX + "px";
    el.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    el.style.cursor = "grab";
    el.style.transition = "";
  });
}

// ---------- MAKE ABOUT ME POPUPS DRAGGABLE ----------
aboutPopups.forEach(popup => makeDraggable(popup));
