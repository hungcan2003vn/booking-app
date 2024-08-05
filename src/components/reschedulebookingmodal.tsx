import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchBookingDetails } from '../api/bookingsApi';
import { Button } from '../components/ui/button';
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { updateBooking, fetchUserBookings } from '../redux/auth/authbookingsSlice';
import SelectParticipantsModal from '../components/selectussers';

interface Participant {
  id: number;
  username: string;
  email: string;
}

interface RescheduleBookingModalProps {
  bookingId: number;
  onClose: () => void;
}

const RescheduleBookingModal: React.FC<RescheduleBookingModalProps> = ({ bookingId, onClose }) => {
  const [summary, setSummary] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchBooking = async () => {
      if (auth.token) {
        const booking = await fetchBookingDetails(auth.token, bookingId);
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
    if (auth.token) {
      const localDateTime = new Date(dateTime);
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
      await dispatch(updateBooking({ token: auth.token, bookingId, bookingData }));
      await dispatch(fetchUserBookings(auth.token)); // Fetch updated bookings
      onClose();
    }
  };

  const handleOpenParticipantModal = () => setIsModalOpen(true);
  const handleCloseParticipantModal = () => setIsModalOpen(false);

  const handleSaveParticipants = (selectedParticipants: Participant[]) => {
    setParticipants(selectedParticipants);
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
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
            <div className="flex items-center justify-between">
              <Label className="block text-sm font-medium text-gray-700">Users</Label>
              <Button type="button" onClick={handleOpenParticipantModal} className="bg-gray-200 text-black hover:bg-gray-300 ml-4">
                Add User
              </Button>
            </div>
            <div className="flex flex-wrap space-x-2 mb-4">
              {participants.map((participant) => (
                <span key={participant.id} className="border p-2 rounded-md">
                  {participant.username}
                </span>
              ))}
            </div>
            {isModalOpen && (
              <SelectParticipantsModal
                onClose={handleCloseParticipantModal}
                onSave={handleSaveParticipants}
                selectedParticipants={participants}
              />
            )}
          </div>
          <div className="flex justify-between">
            <Button type="submit" className="bg-gray-200 text-black hover:bg-gray-300">
              Update Booking
            </Button>
            <Button type="button" onClick={onClose} className="bg-gray-200 text-black hover:bg-gray-300">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleBookingModal;