import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <img
                        src="/assets/nav-logo-final.png"
                        alt="RCB Logo"
                        style={{ height: '70px' }}
                    />
                </Link>

                <div className="nav-links">
                    <Link to="/" className="nav-item">Home</Link>
                    <Link to="/gallery" className="nav-item">Gallery</Link>
                    <Link to="/tournaments" className="nav-item">Tournaments</Link>

                    {/* Hide these for Admin */}
                    {(!user || user.role !== 'ADMIN') && (
                        <>
                            <a href="/#contact-us" className="nav-item">Contact Us</a>
                            <a href="/#about" className="nav-item">About</a>
                            <a href="/#rules" className="nav-item">Rules</a>
                        </>
                    )}

                    {user ? (
                        <>
                            {user.role === 'ADMIN' ? (
                                <Link to="/admin" className="nav-item" style={{ color: '#D4AF37', fontWeight: 'bold' }}>Admin Dashboard</Link>
                            ) : (
                                <Link to="/history" className="nav-item">My Bookings</Link>
                            )}
                            <button onClick={handleLogout} className="nav-btn-outline">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-item">Login</Link>
                            <Link to="/register" className="nav-btn-solid">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
