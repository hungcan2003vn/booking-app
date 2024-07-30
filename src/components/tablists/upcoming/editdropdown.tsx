import React from 'react';
import { Clock, Edit3, MapPin, Users, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { deleteBooking } from '../../../redux/auth/authbookingsSlice';

interface EditDropdownProps {
  onClose: () => void;
  bookingId: number;
  token: string | null; 
}

const EditDropdown: React.FC<EditDropdownProps> = ({ onClose, bookingId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);

  const handleReschedule = () => {
    navigate(`/bookings/${bookingId}/reschedule`);
    onClose();
  };

  const handleCancelEvent = async () => {
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      await dispatch(deleteBooking({ token, bookingId })).unwrap();
      // Optionally, you might want to handle navigation or state updates after deletion
      navigate('/dashboard'); // Redirect to dashboard after successful deletion
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
      <div className="py-1">
        <button onClick={handleReschedule} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
          <Clock className="w-4 h-4 mr-2" /> Reschedule booking
        </button>
        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
          <Edit3 className="w-4 h-4 mr-2" /> Request reschedule
        </button>
        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
          <MapPin className="w-4 h-4 mr-2" /> Edit location
        </button>
        <button  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
          <Users className="w-4 h-4 mr-2" /> Invite people
        </button>
        <button onClick={handleCancelEvent} className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 w-full text-left">
          <XCircle className="w-4 h-4 mr-2" /> Cancel event
        </button>
      </div>
    </div>
  );
};

export default EditDropdown;
