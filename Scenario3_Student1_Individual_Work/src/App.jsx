import { useMemo, useState } from 'react';
import useFetchRooms from './hooks/useFetchRooms.js';
import RoomCard from './components/RoomCard.jsx';

export default function App() {
  const { rooms, loading, error } = useFetchRooms();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [maxPrice, setMaxPrice] = useState(500);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  const filteredRooms = useMemo(() => {
    const result = rooms.filter((room) => {
      const matchesSearch = room.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesType = type === 'All' || room.type === type;
      const matchesPrice = room.price <= maxPrice;
      const matchesAvailability = !availableOnly || room.available;
      return matchesSearch && matchesType && matchesPrice && matchesAvailability;
    });

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [rooms, search, type, maxPrice, availableOnly, sortBy]);

  function resetFilters() {
    setSearch('');
    setType('All');
    setMaxPrice(500);
    setAvailableOnly(false);
    setSortBy('default');
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">STAY · REST · REPEAT</p>
          <h1>იპოვე შენი იდეალური ნომერი</h1>
          <p className="hero-text">აღმოაჩინე კომფორტული სივრცეები და დაგეგმე სასიამოვნო დასვენება.</p>
        </div>
      </header>

      <section className="catalog-header">
        <div>
          <p className="section-label">OUR ROOMS</p>
          <h2>სასტუმროს ნომრები</h2>
          <p className="muted">შეარჩიე ნომერი შენი სურვილისა და ბიუჯეტის მიხედვით.</p>
        </div>
        <div className="result-count">{filteredRooms.length} ნომერი</div>
      </section>

      <section className="filters" aria-label="ნომრების ფილტრები">
        <label className="field search-field">
          <span>ძებნა</span>
          <input
            type="search"
            placeholder="ნომრის სახელით ძებნა..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label className="field">
          <span>ნომრის ტიპი</span>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="All">ყველა ტიპი</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
          </select>
        </label>

        <label className="field price-filter">
          <span>მაქსიმალური ფასი: <strong>₾{maxPrice}</strong></span>
          <input
            type="range"
            min="50"
            max="500"
            step="5"
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
          />
        </label>

        <label className="availability-filter">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => setAvailableOnly(event.target.checked)}
          />
          <span>მხოლოდ თავისუფალი</span>
        </label>

        <label className="field sort-field">
          <span>დალაგება</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="default">ნაგულისხმევი</option>
            <option value="price-asc">ფასი: ზრდადობით</option>
            <option value="price-desc">ფასი: კლებადობით</option>
            <option value="name">სახელით</option>
          </select>
        </label>

        <button className="reset-button" type="button" onClick={resetFilters}>ფილტრების გასუფთავება</button>
      </section>

      {loading && <p className="message">ნომრები იტვირთება...</p>}
      {error && <p className="message error" role="alert">{error}</p>}

      {!loading && !error && (
        <>
          {filteredRooms.length > 0 ? (
            <section className="rooms-grid" aria-label="სასტუმროს ნომრების სია">
              {filteredRooms.map((room) => <RoomCard key={room.id} room={room} />)}
            </section>
          ) : (
            <section className="empty-state">
              <h3>ნომრები ვერ მოიძებნა</h3>
              <p>შეცვალე ძებნის ტექსტი ან ფილტრის პირობები.</p>
              <button className="reset-button" type="button" onClick={resetFilters}>ყველა ნომრის ნახვა</button>
            </section>
          )}
        </>
      )}

      <footer className="footer">HOTEL BOOKING <span>·</span> კომფორტი იწყება აქ</footer>
    </main>
  );
}
