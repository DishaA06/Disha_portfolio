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


    // Label click demo
    // labels.forEach(label => {
    //     label.style.cursor = 'pointer';
    //     label.addEventListener('click', (e) => {
    //         const text = e.target.textContent;
    //         if (text) alert(`Navigating to: ${text.trim()} section...`);
    //     });
    // });
});

// Sticky Note Animation
window.addEventListener('load', () => {
    const stickyNote = document.getElementById('sticky-note');
    setTimeout(() => stickyNote.classList.add('show'), 500);
});

// Popup logic
const label = document.querySelector("#more-about-me");
const popups = [
    document.getElementById("popup-text"),
    document.getElementById("popup-photo-2")
];

label.addEventListener("click", () => {
    popups.forEach((p, i) => {
        setTimeout(() => {
            p.style.display = "block";
            p.style.left = (100 + i * 300) + "px";
            p.style.top = (10 + i * 100) + "px";
        }, i * 150);
    });
});

// making popups draggable
popups.forEach(popup => {
    let isDown = false;
    let offset = [0, 0];
    // Mouse down on popup

    popup.addEventListener("mousedown", e => {
        isDown = true;
        popup.style.zIndex = Date.now(); // bring to front
        offset = [popup.offsetLeft - e.clientX, popup.offsetTop - e.clientY];
        e.stopPropagation(); // prevent closing when starting drag
    });

    document.addEventListener("mouseup", () => isDown = false);

    document.addEventListener("mousemove", e => {
        if (!isDown) return;
        popup.style.left = e.clientX + offset[0] + "px";
        popup.style.top = e.clientY + offset[1] + "px";
    });

    // Prevent clicks inside popup from closing it
    popup.addEventListener("click", e => e.stopPropagation());
});
