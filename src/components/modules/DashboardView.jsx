/**
 * Dashboard View (Candidate Executive Dashboard)
 *
 * The central operational hub for Staffing Bees.
 * Summarizes CPI employability scores, active 4-week SMART objectives,
 * application pipelines, upcoming interviews, and program guarantee status.
 *
 * Used By:
 * Main App default navigation ('dashboard').
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTaskComplete } from '../../store/plansSlice';
import Card from '../common/Card';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import StatusBadge from '../common/StatusBadge';
import {
  Activity,
  Target,
  CheckSquare,
  Briefcase,
  Calendar,
  Users,
  TrendingUp,
  Award,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle,
  PlayCircle,
  Building,
  FileUp,
} from 'lucide-react';

export default function DashboardView({ onNavigate }) {
  const dispatch = useDispatch();

  // Redux Selectors
  const { data: candidate } = useSelector((state) => state.candidate);
  const { data: cpiData } = useSelector((state) => state.cpi);
  const { items: goals = [] } = useSelector((state) => state.goals);
  const { items: tasks = [] } = useSelector((state) => state.plans);
  const { items: applications = [] } = useSelector((state) => state.applications);
  const { items: interviews = [] } = useSelector((state) => state.interviews);
  const { items: experts = [] } = useSelector((state) => state.experts);

  const cpiScore = cpiData?.overallScore || 0;
  const primaryGoal = goals.find((g) => g.isPrimary) || goals[0];

  // Calculation metrics
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const activeAppsCount = applications.length;
  const qualifiedAppsCount = applications.filter((a) => (a.qualificationMatchRate || 0) >= 80).length;
  const upcomingInterview = interviews.find((i) => i.status === 'Scheduled') || interviews[0];
  const alignedExperts = experts.filter((e) => e.alignmentStatus === 'Aligned');

  // Dynamic CPI & Readiness Calculations
  const baselineScore = cpiData?.historicalScores?.[0]?.score;
  const cpiDelta =
    cpiScore > 0 && baselineScore && (cpiData?.historicalScores?.length || 0) > 1
      ? cpiScore - baselineScore
      : null;
  const readinessScore = cpiScore > 0 ? Math.min(100, Math.round(cpiScore * 0.95)) : 0;

  // Guarantee Criteria Evaluation
  const guaranteeCriteria = [
    cpiScore >= 80,
    Boolean(candidate?.hasUploadedResume),
    completedTasks > 0,
    activeAppsCount > 0,
    interviews.length > 0,
    candidate?.status === 'Active Candidate',
  ];
  const guaranteeMetCount = guaranteeCriteria.filter(Boolean).length;
  const isGuaranteeVerified = guaranteeMetCount >= 5;

  // Dynamic Dimensions breakdown
  const dimensionEntries = Object.entries(cpiData?.dimensions || {}).map(([name, val]) => ({
    name,
    score: val?.score || 0,
    benchmark: val?.benchmark || 80,
  }));
  const topStrengths = [...dimensionEntries].sort((a, b) => b.score - a.score).slice(0, 3);
  const priorityGaps = [...dimensionEntries].sort((a, b) => a.score - b.score).slice(0, 2);

  return (
    <div className="space-y-6">
      {/* 1. Candidate Executive Hero Banner */}
      {!candidate?.hasUploadedResume ? (
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-2 border-[#EAB308] rounded-2xl p-6 sm:p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#EAB308] text-neutral-950 uppercase tracking-wide">
                Step 0 Required
              </span>
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                Staffing Bees Candidate Journey
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
              Upload Your Resume to Begin
            </h2>

            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Your candidate journey begins by uploading your resume. Our AI extraction engine will automatically parse your verified skills, career history, calculate your baseline <strong>Candidate Performance Index (CPI)</strong>, and configure your personalized career roadmap.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
            <Button
              variant="primary"
              size="lg"
              icon={FileUp}
              onClick={() => onNavigate('resume')}
              className="font-bold shadow-md"
            >
              Upload Resume Now →
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-700/60 rounded-xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAB308] text-neutral-950 uppercase tracking-wide">
                Active Candidate Cohort
              </span>
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                Staffing Bees 90-Day Accelerator
              </span>
            </div>

            <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
              Welcome back, {candidate?.name || 'Candidate'}
            </h2>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Targeting <strong>{candidate?.targetRole || primaryGoal?.desiredRole || 'Target Career Role'}</strong>
              {(candidate?.targetIndustry || primaryGoal?.targetIndustry) && (
                <span> in {candidate?.targetIndustry || primaryGoal?.targetIndustry}</span>
              )}. Your CPI score is{' '}
              <strong>{cpiScore > 0 ? `${cpiScore}/100` : 'Pending Initial Assessment'}</strong>
              {cpiScore >= 80 && ' — qualifying you for the Job Guarantee track'}.
            </p>
          </div>

          {/* Quick Hero Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="md"
              icon={PlayCircle}
              onClick={() => onNavigate('cpi')}
            >
              CPI Assessment
            </Button>
            <Button
              variant="outline"
              size="md"
              icon={CheckSquare}
              onClick={() => onNavigate('plan')}
            >
              Weekly Plan
            </Button>
            <Button
              variant="ghost"
              size="md"
              icon={FileUp}
              onClick={() => onNavigate('resume')}
              className="text-amber-800 dark:text-amber-300"
            >
              Update Resume
            </Button>
          </div>
        </div>
      )}

      {/* 2. Key Operational Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* CPI */}
        <div
          onClick={() => onNavigate('cpi')}
          className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase">
            <span>CPI Index</span>
            <Activity className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
            {cpiScore > 0 ? cpiScore : '--'}
            <span className="text-xs text-neutral-400 font-normal">/100</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            {cpiDelta !== null
              ? `${cpiDelta >= 0 ? `+${cpiDelta}` : cpiDelta} pts from baseline`
              : cpiScore > 0
              ? 'Baseline calibrated'
              : 'Awaiting assessment'}
          </div>
        </div>

        {/* Career Readiness */}
        <div
          onClick={() => onNavigate('progress')}
          className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase">
            <span>Readiness</span>
            <Target className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
            {readinessScore > 0 ? `${readinessScore}%` : '--'}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">
            {readinessScore >= 80 ? 'Target met (≥80%)' : 'Target threshold: 80%'}
          </div>
        </div>

        {/* SMART Goals */}
        <div
          onClick={() => onNavigate('plan')}
          className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase">
            <span>SMART Tasks</span>
            <CheckSquare className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
            {completedTasks}/{tasks.length}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            {tasks.length === 0
              ? 'No active tasks'
              : completedTasks === tasks.length
              ? 'All tasks completed'
              : 'Sprint in progress'}
          </div>
        </div>

        {/* Applications */}
        <div
          onClick={() => onNavigate('applications')}
          className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase">
            <span>Active Apps</span>
            <Briefcase className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
            {activeAppsCount}
          </div>
          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium mt-0.5">
            {activeAppsCount === 0
              ? '0 applications logged'
              : `${qualifiedAppsCount} high-fit match${qualifiedAppsCount !== 1 ? 'es' : ''}`}
          </div>
        </div>

        {/* Interviews */}
        <div
          onClick={() => onNavigate('interviews')}
          className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase">
            <span>Interviews</span>
            <Calendar className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
            {interviews.length}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            {interviews.length === 0
              ? 'None scheduled'
              : `${interviews.filter((i) => i.status === 'Scheduled').length} scheduled`}
          </div>
        </div>

        {/* Guarantee Status */}
        <div
          onClick={() => onNavigate('program')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
            isGuaranteeVerified
              ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20 hover:border-emerald-500'
              : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
            <span>Guarantee</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg font-black text-neutral-900 dark:text-neutral-100 mt-1.5 truncate">
            {isGuaranteeVerified ? 'Verified' : 'In Progress'}
          </div>
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
            {guaranteeMetCount}/6 Criteria Met
          </div>
        </div>
      </div>

      {/* 3. Two Column Layout: CPI Snapshot & Primary Career Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* CPI Diagnostic Summary Card */}
        <Card
          className="lg:col-span-2 border border-neutral-200 dark:border-neutral-800"
          title="Candidate Performance Index (CPI) Diagnostic"
          subtitle="Evaluated across 14 employability dimensions to drive your development sprints."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('cpi')}
              className="text-xs"
            >
              Full 14 Dimensions
            </Button>
          }
        >
          {cpiScore > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left: Score Breakdown */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-neutral-900 dark:text-neutral-100">
                    {cpiScore}
                  </span>
                  <span className="text-sm font-semibold text-neutral-400">/ 100 Overall</span>
                </div>
                <ProgressBar value={cpiScore} height="h-2.5" />
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Benchmark for high-probability placement is <strong>80/100</strong>.
                  {cpiScore >= 80 ? ' You are currently in the qualified tier.' : ' You are actively building toward the threshold.'}
                </p>

                {topStrengths.length > 0 && (
                  <div className="pt-2">
                    <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-1.5">
                      Core Strengths:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {topStrengths.map((str) => (
                        <span
                          key={str.name}
                          className="text-xs px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium"
                        >
                          {str.name}: {str.score}/100
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Priority Areas for Improvement */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 space-y-3">
                <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Priority Development Sprints:</span>
                </div>

                {priorityGaps.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {priorityGaps.map((gap) => (
                      <div
                        key={gap.name}
                        className="p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-neutral-900 dark:text-neutral-100">
                            {gap.name}
                          </span>
                          <span className="text-amber-700 dark:text-amber-400 font-bold">
                            {gap.score} / 100
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500">
                          Target uplift: {gap.benchmark}/100 via tailored coaching sprints.
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500">All evaluated dimensions meet target benchmarks.</p>
                )}

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => onNavigate('gap')}
                    className="text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Review Gap Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <Activity className="w-10 h-10 text-amber-500 mx-auto opacity-70" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  CPI Diagnostic Pending
                </h4>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Upload your resume or take the comprehensive 14-dimension diagnostic assessment to calculate your baseline CPI score.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <Button variant="primary" size="sm" onClick={() => onNavigate('cpi')} icon={PlayCircle}>
                  Take CPI Diagnostic
                </Button>
                <Button variant="outline" size="sm" onClick={() => onNavigate('resume')} icon={FileUp}>
                  Upload Resume
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Primary Career Goal Card */}
        <Card
          className="border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
          title="Primary Career Goal"
          subtitle="Active 90-day trajectory"
          action={<StatusBadge status={primaryGoal?.status || 'In Progress'} />}
        >
          {primaryGoal ? (
            <div className="space-y-3">
              <div>
                <h4 className="text-lg font-black text-neutral-900 dark:text-neutral-100">
                  {primaryGoal.desiredRole}
                </h4>
                {primaryGoal.objective && (
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {primaryGoal.objective}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Target Industry:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {primaryGoal.targetIndustry || candidate?.targetIndustry || 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Target Location:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {primaryGoal.targetLocation || candidate?.location || 'Open to Hybrid / Remote'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Compensation:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {primaryGoal.targetCompensation || candidate?.targetSalary || 'Negotiable'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Timeline:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {primaryGoal.targetTimeline || '90 Days'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center space-y-2">
              <Target className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-500">No primary goal defined yet.</p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => onNavigate('goals')}
              >
                Set Primary Goal
              </Button>
            </div>
          )}

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => onNavigate('goals')}
            >
              Manage Career Goals
            </Button>
          </div>
        </Card>
      </div>

      {/* 4. Active SMART Plan & Upcoming Interview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly SMART Objectives */}
        <Card
          className="lg:col-span-2 border border-neutral-200 dark:border-neutral-800"
          title="Active SMART Weekly Objectives"
          subtitle={
            tasks.length > 0
              ? `Active Sprints: ${completedTasks} of ${tasks.length} objectives completed.`
              : 'Initialize your SMART plan or upload a resume to generate weekly action items.'
          }
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('plan')}
              className="text-xs"
            >
              View All Tasks ({tasks.length})
            </Button>
          }
        >
          {tasks.length > 0 ? (
            <div className="space-y-2.5">
              {tasks.slice(0, 4).map((task) => {
                const isDone = task.status === 'Completed';

                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs transition-colors ${
                      isDone
                        ? 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-100 dark:border-neutral-800'
                        : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => dispatch(toggleTaskComplete(task.id))}
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer ${
                          isDone
                            ? 'bg-[#EAB308] border-[#EAB308] text-neutral-950'
                            : 'border-neutral-300 dark:border-neutral-600 hover:border-amber-500'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                      <span
                        className={`truncate font-medium ${
                          isDone
                            ? 'line-through text-neutral-400 dark:text-neutral-500'
                            : 'text-neutral-900 dark:text-neutral-100'
                        }`}
                      >
                        {task.goalName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-neutral-400 hidden sm:inline">
                        {task.week}
                      </span>
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center space-y-2">
              <CheckSquare className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-500">No SMART action tasks defined for current week.</p>
              <Button variant="outline" size="sm" onClick={() => onNavigate('plan')}>
                Create First SMART Objective
              </Button>
            </div>
          )}
        </Card>

        {/* Upcoming Interview Card */}
        <Card
          className="border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
          title="Upcoming Interview"
          subtitle="Next scheduled employer round"
          action={<StatusBadge status={upcomingInterview?.status || 'Scheduled'} />}
        >
          {upcomingInterview ? (
            <div className="space-y-3">
              <div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {upcomingInterview.role}
                </h4>
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{upcomingInterview.company}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-neutral-100">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>
                    {upcomingInterview.dateTime
                      ? new Date(upcomingInterview.dateTime).toLocaleString([], {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'Time to be announced'}
                  </span>
                </div>
                {upcomingInterview.round && (
                  <div className="text-neutral-500 text-[11px]">
                    Round: <strong>{upcomingInterview.round}</strong>
                  </div>
                )}
                {upcomingInterview.interviewer && (
                  <div className="text-neutral-500 text-[11px]">
                    Interviewer: <strong>{upcomingInterview.interviewer}</strong>
                  </div>
                )}
              </div>

              {upcomingInterview.notes && (
                <p className="text-xs text-neutral-500 line-clamp-2 italic">
                  "{upcomingInterview.notes}"
                </p>
              )}
            </div>
          ) : (
            <div className="py-6 text-center space-y-2">
              <Calendar className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-500">No upcoming interviews scheduled.</p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => onNavigate('interviews')}
              >
                Log New Interview
              </Button>
            </div>
          )}

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-4">
            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs"
              onClick={() => onNavigate('interviews')}
            >
              Prepare Checklist & Notes
            </Button>
          </div>
        </Card>
      </div>

      {/* 5. Aligned Advisory Specialists */}
      <Card
        title="Your Aligned Advisory Specialists"
        subtitle="Certified Staffing Bees coaches guiding your 7 service development layers."
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('experts')}
            className="text-xs"
          >
            All Experts ({experts.length})
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alignedExperts.map((exp) => (
            <div
              key={exp.id}
              className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-300 dark:border-amber-700">
                {exp.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    {exp.name}
                  </h4>
                  <StatusBadge status="Aligned" />
                </div>
                <div className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold truncate">
                  {exp.category}
                </div>
                <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                  {exp.title}
                </p>
                {exp.nextSession && (
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                    Next: {exp.nextSession}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
