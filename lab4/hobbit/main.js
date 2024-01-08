const notesContainer = document.querySelector('.notes');
const modal = document.querySelector('#add-note-modal');
const form = document.querySelector('#form-add-note');

const notes = [];

const openModal = () => {
    modal.classList.add('modal--visible');
};

const closeModal = () => {
    modal.classList.remove('modal--visible');
    form.reset();
};

const createNote = (note) => {
    return `
        <div class="note note--${note.color}">
            <div class="note__tools">
                <button class="btn">Edit</button>
                <button class="btn btn--delete">Delete</button>
            </div>
            <div class="note__content">
                <div class="note__title">${note.title}</div>
                <div class="note__text">${note.text}</div>
            </div>
        </div>`;
};

const addNote = (note) => {
    const noteEl = createNote(note);

    notes.push(note);
    notesContainer.insertAdjacentHTML('beforeend', noteEl);
};

const deleteNote = (note) => {
    console.log('remove note: ' + note);
};

const editNote = (note) => {
    console.log('edit note: ' + note);
};

const onSubmit = (event) => {
    event.preventDefault();

    const elements = event.target.elements;
    const data = {
        title: elements.title.value ?? 'No title',
        text: elements.text.value ?? 'No text',
        color: elements.color.value,
    };

    addNote(data);
    closeModal();
};

form.addEventListener('submit', onSubmit);
