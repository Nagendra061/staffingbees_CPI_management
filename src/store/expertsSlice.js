/**
 * Experts Slice
 * Redux state management for Expert Matching and Alignment workflow.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { expertsService } from '../services/expertsService';

export const fetchExperts = createAsyncThunk('experts/fetch', async () => {
  return await expertsService.getExperts();
});

export const requestExpertAlignment = createAsyncThunk(
  'experts/requestAlignment',
  async ({ expertId, notes }) => {
    return await expertsService.requestAlignment(expertId, notes);
  }
);

export const updateExpertAlignmentStatus = createAsyncThunk(
  'experts/updateStatus',
  async ({ expertId, status, extraData }) => {
    return await expertsService.updateExpertStatus(expertId, status, extraData);
  }
);

const expertsSlice = createSlice({
  name: 'experts',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExperts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(requestExpertAlignment.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateExpertAlignmentStatus.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default expertsSlice.reducer;
