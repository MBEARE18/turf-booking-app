import React, { useState } from 'react';
import { X, CheckCircle, Copy, AlertCircle, Camera, Upload } from 'lucide-react';
import api from '../services/api';

const UPIPaymentModal = ({ isOpen, onClose, slot, onSucess, className }) => {
    const [utrNumber, setUtrNumber] = useState('');
    const [screenshot, setScreenshot] = useState(null); // New state for screenshot
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false); // New state for success view

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('File size too large. Max 2MB allowed.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshot(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (utrNumber.length < 12) {
            setError('Please enter a valid 12-digit UTR/Transaction ID');
            return;
        }

        if (!screenshot) {
            setError('Please upload a payment screenshot');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const slotIds = Array.isArray(slot._id) ? slot._id : [slot._id];
            await api.post('/bookings/submit-upi', {
                slotIds,
                utrNumber,
                screenshot // Send base64 screenshot
            });
            setIsSubmitted(true);
            setTimeout(() => {
                onSucess();
                onClose();
            }, 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyUPI = () => {
        navigator.clipboard.writeText('8095084383@okbizaxis');
        alert('UPI ID copied to clipboard!');
    };

    if (isSubmitted) {
        return (
            <div className={`modal-overlay ${className || ''}`}>
                <div className="upi-modal" style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="success-icon-container">
                        <CheckCircle size={80} color="#059669" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', color: '#059669', marginTop: '20px' }}>Verification Pending</h2>
                    <p style={{ fontSize: '1.1rem', color: '#4B5563', margin: '15px 0' }}>
                        Your payment details and screenshot have been submitted successfully.
                    </p>
                    <div style={{ background: '#F3F4F6', padding: '15px', borderRadius: '10px', fontSize: '0.9rem', color: '#6B7280' }}>
                        Admin will verify your payment within 10-15 minutes.
                        A confirmation message will appear once approved.
                    </div>
                    <button
                        className="confirm-booking-btn"
                        style={{ marginTop: '25px', background: '#059669' }}
                        onClick={() => { onSucess(); onClose(); }}
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`modal-overlay ${className || ''}`}>
            <div className="upi-modal">
                <button className="close-btn" onClick={onClose}><X size={20} /></button>

                <div className="upi-header">
                    <h2>Verify Payment</h2>
                    <p>Amount to Pay: <strong>₹{slot.price}</strong></p>
                </div>

                <div className="upi-body">
                    <div className="qr-card-container">
                        <div className="qr-image-wrapper">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=upi://pay?pa=8095084383@okbizaxis%26pn=Maruthi%20Tractor%20Automobiles%26am=${slot.price}`}
                                alt="UPI QR Code"
                                className="qr-image"
                            />
                        </div>
                        <div className="upi-id-badge">
                            <span>8095084383@okbizaxis</span>
                            <button onClick={copyUPI} title="Copy UPI ID"><Copy size={14} /></button>
                        </div>
                    </div>

                    <div className="payment-guide">
                        <h3>Payment Instructions</h3>
                        <ul>
                            <li>Scan QR or pay to UPI ID</li>
                            <li>Enter exact amount: <strong>₹{slot.price}</strong></li>
                            <li>Take a screenshot of the payment</li>
                            <li>Enter <strong>12-digit UTR</strong> from your app</li>
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit} className="utr-form-premium">
                        <div className="utr-input-wrapper">
                            <label className="input-label">ENTER 12-DIGIT UTR NUMBER</label>
                            <input
                                type="text"
                                placeholder="e.g. 324567890123"
                                value={utrNumber}
                                onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                required
                            />
                        </div>

                        <div className="utr-input-wrapper" style={{ marginTop: '15px' }}>
                            <label className="input-label">UPLOAD PAYMENT SCREENSHOT</label>
                            <label className="file-upload-box" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                border: '2px dashed #D1D5DB',
                                borderRadius: '10px',
                                padding: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: screenshot ? '#ECFDF5' : 'white'
                            }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                {screenshot ? (
                                    <>
                                        <CheckCircle size={20} color="#059669" />
                                        <span style={{ color: '#059669', fontSize: '0.9rem', fontWeight: '600' }}>Screenshot Added</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} color="#6B7280" />
                                        <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Choose Image or Take Photo</span>
                                    </>
                                )}
                            </label>
                        </div>

                        {error && (
                            <div className="upi-error-msg">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="confirm-booking-btn"
                            disabled={loading || utrNumber.length < 12 || !screenshot}
                        >
                            {loading ? 'Processing...' : 'SUBMIT'}
                        </button>
                    </form>
                </div>

                <div className="upi-footer">
                    <small>🔒 Secure Payment Verification • RCB Turf & Cafe</small>
                </div>
            </div>
        </div>
    );
};

export default UPIPaymentModal;
