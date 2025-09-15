import React, { useState } from 'react';
import { useNotes } from '../../contexts/NotesContext';
import './NoteCard.css';

function NoteCard({ note }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteNote, setEditingNote } = useNotes();

  console.log('Rendering note:', note);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setIsDeleting(true);
    await deleteNote(note._id);
    setIsDeleting(false);
  };

  const handleEdit = () => {
    setEditingNote(note);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isUpdated = note.updatedAt !== note.createdAt;

  return (
    <div className="note-card">
      <div className="note-header">
        <h3>{note.title}</h3>
        <div className="note-actions">
          <button 
            onClick={handleEdit} 
            className="btn btn-small btn-secondary"
            disabled={isDeleting}
          >
            Edit
          </button>
          <button 
            onClick={handleDelete} 
            className="btn btn-small btn-danger"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      
      {note.content && (
        <div className="note-content">
          <p>{note.content}</p>
        </div>
      )}
      
      <div className="note-footer">
        <div className="note-dates">
          <span>Created: {formatDate(note.createdAt)}</span>
          {isUpdated && <span> | Updated: {formatDate(note.updatedAt)}</span>}
        </div>
      </div>
    </div>
  );
}

export default NoteCard;