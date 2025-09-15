import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotes } from '../../contexts/NotesContext';
import './NoteForm.css';

function NoteForm() {
  const [noteData, setNoteData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, upgradeToPro } = useAuth();
  const { 
    notes, 
    createNote, 
    updateNote, 
    editingNote, 
    clearEditingNote 
  } = useNotes();

  // Update form when editingNote changes
  useEffect(() => {
    if (editingNote) {
      setNoteData({
        title: editingNote.title,
        content: editingNote.content || ''
      });
    } else {
      setNoteData({ title: '', content: '' });
    }
  }, [editingNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (editingNote) {
        result = await updateNote(editingNote._id, noteData);
      } else {
        result = await createNote(noteData);
      }

      if (result.success) {
        setNoteData({ title: '', content: '' });
        clearEditingNote();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNoteData({
      ...noteData,
      [e.target.name]: e.target.value
    });
  };

  const cancelEdit = () => {
    setNoteData({ title: '', content: '' });
    clearEditingNote();
  };

  const handleUpgrade = async () => {
    const result = await upgradeToPro();
    if (result.success) {
      // User can now create notes
    }
  };

  const isLimitReached = user.tenant.subscription_plan === 'free' && 
                         notes.length >= 3 && 
                         !editingNote;

  if (isLimitReached) {
    return (
      <div className="note-form-container card">
        <div className="limit-reached">
          <h3>Free Plan Limit Reached</h3>
          <p>You've created all 3 notes available on your Free plan.</p>
          {user.role === 'admin' ? (
            <button onClick={handleUpgrade} className="btn btn-upgrade">
              Upgrade to Pro for Unlimited Notes
            </button>
          ) : (
            <p>Contact your administrator to upgrade to the Pro plan.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="note-form-container card">
      <h2>{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="note-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={noteData.title}
            onChange={handleChange}
            required
            placeholder="Enter note title"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={noteData.content}
            onChange={handleChange}
            placeholder="Enter note content"
            rows={4}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : editingNote ? 'Update Note' : 'Create Note'}
          </button>
          
          {editingNote && (
            <button 
              type="button" 
              onClick={cancelEdit} 
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default NoteForm;