import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CreditCard, ChevronRight } from 'lucide-react';
import UPIPaymentModal from '../components/UPIPaymentModal';

const SlotSelectionPage = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isUPIModalOpen, setIsUPIModalOpen] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSlots();
    }, [date]);

    const fetchSlots = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get(`/slots/${date}`);
            setSlots(data);
        } catch (err) {
            setError('Failed to load slots. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    const initiateBooking = async (slot) => {
        try {
            const { data: lockResponse } = await api.post(`/bookings/lock/${slot._id}`);
            setSelectedSlot(lockResponse.slot);
            setIsUPIModalOpen(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Error locking slot');
        }
    };

    const handleSuccess = () => {
        setIsUPIModalOpen(false);
        navigate('/history');
    };

    return (
        <div className="unified-page-container">
            <div className="unified-card">
                <div className="unified-left-form">
                    <div className="selection-header">
                        <h1>Booking Slots</h1>
                        <p>Select a date and choose an available time slot.</p>
                    </div>

                    <div className="date-picker-section">
                        <div className="picker-wrapper">
                            <Calendar className="picker-icon" size={20} />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="pulse-text" style={{ textAlign: 'center', padding: '40px' }}>Loading slots...</div>
                    ) : (
                        <div className="slots-container-premium">
                            {slots.length === 0 ? (
                                <div className="no-slots">
                                    <Clock size={40} opacity={0.3} />
                                    <p>No slots found for this date.</p>
                                </div>
                            ) : (
                                <div className="slot-grid-premium">
                                    {slots.map(slot => (
                                        <button
                                            key={slot._id}
                                            disabled={slot.status !== 'AVAILABLE'}
                                            className={`slot-pill ${slot.status.toLowerCase()} ${selectedSlot?._id === slot._id ? 'selected' : ''}`}
                                            onClick={() => setSelectedSlot(slot)}
                                        >
                                            <span className="time">{slot.startTime}</span>
                                            <span className="price">₹{slot.price}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}

                    <div className="selection-footer">
                        {selectedSlot ? (
                            <button className="book-btn" style={{ width: '100%' }} onClick={() => initiateBooking(selectedSlot)}>
                                PAY ₹{selectedSlot.price} TO BOOK
                            </button>
                        ) : (
                            <p className="hint-text" style={{ textAlign: 'center' }}>Pick a slot to proceed</p>
                        )}
                    </div>
                </div>

                <div className="unified-right-image" style={{ flex: 0.8 }}>
                    <div className="image-overlay">
                        <h3>Book Your Game</h3>
                        <p>Fast, Simple, and Secure</p>
                    </div>
                </div>
            </div>

            <UPIPaymentModal
                isOpen={isUPIModalOpen}
                onClose={() => setIsUPIModalOpen(false)}
                slot={selectedSlot}
                onSucess={handleSuccess}
            />
        </div>
    );
};

export default SlotSelectionPage;
