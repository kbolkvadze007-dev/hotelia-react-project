import { useEffect, useState } from 'react';
import { roomsData } from '../data/rooms.js';

export default function useFetchRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      setRooms(roomsData);
      setError('');
    } catch {
      setError('ნომრების ჩატვირთვა ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { rooms, loading, error };
}
