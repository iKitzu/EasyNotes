function handleLogout() {
    // Elimina el token y cualquier otro dato del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('usuario'); // Elimina otros datos si es necesario

    // Redirige a la página principal
    window.location.href = '/index.html'; // Cambia '/' por la URL de la página a la que quieres redirigir
}


function createLogoutModal() {
    // Crear el modal HTML
    const modalHTML = `
        <div id="logoutDialog" class="modal-overlay" style="display: none;">
            <div class="modal">
                <div class="flex-col">
                    <div class="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                    </div>
                    <h3>Log Out</h3>
                    <p>Are you sure you want to log out?</p>
                </div>
                    <div class="flex">
                        <button id="cancelLogoutButton">Cancel</button>
                        <button id="confirmLogoutButton">Log Out</button>
                    </div>
                </div>   
        </div>
    `;

    // Agregar el modal al body si no existe
    if (!document.querySelector('#logoutDialog')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Obtener referencias a los elementos
    const logoutDialog = document.querySelector('#logoutDialog');
    const cancelButton = document.querySelector('#cancelLogoutButton');
    const confirmButton = document.querySelector('#confirmLogoutButton');

    // Función para mostrar el modal
    function showLogoutModal() {
        logoutDialog.style.display = 'flex';
    }

    // Función para ocultar el modal
    function hideLogoutModal() {
        logoutDialog.style.display = 'none';
    }

    // Event listeners
    cancelButton.addEventListener('click', hideLogoutModal);
    confirmButton.addEventListener('click', () => {
        // Ejecutar la función de logout
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/index.html';
    });

    return showLogoutModal;
}

// Modificar la función handleLogout
function handleLogout() {
    const showLogoutModal = createLogoutModal();
    showLogoutModal();
}