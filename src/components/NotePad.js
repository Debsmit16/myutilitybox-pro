import React, { useState, useEffect } from 'react';
import './NotePad.css';

const NotePad = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '', category: 'General' });
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const categories = ['All', 'General', 'Work', 'Personal', 'Ideas', 'Important'];

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    setNotes(savedNotes);
  }, []);

  const saveNote = () => {
    if (!currentNote.title.trim() && !currentNote.content.trim()) return;

    const noteToSave = {
      ...currentNote,
      id: currentNote.id || Date.now(),
      title: currentNote.title || 'Untitled Note',
      updatedAt: new Date().toISOString(),
      createdAt: currentNote.createdAt || new Date().toISOString()
    };

    const updatedNotes = currentNote.id
      ? notes.map(note => note.id === currentNote.id ? noteToSave : note)
      : [...notes, noteToSave];

    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    setSelectedNoteId(noteToSave.id);
    setIsEditing(false);
  };

  const createNewNote = () => {
    setCurrentNote({ id: null, title: '', content: '', category: 'General' });
    setSelectedNoteId(null);
    setIsEditing(true);
  };

  const selectNote = (note) => {
    setCurrentNote(note);
    setSelectedNoteId(note.id);
    setIsEditing(false);
  };

  const deleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      if (selectedNoteId === noteId) {
        setCurrentNote({ id: null, title: '', content: '', category: 'General' });
        setSelectedNoteId(null);
      }
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="notepad">
      {/* Header */}
      <div className="notepad-header">
        <div className="header-left">
          <h2>📝 NotePad</h2>
          <span className="notes-count">{notes.length} notes</span>
        </div>
        <div className="header-actions">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="toggle-sidebar-btn"
            title="Toggle Sidebar"
          >
            {showSidebar ? '◀' : '▶'}
          </button>
          <button onClick={createNewNote} className="new-note-btn">
            ➕ New Note
          </button>
        </div>
      </div>

      <div className="notepad-content">
        {/* Sidebar */}
        {showSidebar && (
          <div className="notepad-sidebar">
            {/* Search */}
            <div className="search-section">
              <input
                type="text"
                placeholder="🔍 Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Category Filter */}
            <div className="category-section">
              <h4>Categories</h4>
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  >
                    {category}
                    {category !== 'All' && (
                      <span className="category-count">
                        {notes.filter(note => note.category === category).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes List */}
            <div className="notes-list">
              <h4>Notes</h4>
              {filteredNotes.length === 0 ? (
                <div className="no-notes">
                  {searchTerm ? 'No notes found' : 'No notes yet'}
                </div>
              ) : (
                filteredNotes.map(note => (
                  <div
                    key={note.id}
                    onClick={() => selectNote(note)}
                    className={`note-item ${selectedNoteId === note.id ? 'active' : ''}`}
                  >
                    <div className="note-item-header">
                      <h5 className="note-item-title">{note.title}</h5>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="delete-note-btn"
                        title="Delete note"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="note-item-preview">
                      {note.content.substring(0, 100)}
                      {note.content.length > 100 ? '...' : ''}
                    </p>
                    <div className="note-item-meta">
                      <span className="note-category">{note.category}</span>
                      <span className="note-date">
                        {formatDate(note.updatedAt || note.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="notepad-editor">
          {currentNote.id || isEditing ? (
            <>
              <div className="editor-header">
                <div className="editor-title-section">
                  <input
                    type="text"
                    placeholder="Note title..."
                    value={currentNote.title}
                    onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
                    className="note-title-input"
                    disabled={!isEditing && currentNote.id}
                  />
                  <select
                    value={currentNote.category}
                    onChange={(e) => setCurrentNote({...currentNote, category: e.target.value})}
                    className="category-select"
                    disabled={!isEditing && currentNote.id}
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="editor-actions">
                  {!isEditing && currentNote.id ? (
                    <button onClick={() => setIsEditing(true)} className="edit-btn">
                      ✏️ Edit
                    </button>
                  ) : (
                    <>
                      <button onClick={saveNote} className="save-btn">
                        💾 Save
                      </button>
                      {currentNote.id && (
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            selectNote(notes.find(n => n.id === currentNote.id));
                          }}
                          className="cancel-btn"
                        >
                          ❌ Cancel
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <textarea
                placeholder="Start writing your note..."
                value={currentNote.content}
                onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
                className="note-content-textarea"
                disabled={!isEditing && currentNote.id}
              />

              <div className="editor-footer">
                <div className="note-stats">
                  <span>Characters: {currentNote.content.length}</span>
                  <span>Words: {currentNote.content.split(' ').filter(word => word.length > 0).length}</span>
                  <span>Lines: {currentNote.content.split('\n').length}</span>
                </div>
                {currentNote.createdAt && (
                  <div className="note-timestamps">
                    <span>Created: {formatDate(currentNote.createdAt)}</span>
                    {currentNote.updatedAt && currentNote.updatedAt !== currentNote.createdAt && (
                      <span>Updated: {formatDate(currentNote.updatedAt)}</span>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-editor">
              <div className="empty-state">
                <h3>📝 Welcome to NotePad</h3>
                <p>Select a note from the sidebar or create a new one to get started.</p>
                <button onClick={createNewNote} className="create-first-note-btn">
                  ➕ Create Your First Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotePad;
