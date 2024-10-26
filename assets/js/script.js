// Estado de la aplicación
let notes = JSON.parse(localStorage.getItem('notes')) || [];

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

function setupSwipeToDelete(noteElement, index) {
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

    // Crear la modal de confirmación
    const deleteModal = document.createElement('div');
    deleteModal.innerHTML = `
        <div id="deleteNoteDialog" class="modal-overlay" style="display: none;">
            <div class="modal">
                <div class="flex flex-col items-center mb-4">
                    <div class="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                    </div>
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

    // Event listeners para la modal
    confirmDeleteButton.addEventListener('click', () => {
        notes.splice(index, 1);
        saveNotes();
        updateView();
        deleteDialog.style.display = 'none';
    });

    cancelDeleteButton.addEventListener('click', () => {
        deleteDialog.style.display = 'none';
        deleteOverlay.style.opacity = '0';
    });

    // Limpiar la modal cuando se elimine la nota
    noteElement.addEventListener('remove', () => {
        deleteModal.remove();
    });
}


// Modificar la función updateView para incluir la configuración de búsqueda
function updateView() {
    const container = document.getElementById('notesContainer');
    
    if (notes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <img src="/assets/img/rafiki.png" alt="Empty notes illustration">
                <p>Create your first note!</p>
            </div>
        `;
    } else {
        container.innerHTML = '';
        notes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.style.backgroundColor = note.color;
            noteElement.innerHTML = `
                <div class="note-title">${truncateTitle(note.title)}</div>
                <div class="note-preview">${truncateText(note.content)}</div>
            `;
            
            if (note.title.length > 40) {
                noteElement.querySelector('.note-title').title = note.title;
            }
            
            noteElement.addEventListener('click', () => {
                showNoteDetail(note, index);
            });

            setupSwipeToDelete(noteElement, index);
            container.appendChild(noteElement);
        });
    }

    setupEventListeners();
}

// Modify the showNoteDetail function to include state for the confirmation dialogs
function showNoteDetail(note, index) {
    const mainContainer = document.querySelector('.app');
    const previousContent = mainContainer.innerHTML;
    
    mainContainer.classList.add('fullscreen-mode');
    
    // Add dialog containers to the HTML
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
                <h1 class="note-detail-title" contenteditable="true">${note.title}</h1>
                <div class="note-detail-text" contenteditable="true">${note.content}</div>
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
    let originalTitle = note.title;
    let originalContent = note.content;

    function toggleSaveButton(show) {
        saveButton.style.display = show ? 'flex' : 'none';
        isEditing = show;
    }

    function handleEditStart() {
        toggleSaveButton(true);
    }

    function hasChanges() {
        return titleElement.textContent.trim() !== originalTitle || 
               textElement.textContent.trim() !== originalContent;
    }

    function handleSave() {
        saveChangesDialog.style.display = 'flex';
    }

    function saveChanges() {
        const newTitle = titleElement.textContent.trim();
        const newContent = textElement.textContent.trim();
        
        if (newTitle && newContent) {
            notes[index] = { 
                ...notes[index], 
                title: newTitle, 
                content: newContent 
            };
            saveNotes();
            toggleSaveButton(false);
            originalTitle = newTitle;
            originalContent = newContent;
            saveChangesDialog.style.display = 'none';
        } else {
            showErrorModal('Title and content cannot be empty.');
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
    saveButton.addEventListener('click', handleSave);
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

    function getRandomColor() {
        const colors = ['#fd99ff', '#ff9e9e', '#91f48f', '#fff599', '#9effff', '#b69cff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function hasChanges() {
        return titleElement.textContent.trim() || textElement.textContent.trim();
    }

    function exitNote() {
        mainContainer.classList.remove('fullscreen-mode');
        mainContainer.innerHTML = previousContent;
        updateView();
    }

    function saveNote() {
        const title = titleElement.textContent.trim();
        const content = textElement.textContent.trim();
        
        if (title && content) {
            const newNote = {
                title,
                content,
                color: getRandomColor(),
                createdAt: new Date().toISOString()
            };
            
            notes.unshift(newNote);
            saveNotes();
            exitNote();
        } else {
            showErrorModal('Title and content cannot be empty.');
            saveChangesDialog.style.display = 'none';
        }
    }

    function handleSave() {
        if (hasChanges()) {
            saveChangesDialog.style.display = 'flex';
        }
    }

    function handleBack() {
        if (hasChanges()) {
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

// Función para truncar el texto
function truncateText(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
