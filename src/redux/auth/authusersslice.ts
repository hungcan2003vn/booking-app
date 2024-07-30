// src/features/authUsers/authUsersSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUsers, updateUserThumbnail } from '../../api/userAPI';
import { uploadFile } from '../../api/uploadApi';
import { RootState } from '../store';

interface User {
  id: number;
  username: string;
  email: string;
  thumbnail: string | null;
}

interface AuthUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthUsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchAuthUsers = createAsyncThunk<User[], void, { state: RootState }>(
  'authUsers/fetchAuthUsers',
  async (_, { getState }) => {
    const state = getState();
    const token = state.auth.token;
    if (!token) {
      throw new Error('Token not available');
    }
    const users = await fetchUsers(token);
    return users.map((user: { id: number; username: string; email: string; thumbnail: string; }) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      thumbnailUrl: user.thumbnail,
    }));
  }
);

export const updateThumbnail = createAsyncThunk<User, { userId: number, file: File }, { state: RootState }>(
  'authUsers/updateThumbnail',
  async ({ userId, file }, { getState }) => {
    const state = getState();
    const token = state.auth.token;
    if (!token) {
      throw new Error('Token not available');
    }

    const uploadedFileData = await uploadFile({ file }, token);
    console.log('Uploaded File Data:', uploadedFileData); // Debugging statement

    const thumbnailId = uploadedFileData[0]?.id; // Adjust based on response structure
    console.log('Thumbnail ID:', thumbnailId); // Debugging statement

    const updatedUser = await updateUserThumbnail(userId, thumbnailId, token);
    console.log('Updated User:', updatedUser); // Debugging statement
    return updatedUser;
  }
);

const authUsersSlice = createSlice({
  name: 'authUsers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchAuthUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(updateThumbnail.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        console.log('Updated Users State:', state.users); // Debugging statement
      });
  },
});

export default authUsersSlice.reducer;
