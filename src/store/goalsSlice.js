/**
 * Goals Slice
 * Redux state management for Career Goals CRUD.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { goalsService } from '../services/goalsService';

export const fetchGoals = createAsyncThunk('goals/fetch', async () => {
  return await goalsService.getGoals();
});

export const addGoal = createAsyncThunk('goals/add', async (goalData) => {
  return await goalsService.addGoal(goalData);
});

export const updateGoal = createAsyncThunk('goals/update', async ({ id, data }) => {
  return await goalsService.updateGoal(id, data);
});

export const deleteGoal = createAsyncThunk('goals/delete', async (id) => {
  return await goalsService.deleteGoal(id);
});

export const setPrimaryGoal = createAsyncThunk('goals/setPrimary', async (id) => {
  return await goalsService.setPrimary(id);
});

const goalsSlice = createSlice({
  name: 'goals',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(setPrimaryGoal.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default goalsSlice.reducer;
