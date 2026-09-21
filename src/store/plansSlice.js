/**
 * Plans Slice
 * Redux state management for SMART Career Plan weekly tasks & tracking.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { plansService } from '../services/plansService';

export const fetchPlans = createAsyncThunk('plans/fetch', async () => {
  return await plansService.getPlans();
});
export const fetchPlanTasks = fetchPlans;

export const addPlanTask = createAsyncThunk('plans/addTask', async (taskData) => {
  return await plansService.addPlanTask(taskData);
});

export const updatePlanTask = createAsyncThunk('plans/updateTask', async ({ id, data }) => {
  return await plansService.updatePlanTask(id, data);
});

export const deletePlanTask = createAsyncThunk('plans/deleteTask', async (id) => {
  return await plansService.deletePlanTask(id);
});

export const toggleTaskComplete = createAsyncThunk('plans/toggleComplete', async (id) => {
  return await plansService.toggleTaskComplete(id);
});

const plansSlice = createSlice({
  name: 'plans',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPlanTask.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updatePlanTask.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(deletePlanTask.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default plansSlice.reducer;
