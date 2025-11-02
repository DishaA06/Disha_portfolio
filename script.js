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
