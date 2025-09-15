import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import AppContent from './contexts/AppContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <AppContent />
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;