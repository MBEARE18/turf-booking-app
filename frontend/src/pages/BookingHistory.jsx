import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Calendar, Clock, CreditCard, CheckCircle, XCircle, History, Hash } from 'lucide-react';
import './BookingHistory.css';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/bookings/mybookings');
                setBookings(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return { icon: CheckCircle, color: '#10B981', bg: '#D1FAE5', text: 'Confirmed' };
            case 'PENDING':
            case 'PENDING_VERIFICATION':
                return { icon: Clock, color: '#F59E0B', bg: '#FEF3C7', text: 'Pending' };
            case 'CANCELLED':
                return { icon: XCircle, color: '#EF4444', bg: '#FEE2E2', text: 'Cancelled' };
            default:
                return { icon: Clock, color: '#6B7280', bg: '#F3F4F6', text: status };
        }
    };

    if (loading) {
        return (
            <div className="history-wrapper">
                <Navbar />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="history-wrapper">
            <Navbar />
            <div className="history-container">
                <div className="history-header">
                    <div className="header-content">
                        <History className="header-icon" size={40} />
                        <h1>My Bookings</h1>
                        <p>Track all your turf reservations</p>
                    </div>
                </div>

                {bookings.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <h2>No Bookings Yet</h2>
                        <p>You haven't made any bookings. Start by booking your first slot!</p>
                        <button
                            className="book-now-btn"
                            onClick={() => navigate('/book-now')}
                        >
                            Book Your First Slot
                        </button>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="th-content">
                                            <Hash size={16} />
                                            <span>Booking ID</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <Calendar size={16} />
                                            <span>Date</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <Clock size={16} />
                                            <span>Time Slot</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <CreditCard size={16} />
                                            <span>Amount</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <CheckCircle size={16} />
                                            <span>Status</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <span>Payment Info</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking, index) => {
                                    const statusConfig = getStatusConfig(booking.status);
                                    const StatusIcon = statusConfig.icon;

                                    return (
                                        <tr
                                            key={booking._id}
                                            className="booking-row"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <td>
                                                <div className="booking-id-cell">
                                                    {booking._id.slice(-8).toUpperCase()}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="date-cell">
                                                    {booking.slots?.length > 0 && formatDate(booking.slots[0].date)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="time-cell">
                                                    {booking.slots?.length > 0 && (
                                                        <>
                                                            {booking.slots[0].startTime} - {booking.slots[booking.slots.length - 1].endTime}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="amount-cell">
                                                    ₹{booking.totalAmount}
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    className="status-badge-table"
                                                    style={{
                                                        background: statusConfig.bg,
                                                        color: statusConfig.color
                                                    }}
                                                >
                                                    <StatusIcon size={14} />
                                                    <span>{statusConfig.text}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="payment-cell">
                                                    {booking.utrNumber && (
                                                        <div className="payment-detail">
                                                            <span className="payment-type">UTR:</span>
                                                            <span className="payment-value">{booking.utrNumber}</span>
                                                        </div>
                                                    )}
                                                    {booking.razorpayPaymentId && (
                                                        <div className="payment-detail">
                                                            <span className="payment-type">Payment ID:</span>
                                                            <span className="payment-value">{booking.razorpayPaymentId.slice(0, 16)}...</span>
                                                        </div>
                                                    )}
                                                    {!booking.utrNumber && !booking.razorpayPaymentId && (
                                                        <span className="no-payment">—</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;
