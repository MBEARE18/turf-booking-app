import React from 'react';
import Navbar from '../components/Navbar';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const ContactPage = () => {
    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '80px' }}>
                <ContactSection />
            </div>
            <Footer />
        </>
    );
};

export default ContactPage;
