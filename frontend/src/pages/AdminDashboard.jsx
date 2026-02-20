import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Users, Calendar, Plus, RefreshCw, CheckCircle, AlertCircle, ShoppingBag, Trash2, Clock, X } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('slots');
    const [date, setDate] = useState('');
    const [startHour, setStartHour] = useState(5);
    const [endHour, setEndHour] = useState(24);
    const [price, setPrice] = useState(400);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    // User registration data
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);

    // Bookings data
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    // Slots data for selected date
    const [slots, setSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [selectedScreenshot, setSelectedScreenshot] = useState(null);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'bookings') {
            fetchBookings();
        } else if (activeTab === 'slots' && date) {
            fetchSlots();
        }
    }, [activeTab, date]);

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const { data } = await api.get('/auth/users');
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setUsersLoading(false);
        }
    };

    const [error, setError] = useState(null);

    // ... (existing state)

    const fetchBookings = async () => {
        setBookingsLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/bookings');
            setBookings(data);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch bookings');
        } finally {
            setBookingsLoading(false);
        }
    };

    const handleVerifyBooking = async (id, status) => {
        try {
            await api.put(`/bookings/verify-status/${id}`, { status });
            fetchBookings(); // Refresh list after update
            if (date) fetchSlots(); // Refresh slot preview
        } catch (err) {
            alert('Failed to update booking status');
        }
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

    const fetchSlots = async () => {
        if (!date) return;
        setSlotsLoading(true);
        try {
            const { data } = await api.get(`/slots/${date}`);
            setSlots(data);
        } catch (err) {
            console.error('Failed to fetch slots:', err);
        } finally {
            setSlotsLoading(false);
        }
    };

    const generateSlots = async () => {
        if (!date) {
            setMessage({ text: 'Please select a date', type: 'error' });
            return;
        }

        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            await api.post('/slots/generate', {
                date,
                startHour: parseInt(startHour),
                endHour: parseInt(endHour),
                price: parseInt(price)
            });
            setMessage({ text: `Slots generated successfully for ${date}!`, type: 'success' });
            fetchSlots(); // Refresh slot list
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Failed to generate slots.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-wrapper">
            <Navbar />
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage your turf bookings and view user data</p>
                </div>

                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'slots' ? 'active' : ''}`}
                        onClick={() => setActiveTab('slots')}
                    >
                        <Calendar size={18} />
                        Slot Management
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        <ShoppingBag size={18} />
                        All Bookings
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <Users size={18} />
                        User Registrations
                    </button>
                </div>

                <div className="admin-content">
                    {activeTab === 'slots' && (
                        <div className="admin-slot-layout">
                            <div className="admin-card slot-management">
                                <div className="card-header">
                                    <Plus size={24} />
                                    <h3>Generate Hourly Slots</h3>
                                </div>

                                <div className="admin-form">
                                    <div className="form-group">
                                        <label>Select Date</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Start Hour (4 AM - 23 PM)</label>
                                            <input
                                                type="number"
                                                value={startHour}
                                                min="4"
                                                max="23"
                                                onChange={(e) => setStartHour(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>End Hour (5 AM - 24 PM)</label>
                                            <input
                                                type="number"
                                                value={endHour}
                                                min="5"
                                                max="24"
                                                onChange={(e) => setEndHour(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Base Price per Hour (₹)</label>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        className="admin-action-btn"
                                        onClick={generateSlots}
                                        disabled={loading}
                                    >
                                        {loading ? 'Generating...' : 'Generate New Slots'}
                                    </button>

                                    {message.text && (
                                        <div className={`admin-msg ${message.type}`}>
                                            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                            {message.text}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="admin-card slot-preview">
                                <div className="card-header">
                                    <Clock size={24} />
                                    <h3>Slot Availability Preview</h3>
                                </div>

                                {date ? (
                                    <div className="slot-grid-preview">
                                        {slotsLoading ? (
                                            <div className="admin-loading-small">
                                                <div className="spinner-small"></div>
                                            </div>
                                        ) : slots.length === 0 ? (
                                            <p className="no-slots-msg">No slots generated for this date.</p>
                                        ) : (
                                            slots.map((s) => (
                                                <div key={s._id} className={`slot-item-admin ${s.status.toLowerCase()}`}>
                                                    <span className="slot-time">{formatTime(s.startTime)} - {formatTime(s.endTime)}</span>
                                                    <span className={`slot-status-tag ${s.status}`}>
                                                        {s.status}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    <p className="no-slots-msg">Please select a date to preview slots.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="admin-card bookings-list">
                            <div className="card-header">
                                <ShoppingBag size={24} />
                                <h3 onClick={fetchBookings} style={{ cursor: 'pointer' }}>Manage Real-time Bookings</h3>
                                <RefreshCw
                                    size={20}
                                    className={bookingsLoading ? 'spin' : 'clickable'}
                                    onClick={fetchBookings}
                                />
                            </div>

                            {error && (
                                <div className="admin-msg error">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            {bookingsLoading ? (
                                <div className="admin-loading">
                                    <div className="spinner"></div>
                                    <p>Loading bookings...</p>
                                </div>
                            ) : (
                                <div className="table-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Customer</th>
                                                <th>Payment Info</th>
                                                <th>Screenshot</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="empty-row">No bookings found.</td>
                                                </tr>
                                            ) : (
                                                bookings.map((b) => (
                                                    <tr key={b._id}>
                                                        <td>{b.slots && b.slots.length > 0 ? b.slots[0].date : 'N/A'}</td>
                                                        <td className="bold">
                                                            {b.slots && b.slots.length > 0 ? (
                                                                `${formatTime(b.slots[0].startTime)} - ${formatTime(b.slots[b.slots.length - 1].endTime)}`
                                                            ) : 'N/A'}
                                                        </td>
                                                        <td>
                                                            <div className="customer-info">
                                                                <strong>{b.user?.name || b.guestName}</strong>
                                                                <span>{b.user?.phone || b.guestPhone}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {b.utrNumber ? (
                                                                <div className="utr-badge">
                                                                    <span className="label">UTR:</span>
                                                                    <span className="value">{b.utrNumber}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted">Direct Booking</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {b.screenshot ? (
                                                                <button
                                                                    className="view-ss-btn"
                                                                    onClick={() => setSelectedScreenshot(b.screenshot)}
                                                                >
                                                                    View Image
                                                                </button>
                                                            ) : (
                                                                <span className="text-muted">None</span>
                                                            )}
                                                        </td>
                                                        <td className="bold">₹{b.totalAmount}</td>
                                                        <td>
                                                            <span className={`status-badge ${b.status}`}>
                                                                {b.status.replace('_', ' ')}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {b.status === 'PENDING_VERIFICATION' && (
                                                                <div className="action-btns">
                                                                    <button
                                                                        className="approve-btn"
                                                                        onClick={() => handleVerifyBooking(b._id, 'CONFIRMED')}
                                                                        title="Approve Payment"
                                                                    >
                                                                        <CheckCircle size={18} />
                                                                    </button>
                                                                    <button
                                                                        className="reject-btn"
                                                                        onClick={() => handleVerifyBooking(b._id, 'CANCELLED')}
                                                                        title="Reject / Fake UTR"
                                                                    >
                                                                        <X size={18} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Screenshot Modal */}
                    {selectedScreenshot && (
                        <div className="modal-overlay" onClick={() => setSelectedScreenshot(null)}>
                            <div className="image-preview-modal" onClick={e => e.stopPropagation()}>
                                <button className="close-btn" onClick={() => setSelectedScreenshot(null)}><X /></button>
                                <img src={selectedScreenshot} alt="Payment Screenshot" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="admin-card user-registrations">
                            <div className="card-header">
                                <RefreshCw
                                    size={20}
                                    className={usersLoading ? 'spin' : 'clickable'}
                                    onClick={fetchUsers}
                                />
                                <h3>User Data (via Google Sheets)</h3>
                            </div>

                            {usersLoading ? (
                                <div className="admin-loading">
                                    <div className="spinner"></div>
                                    <p>Fetching user data from Google Sheets...</p>
                                </div>
                            ) : (
                                <div className="table-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Timestamp</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="empty-row">No users found in Google Sheets.</td>
                                                </tr>
                                            ) : (
                                                users.map((u, i) => (
                                                    <tr key={i}>
                                                        <td>{u.timestamp}</td>
                                                        <td className="bold">{u.name}</td>
                                                        <td>{u.email}</td>
                                                        <td>{u.phone}</td>
                                                        <td>
                                                            <span className={`role-badge ${u.role}`}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
