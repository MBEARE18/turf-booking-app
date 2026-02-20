import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SlotSelectionPage from './pages/SlotSelectionPage';
import DirectBookingPage from './pages/DirectBookingPage';
import BookingHistory from './pages/BookingHistory';
import AdminDashboard from './pages/AdminDashboard';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import TournamentsPage from './pages/TournamentsPage';
import ContactPage from './pages/ContactPage';
import RulesPage from './pages/RulesPage';


const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user && user.role === 'ADMIN' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={5000} pauseOnHover theme="colored" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/book-now" element={<PrivateRoute><DirectBookingPage /></PrivateRoute>} />
          <Route
            path="/book"
            element={<PrivateRoute><SlotSelectionPage /></PrivateRoute>}
          />
          <Route
            path="/history"
            element={<PrivateRoute><BookingHistory /></PrivateRoute>}
          />
          <Route
            path="/admin"
            element={<AdminRoute><AdminDashboard /></AdminRoute>}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
