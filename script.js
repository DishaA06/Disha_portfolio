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
            const depth = (index + 1) * 0.05;
            const moveX = (mouseX * depth) / 15;
            const moveY = (mouseY * depth) / 15;

            // Get the current CSS rotation value (e.g., "rotate(-3deg)")
            // We use this to maintain the unique rotated positions defined in the CSS.
            const currentTransform = window.getComputedStyle(label).transform;

            label.style.transform = `
                translate3d(${moveX}px, ${moveY}px, 0) 
                ${currentTransform.includes('rotate') ? currentTransform.match(/rotate\((.*?)\)/)[0] : 'rotate(-3deg)'}
            `;
        });
    });


    // 2. Dynamic Text Animation for the Title
    // -----------------------------------------------------------------
    const titleElement = document.querySelector('.title');
    const text = titleElement.textContent;
    titleElement.textContent = ''; // Clear original text

    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = 0;
        span.style.display = 'inline-block';
        
        span.classList.add('title-letter'); 
        titleElement.appendChild(span);
        
        setTimeout(() => {
            span.style.transition = 'opacity 0.5s ease-out';
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
    });
});