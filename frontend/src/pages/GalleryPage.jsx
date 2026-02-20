import React from 'react';
import Navbar from '../components/Navbar';
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';

const GalleryPage = () => {
    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '80px' }}>
                <Gallery />
            </div>
            <Footer />
        </>
    );
};

export default GalleryPage;
