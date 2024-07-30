"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserBookings } from '../redux/auth/authbookingsSlice';
import { fetchAuthUsers } from '../redux/auth/authusersslice'; 
import { RootState, AppDispatch } from '../redux/store';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import UpcomingTabContent from '../components/tablists/upcoming/UpcomingTabContent';
import { Button } from '../components/ui/button';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const bookingsState = useSelector((state: RootState) => state.authBooking);
  const usersState = useSelector((state: RootState) => state.authUser); // Selector for users state

  useEffect(() => {
    if (auth.token) {
      dispatch(fetchAuthUsers()); // Fetch users and store them in Redux
      dispatch(fetchUserBookings(auth.token)); // Fetch user bookings
    } else {
      navigate('/login'); // Redirect to login if token is not available
    }
  }, [auth.token, dispatch, navigate]);

  useEffect(() => {
    console.log('Bookings State:', bookingsState); // Log bookings state for debugging
    console.log('Users State:', usersState); // Log users state for debugging
  }, [bookingsState, usersState]);

  const handleCreateBooking = () => {
    navigate('/create-booking'); // Navigate to create booking page
  };

  return (
    <div className="dashboard-container mt-4">
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6 space-y-9">
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold tracking-tight">Bookings</h2>
              <Button onClick={handleCreateBooking} className="bg-gray-200 text-black hover:bg-gray-300">
                Create Booking
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">See your scheduled events from your calendar events links.</p>
          </div>
          <Tabs defaultValue="upcoming" className="space-y-9">
            <TabsList>
              <TabsTrigger value="upcoming" className="hover:bg-black-200">Upcoming</TabsTrigger>
              <TabsTrigger value="pending" className="hover:bg-black-200">Pending</TabsTrigger>
              <TabsTrigger value="recurring" className="hover:bg-black-200">Recurring</TabsTrigger>
              <TabsTrigger value="past" className="hover:bg-black-200">Past</TabsTrigger>
              <TabsTrigger value="cancelled" className="hover:bg-black-200">Cancelled</TabsTrigger>
            </TabsList>
            {bookingsState.loading ? (
              <p>Loading...</p>
            ) : bookingsState.error ? (
              <p>Error: {bookingsState.error}</p>
            ) : (
              <UpcomingTabContent bookings={bookingsState.bookings || []} />
            )}
            {/* Repeat for other TabsContent sections */}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
