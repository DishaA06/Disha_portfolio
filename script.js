document.addEventListener('DOMContentLoaded', () => {
    // Parallax Labels
    const labels = document.querySelectorAll('.labels .label');
    document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        labels.forEach((label, index) => {
            const depth = (index + 1) * 0.05;
            const moveX = (mouseX * depth) / 15;
            const moveY = (mouseY * depth) / 15;
            const currentTransform = window.getComputedStyle(label).transform;
            let rotation = 'rotate(0deg)';
            const rotationMatch = currentTransform.match(/rotate\((.*?)\)/);
            if (rotationMatch) rotation = rotationMatch[0];
            label.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) ${rotation}`;
        });
    });

    const titleSpans = document.querySelectorAll('.curved-title span');
    titleSpans.forEach(span => span.style.opacity = 0);
    titleSpans.forEach((span, i) => {
        setTimeout(() => {
            span.style.transition = 'opacity 1.5s ease-out, transform 0.3s ease';
            span.style.opacity = 1;
        }, 50 * i);
    });
});

// Sticky Note Animation
window.addEventListener('load', () => {
    const stickyNote = document.getElementById('sticky-note');
    if (stickyNote) setTimeout(() => stickyNote.classList.add('show'), 500);
});

// Popup logic and Dragging
const label = document.querySelector("#more-about-me");
const popups = [
    document.getElementById("popup-text"),
    document.getElementById("popup-photo-2")
].filter(Boolean); // filter out any nulls

// Smooth close animation
function animateClose(popup) {
    if (!popup) return;
    popup.classList.add("closing");
    setTimeout(() => {
        popup.style.display = "none";
        popup.classList.remove("closing");
    }, 300);
}

function closePopups() {
    popups.forEach(p => {
        if (p && p.style.display === "block") animateClose(p);
    });
}

// Open popups (about-me)
if (label) {
    label.addEventListener("click", (e) => {
        e.stopPropagation();
        popups.forEach((p, i) => {
            if (!p) return;
            if (p.style.display === "none" || !p.style.display) {
                setTimeout(() => {
                    p.style.display = "block";
                    p.style.left = (100 + i * 300) + "px";
                    p.style.top = (10 + i * 100) + "px";
                    p.style.position = "absolute";
                    p.classList.remove("closing");
                }, i * 150);
            }
        });
    });
}

// Close on outside click (about-me popups)
document.addEventListener("click", (e) => {
    let insidePopup = popups.some(p => p && p.contains(e.target));
    let onLabel = label && label.contains(e.target);
    if (!insidePopup && !onLabel) closePopups();
});

// CONTACT POPUP -------------------

const contactBtn = document.querySelector(".top-left");
const contactPopup = document.getElementById("popup-contact");
const closeContact = document.getElementById("close-contact");

if (contactBtn && contactPopup && closeContact) {

  function centerContactPopupIfNeeded() {
    const rect = contactPopup.getBoundingClientRect();
    if (!contactPopup.dataset.moved) {
      contactPopup.style.position = "fixed";
      contactPopup.style.left = `${Math.round((window.innerWidth - rect.width) / 2)}px`;
      contactPopup.style.top = `${Math.round((window.innerHeight - rect.height) / 2)}px`;
      contactPopup.style.transform = "none";
    }
    contactPopup.style.zIndex = Date.now();
  }

  contactBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    contactPopup.classList.add("show");
    requestAnimationFrame(centerContactPopupIfNeeded);
  });

  closeContact.addEventListener("click", (ev) => {
    ev.stopPropagation();
    contactPopup.classList.remove("show");
  });

  document.addEventListener("click", (e) => {
    const inside = contactPopup.contains(e.target) || contactBtn.contains(e.target);
    if (!inside) contactPopup.classList.remove("show");
  });

  // Draggable logic
  let dragActive = false;
  let startX = 0, startY = 0;
  let startLeft = 0, startTop = 0;
  let pointerId = null;

  contactPopup.addEventListener("pointerdown", (e) => {
    if (!contactPopup.classList.contains("show")) return;
    if (e.target.closest("a, button, input, textarea, select, label")) return;

    e.preventDefault();
    e.stopPropagation();

    pointerId = e.pointerId;
    try { contactPopup.setPointerCapture(pointerId); } catch {}

    const rect = contactPopup.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startLeft = rect.left;
    startTop = rect.top;

    contactPopup.style.position = "fixed";
    contactPopup.style.transform = "none";
    contactPopup.dataset.moved = "true";

    document.body.style.userSelect = "none";
    contactPopup.style.touchAction = "none";

    contactPopup.style.zIndex = Date.now();
    dragActive = true;
  });

  document.addEventListener("pointermove", (e) => {
    if (!dragActive || e.pointerId !== pointerId) return;
    e.preventDefault();
    e.stopPropagation();

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let left = Math.round(startLeft + dx);
    let top = Math.round(startTop + dy);

    const margin = 10;
    const maxLeft = Math.max(window.innerWidth - contactPopup.offsetWidth - margin, margin);
    const maxTop = Math.max(window.innerHeight - contactPopup.offsetHeight - margin, margin);

    left = Math.min(Math.max(left, margin), maxLeft);
    top = Math.min(Math.max(top, margin), maxTop);

    contactPopup.style.left = `${left}px`;
    contactPopup.style.top = `${top}px`;
  });

  function stopDrag(e) {
    if (!dragActive) return;
    dragActive = false;

    try { contactPopup.releasePointerCapture(pointerId); } catch {}
    pointerId = null;

    document.body.style.userSelect = "";
    contactPopup.style.touchAction = "manipulation";
  }

  document.addEventListener("pointerup", stopDrag);
  document.addEventListener("pointercancel", stopDrag);

  contactPopup.addEventListener("click", (e) => e.stopPropagation());
}

// Draggable for about-me popups
popups.forEach(popup => {
    if (!popup) return;
    let offsetX = 0;
    let offsetY = 0;

    popup.addEventListener("mousedown", e => {
        e.preventDefault();
        e.stopPropagation();
        popup.style.zIndex = Date.now();

        const style = window.getComputedStyle(popup);
        offsetX = e.clientX - (parseFloat(style.left) || 0);
        offsetY = e.clientY - (parseFloat(style.top) || 0);
        popup.style.position = "absolute";

        function onMouseMove(e) {
            popup.style.left = e.clientX - offsetX + "px";
            popup.style.top = e.clientY - offsetY + "px";
        }

        document.addEventListener("mousemove", onMouseMove);
        function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }
        document.addEventListener("mouseup", onMouseUp);
    });

    popup.addEventListener("click", e => e.stopPropagation());
});

// ARTWORK POPUP ---------------------------------------------------
// NOTE: these IDs match your HTML: "artwork-btn", "popup-artwork", "close-artwork"
const artworksLabel = document.getElementById("artwork-btn");
const deskPopup = document.getElementById("popup-artwork");
const closeDeskPopup = document.getElementById("close-artwork");

// Open
if (artworksLabel && deskPopup) {
    artworksLabel.addEventListener("click", (e) => {
        e.stopPropagation();
        deskPopup.style.display = "block";
        deskPopup.classList.add("show");
    });
}

// Close X
if (closeDeskPopup && deskPopup) {
    closeDeskPopup.addEventListener("click", (e) => {
        e.stopPropagation();
        deskPopup.classList.remove("show");
        setTimeout(() => deskPopup.style.display = "none", 200);
    });
}

// Close outside (artwork)
document.addEventListener("click", (e) => {
    if (
        deskPopup &&
        deskPopup.style.display === "block" &&
        !deskPopup.contains(e.target) &&
        e.target !== artworksLabel
    ) {
        deskPopup.classList.remove("show");
        setTimeout(() => deskPopup.style.display = "none", 200);
    }
});

// Draggable helper
function makeDragTarget(el) {
    if (!el) return;
    let offsetX = 0, offsetY = 0, dragging = false;

    el.addEventListener("mousedown", (e) => {
        // ignore if clicking interactive controls
        if (e.target.closest("button, a, input, textarea, select, label")) return;
        dragging = true;
        const r = el.getBoundingClientRect();
        offsetX = e.clientX - r.left;
        offsetY = e.clientY - r.top;
        el.style.position = "absolute";
        el.style.zIndex = Date.now();
        document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        el.style.left = e.clientX - offsetX + "px";
        el.style.top = e.clientY - offsetY + "px";
    });

    document.addEventListener("mouseup", () => {
        dragging = false;
        document.body.style.userSelect = "";
    });

    // also prevent clicks inside from bubbling (so outside click doesn't close immediately)
    el.addEventListener("click", (e) => e.stopPropagation());
}

// MAKE ARTWORK POPUP DRAGGABLE
if (deskPopup) makeDragTarget(deskPopup);
