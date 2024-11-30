import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; // Import Navbar component
import { format } from 'date-fns';
import { Calendar, MapPin, User } from 'lucide-react';

interface Reservation {
  id: string;
  guestName: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  location: string;
}

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://127.0.0.1:8000/api/reservations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }

      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reservationId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://127.0.0.1:8000/api/reservations/${reservationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reservation status');
      }

      const updatedReservation = await response.json();
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === updatedReservation.id ? updatedReservation : reservation
        )
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-600'; // Green color for confirmed
      case 'cancelled':
        return 'bg-red-100 text-red-600'; // Red color for cancelled
      default:
        return 'bg-yellow-100 text-yellow-600'; // Yellow for pending
    }
  };

  const filteredReservations = reservations.filter(
    (reservation) => filter === 'all' || reservation.status === filter
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Include Navbar here */}
      <Navbar setIsAuthenticated={() => {}} isAuthenticated={true} userRole="Owner" />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold text-gray-800">My Reservations</h1>
          <div className="flex justify-center space-x-6">
            <button
              onClick={() => setFilter('all')}
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Cancelled
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col space-y-4"
              >
                <div className="flex items-center space-x-4">
                  <User size={24} />
                  <h2 className="text-xl font-semibold text-gray-700">{reservation.guestName}</h2>
                </div>
                <div className="text-lg text-gray-600">{reservation.propertyName}</div>
                <div className="flex items-center space-x-2">
                  <MapPin size={20} />
                  <p className="text-gray-600">{reservation.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={20} />
                  <p className="text-gray-600">
                    {format(new Date(reservation.checkIn), 'MMM dd, yyyy')} -{' '}
                    {format(new Date(reservation.checkOut), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold">{`$${reservation.totalAmount.toFixed(2)}`}</p>
                  <span className={`py-1 px-4 rounded-lg ${getStatusColor(reservation.status)}`}>
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </span>
                </div>
                <div className="flex space-x-4 mt-4">
                  {reservation.status === 'pending' && (
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                    >
                      Confirm
                    </button>
                  )}
                  {reservation.status === 'pending' && (
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;
