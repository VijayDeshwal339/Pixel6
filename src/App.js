import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import CustomerForm from './pages/CustomerForm';
import CustomerList from './pages/CustomerList';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
        <Route path="/" element={<CustomerForm />} />
          <Route path="/customer-form/:id?" element={<CustomerForm />} />          
          <Route path="/customer-list" element={<CustomerList />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
