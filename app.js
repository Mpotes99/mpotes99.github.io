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

    function loadNotes() {
        const notes = getNotes();

        noteList.innerHTML = '';

        notes.forEach((note, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${note}`;

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', () => editNote(index));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => deleteNote(index));

            li.appendChild(editButton);
            li.appendChild(deleteButton);

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
        const editedNote = prompt('Editar nota:', notes[index]);

        if (editedNote !== null) {
            notes[index] = editedNote.trim();
            localStorage.setItem('notes', JSON.stringify(notes));
            loadNotes();
        }
    }

    function deleteNote(index) {
        const notes = getNotes();
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
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

    // Función para borrar todas las notas
    function deleteAllNotes() {
        const confirmDelete = confirm('¿Estás seguro de que deseas borrar todas las notas?');

        if (confirmDelete) {
            localStorage.removeItem('notes');
            loadNotes(); // Actualizar la lista después de borrar
        }
    }
});
