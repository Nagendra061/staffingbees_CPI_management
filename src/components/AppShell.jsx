/**
 * AppShell Component
 *
 * Core application shell managing top-level navigation, responsive mobile drawer,
 * candidate journey breadcrumbs, Redux data hydration, and dynamic module rendering.
 *
 * Used By:
 * App root.
 */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidateProfile } from '../store/candidateSlice';
import { fetchCpiData } from '../store/cpiSlice';
import { fetchGoals } from '../store/goalsSlice';
import { fetchPlanTasks } from '../store/plansSlice';
import { fetchExperts } from '../store/expertsSlice';
import { fetchServices } from '../store/servicesSlice';
import { fetchApplications } from '../store/applicationsSlice';
import { fetchInterviews } from '../store/interviewsSlice';
import { fetchProgressData } from '../store/progressSlice';
import { fetchProgramEligibility } from '../store/programSlice';

import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import JourneyBreadcrumb from './layout/JourneyBreadcrumb';

// Modules
import DashboardView from './modules/DashboardView';
import ProfileView from './modules/ProfileView';
import CpiView from './modules/CpiView';
import CareerGoalsView from './modules/CareerGoalsView';
import GapAnalysisView from './modules/GapAnalysisView';
import SmartPlanView from './modules/SmartPlanView';
import ExpertsView from './modules/ExpertsView';
import DevelopmentView from './modules/DevelopmentView';
import CareerMarketingView from './modules/CareerMarketingView';
import JobSearchView from './modules/JobSearchView';
import ApplicationsView from './modules/ApplicationsView';
import InterviewsView from './modules/InterviewsView';
import ProgressView from './modules/ProgressView';
import SuccessManagementView from './modules/SuccessManagementView';
import ProgramEligibilityView from './modules/ProgramEligibilityView';
import ResumeUploadView from './modules/ResumeUploadView';

export default function AppShell() {
  const dispatch = useDispatch();

  const [activeNav, setActiveNav] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redux state
  const { data: cpiData } = useSelector((state) => state.cpi);
  const { items: applications = [] } = useSelector((state) => state.applications);
  const { items: interviews = [] } = useSelector((state) => state.interviews);

  // Hydrate all stores on mount
  useEffect(() => {
    dispatch(fetchCandidateProfile());
    dispatch(fetchCpiData());
    dispatch(fetchGoals());
    dispatch(fetchPlanTasks());
    dispatch(fetchExperts());
    dispatch(fetchServices());
    dispatch(fetchApplications());
    dispatch(fetchInterviews());
    dispatch(fetchProgressData());
    dispatch(fetchProgramEligibility());
  }, [dispatch]);

  const handleNavigate = (navId) => {
    setActiveNav(navId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveModule = () => {
    switch (activeNav) {
      case 'resume':
        return <ResumeUploadView onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfileView onNavigate={handleNavigate} />;
      case 'cpi':
        return (
          <CpiView
            onNavigateToPlan={() => handleNavigate('plan')}
            onNavigateToExperts={() => handleNavigate('experts')}
          />
        );
      case 'goals':
        return <CareerGoalsView onNavigateToPlan={() => handleNavigate('plan')} />;
      case 'gap':
        return (
          <GapAnalysisView
            onNavigateToPlan={() => handleNavigate('plan')}
            onNavigateToExperts={() => handleNavigate('experts')}
            onNavigateToResume={() => handleNavigate('profile')}
          />
        );
      case 'plan':
        return <SmartPlanView />;
      case 'experts':
        return <ExpertsView />;
      case 'development':
        return (
          <DevelopmentView
            onNavigateToExperts={() => handleNavigate('experts')}
            onNavigateToPlan={() => handleNavigate('plan')}
          />
        );
      case 'marketing':
        return (
          <CareerMarketingView
            onNavigateToPlan={() => handleNavigate('plan')}
          />
        );
      case 'jobsearch':
        return (
          <JobSearchView
            onNavigateToApplications={() => handleNavigate('applications')}
          />
        );
      case 'applications':
        return (
          <ApplicationsView
            onNavigateToInterviews={() => handleNavigate('interviews')}
          />
        );
      case 'interviews':
        return (
          <InterviewsView
            onNavigateToExperts={() => handleNavigate('experts')}
          />
        );
      case 'progress':
        return <ProgressView />;
      case 'success':
        return (
          <SuccessManagementView
            onNavigateToExperts={() => handleNavigate('experts')}
          />
        );
      case 'program':
        return (
          <ProgramEligibilityView
            onNavigateToCpi={() => handleNavigate('cpi')}
            onNavigateToPlan={() => handleNavigate('plan')}
          />
        );
      default:
        return <DashboardView onNavigate={handleNavigate} />;
    }
  };

  const cpiScore = cpiData?.overallScore || 0;
  const activeAppsCount = applications.length;
  const interviewsCount = interviews.length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={handleNavigate}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cpiScore={cpiScore}
        activeAppsCount={activeAppsCount}
        interviewsCount={interviewsCount}
      />

      {/* Main Content Layout (Offset for Sidebar on desktop) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header
          activeNav={activeNav}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigate={handleNavigate}
          cpiScore={cpiScore}
        />

        {/* Candidate Journey Breadcrumbs (Assess -> Succeed) */}
        <JourneyBreadcrumb
          currentNav={activeNav}
          onSelectNav={handleNavigate}
        />

        {/* Module Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderActiveModule()}
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 text-center text-xs text-neutral-500 dark:text-neutral-400 bg-white/50 dark:bg-neutral-900/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>
              Staffing Bees — Career Success Management Platform © {new Date().getFullYear()}
            </span>
            <span className="text-[11px] text-neutral-400">
              Assess → Understand → Plan → Improve → Match → Apply → Interview → Place → Support → Succeed
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
