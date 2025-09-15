import React from 'react';
import { useNotes } from '../../contexts/NotesContext';
import NoteCard from '../NoteCard/NoteCard';
import './NotesList.css';

function NotesList() {
  const { notes } = useNotes();

  console.log('NotesList rendering with notes:', notes);

  if (notes.length === 0) {
    return (
      <div className="notes-container card">
        <h2>Your Notes</h2>
        <div className="empty-state">
          <h3>No notes yet</h3>
          <p>Create your first note to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h2>Your Notes ({notes.length})</h2>
      </div>
      
      <div className="notes-grid">
        {notes.map(note => (
          <NoteCard key={note._id} note={note} />
        ))}
      </div>
    </div>
  );
}

export default NotesList;