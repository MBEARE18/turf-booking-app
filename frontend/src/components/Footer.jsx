import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer" id="contact">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <img src="/assets/nav-logo-final.png" alt="RCB Turf & Cafe" className="footer-logo" />
                        <p className="footer-tagline">Experience the ultimate box cricket and premium cafe vibes. Join the community of champions.</p>
                        <div className="footer-socials">
                            <a href="https://www.instagram.com/rcb_turf_n_cafe?igsh=MXhqcGc4cWN2aHVneg==" className="social-icon" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
                            <a href="#" className="social-icon"><Facebook size={20} /></a>
                            <a href="#" className="social-icon"><Twitter size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><a href="#gallery">Gallery</a></li>
                            <li><a href="#tournaments">Tournaments</a></li>
                            <li><Link to="/book-now">Book Slot</Link></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>Contact Us</h4>
                        <div className="contact-item">
                            <MapPin size={18} className="contact-icon" />
                            <span>RCB Turf & Cafe, Holalkere Road, near Venkateshwara Daaba, At Krishna Circle, Chitradurga - 577501</span>
                        </div>
                        <div className="contact-item">
                            <Phone size={18} className="contact-icon" />
                            <span>86603 59906 / 80950 84383</span>
                        </div>
                        <div className="contact-item">
                            <Mail size={18} className="contact-icon" />
                            <span>rcb.court.cafe@gmail.com</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-info">
                        <p>&copy; {new Date().getFullYear()} RCB Turf & Cafe. All Rights Reserved.</p>
                    </div>
                    <div className="footer-legal">
                        <a href="#" className="legal-link"><ShieldCheck size={16} /> Terms & Conditions</a>
                        <a href="#" className="legal-link">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
