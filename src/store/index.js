/**
 * Redux Store Configuration
 * Combines all candidate, assessment, goals, plans, experts,
 * services, applications, interviews, progress, and program slices.
 */
import { configureStore } from '@reduxjs/toolkit';
import candidateReducer from './candidateSlice';
import cpiReducer from './cpiSlice';
import goalsReducer from './goalsSlice';
import plansReducer from './plansSlice';
import expertsReducer from './expertsSlice';
import servicesReducer from './servicesSlice';
import applicationsReducer from './applicationsSlice';
import interviewsReducer from './interviewsSlice';
import progressReducer from './progressSlice';
import programReducer from './programSlice';

export const store = configureStore({
  reducer: {
    candidate: candidateReducer,
    cpi: cpiReducer,
    goals: goalsReducer,
    plans: plansReducer,
    experts: expertsReducer,
    services: servicesReducer,
    applications: applicationsReducer,
    interviews: interviewsReducer,
    progress: progressReducer,
    program: programReducer,
  },
});
