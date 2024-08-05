import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchBookings as apiFetchBookings,
  createBooking as apiCreateBooking,
  deleteBooking as apiDeleteBooking,
  apiUpdateBooking,
} from "../../api/bookingsApi";

interface Participant {
  id: number;
  username: string;
  email: string;
}

interface Booking {
  id: number;
  summary: string;
  location: string;
  date_time: string;
  status: string;
  participants: Participant[];
}

interface AuthBookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthBookingState = {
  bookings: [],
  loading: false,
  error: null,
};

export const fetchUserBookings = createAsyncThunk(
  "authBooking/fetchBookings",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await apiFetchBookings(token);
      const bookings = response.data.map((item: any) => ({
        id: item.id,
        ...item.attributes,
        participants: item.attributes.participants.data.map((p: any) => ({
          id: p.id,
          ...p.attributes,
        })),
      }));
      return bookings;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createBooking = createAsyncThunk(
  "authBooking/createBooking",
  async (
    { token, bookingData }: { token: string; bookingData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiCreateBooking(token, bookingData);
      const booking = {
        id: response.data.id,
        ...response.data.attributes,
        participants: response.data.attributes.participants.data.map(
          (p: any) => ({
            id: p.id,
            ...p.attributes,
          })
        ),
      };
      return booking;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateBooking = createAsyncThunk(
  "authBooking/updateBooking",
  async (
    {
      token,
      bookingId,
      bookingData,
    }: { token: string; bookingId: number; bookingData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiUpdateBooking(token, bookingId, bookingData); // Implement `apiUpdateBooking` in your API
      const booking = {
        id: response.data.id,
        ...response.data.attributes,
        participants: response.data.attributes.participants.data.map(
          (p: any) => ({
            id: p.id,
            ...p.attributes,
          })
        ),
      };
      return booking;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "authBooking/deleteBooking",
  async (
    { token, bookingId }: { token: string; bookingId: number },
    { rejectWithValue }
  ) => {
    try {
      await apiDeleteBooking(token, bookingId);
      return bookingId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const authBookingSlice = createSlice({
  name: "authBooking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.bookings = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchUserBookings.rejected,
        (state, action: PayloadAction<any>) => {
          state.error = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        createBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.bookings.push(action.payload);
        }
      )
      .addCase(
        deleteBooking.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.bookings = state.bookings.filter(
            (booking) => booking.id !== action.payload
          );
        }
      )
      .addCase(
        updateBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          const index = state.bookings.findIndex(
            (booking) => booking.id === action.payload.id
          );
          if (index !== -1) {
            state.bookings[index] = action.payload;
          }
        }
      );
  },
});

export default authBookingSlice.reducer;
