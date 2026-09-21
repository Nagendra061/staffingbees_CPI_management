/**
 * Progress View (Progress Analytics & Metrics)
 *
 * Visual analytics dashboard tracking the candidate's journey from assessment to placement:
 * - CPI Progression timeline (74 -> 78 -> 82)
 * - Career Readiness & Interview Readiness metrics
 * - Application-to-Interview Conversion Rates
 * - Historical Milestones completed
 *
 * Used By:
 * Main App navigation ('progress').
 */
import React from 'react';
import { useSelector } from 'react-redux';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import StatusBadge from '../common/StatusBadge';
import {
  TrendingUp,
  Activity,
  CheckCircle2,
  Calendar,
  Users,
  Target,
  Briefcase,
  Award,
} from 'lucide-react';

export default function ProgressView() {
  const { data: progressData } = useSelector((state) => state.progress);
  const { data: cpiData } = useSelector((state) => state.cpi);
  const { data: candidate } = useSelector((state) => state.candidate);
  const { items: goals = [] } = useSelector((state) => state.goals);
  const { items: applications = [] } = useSelector((state) => state.applications);
  const { items: interviews = [] } = useSelector((state) => state.interviews);
  const { items: tasks = [] } = useSelector((state) => state.plans);

  const overallScore = cpiData?.overallScore || 0;

  // CPI History (Dynamic from cpiData or progressData, without hardcoded fallback values)
  const rawHistory = cpiData?.historicalScores?.length
    ? cpiData.historicalScores
    : progressData?.cpiHistory?.length
    ? progressData.cpiHistory
    : [];

  const cpiHistory = rawHistory.length > 0
    ? rawHistory
    : overallScore > 0
    ? [{ date: cpiData?.lastAssessmentDate || 'Current', score: overallScore, label: 'Current Diagnostic' }]
    : [];

  const firstScore = cpiHistory[0]?.score || overallScore;
  const velocityPts =
    cpiHistory.length > 1 && overallScore > 0 ? overallScore - firstScore : null;

  const readinessScore = overallScore > 0 ? Math.min(100, Math.round(overallScore * 0.95)) : 0;

  const totalApps = applications.length;
  const interviewCount = applications.filter(
    (a) => a.status === 'Interview' || a.status === 'Screening' || a.status === 'Offer'
  ).length;
  const conversionRate = totalApps > 0 ? Math.round((interviewCount / totalApps) * 100) : 0;
  const networkContactsCount = progressData?.networkingContacts?.length || 0;

  // Dynamic Candidate Journey Milestones
  const dynamicMilestones = [
    {
      id: 'm-resume',
      title: 'ATS Resume Ingestion & Profile Verification',
      date: candidate?.createdAt ? new Date(candidate.createdAt).toISOString().split('T')[0] : 'In Progress',
      status: candidate?.hasUploadedResume ? 'Completed' : 'In Progress',
      notes: candidate?.hasUploadedResume
        ? `Verified profile for ${candidate.name || 'Candidate'} with ${candidate.skills?.length || 0} core competencies.`
        : 'Upload resume to extract verified skills and career history.',
    },
    {
      id: 'm-cpi',
      title: 'Baseline CPI Assessment',
      date: cpiData?.lastAssessmentDate || 'Pending',
      status: overallScore > 0 ? 'Completed' : 'In Progress',
      notes: overallScore > 0
        ? `Established initial employability baseline at ${overallScore}/100 across 14 dimensions.`
        : 'Take the CPI diagnostic to pinpoint strengths and gap development vectors.',
    },
    {
      id: 'm-goal',
      title: 'Target Career Goal & Strategy Formulation',
      date: goals[0]?.createdAt ? new Date(goals[0].createdAt).toISOString().split('T')[0] : 'In Progress',
      status: goals.length > 0 ? 'Completed' : 'In Progress',
      notes: goals.length > 0
        ? `Target set: ${goals[0].desiredRole} (${goals[0].targetIndustry || 'Target Industry'}).`
        : 'Define your 90-day primary career objective and compensation benchmark.',
    },
    {
      id: 'm-apps',
      title: 'Active Outbound Application Pipeline',
      date: applications[0]?.applicationDate || 'In Progress',
      status: applications.length >= 3 ? 'Completed' : 'In Progress',
      notes: applications.length > 0
        ? `${applications.length} applications logged across target employer opportunities.`
        : 'Maintain at least 5 qualified employer applications per active sprint.',
    },
    {
      id: 'm-interviews',
      title: 'Employer Interview Readiness & Execution',
      date: interviews[0]?.dateTime ? interviews[0].dateTime.split('T')[0] : 'In Progress',
      status: interviews.length > 0 ? 'Completed' : 'In Progress',
      notes: interviews.length > 0
        ? `${interviews.length} interview round(s) scheduled with tailored STAR coaching.`
        : 'Conduct mock simulations with assigned interview coach.',
    },
    {
      id: 'm-guarantee',
      title: 'Full Job Guarantee Final Placement Threshold',
      date: 'Target: 90 Days',
      status: overallScore >= 80 && candidate?.status === 'Active Candidate' ? 'In Progress' : 'Pending Gates',
      notes: 'Maintain CPI above 80 and active weekly coaching participation.',
    },
  ];

  const milestones = progressData?.milestones?.length ? progressData.milestones : dynamicMilestones;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span>Progress Analytics & Career Velocity</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Transparent metrics tracking your upward trajectory across assessments, goals, applications, and conversions.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300">
          Status: <strong>{overallScore >= 80 ? 'On Track for 90-Day Placement' : 'Active Acceleration'}</strong>
        </span>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold uppercase">
            <span>CPI Velocity</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-2">
            {velocityPts !== null ? `${velocityPts >= 0 ? `+${velocityPts}` : velocityPts} pts` : overallScore > 0 ? 'Baseline' : '--'}
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {velocityPts !== null
              ? `${firstScore} → ${overallScore} / 100`
              : overallScore > 0
              ? `${overallScore} / 100 Current`
              : 'Awaiting Diagnostic'}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold uppercase">
            <span>Career Readiness</span>
            <Target className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-2">
            {readinessScore > 0 ? `${readinessScore}%` : '--'}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {readinessScore >= 80 ? 'Target met (≥80%)' : 'Target benchmark: 80%'}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold uppercase">
            <span>Interview Yield</span>
            <Briefcase className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-2">
            {totalApps > 0 ? `${conversionRate}%` : '--'}
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {interviewCount} of {totalApps} Applications
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold uppercase">
            <span>Network Contacts</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-2">
            {networkContactsCount}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Warm referral conversations
          </p>
        </Card>
      </div>

      {/* CPI Historical Trend Visualization */}
      <Card
        title="Candidate Performance Index (CPI) Historical Trend"
        subtitle="Tracking score progression across diagnostic milestones."
      >
        <div className="space-y-4 pt-2">
          {cpiHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {cpiHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 relative overflow-hidden"
                >
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    {item.label}
                  </div>
                  <div className="text-3xl font-black text-neutral-900 dark:text-neutral-100 mt-1 flex items-baseline gap-1">
                    <span>{item.score}</span>
                    <span className="text-xs text-neutral-400 font-normal">/ 100</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Recorded: {item.date}
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={item.score} height="h-2" showPercentage={false} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-neutral-500">
              No historical CPI assessments logged yet. Upload your resume or take the assessment to begin tracking score trajectory.
            </div>
          )}

          {overallScore > 0 && (
            <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200">
              <strong>Key takeaway:</strong>{' '}
              {velocityPts !== null && velocityPts > 0
                ? `Your ${velocityPts}-point CPI progression reflects active development across your priority employability dimensions.`
                : `Your baseline CPI diagnostic is established at ${overallScore}/100. Complete weekly SMART plan sprints to drive score acceleration.`}
            </div>
          )}
        </div>
      </Card>

      {/* Historical Milestones Timeline */}
      <Card
        title="Candidate Journey Milestones"
        subtitle="Chronological record of achievements and remaining program gates."
      >
        <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
          {milestones.map((m) => {
            const isCompleted = m.status === 'Completed';

            return (
              <div key={m.id} className="relative flex items-start gap-4 pl-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                <div className="flex-1 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {m.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={m.status} />
                      <span className="text-xs text-neutral-400 font-medium">
                        {m.date}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    {m.notes}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
