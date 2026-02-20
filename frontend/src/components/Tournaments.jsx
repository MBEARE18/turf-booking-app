import React from 'react';

const Tournaments = () => {
    const tournamentImages = [
        "/assets/Turf%20images/Tournament/WhatsApp%20Image%202026-01-12%20at%204.09.27%20PM.jpeg",
        "/assets/Turf%20images/Tournament/WhatsApp%20Image%202026-01-12%20at%204.09.34%20PM%20(1).jpeg",
        "/assets/Turf%20images/Tournament/WhatsApp%20Image%202026-01-12%20at%204.09.34%20PM.jpeg",
        "/assets/Turf%20images/Tournament/WhatsApp%20Image%202026-01-12%20at%204.09.42%20PM.jpeg",
        "/assets/Turf%20images/Tournament/WhatsApp%20Image%202026-01-12%20at%204.09.43%20PM.jpeg",
        "/assets/Turf%20images/Tournament/WhatsApp%20Image%202026-01-12%20at%204.09.44%20PM.jpeg",
        "/assets/Turf%20images/Tournament/WhatsApp%20Image%202026-01-12%20at%204.09.45%20PM.jpeg"
    ];

    return (
        <section className="section-container" id="tournaments">
            <div className="section-header">
                <h2>Our <span>Tournaments</span></h2>
                <p>Check out the action from our recent and upcoming tournaments.</p>
            </div>

            <div className="tournaments-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginTop: '40px'
            }}>
                {tournamentImages.map((img, index) => (
                    <div key={index} className="tournament-item" style={{
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer',
                        height: '400px'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <img
                            src={img}
                            alt={`Tournament ${index + 1}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Tournaments;
