import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BookingsPage from './pages/BookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import RoomsPage from './pages/RoomsPage';

export default function App() {
  const bookings = useSelector((state) => state.bookings.items);
  const activeCount = bookings.filter((item) => item.status === 'Confirmed').length;

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink to="/" className="brand" aria-label="Hotelia მთავარი გვერდი">
          <span className="brand-symbol">h</span>
          <span className="brand-name">hotelia<span>.</span><small>STAY, SIMPLIFIED</small></span>
        </NavLink>
        <nav className="main-nav" aria-label="მთავარი ნავიგაცია">
          <NavLink end to="/" className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}>ნომრების კატალოგი</NavLink>
          <NavLink to="/bookings" className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}>ჯავშნები</NavLink>
        </nav>
        <div className="profile"><span className="profile-avatar">A</span><span>ადმინისტრატორი</span><span className="chevron">⌄</span></div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<RoomsPage />} />
          <Route path="/bookings" element={<BookingsPage activeCount={activeCount} />} />
          <Route path="/bookings/:bookingId" element={<BookingDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer><span className="footer-brand">hotelia.</span><span>სასტუმროს ჯავშნების მართვა</span><span>სცენარი 3 · გაერთიანებული პროექტი</span></footer>
    </div>
  );
}