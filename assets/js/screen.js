// Detectar si el dispositivo es de mayor tamaño
function checkDevice() {
    const desktopMessage = document.getElementById('desktopMessage');
    if (window.innerWidth > 768) {
        desktopMessage.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Evitar scroll
    } else {
        desktopMessage.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.addEventListener('resize', checkDevice);
window.addEventListener('load', checkDevice);

// Get the elements
const infoButton = document.querySelector('.header-buttons button:nth-child(2)');
const infoPopup = document.getElementById('infoPopup');
const closeInfoBtn = document.getElementById('closeInfoBtn');

// Show popup when info button is clicked
infoButton.addEventListener('click', () => {
    infoPopup.classList.add('show');
});

// Hide popup when close button is clicked
closeInfoBtn.addEventListener('click', () => {
    infoPopup.classList.remove('show');
});

// Hide popup when clicking outside
infoPopup.addEventListener('click', (e) => {
    if (e.target === infoPopup) {
        infoPopup.classList.remove('show');
    }
});