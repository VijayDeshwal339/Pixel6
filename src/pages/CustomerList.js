import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteCustomer } from '../store/customerSlice';
import { FaEdit, FaTrashAlt, FaSearch, FaPlus } from 'react-icons/fa';

const CustomerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customers = useSelector(state => state.customer.customers);

  const [searchTerm, setSearchTerm] = useState('');

  // Delete Customer Detail
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(deleteCustomer(id));
      navigate('/customer-list'); 
    }
  };

  // Check if customer Details is one or more than otherwise directly visit to the customer form
  useEffect(() => {
    if (customers.length === 0) {
      navigate('/customer-form');
    }
  }, [customers, navigate]);

  // Filter customers based on the search term
  const filteredCustomers = customers.filter(customer =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">Customer List</h2>

      {/* Add the more customer */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate('/customer-form')}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition duration-300"
        >
          <FaPlus className="mr-2" />
          Add Customer
        </button>
      </div>

      {/* Search Bar for searching customer */}
      <div className="mb-6 flex items-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="ml-2 text-gray-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => (
            <div key={customer.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">{customer.fullName}</h3>
              <p className="text-gray-600 mb-2"><strong>Email:</strong> {customer.email}</p>
              <p className="text-gray-600 mb-4"><strong>Mobile:</strong> {customer.mobile}</p>
              <div className="flex justify-between">
                <Link to={`/customer-form/${customer.id}`} className="text-blue-500 hover:text-blue-700 flex items-center">
                  <FaEdit className="mr-2" />
                  Edit
                </Link>
                <button onClick={() => handleDelete(customer.id)} className="text-red-500 hover:text-red-700 flex items-center">
                  <FaTrashAlt className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No customers found</p>
        )}
      </div>
    </div>
  );
};

export default CustomerList;


