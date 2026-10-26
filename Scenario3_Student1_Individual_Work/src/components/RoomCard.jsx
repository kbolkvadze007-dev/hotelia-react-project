import PropTypes from 'prop-types';

export default function RoomCard({ room }) {
  return (
    <article className="room-card">
      <img src={room.image} alt={room.name} loading="lazy" />
      <div className="room-info">
        <div className="card-heading">
          <span className="tag">{room.type}</span>
          <span className={room.available ? 'status available' : 'status unavailable'}>
            {room.available ? 'თავისუფალია' : 'დაკავებულია'}
          </span>
        </div>
        <h2>{room.name}</h2>
        <p className="description">{room.description}</p>
        <p className="capacity">სტუმრების მაქსიმალური რაოდენობა: {room.capacity}</p>
        <div className="price">₾{room.price}<span> / ღამე</span></div>
      </div>
    </article>
  );
}

RoomCard.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    capacity: PropTypes.number.isRequired,
    available: PropTypes.bool.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired
};
