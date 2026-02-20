import React from 'react';

const Gallery = () => {
    const images = [
        {
            url: '/assets/Turf%20images/Images/WhatsApp%20Image%202026-01-12%20at%204.09.18%20PM.jpeg',
            title: 'Premium Turf',
            desc: 'High-quality artificial grass for the best experience'
        },
        {
            url: '/assets/Turf%20images/Images/WhatsApp%20Image%202026-01-12%20at%204.09.35%20PM.jpeg',
            title: 'Night Matches',
            desc: 'Well-lit arena for evening games'
        },
        {
            url: '/assets/Turf%20images/Images/WhatsApp%20Image%202026-01-12%20at%204.09.20%20PM.jpeg',
            title: 'Spacious Arena',
            desc: 'Ample space for professional box cricket action'
        },
        {
            url: '/assets/Turf%20images/Images/WhatsApp%20Image%202026-01-12%20at%204.09.41%20PM.jpeg',
            title: 'Champions Corner',
            desc: 'Perfect spot for team discussions'
        },
        {
            url: '/assets/Turf%20images/Images/WhatsApp%20Image%202026-01-12%20at%204.09.47%20PM.jpeg',
            title: 'Game On',
            desc: 'Ready for the next big match'
        }
    ];

    return (
        <section className="section-container" id="gallery">
            <div className="section-header">
                <h2>Our <span>Gallery</span></h2>
                <p>Take a look at our world-class facilities designed for the ultimate sports experience.</p>
            </div>

            <div className="gallery-grid">
                {images.map((img, index) => (
                    <div className="gallery-item" key={index}>
                        <img src={img.url} alt={img.title} />
                        <div className="gallery-overlay">
                            <h3>{img.title}</h3>
                            <p>{img.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Gallery;
