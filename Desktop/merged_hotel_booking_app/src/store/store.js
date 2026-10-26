import { configureStore } from '@reduxjs/toolkit';
import bookingsReducer from './bookingsSlice';

export const store = configureStore({
  reducer: {
    bookings: bookingsReducer,
  },
});