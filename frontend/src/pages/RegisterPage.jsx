import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, UserPlus, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import './AuthPages.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const validateForm = () => {
        const { name, email, password, confirmPassword, phone } = formData;

        // Name validation
        if (name.trim().length < 2) {
            return 'Please enter a valid full name (at least 2 characters)';
        }

        // Email validation (Basic Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            return 'Phone number must be exactly 10 digits';
        }

        // Password validation
        if (password.length < 6) {
            return 'Password must be at least 6 characters long';
        }

        // Confirm Password validation
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }

        return null; // No errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            // Send everything except confirmPassword to the backend
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            toast.success('Registration successful! Welcome to RCB Turf.');
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                {/* Left Side - Form */}
                <div className="auth-form-section">
                    <div className="auth-form-content">
                        {/* Logo */}
                        <div className="auth-logo" onClick={() => navigate('/')}>
                            <img
                                src="/assets/nav-logo-final.png"
                                alt="RCB Turf & Cafe"
                                className="auth-logo-img"
                            />
                        </div>

                        {/* Header */}
                        <div className="auth-header">
                            <h1>Create Account</h1>
                            <p>Join us and start booking your turf slots</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="auth-error">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="name">
                                    <User size={18} />
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    <Mail size={18} />
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">
                                    <Phone size={18} />
                                    Phone Number
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    required
                                    pattern="[0-9]{10}"
                                    maxLength="10"
                                    autoComplete="tel"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">
                                    <Lock size={18} />
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    required
                                    minLength="6"
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">
                                    <Lock size={18} />
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Re-enter your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    required
                                    minLength="6"
                                    autoComplete="new-password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={20} />
                                        Create Account
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="auth-footer">
                            <p>
                                Already have an account?{' '}
                                <Link to="/login" className="auth-link">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Image */}
                <div className="auth-image-section">
                    <div className="auth-image-overlay">
                        <div className="auth-image-content">
                            <h2>Join Our Community</h2>
                            <p>Become a part of the RCB Turf family and enjoy exclusive benefits</p>
                            <div className="auth-features">
                                <div className="feature-item">✓ Quick & Easy Registration</div>
                                <div className="feature-item">✓ Secure Payment Options</div>
                                <div className="feature-item">✓ Booking History Tracking</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
