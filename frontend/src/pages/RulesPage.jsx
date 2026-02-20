import React from 'react';
import Navbar from '../components/Navbar';
import RulesSection from '../components/RulesSection';
import Footer from '../components/Footer';

const RulesPage = () => {
    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '80px' }}>
                <RulesSection />
            </div>
            <Footer />
        </>
    );
};

export default RulesPage;
