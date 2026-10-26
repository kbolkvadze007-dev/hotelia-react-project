import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [
    { id: 'HT-2041', guestName: 'ანა ბერიძე', guests: 2, email: 'ana.beridze@example.com', roomType: 'Deluxe', checkIn: '2026-11-02', checkOut: '2026-11-05', status: 'Confirmed' },
    { id: 'HT-2042', guestName: 'გიორგი მაისურაძე', guests: 1, email: 'giorgi.m@example.com', roomType: 'Standard', checkIn: '2026-11-06', checkOut: '2026-11-08', status: 'Confirmed' },
    { id: 'HT-2043', guestName: 'ნინო კაპანაძე', guests: 4, email: 'nino.k@example.com', roomType: 'Family Suite', checkIn: '2026-11-10', checkOut: '2026-11-14', status: 'Cancelled' },
  ],
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    addBooking: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare(values) {
        return {
          payload: {
            id: `HT-${nanoid(6).toUpperCase()}`,
            guestName: values.guestName.trim(),
            guests: Number(values.guests),
            email: values.email.trim(),
            roomType: values.roomType,
            checkIn: values.checkIn,
            checkOut: values.checkOut,
            status: 'Confirmed',
          },
        };
      },
    },
    cancelBooking(state, action) {
      const item = state.items.find((booking) => booking.id === action.payload);
      if (item) item.status = 'Cancelled';
    },
  },
});

export const { addBooking, cancelBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;