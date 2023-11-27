if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registrado con éxito:', registration);
        })
        .catch(error => {
            console.error('Error al registrar el Service Worker:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('noteForm');
    const noteContentInput = document.getElementById('noteContent');
    const noteList = document.getElementById('noteList');
    const downloadButton = document.getElementById('downloadButton');
    const deleteAllButton = document.getElementById('deleteAllButton');

    loadNotes();

    noteForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const noteContent = noteContentInput.value.trim();

        if (noteContent !== '') {
            saveNote(noteContent);

            loadNotes();

            noteContentInput.value = '';
        }
    });

    downloadButton.addEventListener('click', () => {
        downloadNotes();
    });

    deleteAllButton.addEventListener('click', () => {
        deleteAllNotes();
    });

    const mobileDownloadBanner = document.getElementById('mobileDownloadBanner');
    const downloadAppButton = document.getElementById('downloadAppButton');

    if (isMobile() && !isAppInstalled()) {
        mobileDownloadBanner.style.display = 'block';

        downloadAppButton.addEventListener('click', () => {
            alert('');
            mobileDownloadBanner.style.display = 'none';
        });
    }

    function loadNotes() {
        const notes = getNotes();

        noteList.innerHTML = '';

        notes.forEach((note, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${note}`;
            li.classList.add('note-item');

            const botonContainer = document.createElement('div');
            botonContainer.classList.add('boton-container');

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', () => editNote(index));
            editButton.classList.add('boton-item');

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => deleteNote(index, li));
            deleteButton.classList.add('boton-eliminar');

            botonContainer.appendChild(editButton);
            botonContainer.appendChild(deleteButton);

            li.appendChild(botonContainer);

            noteList.appendChild(li);
        });
    }

    function saveNote(content) {
        const notes = getNotes();
        notes.push(content);
        localStorage.setItem('notes', JSON.stringify(notes));
    }


    function getNotes() {
        return JSON.parse(localStorage.getItem('notes')) || [];
    }

    function editNote(index) {
        const notes = getNotes();
        const editedNote = prompt('Editar tarea:', notes[index]);

        if (editedNote !== null) {
            notes[index] = editedNote.trim();
            localStorage.setItem('notes', JSON.stringify(notes));
            loadNotes();
        }
    }

    function deleteNote(index, element) {
        const notes = getNotes();
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));

        element.classList.add('delete-animation');

        element.addEventListener('animationend', () => {
            loadNotes();
        });
    }

    function downloadNotes() {
        const notes = getNotes();
        const notesText = notes.join('\n');
        const blob = new Blob([notesText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'notas.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function deleteAllNotes() {
        const confirmDelete = confirm('¿Estás seguro de que deseas borrar todas las notas?');

        if (confirmDelete) {
            localStorage.removeItem('notes');
            loadNotes();
        }
    }

    function isMobile() {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }

    function isAppInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches;
    }
});
