import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="container">
        <div className="header-content">
          <div className="brand">
            <h1>SaaS Notes</h1>
          </div>
          
          <div className="user-info">
            <div className="user-details">
              <span className="tenant-name">{user.tenant.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
            <button onClick={logout} className="btn btn-secondary logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;