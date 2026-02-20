import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import UPIPaymentModal from '../components/UPIPaymentModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, Clock, AlertCircle, CreditCard, Banknote, CheckCircle } from 'lucide-react';

const DirectBookingPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [paymentMode, setPaymentMode] = useState(null); // 'CASH' or 'UPI' or null
    const [bookingLoading, setBookingLoading] = useState(false);

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
            setError('Failed to fetch slots. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSlotClick = async (slot) => {
        const isAdmin = user?.role === 'ADMIN';

        // If user is not admin, they can only book AVAILABLE slots
        if (!isAdmin && slot.status !== 'AVAILABLE') return;

        setBookingLoading(true);
        setError('');
        try {
            // We lock the slot first regardless of payment mode
            const { data: lockResponse } = await api.post(`/bookings/lock/${slot._id}`);
            setSelectedSlot(lockResponse.slot);
            setPaymentMode(null); // Reset mode selection
            setIsModalOpen(true); // Open the unified "Booking Action" view
        } catch (err) {
            setError(err.response?.data?.message || 'Error locking slot');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleCashBooking = async () => {
        setBookingLoading(true);
        try {
            await api.post('/bookings/direct', {
                date: selectedSlot.date,
                startTime: selectedSlot.startTime,
                endTime: selectedSlot.endTime
            });
            handlePaymentSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Cash booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        setIsModalOpen(false);
        setPaymentMode(null);
        setSelectedSlot(null);
        navigate('/history');
    };

    // Helper to Convert 24h to 12h Range (e.g., 5 AM - 6 AM)
    const formatTimeRange = (startTime24, endTime24) => {
        const formatSingle = (t24) => {
            if (!t24) return '';
            const [hours] = t24.split(':');
            let h = parseInt(hours, 10);
            const ampm = h >= 12 ? (h === 24 ? 'AM' : 'PM') : 'AM';
            let displayH = h % 12;
            if (displayH === 0) displayH = 12;
            return `${displayH} ${ampm}`;
        };
        return `${formatSingle(startTime24)} - ${formatSingle(endTime24)}`;
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="unified-page-container" style={{ paddingTop: '100px', flex: 1 }}>
                <div className="unified-card" style={{ maxWidth: '1200px' }}>
                    <div className="unified-left-form" style={{ padding: '40px', justifyContent: 'flex-start' }}>
                        <div className="selection-header" style={{ marginBottom: '25px', textAlign: 'left', width: '100%' }}>
                            <h2 style={{ color: 'var(--rcb-red)', fontWeight: '800', margin: '0 0 5px 0' }}>🏏 Book Your Turf</h2>
                            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Select a date and pick an available slot</p>
                        </div>

                        <div className="input-box" style={{ width: '100%', marginBottom: '30px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={16} /> Select Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                style={{ borderRadius: '12px' }}
                            />
                        </div>

                        {loading ? (
                            <div className="pulse-text" style={{ padding: '60px 0', width: '100%', textAlign: 'center' }}>
                                Fetching available slots...
                            </div>
                        ) : (
                            <div className="slots-grid-container" style={{ width: '100%', position: 'relative' }}>
                                {bookingLoading && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: 'rgba(255,255,255,0.7)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        zIndex: 10,
                                        borderRadius: '12px'
                                    }}>
                                        <div className="pulse-text">Processing...</div>
                                    </div>
                                )}
                                {error && (
                                    <div className="error-message" style={{ width: '100%', marginBottom: '20px' }}>
                                        <AlertCircle size={20} style={{ marginBottom: '10px' }} />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <div className="grid-instructions" style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '0.8rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ width: '12px', height: '12px', background: '#fff', border: '1px solid #ddd', borderRadius: '3px' }}></span> Available
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ width: '12px', height: '12px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '3px' }}></span> Booked
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ width: '12px', height: '12px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '3px' }}></span> Blocked
                                    </div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                                    gap: '12px',
                                    width: '100%'
                                }}>
                                    {slots.map((slot) => {
                                        const isAdmin = user?.role === 'ADMIN';
                                        const isBlocked = slot.status === 'BLOCKED';
                                        const isBooked = slot.status === 'BOOKED' || slot.status === 'PENDING_CONFIRMATION' || slot.status === 'LOCKED';
                                        const isAvailable = slot.status === 'AVAILABLE';

                                        let bg = '#fff';
                                        let border = '#ddd';
                                        let cursor = 'pointer';
                                        let opacity = 1;

                                        if (isBooked) {
                                            bg = '#fff1f2';
                                            border = '#fecaca';
                                            if (!isAdmin) cursor = 'not-allowed';
                                        } else if (isBlocked) {
                                            bg = '#f9fafb';
                                            border = '#e5e7eb';
                                            opacity = 0.6;
                                            if (!isAdmin) cursor = 'not-allowed';
                                        }

                                        return (
                                            <div
                                                key={slot._id}
                                                onClick={() => handleSlotClick(slot)}
                                                style={{
                                                    background: bg,
                                                    border: `2px solid ${border}`,
                                                    borderRadius: '0px',
                                                    padding: '16px 12px',
                                                    textAlign: 'center',
                                                    cursor: cursor,
                                                    opacity: opacity,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    minHeight: '100px',
                                                    gap: '8px'
                                                }}
                                                className="slot-box-premium"
                                            >
                                                <span style={{
                                                    fontWeight: '900',
                                                    fontSize: '0.9rem',
                                                    color: isBooked ? '#991b1b' : isBlocked ? '#64748b' : '#1e293b',
                                                    lineHeight: '1.1'
                                                }}>
                                                    {formatTimeRange(slot.startTime, slot.endTime)}
                                                </span>

                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: '800',
                                                    color: isAvailable ? '#059669' : '#94a3b8',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    {isBooked ? 'Unavailable' : isBlocked ? 'Blocked' : `₹${slot.price}`}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="unified-right-image" style={{ position: 'relative', flex: 0.7 }}>
                        {!isModalOpen ? (
                            <div className="image-overlay" style={{ padding: '40px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', padding: '35px', borderRadius: '0px', border: '1px solid rgba(255,255,255,0.2)', width: '100%', maxWidth: '400px' }}>
                                    <h3 style={{ fontSize: '2.8rem', marginBottom: '10px', fontWeight: '900', letterSpacing: '-1px' }}>Play Bold.</h3>
                                    <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: '1.4', marginBottom: '30px' }}>India's Premium Box Cricket & Cafe Experience</p>
                                    <div style={{ display: 'grid', gap: '15px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px 22px', borderRadius: '0px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <div style={{ background: '#059669', borderRadius: '50%', padding: '4px', display: 'flex' }}><CheckCircle size={14} color="white" /></div> Professional Grade Turf
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px 22px', borderRadius: '0px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <div style={{ background: '#059669', borderRadius: '50%', padding: '4px', display: 'flex' }}><CheckCircle size={14} color="white" /></div> High-Intensity Night Lights
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="modal-overlay contained-modal">
                                {!paymentMode ? (
                                    <div className="upi-modal" style={{ padding: '40px' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ width: '60px', height: '60px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--rcb-red)' }}>
                                                <Clock size={28} />
                                            </div>
                                            <h3 style={{ color: '#0f172a', marginBottom: '12px', fontWeight: '900', fontSize: '1.6rem', letterSpacing: '-0.5px' }}>Booking Summary</h3>
                                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '0px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
                                                <p style={{ fontSize: '1rem', color: '#475569', margin: '0 0 8px 0', fontWeight: '600' }}>
                                                    {formatTimeRange(selectedSlot.startTime, selectedSlot.endTime)}
                                                </p>
                                                <p style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: '900', margin: 0 }}>
                                                    ₹{selectedSlot.price}
                                                </p>
                                            </div>
                                            <div className="payment-choice-container">
                                                <button
                                                    className="payment-btn upi"
                                                    onClick={() => setPaymentMode('UPI')}
                                                >
                                                    <CreditCard size={20} /> Pay with UPI
                                                </button>
                                                <button
                                                    className="payment-btn cash"
                                                    onClick={() => setPaymentMode('CASH')}
                                                >
                                                    <Banknote size={20} /> Pay with Cash
                                                </button>
                                                <button
                                                    onClick={() => setIsModalOpen(false)}
                                                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem', marginTop: '20px', fontWeight: '700' }}
                                                >
                                                    Cancel and Go Back
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : paymentMode === 'UPI' ? (
                                    <UPIPaymentModal
                                        isOpen={true}
                                        onClose={() => setPaymentMode(null)}
                                        slot={selectedSlot}
                                        onSucess={handlePaymentSuccess}
                                        className="inline-modal"
                                    />
                                ) : (
                                    <div className="upi-modal" style={{ padding: '40px' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ width: '60px', height: '60px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#059669' }}>
                                                <Banknote size={28} />
                                            </div>
                                            <h3 style={{ color: '#0f172a', marginBottom: '15px', fontWeight: '900', fontSize: '1.6rem' }}>Cash Payment</h3>
                                            <p style={{ marginBottom: '30px', color: '#475569', fontSize: '1rem', lineHeight: '1.5' }}>
                                                Please visit the counter and pay <strong style={{ color: '#0f172a' }}>₹{selectedSlot.price}</strong>. An admin will confirm your slot immediately.
                                            </p>
                                            <button
                                                className="book-btn"
                                                disabled={bookingLoading}
                                                onClick={handleCashBooking}
                                                style={{ margin: 0, background: '#059669', width: '100%', borderRadius: '14px', padding: '16px', fontWeight: '800' }}
                                            >
                                                {bookingLoading ? 'Confirming...' : 'CONFIRM CASH BOOKING'}
                                            </button>
                                            <button
                                                onClick={() => setPaymentMode(null)}
                                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginTop: '20px', fontWeight: '700' }}
                                            >
                                                Back to Payment Options
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DirectBookingPage;
