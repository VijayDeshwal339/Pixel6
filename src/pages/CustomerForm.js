import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyPAN, getPostcodeDetails } from '../store/api';
import { addCustomer, updateCustomer, setPanValidation, setPostcodeDetails } from '../store/customerSlice';
import AddCustomer from '../assests/AddCustomer1.jpg';

const MAX_ADDRESSES = 10;

const CustomerForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const postcodeDetails = useSelector(state => state.customer.postcodeDetails) || { city: [], state: [] };
  const customers = useSelector(state => state.customer.customers);

  // Checking the User
  const existingCustomer = customers.find(customer => customer.id === parseInt(id, 10));

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: existingCustomer || {
      pan: '',
      fullName: '',
      email: '',
      mobile: '',
      addresses: [{ addressLine1: '', addressLine2: '', postcode: '', city: '', state: '' }],
    }
  });

  // Add Adresses
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses'
  });

  const [isVerifyingPAN, setIsVerifyingPAN] = useState(false);
  const [isLoadingPostcode, setIsLoadingPostcode] = useState(false);


// Verify Pan
  const handleVerifyPAN = async (pan) => {
    if (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      setIsVerifyingPAN(true);
      try {
        const response = await verifyPAN(pan);
        dispatch(setPanValidation(response));
        if (response.isValid && response.fullName) {
          setValue('fullName', response.fullName);
        }
      } catch (error) {
        console.error('Error verifying PAN:', error);
      } finally {
        setIsVerifyingPAN(false);
      }
    }
  };

  // checking Post Code
  const handlePostcodeLookup = async (postcode, index) => {
    if (/^[0-9]{6}$/.test(postcode)) {
      setIsLoadingPostcode(true);
      try {
        const response = await getPostcodeDetails(postcode);
        dispatch(setPostcodeDetails(response));
        if (response) {
          setValue(`addresses.${index}.city`, response.city[0]?.name || '');
          setValue(`addresses.${index}.state`, response.state[0]?.name || '');
        }
      } catch (error) {
        console.error('Error fetching postcode details:', error);
      } finally {
        setIsLoadingPostcode(false);
      }
    }
  };

  // form Submission
  const onSubmit = (data) => {
    if (existingCustomer) {
      dispatch(updateCustomer({ ...data, id: existingCustomer.id }));
    } else {
      dispatch(addCustomer({ ...data, id: Date.now() }));
    }
    navigate('/customer-list');
  };

  useEffect(() => {
    if (existingCustomer) {
      reset(existingCustomer);
    }
  }, [existingCustomer, reset]);

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${AddCustomer})` }}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-8 bg-white bg-opacity-90 shadow-lg rounded-lg  relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">{existingCustomer ? 'Edit Customer' : 'Add New Customer'}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="relative">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="pan">
              PAN <span className="text-red-500">*</span>
            </label>
            <Controller
              name="pan"
              control={control}
              rules={{
                required: "PAN is required",
                maxLength: { value: 10, message: "PAN must be 10 characters long" },
                pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN format" }
              }}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleVerifyPAN(e.target.value);
                    }}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {isVerifyingPAN && (
                    <div className="absolute right-2 top-10">
                      <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                    </div>
                  )}
                  {fieldState.error && <p className="text-red-500 text-xs italic mt-1">{fieldState.error.message}</p>}
                </>
              )}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Controller
              name="fullName"
              control={control}
              rules={{ required: "Full Name is required", maxLength: { value: 140, message: "Full Name cannot exceed 140 characters" } }}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {fieldState.error && <p className="text-red-500 text-xs italic mt-1">{fieldState.error.message}</p>}
                </>
              )}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                maxLength: { value: 255, message: "Email cannot exceed 255 characters" },
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" }
              }}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    type="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {fieldState.error && <p className="text-red-500 text-xs italic mt-1">{fieldState.error.message}</p>}
                </>
              )}
            />
          </div>
          <div className="relative">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="mobile">
              Mobile <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-600">+91</span>
              <Controller
                name="mobile"
                control={control}
                rules={{
                  required: "Mobile Number is required",
                  maxLength: { value: 10, message: "Mobile Number must be 10 digits" },
                  pattern: { value: /^[0-9]{10}$/, message: "Invalid Mobile Number format" }
                }}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {fieldState.error && <p className="text-red-500 text-xs italic mt-1">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">Addresses</h2>
        {fields.map((address, index) => (
          <div key={address.id} className="mb-6 p-4 border rounded shadow-sm bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`addresses[${index}].addressLine1`}>
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <Controller
                  name={`addresses[${index}].addressLine1`}
                  control={control}
                  rules={{ required: "Address Line 1 is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <input
                        {...field}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      {fieldState.error && <p className="text-red-500 text-xs italic mt-1">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`addresses[${index}].addressLine2`}>
                  Address Line 2
                </label>
                <Controller
                  name={`addresses[${index}].addressLine2`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  )}
                />
              </div>
              <div className="relative">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`addresses[${index}].postcode`}>
                  Postcode <span className="text-red-500">*</span>
                </label>
                <Controller
                  name={`addresses[${index}].postcode`}
                  control={control}
                  rules={{
                    required: "Postcode is required",
                    maxLength: { value: 6, message: "Postcode must be 6 digits" },
                    pattern: { value: /^[0-9]{6}$/, message: "Invalid Postcode format" }
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handlePostcodeLookup(e.target.value, index);
                        }}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      {isLoadingPostcode && (
                        <div className="absolute right-2 top-10">
                          <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                        </div>
                      )}
                      {fieldState.error && <p className="text-red-500 text-xs italic mt-1">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`addresses[${index}].city`}>
                  City <span className="text-red-500">*</span>
                </label>
                <Controller
                  name={`addresses[${index}].city`}
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="">Select City</option>
                      {postcodeDetails.city.map((city) => (
                        <option key={city.code} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`addresses[${index}].state`}>
                  State <span className="text-red-500">*</span>
                </label>
                <Controller
                  name={`addresses[${index}].state`}
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="">Select State</option>
                      {postcodeDetails.state.map((state) => (
                        <option key={state.code} value={state.name}>{state.name}</option>
                      ))}
                    </select>
                  )}
                />
              </div>
            </div>
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(index)} className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                Remove Address
              </button>
            )}
          </div>
        ))}

        {fields.length < MAX_ADDRESSES && (
          <button
            type="button"
            onClick={() => append({ addressLine1: '', addressLine2: '', postcode: '', city: '', state: '' })}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Another Address
          </button>
        )}

        <div className="mt-8 flex justify-end">
          <button type="submit" className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600">
            {existingCustomer ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
