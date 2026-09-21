/**
 * JourneyBreadcrumb Component
 *
 * Displays the core Staffing Bees candidate journey:
 * Resume Ingestion → Assess → Understand → Plan → Improve → Match → Apply → Interview → Place → Support → Succeed
 *
 * Used By:
 * Top layout header and Dashboard overview.
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { ChevronRight, Check, FileUp } from 'lucide-react';

const STAGES = [
  { id: 'resume', label: 'Resume', targetNav: 'resume', stepNumber: 0 },
  { id: 'assess', label: 'Assess', targetNav: 'cpi', stepNumber: 1 },
  { id: 'understand', label: 'Understand', targetNav: 'gap', stepNumber: 2 },
  { id: 'plan', label: 'Plan', targetNav: 'plan', stepNumber: 3 },
  { id: 'improve', label: 'Improve', targetNav: 'development', stepNumber: 4 },
  { id: 'match', label: 'Match', targetNav: 'experts', stepNumber: 5 },
  { id: 'apply', label: 'Apply', targetNav: 'applications', stepNumber: 6 },
  { id: 'interview', label: 'Interview', targetNav: 'interviews', stepNumber: 7 },
  { id: 'place', label: 'Place', targetNav: 'success', stepNumber: 8 },
  { id: 'support', label: 'Support', targetNav: 'success', stepNumber: 9 },
  { id: 'succeed', label: 'Succeed', targetNav: 'progress', stepNumber: 10 },
];

export default function JourneyBreadcrumb({
  currentNav = 'dashboard',
  onSelectNav,
  className = '',
}) {
  const { data: candidate } = useSelector((state) => state.candidate);
  const hasResume = Boolean(candidate?.hasUploadedResume);

  // Current active step calculation based on active nav
  const getActiveIndex = () => {
    switch (currentNav) {
      case 'resume':
        return 0;
      case 'cpi':
        return 1;
      case 'gap':
      case 'goals':
        return 2;
      case 'plan':
        return 3;
      case 'development':
      case 'marketing':
        return 4;
      case 'experts':
        return 5;
      case 'jobsearch':
      case 'applications':
        return 6;
      case 'interviews':
        return 7;
      case 'success':
        return 8;
      case 'progress':
      case 'program':
        return 9;
      default:
        // On dashboard: if no resume, step 0 is active; else step 1 or current
        return hasResume ? 1 : 0;
    }
  };

  const activeIdx = getActiveIndex();

  return (
    <div className={`w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 overflow-x-auto ${className}`}>
      <div className="flex items-center min-w-max space-x-1.5 text-xs">
        <span className="font-bold text-neutral-400 uppercase tracking-widest text-[10px] mr-2">
          Candidate Journey:
        </span>
        {STAGES.map((stage, idx) => {
          // If stage is resume (idx 0), it's completed as long as hasResume is true!
          const isCompleted = idx === 0 ? hasResume : (hasResume && idx < activeIdx);
          const isCurrent = idx === activeIdx;

          return (
            <React.Fragment key={stage.id}>
              <button
                onClick={() => onSelectNav && onSelectNav(stage.targetNav)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                  isCurrent
                    ? 'bg-[#EAB308] text-neutral-950 font-bold shadow-xs'
                    : isCompleted
                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 hover:bg-amber-100'
                    : !hasResume && idx > 0
                    ? 'text-neutral-400 dark:text-neutral-600 opacity-60 hover:opacity-100'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 text-amber-700 dark:text-amber-300 stroke-[3]" />
                ) : idx === 0 ? (
                  <FileUp className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-semibold text-neutral-700 dark:text-neutral-300">
                    {stage.stepNumber}
                  </span>
                )}
                <span>{stage.label}</span>
              </button>
              {idx < STAGES.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
