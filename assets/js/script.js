// Estado de la aplicación
let notes = JSON.parse(localStorage.getItem('notes')) || [];

function showUserId() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        console.log('ID de usuario almacenado en localStorage:', userId);
    } else {
        console.log('No se encontró ningún ID de usuario en localStorage.');
    }
}

showUserId();

// Función para guardar notas en localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Función para inicializar la aplicación
function initializeApp() {
    updateView();
    setupEventListeners();
}

// Función para configurar los event listeners
function setupEventListeners() {
    const fab = document.querySelector('.fab');
    if (fab) {
        // Removemos el event listener anterior si existe
        fab.replaceWith(fab.cloneNode(true));
        // Añadimos el nuevo event listener
        document.querySelector('.fab').addEventListener('click', createNewNote);
    }
}

function setupSwipeToDelete(noteElement, note) {
    let startX;
    let isSwiping = false;
    const deleteOverlay = document.createElement('div');
    
    // Crear el overlay de eliminación
    deleteOverlay.classList.add('delete-overlay');
    deleteOverlay.innerHTML = `
        <div class="delete-icon">
            <img src="/assets/img/delete.png" alt="Eliminar" width="27" height="auto" />
        </div>
    `;
    deleteOverlay.style.backgroundColor = 'rgba(255, 0, 0)';
    deleteOverlay.style.position = 'absolute';
    deleteOverlay.style.top = '0';
    deleteOverlay.style.left = '0';
    deleteOverlay.style.right = '0';
    deleteOverlay.style.bottom = '0';
    deleteOverlay.style.display = 'flex';
    deleteOverlay.style.alignItems = 'center';
    deleteOverlay.style.justifyContent = 'center';
    deleteOverlay.style.color = 'white';
    deleteOverlay.style.opacity = '0';
    deleteOverlay.style.transition = 'opacity 0.3s';
    deleteOverlay.style.borderRadius = '10px';

    noteElement.appendChild(deleteOverlay);

    const deleteModal = document.createElement('div');
    deleteModal.innerHTML = `
        <div id="deleteNoteDialog" class="modal-overlay" style="display: none;">
            <div class="modal">
                <div class="flex flex-col items-center mb-4">
                    <h3 class="text-lg font-semibold text-center">Delete Note</h3>
                    <p class="text-gray-500 text-center mt-2">Are you sure you want to delete this note? This action cannot be undone.</p>
                </div>
                <div class="flex gap-3">
                    <button class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors" id="cancelDeleteButton">
                        Cancel
                    </button>
                    <button class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors" id="confirmDeleteButton">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(deleteModal);

    const deleteDialog = deleteModal.querySelector('#deleteNoteDialog');
    const confirmDeleteButton = deleteModal.querySelector('#confirmDeleteButton');
    const cancelDeleteButton = deleteModal.querySelector('#cancelDeleteButton');

    // Eventos touch para el deslizamiento
    noteElement.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = false;
    });

    noteElement.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].clientX;
        const deltaX = touchX - startX;

        if (deltaX > 50) {
            isSwiping = true;
            deleteOverlay.style.opacity = '1';
        }
    });

    noteElement.addEventListener('touchend', () => {
        if (isSwiping) {
            deleteDialog.style.display = 'flex';
        }
    });

    // Event listener para confirmar eliminación
    confirmDeleteButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://172.16.101.158:8080/notes/api/notas/${note.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                updateView();  // Refrescar las notas para eliminar la nota borrada
            } else {
                showErrorModal('Error al eliminar la nota en la base de datos.');
            }
        } catch (error) {
            showErrorModal('No se pudo conectar al servidor.');
            console.error('Error de red:', error);
        }

        deleteDialog.style.display = 'none';
    });

    cancelDeleteButton.addEventListener('click', () => {
        deleteDialog.style.display = 'none';
        deleteOverlay.style.opacity = '0';
    });
}



// Modificar la función showNoteDetail para enviar los cambios a la API y manejar los diálogos de confirmación
async function showNoteDetail(note) {
    const mainContainer = document.querySelector('.app');
    const previousContent = mainContainer.innerHTML;
    
    mainContainer.classList.add('fullscreen-mode');
    
    // Mostrar el diálogo en HTML
    mainContainer.innerHTML = `
        <div id="saveChangesDialog" class="modal-overlay" style="display: none;">
            <div class="modal">
                <div class="flex flex-col items-center mb-4">
                    <div class="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-center">Save changes?</h3>
                    <p class="text-gray-500 text-center mt-2">Do you want to save your changes?</p>
                </div>
                <div class="flex gap-3">
                    <button class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors" id="discardButton">
                        Discard
                    </button>
                    <button class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors" id="saveButton">
                        Save
                    </button>
                </div>
            </div>
        </div>
        
        <div id="discardChangesDialog" class="modal-overlay" style="display: none;">
            <div class="modal">
                <div class="flex flex-col items-center mb-4">
                    <div class="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-center">Are you sure you want to discard your changes?</h3>
                    <p class="text-gray-500 text-center mt-2">This action cannot be undone.</p>
                </div>
                <div class="flex gap-3">
                    <button class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors" id="confirmDiscardButton">
                        Discard
                    </button>
                    <button class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors" id="keepButton">
                        Keep
                    </button>
                </div>
            </div>
        </div>

        <header class="detail-header">
            <button class="icon-button back-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </button>
            <div class="header-buttons">
                <button class="icon-button save-button" style="display: none;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                    </svg>
                </button>
            </div>
        </header>
        <main class="note-detail-page">
            <div class="note-detail-content">
                <h1 class="note-detail-title" contenteditable="true">${note.titulo}</h1>
                <div class="note-detail-text" contenteditable="true">${note.contenido}</div>
                <br><br><br><br><br><br>
            </div>
        </main>
    `;

    const backButton = document.querySelector('.back-button');
    const saveButton = document.querySelector('.save-button');
    const titleElement = document.querySelector('.note-detail-title');
    const textElement = document.querySelector('.note-detail-text');
    const saveChangesDialog = document.querySelector('#saveChangesDialog');
    const discardChangesDialog = document.querySelector('#discardChangesDialog');
    
    let isEditing = false;
    let originalTitle = note.titulo;
    let originalContent = note.contenido;

    function toggleSaveButton(show) {
        saveButton.style.display = show ? 'flex' : 'none';
        isEditing = show;
    }

    function handleEditStart() {
        toggleSaveButton(true);
    }

    function hasChanges() {
        return titleElement.textContent.trim() !== originalTitle || 
               textElement.innerHTML.trim() !== originalContent;
    }

    async function saveChanges() {
        const newTitle = titleElement.textContent.trim();
        const newContent = textElement.innerHTML.replace(/\n/g, '<br>').trim();
        
        if (newTitle && newContent) {
            try {
                const response = await fetch(`http://172.16.101.158:8080/notes/api/notas/${note.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        ...note,
                        titulo: newTitle,
                        contenido: newContent 
                    })
                });

                if (response.ok) {
                    originalTitle = newTitle;
                    originalContent = newContent;
                    toggleSaveButton(false);
                    saveChangesDialog.style.display = 'none';
                    console.log('Changes saved successfully.');
                } else {
                    console.error('Error saving changes.');
                }
            } catch (error) {
                console.error('Network error while saving changes:', error);
            }
        } else {
            alert('Title and content cannot be empty.');
        }
    }

    function handleBack() {
        if (isEditing && hasChanges()) {
            discardChangesDialog.style.display = 'flex';
        } else {
            exitNote();
        }
    }

    function exitNote() {
        mainContainer.classList.remove('fullscreen-mode');
        mainContainer.innerHTML = previousContent;
        updateView();
    }

    // Event Listeners
    titleElement.addEventListener('input', handleEditStart);
    textElement.addEventListener('input', handleEditStart);
    saveButton.addEventListener('click', () => saveChangesDialog.style.display = 'flex');
    backButton.addEventListener('click', handleBack);

    // Save Changes Dialog
    document.querySelector('#saveButton').addEventListener('click', saveChanges);
    document.querySelector('#discardButton').addEventListener('click', () => {
        saveChangesDialog.style.display = 'none';
    });

    // Discard Changes Dialog
    document.querySelector('#confirmDiscardButton').addEventListener('click', exitNote);
    document.querySelector('#keepButton').addEventListener('click', () => {
        discardChangesDialog.style.display = 'none';
    });
    
    titleElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            textElement.focus();
        }
    });
}


