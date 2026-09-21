/**
 * Gap Analysis View
 *
 * Compares the candidate's Current Baseline State vs. the Target Career Goal
 * across 7 core vectors: Skills, Communication, Interview Readiness, Experience,
 * Market Fit, Career Marketing, and Technical Capabilities.
 *
 * Used By:
 * Main App navigation ('gap').
 */
import React from 'react';
import { useSelector } from 'react-redux';
import Card from '../common/Card';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import {
  GitFork,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  UploadCloud,
} from 'lucide-react';

export default function GapAnalysisView({ onNavigateToPlan, onNavigateToExperts, onNavigateToResume }) {
  const { data: candidate } = useSelector((state) => state.candidate);
  const { data: cpiData } = useSelector((state) => state.cpi);
  const { items: goals = [] } = useSelector((state) => state.goals);
  const { items: experts = [] } = useSelector((state) => state.experts);

  const primaryGoal = goals[0];
  const overallScore = cpiData?.overallScore || 0;
  const dimensions = cpiData?.dimensions || {};
  const roadmaps = cpiData?.developmentRoadmaps || [];

  // Generate dynamic gap items from CPI dimensions and roadmaps
  const dynamicGaps = Object.entries(dimensions)
    .filter(([_, dim]) => dim.score < 85)
    .map(([name, dim]) => {
      const roadmapMatch = roadmaps.find((r) => r.dimension === name);
      const isHighPriority = dim.score < 75;
      const assignedCoach = roadmapMatch?.assignedCoach || experts[0]?.name || 'Assigned Career Coach';

      return {
        category: name,
        currentState: `Diagnostic score ${dim.score}/100. ${dim.weight ? `Evaluated at ${Math.round(dim.weight * 100)}% weight.` : ''}`,
        targetState: `Benchmark target score ≥ ${roadmapMatch?.targetScore || 80}/100 for competitive candidate positioning.`,
        gapSeverity: isHighPriority ? 'High Priority' : 'Medium Priority',
        actionPlan: roadmapMatch?.recommendedActivity || `Targeted coaching sprint and skill reinforcement with ${assignedCoach}.`,
        status: roadmapMatch?.status || (dim.score >= 80 ? 'Completed' : 'In Progress'),
        assignedExpert: assignedCoach,
      };
    });

  // Fallback to development roadmaps if dimensions are not structured
  const gapItems =
    dynamicGaps.length > 0
      ? dynamicGaps
      : roadmaps.map((r) => ({
          category: r.dimension,
          currentState: `Current score: ${r.currentScore}/100.`,
          targetState: `Target benchmark: ${r.targetScore}/100.`,
          gapSeverity: r.currentScore < 75 ? 'High Priority' : 'Medium Priority',
          actionPlan: r.recommendedActivity,
          status: r.status || 'In Progress',
          assignedExpert: r.assignedCoach || 'Dedicated Coach',
        }));

  const currentTitle =
    candidate?.currentRole ||
    (candidate?.experience?.[0] ? `${candidate.experience[0].title} (${candidate.experience[0].company})` : null) ||
    'Baseline Candidate Profile';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <GitFork className="w-5 h-5 text-amber-600" />
            <span>Gap Analysis Matrix</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            "What is stopping me?" Pinpoint the exact discrepancies between where you stand today and what employers demand.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToPlan && (
            <Button variant="primary" size="sm" onClick={onNavigateToPlan} icon={Sparkles}>
              Transfer to SMART Plan
            </Button>
          )}
        </div>
      </div>

      {/* Target Comparison Headline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Current State Baseline
          </div>
          <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            {currentTitle} • CPI: {overallScore > 0 ? `${overallScore}/100` : '--'}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {candidate?.skills?.length
              ? `Core competencies: ${candidate.skills.slice(0, 4).join(', ')}.`
              : 'Upload your resume to calibrate your baseline capabilities and experience.'}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/20 dark:bg-amber-950/10">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">
            Target Career Goal
          </div>
          <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            {primaryGoal?.desiredRole || 'Target Career Role'} • {primaryGoal?.targetSalary || 'Benchmark Compensation'}
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            {primaryGoal?.targetIndustry
              ? `Industry focus: ${primaryGoal.targetIndustry}. Targeted placement in ${primaryGoal.targetLocation || 'Preferred Region'}.`
              : 'Configure your career goals to benchmark market requirements.'}
          </p>
        </div>
      </div>

      {/* Gap Analysis Cards */}
      {gapItems.length > 0 ? (
        <div className="space-y-4">
          {gapItems.map((item, idx) => (
            <Card key={idx} className="border border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {item.category}
                    </span>
                    <StatusBadge status={item.status} />
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        item.gapSeverity === 'High Priority'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : item.gapSeverity === 'Medium Priority'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {item.gapSeverity}
                    </span>
                  </div>

                  {/* State Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
                      <span className="font-semibold text-neutral-500 block mb-0.5">
                        Current Capability:
                      </span>
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {item.currentState}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40">
                      <span className="font-semibold text-amber-800 dark:text-amber-300 block mb-0.5">
                        Target Expectation:
                      </span>
                      <span className="text-neutral-800 dark:text-neutral-200">
                        {item.targetState}
                      </span>
                    </div>
                  </div>

                  {/* Resolution Plan */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                      <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                      <span>Resolution Strategy:</span>
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {item.actionPlan}
                    </span>
                    {item.assignedExpert && (
                      <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                        (Assigned: {item.assignedExpert})
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="shrink-0 flex items-center gap-2">
                  {onNavigateToPlan && (
                    <Button variant="outline" size="sm" onClick={onNavigateToPlan}>
                      Track in Plan
                    </Button>
                  )}
                  {onNavigateToExperts && (
                    <Button variant="ghost" size="sm" onClick={onNavigateToExperts}>
                      Consult Expert
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center space-y-3">
          <GitFork className="w-8 h-8 text-neutral-400 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            No Capability Gaps Identified Yet
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Upload your resume or run the CPI diagnostic assessment to automatically pinpoint market discrepancies and assign coaching roadmaps.
          </p>
          {onNavigateToResume && (
            <div className="pt-2">
              <Button variant="primary" size="sm" icon={UploadCloud} onClick={onNavigateToResume}>
                Upload Resume
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
