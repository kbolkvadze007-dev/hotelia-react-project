import { Link, Navigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cancelBooking } from '../store/bookingsSlice';

function formatDate(value) {
  if (!value) return 'თარიღი მითითებული არ არის';
  return new Intl.DateTimeFormat('ka-GE', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

export default function BookingDetailsPage() {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.bookings.items.find((item) => item.id === bookingId));

  if (!booking) return <Navigate to="/bookings" replace />;
  const confirmed = booking.status === 'Confirmed';

  return (
    <div className="page-wrap details-page">
      <div className="breadcrumb details-breadcrumb"><Link to="/bookings">ჯავშნები</Link><span>/</span>{booking.id}</div>
      <section className="details-banner"><div><p className="eyebrow">BOOKING DETAILS</p><h1>ჯავშნის დეტალები</h1><p className="intro-copy">ყველა მნიშვნელოვანი ინფორმაცია ერთ სივრცეში.</p></div><span className={`status-pill ${confirmed ? 'status-confirmed' : 'status-cancelled'}`}><i />{confirmed ? 'დადასტურებული' : 'გაუქმებული'}</span></section>
      <section className="panel details-card">
        <div className="details-card-head"><div><p className="eyebrow">BOOKING REFERENCE</p><h2>{booking.id}</h2></div><span className="details-avatar">{booking.guestName.trim().charAt(0)}</span></div>
        <div className="details-grid">
          <div className="detail-item"><span>სტუმრის სახელი</span><strong>{booking.guestName}</strong></div>
          <div className="detail-item"><span>ელფოსტა</span><strong>{booking.email}</strong></div>
          <div className="detail-item"><span>სტუმრების რაოდენობა</span><strong>{booking.guests}</strong></div>
          <div className="detail-item"><span>ოთახის ტიპი</span><strong>{booking.roomType}</strong></div>
          <div className="detail-item"><span>შესვლის თარიღი</span><strong>{formatDate(booking.checkIn)}</strong></div>
          <div className="detail-item"><span>გასვლის თარიღი</span><strong>{formatDate(booking.checkOut)}</strong></div>
        </div>
        <div className="details-actions"><Link className="button button-light" to="/bookings">← ჯავშნების სიაში დაბრუნება</Link>{confirmed && <button className="button button-danger" onClick={() => dispatch(cancelBooking(booking.id))}>ჯავშნის გაუქმება</button>}</div>
      </section>
    </div>
  );
}