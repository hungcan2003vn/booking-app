import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';

interface Participant {
  id: number;
  username: string;
  email: string;
}

interface SelectParticipantsModalProps {
  onClose: () => void;
  onSave: (selectedParticipants: Participant[]) => void;
  selectedParticipants: Participant[];
}

const SelectParticipantsModal: React.FC<SelectParticipantsModalProps> = ({
  onClose,
  onSave,
  selectedParticipants,
}) => {
  const { users, loading } = useSelector((state: RootState) => state.authUser);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selected, setSelected] = useState<Participant[]>(selectedParticipants);

  useEffect(() => {
    if (!loading && users.length > 0) {
      setParticipants(users);
    }
  }, [loading, users]);

  const handleToggleParticipant = (participant: Participant, checked: boolean) => {
    setSelected(selected =>
      checked
        ? [...selected, participant]
        : selected.filter(p => p.id !== participant.id)
    );
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="modal-container p-4 bg-white rounded-lg shadow-md max-w-lg w-full">
        <div className="modal-content">
          <h2 className="text-xl font-semibold mb-4">Select Participants</h2>
          <ul className="space-y-2 mb-4">
            {participants.map(participant => (
              <li key={participant.id} className="flex items-center">
                <Checkbox
                  checked={selected.some(p => p.id === participant.id)}
                  onCheckedChange={(checked) => handleToggleParticipant(participant, !!checked)}
                  className="mr-2"
                />
                <span>{participant.username}</span>
              </li>
            ))}
          </ul>
          <div className="modal-actions flex justify-end space-x-2">
            <Button onClick={onClose} className="bg-gray-200 text-black hover:bg-gray-300">Cancel</Button>
            <Button onClick={handleSave} className="bg-gray-200 text-black hover:bg-gray-300">Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectParticipantsModal;
