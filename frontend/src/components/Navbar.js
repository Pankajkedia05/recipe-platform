import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner page-wrapper">
        <Link to="/" className="brand-link">Recipe Platform</Link>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/search">Search</Link>
          {user ? (
            <>
              <Link to={`/profile/${user.username || ''}`}>Profile</Link>
              <Link to="/create">Create</Link>
              <button className="btn-primary" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
