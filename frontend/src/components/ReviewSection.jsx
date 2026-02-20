import React from 'react';
import { Star, Quote } from 'lucide-react';

const ReviewSection = () => {
    const reviews = [
        {
            name: 'Rahul Sharma',
            initial: 'R',
            text: 'The best turf in Bangalore! The grass quality is amazing and the floodlights are world-class. Highly recommended for night matches.',
            rating: 5
        },
        {
            name: 'Priya Singh',
            initial: 'P',
            text: 'Love the cafe vibes! Perfect place to hang out with friends after a game. The coffee is surprisingly good for a sports arena.',
            rating: 5
        },
        {
            name: 'Arjun Verma',
            initial: 'A',
            text: 'Easy booking process and very professional staff. The tournament organization was top-notch. Cant wait for the next season!',
            rating: 4
        }
    ];

    return (
        <section className="section-container" id="reviews">
            <div className="section-header">
                <h2>Player <span>Reviews</span></h2>
                <p>Hear what our regular champions have to say about their experience at RCB Turf.</p>
            </div>

            <div className="reviews-grid">
                {reviews.map((rev, index) => (
                    <div className="review-card" key={index}>
                        <Quote className="quote-icon" size={40} />
                        <div className="review-head">
                            <div className="user-avatar">{rev.initial}</div>
                            <div className="user-info">
                                <h4>{rev.name}</h4>
                                <div className="rating">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill={i < rev.rating ? '#FBBF24' : 'none'} color={i < rev.rating ? '#FBBF24' : '#D1D5DB'} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="review-text">"{rev.text}"</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ReviewSection;
