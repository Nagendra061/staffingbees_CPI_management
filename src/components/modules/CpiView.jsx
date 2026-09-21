/**
 * CPI View (Candidate Performance Index)
 *
 * Dedicated section for Staffing Bees' central assessment methodology.
 * Displays overall CPI score, the 14 dimension metrics, benchmark comparisons,
 * and personalized development roadmaps with target uplift plans.
 *
 * Used By:
 * Main App when navigating to 'cpi'.
 */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '../common/Card';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import StatusBadge from '../common/StatusBadge';
import LoadingState from '../common/LoadingState';
import CpiAssessmentModal from './CpiAssessmentModal';
import {
  Activity,
  PlayCircle,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

export default function CpiView({ onNavigateToPlan, onNavigateToExperts }) {
  const { data: cpiData, loading } = useSelector((state) => state.cpi);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  if (loading && !cpiData) {
    return <LoadingState message="Loading Candidate Performance Index..." />;
  }

  const overallScore = cpiData?.overallScore || 0;
  const dimensions = cpiData?.dimensions || {};
  const dimensionList = Object.entries(dimensions).map(([name, val]) => ({
    name,
    ...val,
  }));
  const roadmaps = cpiData?.developmentRoadmaps || [];

  const baselineScore = cpiData?.historicalScores?.[0]?.score;
  const scoreDelta =
    overallScore > 0 && baselineScore && (cpiData?.historicalScores?.length || 0) > 1
      ? overallScore - baselineScore
      : null;

  // Dynamic strengths and development areas
  const sortedByScoreDesc = [...dimensionList].sort((a, b) => (b.score || 0) - (a.score || 0));
  const sortedByScoreAsc = [...dimensionList].sort((a, b) => (a.score || 0) - (b.score || 0));

  const topStrengthsList = sortedByScoreDesc.slice(0, 2);
  const priorityGapsList = sortedByScoreAsc.slice(0, 2);

  // Filter dimensions
  const filteredDimensions = dimensionList.filter((dim) => {
    if (categoryFilter === 'priority') return dim.score < 80;
    if (categoryFilter === 'strong') return dim.score >= 85;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Assessment Launch */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-700/60 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAB308] text-neutral-950 uppercase tracking-wide">
              Employability Diagnostic
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Last Assessed: {cpiData?.lastAssessmentDate || 'Recent'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Candidate Performance Index (CPI)
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
            CPI is your strategic roadmap, not a rejection score. It evaluates your readiness
            across 14 proprietary dimensions to identify immediate career development vectors.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={PlayCircle}
          onClick={() => setIsAssessmentOpen(true)}
          className="shrink-0"
        >
          Take CPI Assessment
        </Button>
      </div>

      {/* Overall Scorecard & Benchmark Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Overall Score */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Overall Index
              </span>
              <Activity className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-neutral-900 dark:text-neutral-100">
                {overallScore > 0 ? overallScore : '--'}
              </span>
              <span className="text-base font-semibold text-neutral-400">/ 100</span>
            </div>
            {scoreDelta !== null ? (
              <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>
                  {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} points since baseline ({baselineScore})
                </span>
              </div>
            ) : (
              <div className="mt-2 text-xs text-neutral-500 flex items-center gap-1 font-medium">
                <span>{overallScore > 0 ? 'Baseline calibrated' : 'Awaiting diagnostic assessment'}</span>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <ProgressBar value={overallScore} height="h-2.5" />
            <p className="text-[11px] text-neutral-500 mt-1.5">
              Target threshold for Job Guarantee qualification: <strong>80/100</strong>{' '}
              {overallScore >= 80 ? '(Met)' : '(In Progress)'}
            </p>
          </div>
        </Card>

        {/* Priority Improvement Vector */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Key Development Area
              </span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              {priorityGapsList.length > 0 && overallScore > 0
                ? priorityGapsList.map((g) => `${g.name} (${g.score})`).join(' & ')
                : 'Pending assessment'}
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5">
              {priorityGapsList.length > 0 && overallScore > 0
                ? 'These dimensions currently sit below the 80-point target and are prioritized for coaching sprints.'
                : 'Complete the CPI diagnostic to pinpoint targeted skill and readiness vectors.'}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              {roadmaps.length > 0 ? `${roadmaps.length} Sprints Assigned` : 'No Sprints Assigned'}
            </span>
          </div>
        </Card>

        {/* Top Strengths */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Primary Market Strengths
              </span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              {topStrengthsList.length > 0 && overallScore > 0
                ? topStrengthsList.map((s) => `${s.name} (${s.score})`).join(' & ')
                : 'Pending assessment'}
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5">
              {topStrengthsList.length > 0 && overallScore > 0
                ? 'Demonstrated strong domain competence and adaptability matching target career employers.'
                : 'Upload your resume or complete the assessment to benchmark your profile strengths.'}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {overallScore >= 80 ? 'Top Tier Candidate Cohort' : 'Active Candidate Cohort'}
            </span>
          </div>
        </Card>
      </div>

      {/* CPI Result: Development Roadmaps */}
      <Card
        title="CPI Development Roadmaps (Action Plans)"
        subtitle="Staffing Bees translates assessment scores directly into structured improvement activities."
      >
        {roadmaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roadmaps.map((item) => (
              <div
                key={item.id}
                className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {item.dimension}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {item.currentScore}
                    </span>
                    <span className="text-xs text-neutral-500">→ Target: {item.targetScore}</span>
                  </div>
                  <ProgressBar
                    value={item.currentScore}
                    max={item.targetScore}
                    showPercentage={false}
                    height="h-1.5"
                    className="mb-3"
                  />
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                    {item.recommendedActivity}
                  </p>
                  <div className="text-[11px] text-neutral-500 mt-2">
                    Coach: <strong className="text-neutral-700 dark:text-neutral-300">{item.assignedCoach}</strong>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500">{item.reassessmentStatus}</span>
                  {onNavigateToPlan && (
                    <button
                      onClick={() => onNavigateToPlan()}
                      className="text-amber-700 dark:text-amber-400 font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <span>View in Plan</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-neutral-500">
            No development roadmaps generated yet. Complete your CPI diagnostic or upload a resume to generate tailored uplift sprints.
          </div>
        )}
      </Card>

      {/* 14 CPI Dimensions Matrix */}
      <Card
        title="The 14 CPI Employability Dimensions"
        subtitle="Individual evaluation breakdown across the complete Staffing Bees framework."
        action={
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <div className="flex text-xs bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-white dark:bg-neutral-700 font-semibold shadow-xs'
                    : 'text-neutral-500'
                }`}
              >
                All (14)
              </button>
              <button
                onClick={() => setCategoryFilter('priority')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  categoryFilter === 'priority'
                    ? 'bg-white dark:bg-neutral-700 font-semibold shadow-xs text-amber-700'
                    : 'text-neutral-500'
                }`}
              >
                Priority (&lt;80)
              </button>
              <button
                onClick={() => setCategoryFilter('strong')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  categoryFilter === 'strong'
                    ? 'bg-white dark:bg-neutral-700 font-semibold shadow-xs text-emerald-700'
                    : 'text-neutral-500'
                }`}
              >
                Optimal (85+)
              </button>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDimensions.map((dim) => {
            const isPriority = dim.score < 80;
            const isTop = dim.score >= 88;

            return (
              <div
                key={dim.name}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-amber-300 dark:hover:border-amber-700/60 transition-colors bg-white dark:bg-neutral-900"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {dim.name}
                  </h4>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isTop
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                        : isPriority
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                        : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {dim.score} / 100
                  </span>
                </div>

                <div className="mb-2">
                  <ProgressBar
                    value={dim.score}
                    showPercentage={false}
                    height="h-1.5"
                    colorClass={isPriority ? 'bg-amber-500' : 'bg-[#EAB308]'}
                  />
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {dim.summary}
                </p>

                <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>Benchmark: {dim.benchmark || 80}</span>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    {dim.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Assessment Modal */}
      <CpiAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
      />
    </div>
  );
}
