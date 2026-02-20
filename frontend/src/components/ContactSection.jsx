import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactSection = () => {
    return (
        <section className="section-container" id="contact-us">
            <div className="section-header">
                <h2>Contact <span>Us</span></h2>
                <p>Have questions? Reach out to us and we'll get back to you as soon as possible.</p>
            </div>

            <div className="contact-card" style={{
                background: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
                <div className="contact-info-pane" style={{
                    flex: 1,
                    background: 'var(--rcb-red)',
                    color: 'white',
                    padding: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '40px'
                }}>
                    <h3>Let's get in touch</h3>
                    <p>We're open for any suggestion or just to have a chat</p>

                    <div className="contact-methods" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div className="method" style={{ display: 'flex', gap: '15px' }}>
                            <MapPin />
                            <div>
                                <strong>Address:</strong>
                                <p>RCB Turf & Cafe, Holalkere Road, near Venkateshwara Daaba, At Krishna Circle, Chitradurga - 577501</p>
                            </div>
                        </div>
                        <div className="method" style={{ display: 'flex', gap: '15px' }}>
                            <Phone />
                            <div>
                                <strong>Phone:</strong>
                                <p>86603 59906 / 80950 84383</p>
                            </div>
                        </div>
                        <div className="method" style={{ display: 'flex', gap: '15px' }}>
                            <Mail />
                            <div>
                                <strong>Email:</strong>
                                <p>rcb.court.cafe@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contact-form-pane" style={{ flex: 1.5, padding: '60px' }}>
                    <form className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <input type="text" placeholder="Your Name" style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1.5px solid #E5E7EB' }} />
                            <input type="email" placeholder="Your Email" style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1.5px solid #E5E7EB' }} />
                        </div>
                        <input type="text" placeholder="Subject" style={{ padding: '15px', borderRadius: '12px', border: '1.5px solid #E5E7EB' }} />
                        <textarea placeholder="Message" rows="5" style={{ padding: '15px', borderRadius: '12px', border: '1.5px solid #E5E7EB', resize: 'none' }}></textarea>
                        <button type="submit" className="primary-btn" style={{ width: 'fit-content' }}>
                            Send Message <Send size={18} style={{ marginLeft: '10px' }} />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
