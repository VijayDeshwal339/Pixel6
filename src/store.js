import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './store/customerSlice';

export const store = configureStore({
  reducer: {
    customer: customerReducer,
  },
});
