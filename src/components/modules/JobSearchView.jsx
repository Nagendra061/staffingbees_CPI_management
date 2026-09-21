/**
 * Job Search Management View
 *
 * Strategic opportunity pipeline designed to avoid blind spam applications.
 * Tracks Target Employers, Target Roles, Qualified Match Scores,
 * and enables direct conversion into tracked active applications.
 *
 * Used By:
 * Main App navigation ('jobsearch').
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addApplication } from '../../store/applicationsSlice';
import Card from '../common/Card';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import {
  Search,
  Building,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle,
  ExternalLink,
  PlusCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function JobSearchView({ onNavigateToApplications }) {
  const dispatch = useDispatch();
  const { items: applications = [] } = useSelector((state) => state.applications);

  const [appliedJobs, setAppliedJobs] = useState({});

  // Verified Opportunities curated for candidate's target role & CPI profile
  const curatedOpportunities = [
    {
      id: 'opp-1',
      title: 'Healthcare Analytics Specialist',
      company: 'Northwestern Medicine',
      location: 'Chicago, IL (Hybrid)',
      salaryRange: '$98,000 - $112,000',
      matchScore: 94,
      department: 'Clinical Quality & Patient Safety',
      postedDate: '2 days ago',
      keyRequirements: ['SQL / Tableau', 'Clinical EHR Workflows', 'HIPAA Compliance'],
      whyMatched: 'Matches 94% with your CPI Market Fit (88) and Technical Capabilities.',
    },
    {
      id: 'opp-2',
      title: 'Clinical Data Analyst',
      company: 'Rush University Medical Center',
      location: 'Chicago, IL (On-site)',
      salaryRange: '$92,000 - $105,000',
      matchScore: 89,
      department: 'Informatics Research Core',
      postedDate: '4 days ago',
      keyRequirements: ['Claims Data EDI 837/835', 'Python / R', 'Data Pipeline Hygiene'],
      whyMatched: 'Direct alignment with your Sprint 2 technical upskilling with David Chen.',
    },
    {
      id: 'opp-3',
      title: 'Senior EHR Implementation Analyst',
      company: 'Advocate Health',
      location: 'Downers Grove, IL (Hybrid)',
      salaryRange: '$105,000 - $120,000',
      matchScore: 86,
      department: 'Enterprise Clinical Systems',
      postedDate: '1 week ago',
      keyRequirements: ['Epic Clarity / Caboodle', 'Executive Presentation', 'Cross-Functional Leadership'],
      whyMatched: 'Strong compensation benchmark matching your primary career goal ($95k-$115k).',
    },
    {
      id: 'opp-4',
      title: 'Healthcare Informatics Consultant',
      company: 'Slalom Consulting',
      location: 'Chicago, IL (Hybrid / Remote)',
      salaryRange: '$110,000 - $125,000',
      matchScore: 82,
      department: 'Healthcare & Life Sciences Practice',
      postedDate: '3 days ago',
      keyRequirements: ['Client Stakeholder Presentation', 'Healthcare Analytics', 'Agile Delivery'],
      whyMatched: 'High-growth trajectory matching your long-term consulting goals.',
    },
  ];

  const handleApply = (opp) => {
    dispatch(
      addApplication({
        company: opp.company,
        role: opp.title,
        status: 'Applied',
        location: opp.location,
        salaryRange: opp.salaryRange,
        applicationDate: new Date().toISOString().split('T')[0],
        matchScore: opp.matchScore,
        source: 'Staffing Bees Curated Opportunity',
        qualificationMatchRate: opp.matchScore,
        notes: `Applied through curated strategic opportunity matching. ${opp.whyMatched}`,
        nextFollowUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
    );
    setAppliedJobs((prev) => ({ ...prev, [opp.id]: true }));
  };

  const activeAppsCount = applications.length;
  const qualifiedCount = applications.filter((a) => (a.qualificationMatchRate || 0) >= 80).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-600" />
            <span>Strategic Job Search Pipeline</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Target high-probability employers verified for candidate-market fit rather than blind submissions.
          </p>
        </div>

        {onNavigateToApplications && (
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateToApplications}
            icon={Briefcase}
          >
            View Active Tracker ({activeAppsCount})
          </Button>
        )}
      </div>

      {/* Pipeline Metrics Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Target Employers
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            24
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            Regional healthcare networks
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Applications Submitted
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            {activeAppsCount}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            Controlled high-quality volume
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/20 dark:bg-amber-950/10">
          <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            Qualified Matches (80%+)
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            {qualifiedCount}
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
            Highest interview yield
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Average Match Score
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            87%
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            Above 80% guarantee standard
          </div>
        </div>
      </div>

      {/* Curated Opportunities List */}
      <Card
        title="Curated High-Fit Opportunities"
        subtitle="Opportunities algorithmically filtered and approved by your Staffing Bees advisory team."
      >
        <div className="space-y-4">
          {curatedOpportunities.map((opp) => {
            const isApplied =
              appliedJobs[opp.id] ||
              applications.some((a) => a.company.toLowerCase() === opp.company.toLowerCase());

            return (
              <div
                key={opp.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all bg-white dark:bg-neutral-900 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {opp.title}
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {opp.matchScore}% Match
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">
                      • {opp.postedDate}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{opp.company}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{opp.location}</span>
                    </span>
                    <span className="flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{opp.salaryRange}</span>
                    </span>
                  </div>

                  {/* Requirements chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {opp.keyRequirements.map((req, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      >
                        {req}
                      </span>
                    ))}
                  </div>

                  {/* Why matched */}
                  <div className="text-xs text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1.5 pt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{opp.whyMatched}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-100 dark:border-neutral-800">
                  {isApplied ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-4 h-4" />
                      <span>Application Tracked</span>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={PlusCircle}
                      onClick={() => handleApply(opp)}
                    >
                      Apply & Track
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
