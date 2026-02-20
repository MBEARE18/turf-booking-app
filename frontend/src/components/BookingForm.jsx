import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import UPIPaymentModal from './UPIPaymentModal';

const BookingForm = ({ onBookingInitiated }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchingSlots, setFetchingSlots] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (formData.date) {
            fetchAvailability(formData.date);
        }
    }, [formData.date]);

    const fetchAvailability = async (selectedDate) => {
        setFetchingSlots(true);
        try {
            const { data } = await api.get(`/slots/${selectedDate}`);
            setAvailableSlots(data);
        } catch (err) {
            console.error('Failed to fetch slots:', err);
        } finally {
            setFetchingSlots(false);
        }
    };

    // Generate time slots from 04:00 AM to 12:00 AM (00:00)
    const timeSlots = [
        '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
        '20:00', '21:00', '22:00', '23:00', '00:00'
    ];

    const isSlotAvailable = (time) => {
        if (!formData.date) return true;
        const slot = availableSlots.find(s => s.startTime === time);
        if (!slot) return true; // Default virtual available
        return slot.status === 'AVAILABLE';
    };

    // Filter end time slots based on start time
    const getEndTimeSlots = () => {
        if (!formData.startTime) return [];
        const startIndex = timeSlots.indexOf(formData.startTime);
        return timeSlots.slice(startIndex + 1);
    };

    // Helper to Convert 24h to 12h AM/PM
    const formatTime = (time24) => {
        if (!time24) return '';
        const [hours, minutes] = time24.split(':');
        let h = parseInt(hours, 10);
        const m = minutes ? minutes : '00';
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12; // 0 should be 12
        return `${h}:${m} ${ampm}`;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Reset end time if start time changes
        if (e.target.name === 'startTime') {
            setFormData(prev => ({ ...prev, startTime: e.target.value, endTime: '' }));
        }
    };

    const calculatePrice = () => {
        const { startTime, endTime } = formData;
        if (!startTime || !endTime) return 0;

        let startHour = parseInt(startTime.split(':')[0]);
        let endHour = parseInt(endTime.split(':')[0]);

        if (endHour === 0) endHour = 24; // Handle midnight
        if (startHour === 0) startHour = 24; // Handle edge case if start is 00:00

        let totalPrice = 0;
        for (let h = startHour; h < endHour; h++) {
            if (h < 17) {
                totalPrice += 300;
            } else {
                totalPrice += 400;
            }
        }
        return totalPrice;
    };

    const totalPrice = calculatePrice();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await api.post('/bookings/lock-range', {
                ...formData
            });

            if (onBookingInitiated) {
                onBookingInitiated({
                    _id: data.slots.map(s => s._id), // Hack to pass multiple IDs to the modal
                    price: data.totalPrice,
                    isRange: true,
                    slots: data.slots
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-card">
            <h2 className="card-title">🏏 Book Your Turf Slot</h2>
            <p className="card-subtitle">RCB Box Cricket • Play Like Champions</p>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit} className="booking-form">

                <div className="input-box">
                    <label>Match Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="time-section" style={{ alignItems: 'flex-end' }}>
                    <div className="input-box" style={{ flex: 1 }}>
                        <label>Start Time</label>
                        <select
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                            disabled={fetchingSlots || !formData.date}
                        >
                            <option value="">{fetchingSlots ? 'Loading...' : 'Select'}</option>
                            {timeSlots.slice(0, -1).map(time => {
                                const available = isSlotAvailable(time);
                                return (
                                    <option key={time} value={time} disabled={!available}>
                                        {formatTime(time)} {!available ? '(N/A)' : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="input-box" style={{ flex: 1 }}>
                        <label>End Time</label>
                        <select
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                            disabled={!formData.startTime}
                        >
                            <option value="">Select</option>
                            {getEndTimeSlots().map(time => (
                                <option key={time} value={time}>{formatTime(time)}</option>
                            ))}
                        </select>
                    </div>

                    {formData.startTime && formData.endTime && (
                        <div style={{ flex: 0.8, display: 'flex', alignItems: 'flex-end', paddingBottom: '1px' }}>
                            <div style={{
                                background: '#FFFBEB',
                                border: '1px solid #FCD34D',
                                borderRadius: '10px',
                                width: '100%',
                                height: '42px', /* Matches the visual height of dropdowns */
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                lineHeight: '1'
                            }}>
                                <div style={{ color: '#92400E', fontWeight: '800', fontSize: '1rem' }}>
                                    ₹{totalPrice}
                                </div>
                                <div style={{ fontSize: '0.6rem', color: '#B45309' }}>
                                    Estimated
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button type="submit" className="book-btn" disabled={loading}>
                    {loading ? 'Booking...' : 'CONFIRM BOOKING'}
                </button>
            </form>
        </div>
    );
};

export default BookingForm;
