import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/store';
import { fetchBookingDetails } from '../api/bookingsApi';
import { Button } from '../components/ui/button';
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { updateBooking } from '../redux/auth/authbookingsSlice';
import SelectParticipantsModal from '../components/selectussers';  // Import the modal component

interface Participant {
  id: number;
  username: string;
  email: string;
}

const RescheduleBooking: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [summary, setSummary] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchBooking = async () => {
      if (auth.token && bookingId) {
        const booking = await fetchBookingDetails(auth.token, parseInt(bookingId));
        setSummary(booking.data.attributes.summary);
        setLocation(booking.data.attributes.location);

        // Convert the UTC time to local time for display
        const utcDateTime = new Date(booking.data.attributes.date_time);
        const localDateTime = new Date(utcDateTime.getTime() - utcDateTime.getTimezoneOffset() * 120000);
        setDateTime(localDateTime.toISOString().substring(0, 16));
      }
    };
    fetchBooking();
  }, [auth.token, bookingId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (auth.token && bookingId) {
      const localDateTime = new Date(dateTime);
      // Convert local time to UTC for storage
      const utcDateTime = new Date(localDateTime.getTime() + localDateTime.getTimezoneOffset() * 60000);
      const bookingData = {
        data: {
          summary,
          location,
          date_time: utcDateTime.toISOString(),
          status: 'pending',
          participants: participants.map(p => p.id)
        },
      };
      await dispatch(updateBooking({ token: auth.token, bookingId: parseInt(bookingId), bookingData }));
      navigate('/dashboard');
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveParticipants = (selectedParticipants: Participant[]) => {
    setParticipants(selectedParticipants);
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6">Reschedule Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary</Label>
            <Input
              type="text"
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</Label>
            <Input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">Date and Time</Label>
            <Input
              type="datetime-local"
              id="dateTime"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="block text-sm font-medium text-gray-700">Users</Label>
            <div className="flex flex-wrap space-x-2 mb-4">
              {participants.map((participant) => (
                <span key={participant.id} className="border p-2 rounded-md">
                  {participant.username}
                </span>
              ))}
            </div>
            {isModalOpen && (
              <SelectParticipantsModal
                onClose={handleCloseModal}
                onSave={handleSaveParticipants}
                selectedParticipants={participants}
              />
            )}
            <Button type="button" onClick={handleOpenModal} className="bg-gray-200 text-black hover:bg-gray-300">
              Add User
            </Button>
          </div>
          <Button type="submit" className="bg-gray-200 text-black hover:bg-gray-200">
            Update Booking
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RescheduleBooking;
