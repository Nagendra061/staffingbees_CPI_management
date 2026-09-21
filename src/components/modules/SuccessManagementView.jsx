/**
 * Success Management View (Post-Placement Support)
 *
 * Dedicated post-placement support module embodying Staffing Bees' commitment:
 * "The journey does not end at placement."
 * Tracks 30-60-90 day onboarding objectives, post-placement coaching touchpoints,
 * compensation reviews, and long-term career growth.
 *
 * Used By:
 * Main App navigation ('success').
 */
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import StatusBadge from '../common/StatusBadge';
import {
  Award,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

export default function SuccessManagementView({ onNavigateToExperts }) {
  const [checkpoints, setCheckpoints] = useState([
    {
      id: 'cp-30',
      period: 'Day 1 - 30: Onboarding & Clinical Team Integration',
      status: 'Ready for Kickoff',
      tasks: [
        { id: 't1', title: 'Complete HIPAA compliance and hospital EHR access credentials', done: true },
        { id: 't2', title: 'Schedule 1-on-1 alignment with Director of Informatics', done: true },
        { id: 't3', title: 'Conduct Day 30 Staffing Bees coaching check-in with Elena Rostova', done: false },
      ],
    },
    {
      id: 'cp-60',
      period: 'Day 31 - 60: Early Value Delivery & Pipeline Autonomy',
      status: 'Upcoming',
      tasks: [
        { id: 't4', title: 'Deliver first clinical EDI claims risk-adjustment dashboard', done: false },
        { id: 't5', title: 'Present monthly metrics to clinical operations committee', done: false },
        { id: 't6', title: 'Day 60 performance review calibration with Staffing Bees coach', done: false },
      ],
    },
    {
      id: 'cp-90',
      period: 'Day 61 - 90: Long-Term Autonomy & Promotion Vector',
      status: 'Upcoming',
      tasks: [
        { id: 't7', title: 'Formalize 6-month career growth and compensation milestone plan', done: false },
        { id: 't8', title: 'Final Staffing Bees placement program graduation and give-back mentorship', done: false },
      ],
    },
  ]);

  const toggleTask = (periodId, taskId) => {
    setCheckpoints((prev) =>
      prev.map((cp) => {
        if (cp.id !== periodId) return cp;
        return {
          ...cp,
          tasks: cp.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-700/60 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAB308] text-neutral-950 uppercase tracking-wide">
              Step 9 & 10: Support → Succeed
            </span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Post-Placement Career Success Management
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
            Staffing Bees supports candidates through placement and beyond. We provide dedicated
            30-60-90 day onboarding support to ensure long-term job retention and promotion.
          </p>
        </div>

        {onNavigateToExperts && (
          <Button
            variant="primary"
            size="sm"
            onClick={onNavigateToExperts}
            icon={UserCheck}
          >
            Connect with Success Coach
          </Button>
        )}
      </div>

      {/* Target Placement Offer Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-4 border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
            Placement Stage
          </div>
          <div className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100">
            Offer Negotiation / Final Round
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Active negotiations with Rush Medical Center & Northwestern Medicine.
          </p>
        </Card>

        <Card className="p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Assigned Success Coach
          </div>
          <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Elena Rostova
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Certified Career Coach & Executive Transition Lead (Weekly Check-in Scheduled).
          </p>
        </Card>

        <Card className="p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Success Retention Guarantee
          </div>
          <div className="text-xl font-bold text-amber-700 dark:text-amber-400">
            90-Day Coverage
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Free retraining and reassignment support if career fit discrepancies occur.
          </p>
        </Card>
      </div>

      {/* 30-60-90 Day Roadmap */}
      <Card
        title="30-60-90 Day Onboarding Roadmap"
        subtitle="Structured checkpoints safeguarding candidate tenure, performance reviews, and clinical team integration."
      >
        <div className="space-y-6">
          {checkpoints.map((cp) => {
            const completedCount = cp.tasks.filter((t) => t.done).length;
            const progress = Math.round((completedCount / cp.tasks.length) * 100);

            return (
              <div
                key={cp.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {cp.period}
                    </h3>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Completed {completedCount} of {cp.tasks.length} objectives
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ProgressBar
                      value={progress}
                      height="h-2"
                      showPercentage={true}
                      className="w-28"
                    />
                    <StatusBadge status={cp.status} />
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-2 pt-1">
                  {cp.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(cp.id, task.id)}
                      className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none hover:text-neutral-950 dark:hover:text-white"
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          task.done
                            ? 'bg-[#EAB308] border-[#EAB308] text-neutral-950'
                            : 'border-neutral-300 dark:border-neutral-600'
                        }`}
                      >
                        {task.done && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={task.done ? 'line-through text-neutral-400' : 'font-medium'}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