function createNewNote() {
    const mainContainer = document.querySelector('.app');
    const previousContent = mainContainer.innerHTML;
    
    mainContainer.classList.add('fullscreen-mode');
    
    mainContainer.innerHTML = `
        <div id="saveChangesDialog" class="modal-overlay" style="display: none;">
            <div class="modal">
                <div class="flex-col">
                    <div class="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                    </div>
                    <h3>Save note?</h3>
                    <p>Do you want to save this note?</p>
                </div>
                <div class="flex">
                    <button id="discardButton">Discard</button>
                    <button id="saveButton">Save</button>
                </div>
            </div>
        </div>
        
        <div id="discardChangesDialog" class="modal-overlay" style="display: none;">
            <div class="modal">
                <div class="flex-col">
                    <div class="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                    </div>
                    <h3>Discard changes?</h3>
                    <p>Are you sure you want to discard this note?</p>
                </div>
                <div class="flex">
                    <button id="confirmDiscardButton">Discard</button>
                    <button id="keepButton">Keep</button>
                </div>
            </div>
        </div>

        <header class="detail-header">
            <button class="icon-button back-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </button>
            <div class="header-buttons">
                <button class="icon-button save-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                    </svg>
                </button>
            </div>
        </header>
        <main class="note-detail-page">
            <div class="note-detail-content">
                <h1 class="note-detail-title" contenteditable="true" data-placeholder="Title"></h1>
                <div class="note-detail-text" contenteditable="true" data-placeholder="Type something..."></div>
                <br><br><br><br><br><br>
            </div>
        </main>
    `;
    const backButton = document.querySelector('.back-button');
    const saveButton = document.querySelector('.save-button');
    const titleElement = document.querySelector('.note-detail-title');
    const textElement = document.querySelector('.note-detail-text');
    const saveChangesDialog = document.querySelector('#saveChangesDialog');
    const discardChangesDialog = document.querySelector('#discardChangesDialog');

    const userId = localStorage.getItem('userId'); // Recuperar userId

    function exitNote() {
        mainContainer.classList.remove('fullscreen-mode');
        mainContainer.innerHTML = previousContent;
        updateView();
    }

    async function saveNote() {
        const title = titleElement.textContent.trim();
        const content = textElement.innerHTML.trim();
        
        if (title && content) {
            // Crear objeto de la nota
            const newNote = {
                titulo: title,
                contenido: content
            };

            try {
                // Enviar solicitud POST al backend
                const response = await fetch(`http://172.16.101.158:8080/notes/api/notas/usuario/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newNote)
                });

                if (response.ok) {
                    exitNote(); // Salir del modo de creación después de guardar
                } else {
                    showErrorModal('Error al guardar la nota en la base de datos.');
                }
            } catch (error) {
                showErrorModal('No se pudo conectar al servidor.');
                console.error('Error de red:', error);
            }
        } else {
            showErrorModal('El título y el contenido no pueden estar vacíos.');
            saveChangesDialog.style.display = 'none';
        }
    }

    function handleSave() {
        if (titleElement.textContent.trim() || textElement.innerHTML.trim()) {
            saveChangesDialog.style.display = 'flex';
        }
    }

    function handleBack() {
        if (titleElement.textContent.trim() || textElement.innerHTML.trim()) {
            discardChangesDialog.style.display = 'flex';
        } else {
            exitNote();
        }
    }

    // Event Listeners
    saveButton.addEventListener('click', handleSave);
    backButton.addEventListener('click', handleBack);

    // Save Changes Dialog
    document.querySelector('#saveButton').addEventListener('click', saveNote);
    document.querySelector('#discardButton').addEventListener('click', () => {
        saveChangesDialog.style.display = 'none';
    });

    // Discard Changes Dialog
    document.querySelector('#confirmDiscardButton').addEventListener('click', exitNote);
    document.querySelector('#keepButton').addEventListener('click', () => {
        discardChangesDialog.style.display = 'none';
    });

    titleElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            textElement.focus();
        }
    });

    titleElement.focus();
}

// Actualizar el event listener del botón FAB
document.addEventListener('DOMContentLoaded', () => {
    const fab = document.querySelector('.fab');
    if (fab) {
        fab.addEventListener('click', createNewNote);
    }
});

// Función para truncar el texto, ignorando etiquetas HTML como <br>
function truncateText(text, maxLength = 100) {
    if (!text) return '';
    
    // Remover las etiquetas <br> u otras etiquetas HTML que puedan afectar el largo del texto
    const plainText = text.replace(/<br\s*\/?>/gi, ' ');
    
    if (plainText.length <= maxLength) return plainText;
    
    return plainText.substring(0, maxLength) + '...';
}


// Función separada para truncar títulos (más cortos que el contenido)
function truncateTitle(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
// --------------------------------------------------------------------------------------------------


// Primero agregamos la función para mostrar el error modal
function showErrorModal(message) {
    const modalHTML = `
        <div id="errorDialog" class="modal-overlay" style="display: flex;">
            <div class="modal">
                <div class="flex flex-col items-center mb-4">
                    <div class="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-center">Error</h3>
                    <p class="text-gray-500 text-center mt-2">${message}</p>
                </div>
                <div class="flex justify-center">
                    <button class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors" id="errorOkButton">
                        OK
                    </button>
                </div>
            </div>
        </div>
    `;

    // Agregar el modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Configurar el event listener para el botón OK
    const errorDialog = document.getElementById('errorDialog');
    const okButton = document.getElementById('errorOkButton');

    okButton.addEventListener('click', () => {
        errorDialog.remove();
    });
}


// Cargar las notas al iniciar la aplicación
updateView();


// ---------------------------------------------------------------------------------------------------------------------------------------------------

// Estado de la aplicación y búsqueda
let filteredNotes = [];
let isSearching = false;

// Función para inicializar la búsqueda
function initializeSearch() {
    const searchView = document.getElementById('searchView');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.querySelector('.search-results');
    const noResults = document.querySelector('.no-results');

    function renderSearchResults() {
        // Limpiar resultados anteriores
        searchResults.innerHTML = '';
    
        const searchTerm = document.getElementById('searchInput').value.trim();
    
        // Recrear el div de no-results con el término de búsqueda
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.innerHTML = `
            <img src="/assets/img/cuate.png" alt="No results illustration" class="no-results-image">
            <p class="no-results-text">There are no results for ${searchTerm}...</p>
        `;
    
        // Verificar si no hay resultados
        if (filteredNotes.length === 0) {
            searchResults.appendChild(noResultsDiv);
            return;
        }
        
        // Crear contenedor para las notas filtradas
        const notesContainer = document.createElement('div');
        notesContainer.className = 'filtered-notes';
        notesContainer.style.cssText = `
            width: 100%;
            padding: 16px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
            overflow-y: auto;
        `;
    
        // Renderizar notas filtradas
        filteredNotes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.style.backgroundColor = note.color;
            noteElement.innerHTML = `
                <div class="note-title">${truncateTitle(note.title)}</div>
                <div class="note-preview">${truncateText(note.content)}</div>
            `;
    
            noteElement.addEventListener('click', () => {
                isSearching = false;
                if (searchView) {
                    searchView.style.display = 'none';
                }
                searchInput.value = '';
                showNoteDetail(note, notes.indexOf(note));
            });
    
            notesContainer.appendChild(noteElement);
        });
    
        searchResults.appendChild(notesContainer);
    }

    // Función para filtrar notas
    function filterNotes(searchTerm) {
        if (!searchTerm.trim()) {
            filteredNotes = [];
            renderSearchResults();
            return;
        }

        searchTerm = searchTerm.toLowerCase();
        filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm)
        );
        renderSearchResults();
    }

    // Remover event listeners anteriores
    const oldSearchInput = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(oldSearchInput, searchInput);
    
    const oldCloseButton = document.getElementById('closeSearch');
    const newCloseButton = oldCloseButton.cloneNode(true);
    oldCloseButton.parentNode.replaceChild(newCloseButton, oldCloseButton);

    // Actualizar referencias después de clonar
    const newSearchInput = document.getElementById('searchInput');
    const closeSearchButton = document.getElementById('closeSearch');

    // Añadir nuevos event listeners
    newSearchInput.addEventListener('input', (e) => {
        filterNotes(e.target.value);
    });

    closeSearchButton.addEventListener('click', () => {
        isSearching = false;
        if (searchView) {
            searchView.style.display = 'none';
        }
        newSearchInput.value = '';
        filteredNotes = [];
        renderSearchResults(); // Asegúrate de renderizar para limpiar resultados
    });
}

// Modificar la función updateView para incluir la reinicialización de la búsqueda
async function updateView() {
    const container = document.getElementById('notesContainer');
    const userId = localStorage.getItem('userId'); // Obtener el userId

    try {
        // Solicitud GET a la API para obtener las notas del usuario
        const response = await fetch(`http://172.16.101.158:8080/notes/api/notas/usuario/${userId}`);
        
        if (response.ok) {
            const notes = await response.json(); // Asume que la API devuelve un array de notas
            
            // Añadir console.log para mostrar el JSON de las notas
            console.log('Notas obtenidas:', JSON.stringify(notes, null, 2)); // Formatear el JSON para una mejor legibilidad

            if (notes.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <img src="/assets/img/rafiki.png" alt="Empty notes illustration">
                        <p>Create your first note!</p>
                    </div>
                `;
            } else {
                container.innerHTML = '';
                notes.forEach((note) => {
                    const noteElement = document.createElement('div');
                    noteElement.classList.add('note');
                    noteElement.style.backgroundColor = note.color; // Cambiar color si es necesario
                    noteElement.innerHTML = `
                        <div class="note-title">${truncateTitle(note.titulo)}</div>
                        <div class="note-preview">${truncateText(note.contenido)}</div>
                    `;
                    
                    if (note.titulo.length > 40) {
                        noteElement.querySelector('.note-title').title = note.titulo;
                    }
                    
                    noteElement.addEventListener('click', () => {
                        showNoteDetail(note); // Cambiar para pasar el objeto completo
                    });

                    // Aquí se pasa el objeto note completo a setupSwipeToDelete
                    setupSwipeToDelete(noteElement, note); 
                    container.appendChild(noteElement);
                });
            }

            setupEventListeners();
            initializeSearch(); // Reinicializar la búsqueda
            setupSearchButton(); // Configurar el botón de búsqueda
        } else {
            console.error('Error al recuperar las notas desde la API.');
        }
    } catch (error) {
        console.error('Error de red al intentar obtener las notas:', error);
    }
}




// Nueva función para configurar el botón de búsqueda
function setupSearchButton() {
    const searchButton = document.querySelector('button[aria-label="Buscar"]');
    if (searchButton) {
        // Remover event listeners anteriores
        const newSearchButton = searchButton.cloneNode(true);
        searchButton.parentNode.replaceChild(newSearchButton, searchButton);
        
        // Añadir nuevo event listener
        newSearchButton.addEventListener('click', () => {
            const searchView = document.getElementById('searchView');
            const searchInput = document.getElementById('searchInput');
            isSearching = true;
            if (searchView) {
                searchView.style.display = 'flex';
            }
            searchInput.focus();
            searchInput.value = '';
            filteredNotes = [];
        });
    }
}

// Event listener para la tecla Escape (mantener fuera de las funciones para evitar duplicados)
document.addEventListener('keydown', (e) => {
    const searchView = document.getElementById('searchView');
    const searchInput = document.getElementById('searchInput');
    
    if (e.key === 'Escape' && searchView.style.display === 'flex') {
        isSearching = false;
        if (searchView) {
            searchView.style.display = 'none';
        }
        searchInput.value = '';
        filteredNotes = [];
    }
});

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    setupSearchButton();
});


/* MODO OSCURO - MODO CLARO */

function toggleTheme() {
    document.body.classList.toggle('light-theme');
}
