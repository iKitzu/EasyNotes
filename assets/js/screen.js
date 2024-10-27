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

// Selecciona el contenedor principal
document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('body'); // Escoge un contenedor que no cambia, como 'body'

    // Usa delegación de eventos para el botón de información
    mainContainer.addEventListener('click', (event) => {
        const infoPopup = document.getElementById('infoPopup');

        if (event.target.closest('.icon-button[aria-label="Información"]')) {
            // Muestra el popup al hacer clic en el botón de información
            infoPopup.classList.add('show');
        }

        // Cierra el popup al hacer clic en el botón de cerrar
        if (event.target.id === 'closeInfoBtn' || event.target === infoPopup) {
            infoPopup.classList.remove('show');
        }
    });
});
