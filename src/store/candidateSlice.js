/**
 * Candidate Slice
 * Redux state management for candidate profile and information.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { candidateService } from '../services/candidateService';

export const fetchCandidate = createAsyncThunk('candidate/fetch', async () => {
  return await candidateService.getCandidate();
});
export const fetchCandidateProfile = fetchCandidate;

export const updateCandidateProfile = createAsyncThunk('candidate/update', async (data) => {
  return await candidateService.updateCandidate(data);
});
export const updateProfile = updateCandidateProfile;

export const saveExtractedResumeProfile = createAsyncThunk('candidate/saveExtracted', async (extractedData) => {
  return await candidateService.saveExtractedProfile(extractedData);
});

export const resetCandidateProfile = createAsyncThunk('candidate/reset', async () => {
  return await candidateService.resetCandidate();
});

const candidateSlice = createSlice({
  name: 'candidate',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCandidateProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(saveExtractedResumeProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(resetCandidateProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default candidateSlice.reducer;
