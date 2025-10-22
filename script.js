/**
 * script.js for Disha’s Portfolio
 * Adds subtle parallax motion to the labels and animates the title text.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Parallax Effect for Labels
    // -----------------------------------------------------------------
    const labels = document.querySelectorAll('.labels .label');

    // Add a listener to the entire document body
    document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        labels.forEach((label, index) => {
            // Adjust depth calculation for a more subtle effect
            const depth = (index + 1) * 0.05; 
            const moveX = (mouseX * depth) / 15;
            const moveY = (mouseY * depth) / 15;

            // Get the current CSS transform (including rotation)
            const currentTransform = window.getComputedStyle(label).transform;

            // Extract the rotation part (e.g., "rotate(4deg)")
            let rotation = 'rotate(0deg)'; // Default if no rotation found
            const rotationMatch = currentTransform.match(/rotate\((.*?)\)/);
            if (rotationMatch) {
                rotation = rotationMatch[0];
            } else {
                // Fallback for initial state or where the matrix doesn't show rotate() explicitly
                // You might need to check your CSS and set a specific fallback here for each label
                // For simplicity, we'll try to get the existing CSS matrix transform
            }

            // Apply the parallax translation *and* the original rotation
            label.style.transform = `
                translate3d(${moveX}px, ${moveY}px, 0) 
                ${rotation}
            `;
        });
    });


    // 2. Dynamic Text Animation for the Title (PORTFOLIO)
    // -----------------------------------------------------------------
    // FIX: Select the correct element: .curved-title
    const titleSpans = document.querySelectorAll('.curved-title span'); 

    // 2.1 Set initial state for animation (optional but good practice)
    titleSpans.forEach(span => {
        span.style.opacity = 0;
    });

    // 2.2 Animate the spans into view
    titleSpans.forEach((span, index) => {
        // We use the existing spans, just fade them in sequentially
        setTimeout(() => {
            span.style.transition = 'opacity 0.5s ease-out, transform 0.3s ease';
            span.style.opacity = 1;
        }, 50 * index); // 50ms delay per letter
    });


    // 3. Optional: Add Clickable Links to Labels
    // -----------------------------------------------------------------
    labels.forEach(label => {
        label.style.cursor = 'pointer';
        label.addEventListener('click', (event) => {
            const labelText = event.target.textContent;
            if (labelText) {
                // In a real site, replace alert with window.location.href = '/projects.html'
                alert(`Navigating to: ${labelText.trim()} section...`);
            }
        });
    }
);
});
window.addEventListener('load', () => {
  const stickyNote = document.getElementById('sticky-note');
  setTimeout(() => {
    stickyNote.classList.add('show'); // pop-up animation
  }, 500); // delay for nice effect
});
