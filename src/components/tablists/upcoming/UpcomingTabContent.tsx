import React, { useState } from 'react';
import { TabsContent } from '../../ui/tabs';
import { Card, CardContent, CardDescription } from '../../ui/card';
import { Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../ui/button';
import EditDropdown from './editdropdown';
import avatar from '../../ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const { Avatar } = avatar;

interface Participant {
  id: number;
  username: string;
}

interface Booking {
  id: number;
  summary: string;
  location: string;
  date_time: string;
  status: string;
  participants: Participant[] | { data: Participant[] }; // Adjusted type
}

interface GroupedBooking extends Booking {
  month: string;
  dayOfWeek: string;
  day: string;
  time: string;
}

interface UpcomingTabContentProps {
  bookings: Booking[];
}

const formatDate = (dateTime: string) => {
  const date = new Date(dateTime); // Assuming dateTime is in UTC
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Convert UTC to local

  const startTime = localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const endDate = new Date(localDate.getTime() + 30 * 60 * 1000); // Add 30 minutes
  const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return {
    month: localDate.toLocaleString('default', { month: 'long' }),
    dayOfWeek: localDate.toLocaleString('default', { weekday: 'short' }),
    day: localDate.getDate().toString(),
    time: `${startTime} - ${endTime}`, // Format as "06:00 - 06:30"
  };
};

const UpcomingTabContent: React.FC<UpcomingTabContentProps> = ({ bookings = [] }) => {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token); // Retrieve token from Redux state

  const handleEditClick = (uniqueId: string) => {
    setShowDropdown(showDropdown === uniqueId ? null : uniqueId);
  };

  const normalizeParticipants = (participants: Participant[] | { data: Participant[] }): Participant[] => {
    return Array.isArray(participants) ? participants : participants.data || [];
  };

  const groupedBookings = bookings.reduce((acc, booking) => {
    const participants = normalizeParticipants(booking.participants);
    const { month, dayOfWeek, day, time } = formatDate(booking.date_time);
    if (!acc[month]) acc[month] = [];
    acc[month].push({ ...booking, month, dayOfWeek, day, time, participants });
    return acc;
  }, {} as Record<string, GroupedBooking[]>);
  
  console.log('Grouped Bookings:', groupedBookings);

  return (
    <TabsContent value="upcoming" className="space-y-6">
      {Object.keys(groupedBookings).length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        Object.entries(groupedBookings).map(([month, bookings], monthIndex) => {
          if (!bookings) return null; // Safeguard against undefined bookings array
  
          return (
            <div key={monthIndex}>
              <h3 className="text-xl font-bold mb-2 py-2 rounded">{month}</h3>
              {bookings.map((booking, index) => {
                const uniqueId = `booking-${monthIndex}-${index}`;
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
                          bookingId={booking.id} // Pass the actual booking ID here
                          token={token} // Pass the token here
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

export default UpcomingTabContent;
