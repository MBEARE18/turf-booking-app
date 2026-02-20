import React from 'react';
import { Target, Users, Coffee, Clock } from 'lucide-react';

const AboutSection = () => {
    return (
        <section className="section-container" id="about">
            <div className="section-header">
                <h2>About <span>Us</span></h2>
                <p>More than just a turf, we are a community of sports enthusiasts.</p>
            </div>

            <div className="about-grid">
                {/* Main Content */}
                <div className="about-text-card">
                    <h3>Exotic Box Cricket & Premium Cafe</h3>
                    <p className="highlight-text">
                        Now available in Fortcity, Chitradurga.
                    </p>
                    <p>
                        Our box cricket facility is designed for everyone - from friends having a weekend blast to corporate teams building camaraderie. With premium FIFA-standard turf, high-quality boundary nets, and flexible booking slots, it’s the ideal place to play, compete, and have fun.
                    </p>

                    <div className="about-features-list">
                        <div className="feature-pill"><Target size={16} /> Recreational Games</div>
                        <div className="feature-pill"><Users size={16} /> Corporate Events</div>
                        <div className="feature-pill"><Coffee size={16} /> Birthday Parties</div>
                        <div className="feature-pill"><Users size={16} /> Team Building</div>
                    </div>
                </div>

                {/* Cafe Section */}
                <div className="about-cafe-card">
                    <div className="cafe-content">
                        <h3>Champions Cafe</h3>
                        <p>
                            Relax and refuel at our cozy cafeteria. Whether you’re cooling down after a match or just stopping by to unwind, we provide a comfortable atmosphere with quality food.
                        </p>
                        <ul className="cafe-offerings">
                            <li>Hot & Cold Beverages</li>
                            <li>Snacks & Refreshments</li>
                            <li>Clean Seating</li>
                            <li>Quick Service</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
