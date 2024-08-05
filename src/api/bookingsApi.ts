import axios from 'axios';

const API_BASE_URL = 'https://jellyfish-app-43090-zm6h3.ondigitalocean.app';

export const fetchBookings = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/bookings?populate=*`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchBookingDetails = async (token: string, bookingId: number) => {
  const response = await axios.get(`${API_BASE_URL}/api/bookings/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createBooking = async (token: string, bookingData: any) => {
  const response = await axios.post(`${API_BASE_URL}/api/bookings?populate=*`, bookingData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteBooking = async (token: string, bookingId: number) => {
  await axios.delete(`${API_BASE_URL}/api/bookings/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const apiUpdateBooking = async (token: string, bookingId: number, bookingData: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/bookings/${bookingId}`,
    bookingData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};
