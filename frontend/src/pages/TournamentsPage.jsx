import React from 'react';
import Navbar from '../components/Navbar';
import Tournaments from '../components/Tournaments';
import Footer from '../components/Footer';

const TournamentsPage = () => {
    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '80px' }}>
                <Tournaments />
            </div>
            <Footer />
        </>
    );
};

export default TournamentsPage;
