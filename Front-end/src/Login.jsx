
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import rkLogo from './assets/Rk Palkhova Logo_page-0001.jpg';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple hardcoded authentication
    if (username === 'admin' && password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="rk-login-root min-vh-100 d-flex align-items-center justify-content-center position-relative" style={{ minHeight: '100vh' }}>
  {/* Background logo removed as per request */}
  <div className="rk-login-card card p-4 shadow position-relative" style={{ width: 480, height: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2.5rem' }}>
        <img src={rkLogo} alt="RK Logo" className="rk-logo" />
        <h3 className="mb-3 text-center" style={{ color: '#b91c1c', fontWeight: 700, letterSpacing: 1 }}>Admin Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#b91c1c', fontWeight: 500 }}>Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ borderColor: '#eab308' }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#b91c1c', fontWeight: 500 }}>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderColor: '#eab308' }}
            />
          </div>
          <button type="submit" className="rk-login-btn btn w-100 mt-2">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

