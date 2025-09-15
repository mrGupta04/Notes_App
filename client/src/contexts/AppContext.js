import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotes } from './NotesContext';
import Login from '../components/Login/Login';
import Dashboard from '../components/Dashboard/Dashboard';

function AppContent() {
  const { user, loading, error, success, clearMessages } = useAuth();
  const { fetchNotes } = useNotes();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, clearMessages]);

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <div className="app">
      {!user ? <Login /> : <Dashboard />}
    </div>
  );
}

export default AppContent;