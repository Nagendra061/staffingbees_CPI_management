/**
 * Sidebar Component
 *
 * Primary navigation sidebar for Staffing Bees.
 * Features grouped career stages, badges for active records/CPI,
 * and responsive mobile drawer toggling.
 *
 * Used By:
 * Main App layout.
 */
import React from 'react';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  User,
  Activity,
  Target,
  GitFork,
  CheckSquare,
  Users,
  Compass,
  Sparkles,
  Search,
  Briefcase,
  Calendar,
  TrendingUp,
  Award,
  ShieldCheck,
  FileUp,
  X,
} from 'lucide-react';

export default function Sidebar({
  activeNav = 'dashboard',
  onSelectNav,
  isOpen = false,
  onClose,
  cpiScore = 0,
  activeAppsCount = 0,
  interviewsCount = 0,
}) {
  const { data: candidate } = useSelector((state) => state.candidate);

  const getInitials = (name) => {
    if (!name) return 'SB';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const navGroups = [
    {
      label: 'Get Started',
      items: [
        {
          id: 'resume',
          label: 'Upload Resume',
          icon: FileUp,
          badge: candidate?.hasUploadedResume ? 'Uploaded' : 'Action Needed',
          badgeHighlight: !candidate?.hasUploadedResume,
        },
      ],
    },
    {
      label: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'profile', label: 'My Profile', icon: User },
      ],
    },
    {
      label: 'Assess & Plan',
      items: [
        {
          id: 'cpi',
          label: 'CPI Assessment',
          icon: Activity,
          badge: cpiScore > 0 ? `${cpiScore}/100` : 'Diagnostic',
          badgeHighlight: cpiScore > 0,
        },
        { id: 'goals', label: 'Career Goals', icon: Target },
        { id: 'gap', label: 'Gap Analysis', icon: GitFork },
        { id: 'plan', label: 'SMART Career Plan', icon: CheckSquare },
      ],
    },
    {
      label: 'Improve & Match',
      items: [
        { id: 'experts', label: 'Expert Matching', icon: Users },
        { id: 'development', label: 'Development Services', icon: Compass },
        { id: 'marketing', label: 'Career Marketing', icon: Sparkles },
      ],
    },
    {
      label: 'Job Search & Execution',
      items: [
        { id: 'jobsearch', label: 'Job Search Strategy', icon: Search },
        {
          id: 'applications',
          label: 'Applications',
          icon: Briefcase,
          badge: activeAppsCount > 0 ? activeAppsCount : undefined,
        },
        {
          id: 'interviews',
          label: 'Interviews & Prep',
          icon: Calendar,
          badge: interviewsCount > 0 ? interviewsCount : undefined,
        },
      ],
    },
    {
      label: 'Progress & Support',
      items: [
        { id: 'progress', label: 'Progress Analytics', icon: TrendingUp },
        { id: 'success', label: 'Success Management', icon: Award },
        { id: 'program', label: 'Program Eligibility', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-950/60 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAB308] flex items-center justify-center font-black text-neutral-950 shadow-sm text-base tracking-tighter">
              SB
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-none">
                STAFFING BEES
              </div>
              <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider mt-0.5">
                Career Success Platform
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {group.label}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          onSelectNav(item.id);
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#EAB308] text-neutral-950 font-bold shadow-xs'
                            : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 hover:text-neutral-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive
                                ? 'text-neutral-950'
                                : 'text-neutral-400 dark:text-neutral-500'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                              isActive
                                ? 'bg-neutral-950/15 text-neutral-950'
                                : item.badgeHighlight
                                ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Candidate Footer Snapshot */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50">
          {candidate?.hasUploadedResume ? (
            <button
              onClick={() => onSelectNav('profile')}
              className="w-full flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 hover:border-amber-300 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 font-bold text-xs flex items-center justify-center shrink-0">
                {getInitials(candidate?.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {candidate?.name || 'Active Candidate'}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
                  {candidate?.targetRole || candidate?.currentRole || 'Candidate'} • CPI {cpiScore}
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => onSelectNav('resume')}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-full bg-[#EAB308] text-neutral-950 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                <FileUp className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                  Upload Resume
                </div>
                <div className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold truncate">
                  Start candidate journey →
                </div>
              </div>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
