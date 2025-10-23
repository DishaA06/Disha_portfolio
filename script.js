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

    const titleSpans = document.querySelectorAll('.curved-title span'); titleSpans.forEach(span => span.style.opacity = 0); titleSpans.forEach((span, i) => { setTimeout(() => { span.style.transition = 'opacity 1.5s ease-out, transform 0.3s ease'; span.style.opacity = 1; }, 50 * i); });

    // (Commented out Label click demo remains as is)
});

// Sticky Note Animation
window.addEventListener('load', () => {
    const stickyNote = document.getElementById('sticky-note');
    setTimeout(() => stickyNote.classList.add('show'), 500);
});

// Popup logic and Dragging (REVISED)
const label = document.querySelector("#more-about-me");
const popups = [
    document.getElementById("popup-text"),
    document.getElementById("popup-photo-2")
];

// Function to close all popups
function closePopups() {
    popups.forEach(p => {
        p.style.display = "none";
    });
}

// Open popups on label click
label.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent the document click listener from immediately closing them
    popups.forEach((p, i) => {
        // Only show if currently hidden (prevents re-positioning if already open)
        if (p.style.display === "none" || !p.style.display) {
            setTimeout(() => {
                p.style.display = "block";
                // Initial positioning (using left/top)
                p.style.left = (100 + i * 300) + "px";
                p.style.top = (10 + i * 100) + "px";
                p.style.position = "absolute"; // Ensure they are positionable
            }, i * 150);
        }
    });
});

// --- NEW FEATURE: Click outside to close popups ---
document.addEventListener("click", (e) => {
    // Check if the click target is the opening label, or inside any popup
    let isClickInsidePopup = popups.some(p => p.contains(e.target));
    let isClickOnLabel = label.contains(e.target);

    // If the click is NOT inside a popup AND NOT on the label, close them
    if (!isClickInsidePopup && !isClickOnLabel) {
        closePopups();
    }
});
// --------------------------------------------------

// making popups draggable (FIXED OFFSET)
popups.forEach(popup => {
    let offsetX = 0;
    let offsetY = 0;

    popup.addEventListener("mousedown", e => {
        e.preventDefault();
        e.stopPropagation(); // Stop propagation to prevent document click from closing

        popup.style.zIndex = Date.now(); // bring to front

        // --- FIXED OFFSET LOGIC ---
        // Get the current computed 'left' and 'top' values, defaulting to 0
        const style = window.getComputedStyle(popup);
        const currentLeft = parseFloat(style.left) || 0;
        const currentTop = parseFloat(style.top) || 0;

        // Calculate offset by subtracting the current CSS 'left'/'top' 
        // from the mouse's client coordinates. This makes the drag smooth.
        offsetX = e.clientX - currentLeft;
        offsetY = e.clientY - currentTop;
        // -------------------------

        popup.style.position = "absolute"; // Ensure it's absolutely positioned for dragging

        // Move popup as mouse moves
        function onMouseMove(e) {
            popup.style.left = e.clientX - offsetX + "px";
            popup.style.top = e.clientY - offsetY + "px";
        }

        // Attach mousemove listener
        document.addEventListener("mousemove", onMouseMove);

        // Remove listener on mouseup
        function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }

        document.addEventListener("mouseup", onMouseUp);
    });

    // Prevent clicks inside popup from propagating up and closing them
    popup.addEventListener("click", e => e.stopPropagation());
});