/**
 * Interviews Slice
 * Redux state management for Interviews schedule, rounds, and prep checklist.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { interviewsService } from '../services/interviewsService';

export const fetchInterviews = createAsyncThunk('interviews/fetch', async () => {
  return await interviewsService.getInterviews();
});

export const addInterview = createAsyncThunk('interviews/add', async (data) => {
  return await interviewsService.addInterview(data);
});

export const updateInterview = createAsyncThunk(
  'interviews/update',
  async ({ id, data }) => {
    return await interviewsService.updateInterview(id, data);
  }
);

export const deleteInterview = createAsyncThunk('interviews/delete', async (id) => {
  return await interviewsService.deleteInterview(id);
});

export const togglePrepChecklist = createAsyncThunk(
  'interviews/togglePrep',
  async ({ interviewId, checkId, itemId }) => {
    return await interviewsService.togglePrepChecklist(interviewId, checkId || itemId);
  }
);
export const toggleInterviewChecklistItem = togglePrepChecklist;

const interviewsSlice = createSlice({
  name: 'interviews',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addInterview.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateInterview.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(deleteInterview.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(togglePrepChecklist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default interviewsSlice.reducer;
