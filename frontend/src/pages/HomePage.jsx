import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';
import RulesSection from '../components/RulesSection';
import ContactSection from '../components/ContactSection';
import './HomePage.css';
import './HomeSections.css';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-wrapper">
            <Navbar />

            {/* Hero Section */}
            <div className="hero-section" id="home">
                <div className="hero-content">
                    <h1>
                        Welcome to <span>Rcb turf & cafe</span>
                    </h1>
                    <p>
                        Experience the best box cricket and cafe vibes in town.
                        <br /><strong>Book your slot today!</strong>
                    </p>

                    <div className="hero-buttons">
                        <button
                            className="primary-btn"
                            onClick={() => navigate('/book-now')}
                        >
                            BOOK A SLOT
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() => navigate('/history')}
                        >
                            MY BOOKINGS
                        </button>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <AboutSection />

            {/* Rules Section */}
            <RulesSection />

            {/* Contact Us Section */}
            <ContactSection />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;
