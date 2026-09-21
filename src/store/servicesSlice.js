/**
 * Services Slice
 * Redux state management for 7 Staffing Bees Development Services.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { servicesService } from '../services/servicesService';

export const fetchServices = createAsyncThunk('services/fetch', async () => {
  return await servicesService.getServices();
});

export const updateService = createAsyncThunk('services/update', async ({ id, data }) => {
  return await servicesService.updateService(id, data);
});

export const toggleServiceStatus = createAsyncThunk(
  'services/toggleStatus',
  async ({ id, status }) => {
    return await servicesService.toggleServiceStatus(id, status);
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(toggleServiceStatus.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default servicesSlice.reducer;
