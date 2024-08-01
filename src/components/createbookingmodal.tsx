import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../redux/auth/authbookingsSlice';
import { RootState, AppDispatch } from '../redux/store';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import SelectParticipantsModal from '../components/selectussers';
import { fetchAuthUsers } from '../redux/auth/authusersslice';

interface Participant {
  id: number;
  username: string;
  email: string;
}

interface CreateBookingModalProps {
  onClose: () => void;
}

const CreateBookingModal: React.FC<CreateBookingModalProps> = ({ onClose }) => {
  const [summary, setSummary] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchAuthUsers());
  }, [dispatch]);

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
          participants: participants.map(p => p.id),
        },
      };
      await dispatch(createBooking({ token: auth.token, bookingData }));
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6">Create Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="summary" className="block text-sm font-medium text-gray-700">
              Summary
            </Label>
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
            <Label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </Label>
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
            <Label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">
              Date and Time
            </Label>
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
              Request Booking
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

export default CreateBookingModal;
