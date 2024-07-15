document.addEventListener('DOMContentLoaded', () => {
    const saveNoteButton = document.getElementById('save-note');
    const clearFormButton = document.getElementById('clear-form');
    const noteTitle = document.getElementById('note-title');
    const noteText = document.getElementById('note-text');
    const notesList = document.querySelector('.notes-list');
  
    const loadNotes = async () => {
      const response = await fetch('/api/notes');
      const notes = await response.json();
      notesList.innerHTML = '';
      notes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.classList.add('note-item');
        noteItem.innerHTML = `
          <h3>${note.title}</h3>
          <p>${note.text}</p>
        `;
        notesList.appendChild(noteItem);
      });
    };
  
    const saveNote = async () => {
      const newNote = {
        title: noteTitle.value,
        text: noteText.value
      };
      await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNote)
      });
      loadNotes();
      noteTitle.value = '';
      noteText.value = '';
    };
  
    saveNoteButton.addEventListener('click', saveNote);
    clearFormButton.addEventListener('click', () => {
      noteTitle.value = '';
      noteText.value = '';
    });
  
    loadNotes();
  });
  