import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login, error, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to SaaS Notes</h1>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary login-btn">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="test-accounts">
          <h3>Test Accounts</h3>
          <div className="account-grid">
            <div className="account-item">
              <h4>Acme Corporation</h4>
              <p>admin@acme.test (Admin)</p>
              <p>user@acme.test (Member)</p>
            </div>
            <div className="account-item">
              <h4>Globex Corporation</h4>
              <p>admin@globex.test (Admin)</p>
              <p>user@globex.test (Member)</p>
            </div>
          </div>
          <p className="password-note"><em>All passwords: "password"</em></p>
        </div>
      </div>
    </div>
  );
}

export default Login;