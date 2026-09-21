/**
 * Program Slice
 * Redux state management for Job Guarantee eligibility verification,
 * Career Access Scholarship status, and modular payment selection.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { programService } from '../services/programService';

export const fetchProgramData = createAsyncThunk('program/fetch', async () => {
  return await programService.getProgramData();
});
export const fetchProgramEligibility = fetchProgramData;

export const selectPaymentPlan = createAsyncThunk('program/selectPlan', async (planId) => {
  return await programService.selectPaymentPlan(planId);
});

export const toggleProgramCondition = createAsyncThunk(
  'program/toggleCondition',
  async (conditionId) => {
    return await programService.toggleCondition(conditionId);
  }
);

const programSlice = createSlice({
  name: 'program',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgramData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgramData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProgramData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(selectPaymentPlan.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(toggleProgramCondition.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default programSlice.reducer;
