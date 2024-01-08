const notesContainer = document.querySelector('.notes');
const modal = document.querySelector('#add-note-modal');
const modalOverlay = document.querySelector('#modal-overlay');
const form = document.querySelector('#form-add-note');
const btnAddNote = document.querySelector('#btn-add-note');
const btnCloseModal = document.querySelector('#btn-close-modal');

let editNoteId = null;

const openModal = (noteId) => {
    if (noteId) {
        const note = notes.find((note) => note.id === noteId);
        const elements = form.elements;

        elements.title.value = note?.title ?? '';
        elements.text.value = note?.text ?? '';
        elements.color.value = note?.color ?? 'green';

        editNoteId = noteId;
    }

    modal.classList.add('modal--visible');
};

const closeModal = () => {
    modal.classList.remove('modal--visible');
    form.reset();
};

const getNotes = () => {
    return JSON.parse(localStorage.getItem('notes')) ?? [];
};

const saveNotes = () => {
    localStorage.setItem('notes', JSON.stringify(notes));
};

let notes = getNotes();

const createNote = (note) => {
    return `
        <div class="note note--${note.color}" data-id="${note.id}" data-pinned=${note.pinned}>
            <div class="note__tools">
                ${
                    note.pinned
                        ? `
                            <button class="btn btn--info" onclick="unpinNode(${note.id}); saveNotes();">
                                <span>📌 Unpin</span>
                            </button>`
                        : `
                            <button class="btn btn--info" onclick="pinNote(${note.id}); saveNotes();">
                                <span>📌 Pin</span>
                            </button>`
                }
                <button class="btn btn--warning" onclick="openModal(${note.id})">Edit</button>
                <button class="btn btn--danger" onclick="deleteNote(${note.id}); saveNotes();">Delete</button>
            </div>
            <div class="note__content">
                <div class="note__title">${note.title}</div>
                <div class="note__text">${note.text}</div>
            </div>
        </div>`;
};

const addNote = (note, beforeId) => {
    const noteEl = createNote(note);

    if (beforeId) {
        const index = notes.findIndex((note) => note.id === beforeId);
        notes.splice(index, 0, note);

        const noteBeforeEl = document.querySelector(`[data-id="${beforeId}"]`);
        noteBeforeEl.insertAdjacentHTML('beforebegin', noteEl);
    } else {
        notes.push(note);
        notesContainer.insertAdjacentHTML('beforeend', noteEl);
    }
};

const editNote = (noteId, newNote) => {
    const index = notes.findIndex((note) => note.id === noteId);
    const beforeId = notes.at(index + 1)?.id ?? null;

    deleteNote(noteId);
    addNote(newNote, beforeId);
};

const deleteNote = (noteId) => {
    notes = notes.filter((note) => note.id !== noteId);

    const noteEl = document.querySelector(`[data-id="${noteId}"]`);
    noteEl && noteEl.remove();
};

const pinNote = (noteId) => {
    const note = notes.find((note) => note.id === noteId);
    note.pinned = true;

    deleteNote(noteId);
    addNote(note, notes[0]?.id ?? null);
};

const unpinNode = (noteId) => {
    const note = notes.find((note) => note.id === noteId);
    note.pinned = false;

    deleteNote(noteId);
    addNote(note);
};

const onSubmit = (event) => {
    event.preventDefault();

    const elements = event.target.elements;

    if (editNoteId) {
        const note = notes.find((note) => note.id === editNoteId);
        const newNote = {
            id: editNoteId,
            title: elements.title.value ?? 'No title',
            text: elements.text.value ?? 'No text',
            color: elements.color.value,
            pinned: note.pinned,
        };

        editNote(editNoteId, newNote);
        editNoteId = null;
    } else {
        const newNote = {
            id: Date.now(),
            title: elements.title.value ?? 'No title',
            text: elements.text.value ?? 'No text',
            color: elements.color.value,
            pinned: false,
        };

        addNote(newNote);
    }

    saveNotes();
    closeModal();
};

notes.forEach((note) => {
    const noteEl = createNote(note);
    notesContainer.insertAdjacentHTML('beforeend', noteEl);
});

btnAddNote.addEventListener('click', openModal.bind(null, null));
btnCloseModal.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
form.addEventListener('submit', onSubmit);
