import React, { useState } from 'react';
import './NotePad.css';

const NotePad = () => {
  const [note, setNote] = useState('');
  const [title, setTitle] = useState('');

  const saveNote = () => {
    if (title && note) {
      const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
      const newNote = {
        id: Date.now(),
        title,
        content: note,
        createdAt: new Date().toLocaleString()
      };
      savedNotes.push(newNote);
      localStorage.setItem('notes', JSON.stringify(savedNotes));
      alert('Note saved!');
      setTitle('');
      setNote('');
    }
  };

  return (
    <div className="notepad">
      <div className="notepad-header">
        <h2>📝 NotePad</h2>
        <button onClick={saveNote} className="save-btn">Save Note</button>
      </div>
      
      <div className="note-editor">
        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="note-title"
        />
        
        <textarea
          placeholder="Start writing your note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="note-content"
          rows="15"
        />
      </div>
      
      <div className="note-info">
        <p>Characters: {note.length}</p>
        <p>Words: {note.split(' ').filter(word => word.length > 0).length}</p>
      </div>
    </div>
  );
};

export default NotePad;
