// Close popup by clicking the red cross
const closeBtn = document.getElementById('close-popup');

closeBtn.addEventListener('click', () => {
  // Navigate back to homepage
  window.location.href = 'index.html';
});
