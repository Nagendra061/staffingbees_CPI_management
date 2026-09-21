/**
 * Progress Slice
 * Redux state management for progress metrics, CPI history, and networking.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressService } from '../services/progressService';

export const fetchProgress = createAsyncThunk('progress/fetch', async () => {
  return await progressService.getProgress();
});
export const fetchProgressData = fetchProgress;

export const addNetworkingContact = createAsyncThunk(
  'progress/addContact',
  async (contactData) => {
    return await progressService.addNetworkingContact(contactData);
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addNetworkingContact.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default progressSlice.reducer;
