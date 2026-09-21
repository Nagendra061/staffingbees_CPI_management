/**
 * Header Component
 *
 * Top navigation bar with active section title, quick stats,
 * mobile menu toggle, and primary CTA.
 *
 * Used By:
 * Main App layout.
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { Menu, Activity, PlusCircle, ShieldCheck, FileUp } from 'lucide-react';
import Button from '../common/Button';

export default function Header({
  activeNav = 'dashboard',
  onOpenMobileMenu,
  onNavigate,
  cpiScore = 0,
}) {
  const { data: candidate } = useSelector((state) => state.candidate);

  const getNavMeta = () => {
    switch (activeNav) {
      case 'resume':
        return {
          title: 'Resume Onboarding & Extraction',
          subtitle: 'Upload your resume to extract career history, skills, and unlock your personalized Candidate Journey.',
        };
      case 'dashboard':
        return {
          title: 'Candidate Dashboard',
          subtitle: 'Executive overview of your career progress, employability, and active milestones.',
        };
      case 'profile':
        return {
          title: 'Candidate Profile',
          subtitle: 'Manage verified skills, experience, target roles, and credentials.',
        };
      case 'cpi':
        return {
          title: 'Candidate Performance Index (CPI)',
          subtitle: '14-dimension employability assessment and personalized development roadmaps.',
        };
      case 'goals':
        return {
          title: 'Career Goals',
          subtitle: 'Define target role, compensation benchmarks, industry focus, and milestones.',
        };
      case 'gap':
        return {
          title: 'Gap Analysis',
          subtitle: 'Compare Current Baseline vs Target Role requirements to eliminate blockers.',
        };
      case 'plan':
        return {
          title: 'SMART Career Plan',
          subtitle: 'Weekly action plan tracking concrete deliverables and accountability.',
        };
      case 'experts':
        return {
          title: 'Expert Matching & Alignment',
          subtitle: 'Connect with certified counselors, coaches, and industry mentors.',
        };
      case 'development':
        return {
          title: 'Development Services',
          subtitle: 'Active Staffing Bees service layers: counseling, coaching, and upskilling.',
        };
      case 'marketing':
        return {
          title: 'Career Marketing',
          subtitle: 'Resume optimization, LinkedIn algorithmic positioning, and personal brand.',
        };
      case 'jobsearch':
        return {
          title: 'Job Search Management',
          subtitle: 'Target employer pipelines, qualified opportunities, and outreach cadence.',
        };
      case 'applications':
        return {
          title: 'Application Tracking',
          subtitle: 'Monitor submission status, qualification match rates, and follow-ups.',
        };
      case 'interviews':
        return {
          title: 'Interviews & Preparation',
          subtitle: 'Interview schedule, prep checklists, and mock simulation feedback.',
        };
      case 'progress':
        return {
          title: 'Progress Analytics',
          subtitle: 'Historical CPI progression, readiness metrics, and networking volume.',
        };
      case 'success':
        return {
          title: 'Success Management',
          subtitle: 'Post-placement support, onboarding roadmaps, and continued career guidance.',
        };
      case 'program':
        return {
          title: 'Program Eligibility & Guarantee',
          subtitle: 'Job guarantee verification criteria, scholarship status, and modular plans.',
        };
      default:
        return {
          title: 'Staffing Bees',
          subtitle: 'Career Success Management Platform',
        };
    }
  };

  const meta = getNavMeta();

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Header */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 -ml-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 lg:hidden rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 truncate">
              {meta.title}
            </h1>
            <p className="hidden sm:block text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
              {meta.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Quick Highlights & Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* CPI Badge */}
          <button
            onClick={() => onNavigate('cpi')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs font-semibold hover:bg-amber-100 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>CPI: <strong>{cpiScore > 0 ? cpiScore : '--'}</strong>/100</span>
          </button>

          {/* Guarantee / Eligibility Chip */}
          <button
            onClick={() => onNavigate('program')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guarantee: {cpiScore >= 80 ? 'Qualified' : 'In Progress'}</span>
          </button>

          {/* Primary context Action */}
          {!candidate?.hasUploadedResume && activeNav !== 'resume' ? (
            <Button
              size="sm"
              variant="primary"
              icon={FileUp}
              onClick={() => onNavigate('resume')}
            >
              Upload Resume
            </Button>
          ) : activeNav === 'applications' ? (
            <Button
              size="sm"
              variant="primary"
              icon={PlusCircle}
              onClick={() => {
                const event = new CustomEvent('open-new-application-modal');
                window.dispatchEvent(event);
              }}
            >
              Add Application
            </Button>
          ) : activeNav === 'goals' ? (
            <Button
              size="sm"
              variant="primary"
              icon={PlusCircle}
              onClick={() => {
                const event = new CustomEvent('open-new-goal-modal');
                window.dispatchEvent(event);
              }}
            >
              Add Goal
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              icon={Activity}
              onClick={() => onNavigate('cpi')}
            >
              Take Assessment
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
