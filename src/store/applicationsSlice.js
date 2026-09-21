/**
 * Applications Slice
 * Redux state management for Job Applications CRUD tracking.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationsService } from '../services/applicationsService';

export const fetchApplications = createAsyncThunk('applications/fetch', async () => {
  return await applicationsService.getApplications();
});

export const addApplication = createAsyncThunk('applications/add', async (appData) => {
  return await applicationsService.addApplication(appData);
});

export const updateApplication = createAsyncThunk(
  'applications/update',
  async ({ id, data }) => {
    return await applicationsService.updateApplication(id, data);
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status }) => {
    return await applicationsService.updateApplication(id, { status });
  }
);

export const deleteApplication = createAsyncThunk('applications/delete', async (id) => {
  return await applicationsService.deleteApplication(id);
});

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addApplication.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default applicationsSlice.reducer;
