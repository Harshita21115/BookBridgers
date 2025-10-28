import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };
  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: '0.8rem 2rem',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    fontFamily: 'Inter, sans-serif',
  };

  const linksContainer = {
    display: 'flex',
    alignItems: 'center',
  };

  const linkStyle = {
    margin: '0 1rem',
    textDecoration: 'none',
    color: '#333',
    fontWeight: 500,
    transition: 'color 0.2s ease, transform 0.2s ease',
  };

  const userSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  const spanStyle = {
    fontSize: '0.9rem',
    color: '#555',
  };

  const buttonStyle = {
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    border: '1px solid #007bff',
    backgroundColor: 'transparent',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
  };

  const hoverButton = (e, isHovering) => {
    e.target.style.backgroundColor = isHovering ? '#007bff' : 'transparent';
    e.target.style.color = isHovering ? '#fff' : '#007bff';
  };

  return (
    <nav style={navStyle}>
      {/* Left side links */}
      <div style={linksContainer}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/community" style={linkStyle}>Community</Link>
        <Link to="/library" style={linkStyle}>Library</Link>
        <Link to="/partner-libraries" style={linkStyle}>Partner Libraries</Link>
        {user?.role === 'student' && <Link to="/student" style={linkStyle}>Student</Link>}
        {user?.role === 'donor' && <Link to="/donor" style={linkStyle}>Donor</Link>}
        {user?.role === 'admin' && <Link to="/admin" style={linkStyle}>Admin</Link>}
      </div>

      {/* Right side user info */}
      <div style={userSectionStyle}>
        {user ? (
          <>
            <span style={spanStyle}>Welcome, {user.fullName}</span>
            <button
              style={buttonStyle}
              onMouseEnter={(e) => hoverButton(e, true)}
              onMouseLeave={(e) => hoverButton(e, false)}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/admin-login" style={linkStyle}>Admin Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
