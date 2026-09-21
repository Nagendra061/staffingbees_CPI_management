/**
 * CPI Slice
 * Redux state management for Candidate Performance Index,
 * 14 dimensions, assessment questions, and development roadmaps.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cpiService } from '../services/cpiService';

export const fetchCpi = createAsyncThunk('cpi/fetch', async () => {
  const [cpi, questions] = await Promise.all([
    cpiService.getCpi(),
    cpiService.getQuestions(),
  ]);
  return { cpi, questions };
});
export const fetchCpiData = fetchCpi;

export const submitCpiAssessment = createAsyncThunk('cpi/submitAssessment', async (answersMap) => {
  return await cpiService.submitAssessment(answersMap);
});

export const updateCpiRoadmap = createAsyncThunk(
  'cpi/updateRoadmap',
  async ({ roadmapId, updateData }) => {
    return await cpiService.updateRoadmapItem(roadmapId, updateData);
  }
);

const cpiSlice = createSlice({
  name: 'cpi',
  initialState: {
    data: null,
    questions: [],
    loading: false,
    error: null,
    assessmentSubmitting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCpi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCpi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.cpi;
        state.questions = action.payload.questions;
      })
      .addCase(fetchCpi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(submitCpiAssessment.pending, (state) => {
        state.assessmentSubmitting = true;
      })
      .addCase(submitCpiAssessment.fulfilled, (state, action) => {
        state.assessmentSubmitting = false;
        state.data = action.payload;
      })
      .addCase(submitCpiAssessment.rejected, (state, action) => {
        state.assessmentSubmitting = false;
        state.error = action.error.message;
      })
      .addCase(updateCpiRoadmap.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default cpiSlice.reducer;
