import { createSlice } from '@reduxjs/toolkit';

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    customers: JSON.parse(localStorage.getItem('customers')) || [],
    panValidation: null,
    postcodeDetails: null,
  },
  reducers: {
    addCustomer: (state, action) => {
      state.customers.push(action.payload);
      localStorage.setItem('customers', JSON.stringify(state.customers));
    },
    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(customer => customer.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
        localStorage.setItem('customers', JSON.stringify(state.customers));
      }
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(customer => customer.id !== action.payload);
      localStorage.setItem('customers', JSON.stringify(state.customers));
    },
    setPanValidation: (state, action) => {
      state.panValidation = action.payload;
    },
    setPostcodeDetails: (state, action) => {
      state.postcodeDetails = action.payload;
    },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer, setPanValidation, setPostcodeDetails } = customerSlice.actions;
export default customerSlice.reducer;
