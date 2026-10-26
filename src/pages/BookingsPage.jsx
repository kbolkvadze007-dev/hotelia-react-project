import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BookingForm from '../components/BookingForm';
import { addBooking, cancelBooking } from '../store/bookingsSlice';

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('ka-GE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

export default function BookingsPage({ activeCount }) {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.items);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => bookings.filter((booking) => {
    const query = `${booking.id} ${booking.guestName} ${booking.email}`.toLowerCase();
    return query.includes(search.toLowerCase()) && (filter === 'All' || booking.status === filter);
  }), [bookings, search, filter]);

  const guestCount = bookings.filter((booking) => booking.status === 'Confirmed').reduce((sum, booking) => sum + booking.guests, 0);

  return (
    <div className="page-wrap">
      <div className="page-intro">
        <div><div className="breadcrumb">სამუშაო სივრცე <span>/</span> ჯავშნები</div><p className="eyebrow">HOTEL MANAGEMENT</p><h1>ჯავშნები</h1><p className="intro-copy">მოგესალმები! აქ შეგიძლია მართო სტუმრების ჯავშნები და დეტალები.</p></div>
        <div className="intro-badge"><span className="badge-icon">✳</span><span><small>დღევანდელი განწყობა</small><strong>მშვიდი და ორგანიზებული</strong></span></div>
      </div>

      <section className="stats-grid" aria-label="ჯავშნების სტატისტიკა">
        <article className="stat-card"><div className="stat-top"><span className="stat-icon icon-sage">▤</span><span className="stat-trend">სულ</span></div><p>ჯავშნების რაოდენობა</p><strong>{String(bookings.length).padStart(2, '0')}</strong><small>ყველა ჩანაწერი</small></article>
        <article className="stat-card"><div className="stat-top"><span className="stat-icon icon-green">✓</span><span className="stat-trend trend-green">აქტიური</span></div><p>დადასტურებული</p><strong>{String(activeCount).padStart(2, '0')}</strong><small>აქტიური ჯავშნები</small></article>
        <article className="stat-card"><div className="stat-top"><span className="stat-icon icon-sand">♧</span><span className="stat-trend">სტუმრები</span></div><p>სტუმრების რაოდენობა</p><strong>{String(guestCount).padStart(2, '0')}</strong><small>აქტიურ ჯავშნებში</small></article>
      </section>

      <BookingForm onSubmit={(values) => dispatch(addBooking(values))} />

      <section className="panel list-panel">
        <div className="section-heading list-heading">
          <div><p className="eyebrow">სტუმრების ჩანაწერები</p><h2>ყველა ჯავშანი <span className="count-badge">{bookings.length}</span></h2></div>
          <div className="list-tools">
            <label className="search-field"><span>⌕</span><input aria-label="ჯავშნების ძებნა" placeholder="მოძებნე სტუმარი..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
            <select aria-label="სტატუსის ფილტრი" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="All">ყველა სტატუსი</option><option value="Confirmed">დადასტურებული</option><option value="Cancelled">გაუქმებული</option></select>
          </div>
        </div>
        <div className="table-scroll"><table><thead><tr><th>ჯავშნის კოდი</th><th>სტუმარი</th><th>ოთახი</th><th>შესვლა / გასვლა</th><th>სტუმრები</th><th>სტატუსი</th><th>მოქმედება</th></tr></thead>
          <tbody>
            {filtered.map((booking) => <tr key={booking.id}>
              <td><Link className="booking-code" to={`/bookings/${booking.id}`}>{booking.id}</Link></td>
              <td><div className="guest-info"><span className="guest-avatar">{booking.guestName.trim().charAt(0)}</span><span><strong>{booking.guestName}</strong><small>{booking.email}</small></span></div></td>
              <td><span className="room-name">{booking.roomType}</span></td>
              <td><span className="date-main">{formatDate(booking.checkIn)}</span><small className="date-sub">{formatDate(booking.checkOut)}</small></td>
              <td>{booking.guests} <span className="subtle">სტუმ.</span></td>
              <td><span className={`status-pill ${booking.status === 'Confirmed' ? 'status-confirmed' : 'status-cancelled'}`}><i />{booking.status === 'Confirmed' ? 'დადასტურებული' : 'გაუქმებული'}</span></td>
              <td><div className="row-actions"><Link to={`/bookings/${booking.id}`} className="view-link">დეტალები ↗</Link>{booking.status === 'Confirmed' && <button type="button" className="icon-button" aria-label={`${booking.id} ჯავშნის გაუქმება`} title="ჯავშნის გაუქმება" onClick={() => dispatch(cancelBooking(booking.id))}>×</button>}</div></td>
            </tr>)}
            {filtered.length === 0 && <tr><td colSpan="7"><div className="empty-state"><span>⌕</span><strong>ჯავშანი ვერ მოიძებნა</strong><p>სცადე სხვა საძიებო სიტყვა ან ფილტრი.</p></div></td></tr>}
          </tbody>
        </table></div>
        <div className="table-footer"><span>ნაჩვენებია <strong>{filtered.length}</strong> ჩანაწერი</span><span>HOTELIA <b>•</b> BOOKING OVERVIEW</span></div>
      </section>
    </div>
  );
}