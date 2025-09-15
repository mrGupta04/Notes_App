import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';
console.log(API_BASE);

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const { user } = useAuth();

  const clearEditingNote = () => setEditingNote(null);

  const fetchNotes = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      const response = await fetch(`${API_BASE}/notes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const notesData = await response.json();
        setNotes(notesData);
      } else {
        console.error('Failed to fetch notes:', response.status);
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  const createNote = async (noteData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(noteData)
      });

      if (response.ok) {
        await fetchNotes();
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const updateNote = async (id, noteData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(noteData)
      });

      if (response.ok) {
        await fetchNotes();
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const deleteNote = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE}/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchNotes();
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const startEditingNote = (note) => {
    setEditingNote(note);
  };

  const value = {
    notes,
    editingNote,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    setEditingNote: startEditingNote,
    clearEditingNote
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};