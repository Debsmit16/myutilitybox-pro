import React, { useState, useEffect } from 'react';
import './NotePad.css';

const NotePad = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ title: '', content: '' });
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);
      if (parsedNotes.length > 0) {
        setSelectedNoteId(parsedNotes[0].id);
        setCurrentNote(parsedNotes[0]);
      }
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Auto-save current note
  useEffect(() => {
    if (selectedNoteId && (currentNote.title || currentNote.content)) {
      const timer = setTimeout(() => {
        saveCurrentNote();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentNote.title, currentNote.content, selectedNoteId]);

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setCurrentNote(newNote);
  };

  const saveCurrentNote = () => {
    if (selectedNoteId) {
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === selectedNoteId
            ? {
                ...note,
                title: currentNote.title || 'Untitled',
                content: currentNote.content,
                updatedAt: new Date().toISOString()
              }
            : note
        )
      );
    }
  };

  const selectNote = (note) => {
    if (selectedNoteId && (currentNote.title || currentNote.content)) {
      saveCurrentNote();
    }
    setSelectedNoteId(note.id);
    setCurrentNote(note);
  };

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    
    if (selectedNoteId === noteId) {
      if (updatedNotes.length > 0) {
        setSelectedNoteId(updatedNotes[0].id);
        setCurrentNote(updatedNotes[0]);
      } else {
        setSelectedNoteId(null);
        setCurrentNote({ title: '', content: '' });
      }
    }
  };

  const downloadNote = (note) => {
    const element = document.createElement('a');
    const file = new Blob([`${note.title}\n\n${note.content}`], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title || 'note'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAllNotes = () => {
    const allNotesContent = notes
      .map(note => `${note.title}\n${'='.repeat(note.title.length)}\n\n${note.content}\n\n`)
      .join('\n');
    
    const element = document.createElement('a');
    const file = new Blob([allNotesContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'all-notes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="notepad-container">
      <div className="notepad-header">
        <h2>📝 Notes</h2>
        <div className="header-actions">
          <button onClick={createNewNote} className="new-note-btn">
            ➕ New Note
          </button>
          {notes.length > 0 && (
            <button onClick={downloadAllNotes} className="download-all-btn">
              📥 Download All
            </button>
          )}
        </div>
      </div>

      <div className="notepad-content">
        <div className="notes-sidebar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="notes-list">
            {filteredNotes.length === 0 ? (
              <div className="empty-notes">
                <p>No notes found.</p>
                {searchTerm && <p>Try a different search term.</p>}
              </div>
            ) : (
              filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={`note-item ${selectedNoteId === note.id ? 'active' : ''}`}
                  onClick={() => selectNote(note)}
                >
                  <div className="note-item-header">
                    <h4 className="note-title">{note.title || 'Untitled'}</h4>
                    <div className="note-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadNote(note);
                        }}
                        className="download-btn"
                        title="Download note"
                      >
                        📥
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="delete-btn"
                        title="Delete note"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="note-preview">
                    {note.content.substring(0, 100)}
                    {note.content.length > 100 ? '...' : ''}
                  </p>
                  <div className="note-date">
                    {formatDate(note.updatedAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="note-editor">
          {selectedNoteId ? (
            <>
              <input
                type="text"
                value={currentNote.title}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                placeholder="Note title..."
                className="note-title-input"
              />
              <textarea
                value={currentNote.content}
                onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                placeholder="Start writing your note..."
                className="note-content-textarea"
              />
              <div className="editor-footer">
                <span className="auto-save-indicator">
                  Auto-saving... ✨
                </span>
                <span className="word-count">
                  {currentNote.content.split(/\s+/).filter(word => word.length > 0).length} words
                </span>
              </div>
            </>
          ) : (
            <div className="no-note-selected">
              <h3>Welcome to Notes! 📝</h3>
              <p>Select a note from the sidebar or create a new one to get started.</p>
              <button onClick={createNewNote} className="create-first-note-btn">
                Create Your First Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotePad;
