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
    setTimeout(() => stickyNote.classList.add('show'), 500);
});

// Popup logic and Dragging
const label = document.querySelector("#more-about-me");
const popups = [
    document.getElementById("popup-text"),
    document.getElementById("popup-photo-2")
];

// 🟢 New Function: Animate popup close smoothly
function animateClose(popup) {
    popup.classList.add("closing");
    setTimeout(() => {
        popup.style.display = "none";
        popup.classList.remove("closing");
    }, 300); // Matches CSS animation duration
}

// Function to close all popups
function closePopups() {
    popups.forEach(p => {
        if (p.style.display === "block") {
            animateClose(p);
        }
    });
}

// Open popups on label click
label.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent document click from closing immediately
    popups.forEach((p, i) => {
        if (p.style.display === "none" || !p.style.display) {
            setTimeout(() => {
                p.style.display = "block";
                p.style.left = (100 + i * 300) + "px";
                p.style.top = (10 + i * 100) + "px";
                p.style.position = "absolute";
                p.classList.remove("closing"); // Ensure clean state
            }, i * 150);
        }
    });
});

// Close popups on outside click
document.addEventListener("click", (e) => {
    let isClickInsidePopup = popups.some(p => p.contains(e.target));
    let isClickOnLabel = label.contains(e.target);
    if (!isClickInsidePopup && !isClickOnLabel) {
        closePopups();
    }
});



// ------------------- CONTACT POPUP (full-window dragging) -------------------

const contactBtn = document.querySelector(".top-left");
const contactPopup = document.getElementById("popup-contact");
const closeContact = document.getElementById("close-contact");

// Open popup and center it (if not already positioned)
contactBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  contactPopup.classList.add("show");

  // Center visually and convert to fixed coords
  requestAnimationFrame(() => {
    // ensure the element is measurable
    const rect = contactPopup.getBoundingClientRect();
    // if already positioned (user moved it), don't recenter
    if (!contactPopup.style.left && !contactPopup.style.top) {
      contactPopup.style.position = "fixed";
      contactPopup.style.left = `${Math.round((window.innerWidth - rect.width) / 2)}px`;
      contactPopup.style.top = `${Math.round((window.innerHeight - rect.height) / 2)}px`;
      contactPopup.style.transform = "none";
    }
    // bring to front
    contactPopup.style.zIndex = Date.now();
  });
});

// Close popup (X)
closeContact.addEventListener("click", (ev) => {
  ev.stopPropagation();
  contactPopup.classList.remove("show");
});

// Close WHEN clicking outside the popup (keeps parity with other popups)
document.addEventListener("click", (e) => {
  const clickedInside = contactPopup.contains(e.target) || contactBtn.contains(e.target);
  if (!clickedInside) {
    contactPopup.classList.remove("show");
  }
});

// ------------------- Dragging (pointer events, whole popup draggable) -------------------

let isDraggingContact = false;
let startX = 0;
let startY = 0;
let startLeft = 0;
let startTop = 0;
let activePointerId = null;

// Start drag when pointerdown on popup (but ignore clicks on links/inputs/buttons)
contactPopup.addEventListener("pointerdown", (ev) => {
  // only start when popup is visible
  if (!contactPopup.classList.contains("show")) return;

  // ignore right click or secondary buttons
  if (ev.button && ev.button !== 0) return;

  // if user clicked a control where dragging would be unexpected, ignore it
  if (ev.target.closest("a, button, input, textarea, select, label")) return;

  // capture pointer so move events are reliable across the window
  contactPopup.setPointerCapture(ev.pointerId);
  activePointerId = ev.pointerId;

  const rect = contactPopup.getBoundingClientRect();
  // initial positions
  startX = ev.clientX;
  startY = ev.clientY;
  startLeft = rect.left;
  startTop = rect.top;

  // ensure fixed positioning so left/top are viewport-relative
  contactPopup.style.position = "fixed";
  contactPopup.style.transform = "none"; // disable centering transform while dragging
  contactPopup.style.zIndex = Date.now();

  // disable text selection while dragging
  document.body.style.userSelect = "none";

  isDraggingContact = true;
});

// Move
document.addEventListener("pointermove", (ev) => {
  if (!isDraggingContact || ev.pointerId !== activePointerId) return;

  const dx = ev.clientX - startX;
  const dy = ev.clientY - startY;

  let newLeft = Math.round(startLeft + dx);
  let newTop = Math.round(startTop + dy);

  // clamp within viewport with small margins
  const margin = 8;
  const maxLeft = window.innerWidth - contactPopup.offsetWidth - margin;
  const maxTop = window.innerHeight - contactPopup.offsetHeight - margin;
  newLeft = Math.min(Math.max(newLeft, margin), Math.max(maxLeft, margin));
  newTop = Math.min(Math.max(newTop, margin), Math.max(maxTop, margin));

  contactPopup.style.left = `${newLeft}px`;
  contactPopup.style.top = `${newTop}px`;
});

// End drag
function endContactDrag(ev) {
  if (!isDraggingContact) return;
  isDraggingContact = false;

  // release pointer capture if possible
  try { contactPopup.releasePointerCapture(ev.pointerId); } catch (err) { /* ignore */ }
  activePointerId = null;

  // re-enable text selection
  document.body.style.userSelect = "";

  // ensure transform state is normalized
  contactPopup.style.transform = "none";
}

document.addEventListener("pointerup", endContactDrag);
document.addEventListener("pointercancel", endContactDrag);

// stop clicks inside popup from bubbling up (so outside-click handler doesn't close immediately)
contactPopup.addEventListener("click", (e) => e.stopPropagation());





// Make popups draggable
popups.forEach(popup => {
    let offsetX = 0;
    let offsetY = 0;

    popup.addEventListener("mousedown", e => {
        e.preventDefault();
        e.stopPropagation();
        popup.style.zIndex = Date.now();

        const style = window.getComputedStyle(popup);
        const currentLeft = parseFloat(style.left) || 0;
        const currentTop = parseFloat(style.top) || 0;

        offsetX = e.clientX - currentLeft;
        offsetY = e.clientY - currentTop;
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
