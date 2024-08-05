"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserBookings } from '../redux/auth/authbookingsSlice';
import { fetchAuthUsers } from '../redux/auth/authusersslice';
import { RootState, AppDispatch } from '../redux/store';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import UpcomingTabContent from '../components/tablists/UpcomingTabContent';
import PastTabContent from '../components/tablists/PastTabContent';
import { Button } from '../components/ui/button';
import CreateBookingModal from '../components/createbookingmodal';
import RescheduleBookingModal from '../components/reschedulebookingmodal';
import { UserNav } from '../components/user-nav';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const bookingsState = useSelector((state: RootState) => state.authBooking);
  const usersState = useSelector((state: RootState) => state.authUser);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleBookingId, setRescheduleBookingId] = useState<number | null>(null);

  useEffect(() => {
    if (auth.token) {
      dispatch(fetchAuthUsers());
      dispatch(fetchUserBookings(auth.token));
    } else {
      navigate('/login');
    }
  }, [auth.token, dispatch, navigate]);

  useEffect(() => {
    console.log('Bookings State:', bookingsState);
    console.log('Users State:', usersState);
  }, [bookingsState, usersState]);

  const handleCreateBooking = () => setIsCreateModalOpen(true);

  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleOpenRescheduleModal = (bookingId: number) => {
    if (auth.token) {
      dispatch(fetchUserBookings(auth.token));
    }
    setRescheduleBookingId(bookingId);
    setIsRescheduleModalOpen(true);
  };

  const handleCloseRescheduleModal = () => {
    setIsRescheduleModalOpen(false);
    setRescheduleBookingId(null);
  };
 
  const isFutureBooking = (dateTime: string) => new Date(dateTime) > new Date();
  const isPastBooking = (dateTime: string) => new Date(dateTime) < new Date();

  const upcomingBookings = bookingsState.bookings.filter(booking => isFutureBooking(booking.date_time));
  const pastBookings = bookingsState.bookings.filter(booking => isPastBooking(booking.date_time));

  return (
    <div className="flex flex-col sm:flex-row min-h-screen ">
      <div className="flex-1 p-4 min-h-screen">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex justify-between items-center space-x-4">
              <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleCreateBooking}
                  className="bg-gray-200 text-black hover:bg-gray-300  ml-10 "
                >
                  + Create Booking
                </Button>
                <UserNav />
              </div>
            </div>
            <p className="text-md text-muted-foreground mt-1">See your scheduled events from your calendar events links.</p>
            <Tabs defaultValue="upcoming">
              <TabsList  className="w-45"  >
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="pending" className="hover:bg-gray-200">Pending</TabsTrigger>
                <TabsTrigger value="recurring" className="hover:bg-gray-200">Recurring</TabsTrigger>
                <TabsTrigger value="past" className="hover:bg-gray-200">Past</TabsTrigger>
                <TabsTrigger value="cancelled" className="hover:bg-gray-200">Cancelled</TabsTrigger>
              </TabsList>
              <UpcomingTabContent bookings={upcomingBookings} onReschedule={handleOpenRescheduleModal} />
              <PastTabContent bookings={pastBookings} onReschedule={handleOpenRescheduleModal} />
            </Tabs>
          </div>
        </div>
      </div>
      {isCreateModalOpen && <CreateBookingModal onClose={handleCloseCreateModal} />}
        {isRescheduleModalOpen && rescheduleBookingId !== null && (
          <RescheduleBookingModal bookingId={rescheduleBookingId} onClose={handleCloseRescheduleModal} />
        )}
    </div>
  );
};

export default Dashboard;
