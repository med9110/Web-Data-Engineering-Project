import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; // Import Navbar component

interface Property {
  id: string;
  name: string;
  location: string;
  type: string;
  price: number;
  status: 'available' | 'occupied' | 'maintenance';
}

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', type: '', price: 0 });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://127.0.0.1:8000/api/properties', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://127.0.0.1:8000/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add property');
      }

      const newProperty = await response.json();
      setProperties((prev) => [...prev, newProperty]);
      setIsAddDialogOpen(false);
      setFormData({
        name: '',
        location: '',
        type: '',
        price: 0,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://127.0.0.1:8000/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      setProperties((prev) => prev.filter((property) => property.id !== propertyId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Include Navbar here */}
      <Navbar setIsAuthenticated={() => {}} isAuthenticated={true} userRole="Owner" />

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Properties</h1>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Property
          </button>
        </div>

        {isAddDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-semibold text-center mb-6">Add New Property</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Property Name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    placeholder="Type"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price per Night"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mt-6 flex justify-between">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700">{property.name}</h2>
              <p className="text-lg text-gray-600">{property.location}</p>
              <p className="text-lg text-gray-600">{property.type}</p>
              <p className="text-lg text-gray-600">${property.price.toFixed(2)} per night</p>
              <span
                className={`py-1 px-4 rounded-lg ${
                  property.status === 'available'
                    ? 'bg-green-100 text-green-600'
                    : property.status === 'occupied'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
              </span>
              <button
                onClick={() => handleDeleteProperty(property.id)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete Property
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Properties;
