import React, { useState } from 'react';
import { TabsContent } from '../ui/tabs';
import { Card, CardContent, CardDescription } from '../ui/card';
import { Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import EditDropdown from '../editdropdown';
import avatar from '../ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const { Avatar } = avatar;

export interface Participant {
  id: number;
  username: string;
  email: string;
}

export interface Booking {
  id: number;
  date_time: string;
  location: string;
  summary: string;
  participants: Participant[] | { data: Participant[] };
}

export interface GroupedBooking {
  id: number;
  date_time: string;
  location: string;
  summary: string;
  participants: Participant[];
  month: string;
  dayOfWeek: string;
  day: string;
  time: string;
}

interface PastTabContentProps {
  bookings: Booking[];
  onReschedule: (bookingId: number) => void;
}

const PastTabContent: React.FC<PastTabContentProps> = ({ bookings = [], onReschedule }) => {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleEditClick = (uniqueId: string) => {
    setShowDropdown(showDropdown === uniqueId ? null : uniqueId);
  };

  const normalizeParticipants = (participants: Participant[] | { data: Participant[] }): Participant[] => {
    return Array.isArray(participants) ? participants : participants.data || [];
  };

  const formatDate = (dateTime: string) => {
    const date = new Date(dateTime);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    const startTime = localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const endDate = new Date(localDate.getTime() + 30 * 60 * 1000); // Assume each booking is 30 minutes
    const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    return {
      month: localDate.toLocaleString('default', { month: 'long' }),
      dayOfWeek: localDate.toLocaleString('default', { weekday: 'short' }),
      day: localDate.getDate().toString(),
      time: `${startTime} - ${endTime}`,
    };
  };

  const groupedBookings = bookings.reduce((acc, booking) => {
    const participants = normalizeParticipants(booking.participants);
    const { month, dayOfWeek, day, time } = formatDate(booking.date_time);
    if (!acc[month]) acc[month] = [];
    acc[month].push({ ...booking, month, dayOfWeek, day, time, participants });
    return acc;
  }, {} as Record<string, GroupedBooking[]>);

  // Sort months and bookings within each month
  const sortedMonths = Object.keys(groupedBookings).sort((a, b) => {
    const dateA = new Date(`${a} 1, 2024`);
    const dateB = new Date(`${b} 1, 2024`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <TabsContent value="past" className="space-y-6">
      {sortedMonths.length === 0 ? (
        <p>No past bookings.</p>
      ) : (
        sortedMonths.map((month, monthIndex) => {
          const sortedBookings = groupedBookings[month].sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime());

          return (
            <div key={monthIndex}>
              <h3 className="text-xl font-bold mb-2 py-2 rounded">{month}</h3>
              {sortedBookings.map((booking, index) => {
                const uniqueId = `past-${monthIndex}-${index}`;
                return (
                  <Card key={index} className="flex flex-row justify-between items-center p-4 space-x-4 rounded-lg shadow-sm mb-2 pb-0 pt-0">
                    <div className="flex items-center ml-3">
                      <div className="flex flex-col items-center border-r border-gray-300 pr-6 mr-3">
                        <span className="text-sm font-semibold">{booking.dayOfWeek}</span>
                        <span className="text-3xl">{booking.day}</span>
                      </div>
                      <CardDescription className="ml-3 mr-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.location}</span>
                        </div>
                      </CardDescription>
                      <CardContent className="flex-1 items-center justify-center ml-5">
                        <div className="text-center pt-6">
                          <span>{booking.summary}</span>
                          <div className="mt-3 flex space-x-2">
                            {normalizeParticipants(booking.participants).map((participant, idx) => (
                              <Avatar key={idx} name={participant.username || 'Guest'} />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </div>
                    <div className="relative">
                      <Button
                        onClick={() => handleEditClick(uniqueId)}
                        className={`flex items-center ${showDropdown === uniqueId ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
                      >
                        Edit {showDropdown === uniqueId ? <ChevronDown className="ml-2" /> : <ChevronUp className="ml-2" />}
                      </Button>
                      {showDropdown === uniqueId && (
                        <EditDropdown
                          onClose={() => setShowDropdown(null)}
                          bookingId={booking.id}
                          token={token}
                          onReschedule={onReschedule}
                        />
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          );
        })
      )}
    </TabsContent>
  );
};

export default PastTabContent;
