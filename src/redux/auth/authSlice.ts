import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginApi } from "../../api/loginApi";
import { loginRequest, loginSuccess, loginFailure } from "./authActions";

interface Users {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: Users | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const userLoginFetch = createAsyncThunk(
  "auth/login",
  async (userData: { identifier: string; password: string }, { dispatch }) => {
    const { identifier, password } = userData;
    dispatch(loginRequest());
    try {
      const response = await loginApi(identifier, password);
      if (response) {
        const userdata = response;
        dispatch(loginSuccess({ user: userdata.user, token: userdata.jwt }));
        return userdata.user;
      } else {
        const errorMessage = "An unexpected error occurred";
        dispatch(loginFailure(errorMessage));
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = "An error occurred during login";
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginRequest, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginSuccess, (state, action: PayloadAction<{ user: Users, token: string }>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(loginFailure, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
