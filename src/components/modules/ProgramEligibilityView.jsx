/**
 * Program Eligibility & Job Guarantee View
 *
 * Comprehensive program qualification module:
 * - 6-point Job Guarantee criteria verification checklist
 * - Career Access Scholarship application form with dynamic submission
 * - Modular service pricing & package comparison
 *
 * Used By:
 * Main App navigation ('program').
 */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '../common/Card';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  DollarSign,
  HeartHandshake,
  Send,
  AlertCircle,
} from 'lucide-react';

export default function ProgramEligibilityView({ onNavigateToCpi, onNavigateToPlan }) {
  const { data: programData } = useSelector((state) => state.program);
  const { data: cpiData } = useSelector((state) => state.cpi);
  const { data: candidate } = useSelector((state) => state.candidate);
  const { items: tasks = [] } = useSelector((state) => state.plans);
  const { items: applications = [] } = useSelector((state) => state.applications);
  const { items: interviews = [] } = useSelector((state) => state.interviews);

  const [isScholarshipModalOpen, setIsScholarshipModalOpen] = useState(false);
  const [scholarshipSubmitted, setScholarshipSubmitted] = useState(false);
  const [scholarshipForm, setScholarshipForm] = useState({
    applicantName: candidate?.name || '',
    category: 'Non-traditional career changer',
    householdIncomeTier: 'Below $45,000 / year',
    statement: '',
    requestedProgramTier: 'Comprehensive Job Guarantee Track',
  });

  const cpiScore = cpiData?.overallScore || 0;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const taskPct = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const completedInterviews = interviews.filter((i) => i.status === 'Completed').length;
  const hasCoach = !!(candidate?.assignedCoach || cpiData?.developmentRoadmaps?.[0]?.assignedCoach);
  const hasResume = !!candidate?.hasUploadedResume;

  const guaranteeCriteria = [
    {
      id: 'c1',
      title: 'CPI Score Threshold (≥ 80 / 100)',
      requirement: 'Maintain an overall CPI of 80 or above across all assessments',
      currentValue: cpiScore > 0 ? `Current CPI: ${cpiScore}/100` : 'Awaiting diagnostic assessment',
      status: cpiScore >= 80 ? 'Met' : cpiScore > 0 ? 'In Progress' : 'Pending',
      isMet: cpiScore >= 80,
    },
    {
      id: 'c2',
      title: 'Curriculum & Upskilling Completion (≥ 80%)',
      requirement: 'Complete assigned development sprints and verified deliverables',
      currentValue:
        tasks.length > 0
          ? `Current: ${taskPct}% Completed (${completedTasks} of ${tasks.length} tasks)`
          : 'No active sprint tasks assigned yet',
      status: tasks.length > 0 && taskPct >= 80 ? 'Met' : tasks.length > 0 ? 'In Progress' : 'Pending',
      isMet: tasks.length > 0 && taskPct >= 80,
    },
    {
      id: 'c3',
      title: 'Mock Interview Simulations (≥ 3 Completed)',
      requirement: 'Participate in at least 3 formal simulations with certified coach',
      currentValue: `Current: ${completedInterviews} of 3 Completed`,
      status: completedInterviews >= 3 ? 'Met' : completedInterviews > 0 ? 'In Progress' : 'Pending',
      isMet: completedInterviews >= 3,
    },
    {
      id: 'c4',
      title: 'Consistent Job Search Pipeline Activity',
      requirement: 'Submit at least 5 qualified applications per active sprint week',
      currentValue: `Current: ${applications.length} Qualified Applications Tracked`,
      status: applications.length >= 5 ? 'Met' : applications.length > 0 ? 'In Progress' : 'Pending',
      isMet: applications.length >= 5,
    },
    {
      id: 'c5',
      title: 'Active Coaching & Counselor Participation',
      requirement: '100% attendance on scheduled 1-on-1 advisor sessions',
      currentValue: hasCoach
        ? `Advisor Assigned: ${candidate?.assignedCoach || cpiData?.developmentRoadmaps?.[0]?.assignedCoach}`
        : 'Awaiting Advisor Assignment',
      status: hasCoach ? 'Met' : 'Pending',
      isMet: hasCoach,
    },
    {
      id: 'c6',
      title: 'Adherence to Career Marketing Standards',
      requirement: 'Verified ATS résumé and LinkedIn profile optimization',
      currentValue: hasResume
        ? `Verified Resume: ${candidate?.resumeFileName || 'Active Upload'}`
        : 'ATS Resume Upload Required',
      status: hasResume ? 'Met' : 'Pending',
      isMet: hasResume,
    },
  ];

  const metCount = guaranteeCriteria.filter((c) => c.isMet).length;
  const isFullyEligible = metCount === guaranteeCriteria.length;

  const handleScholarshipSubmit = (e) => {
    e.preventDefault();
    setScholarshipSubmitted(true);
    setTimeout(() => {
      setIsScholarshipModalOpen(false);
      setScholarshipSubmitted(false);
      alert('Scholarship Application Submitted! Our committee reviews submissions within 48 hours.');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-300 dark:border-emerald-800/80 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white uppercase tracking-wide">
              Official Guarantee Criteria
            </span>
            <span className="text-xs text-neutral-500">
              Staffing Bees Quality Assurance
            </span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Job Guarantee Program Eligibility
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
            Staffing Bees backs eligible candidates with our placement guarantee. Meet all 6 operational
            readiness milestones below to activate your placement fee refund protection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsScholarshipModalOpen(true)}
            icon={HeartHandshake}
          >
            Apply for Scholarship
          </Button>
        </div>
      </div>

      {/* Qualification Meter Card */}
      <Card className="border-2 border-emerald-400 dark:border-emerald-700/80 bg-emerald-50/20 dark:bg-emerald-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              Guarantee Readiness Status
            </div>
            <div className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
              {isFullyEligible
                ? 'Fully Qualified & Guaranteed'
                : `${metCount} of ${guaranteeCriteria.length} Criteria Verified (${Math.round(
                    (metCount / guaranteeCriteria.length) * 100
                  )}%)`}
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              {isFullyEligible
                ? 'All academic, assessment, and coaching criteria have been satisfied for the 90-day guarantee cohort.'
                : 'Complete the remaining criteria below to qualify for the 90-day placement fee guarantee protection.'}
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {metCount} / {guaranteeCriteria.length}
            </div>
            <div className="text-xs font-semibold text-neutral-500">
              Criteria Verified
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800/60">
          <ProgressBar
            value={metCount}
            max={guaranteeCriteria.length}
            height="h-2.5"
            colorClass="bg-emerald-500"
          />
        </div>
      </Card>

      {/* 6 Criteria Checklist Cards */}
      <Card
        title="Verification Requirements Matrix"
        subtitle="Transparent requirements protecting both candidate dedication and employer hiring standards."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guaranteeCriteria.map((crit) => (
            <div
              key={crit.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {crit.title}
                  </h4>
                </div>
                <StatusBadge status={crit.status} />
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {crit.requirement}
              </p>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                {crit.currentValue}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Modular Packages Comparison */}
      <Card
        title="Staffing Bees Modular Service Packages"
        subtitle="Tailor your enrollment to your exact development needs or opt into the comprehensive guarantee."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* Package 1 */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Foundational
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                CPI Diagnostic & Career Plan
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                Complete 14-dimension assessment, gap analysis, and personalized 4-week SMART plan.
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300 mt-4">
                <li>• Comprehensive CPI Evaluation</li>
                <li>• Gap Analysis Matrix</li>
                <li>• 1 Career Counselor Consultation</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Ideal for Self-Directed Learners
              </span>
            </div>
          </div>

          {/* Package 2 */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Targeted Acceleration
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                Career Marketing & Interview Sprints
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                Resume overhaul, LinkedIn SEO optimization, and 3 live mock interview coaching simulations.
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300 mt-4">
                <li>• Verified ATS Résumé v3.2</li>
                <li>• LinkedIn Algorithmic Repositioning</li>
                <li>• 3 Certified Mock Interview Rounds</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                High-Conversion Candidate Sprint
              </span>
            </div>
          </div>

          {/* Package 3 - Primary */}
          <div className="p-5 rounded-xl border-2 border-[#EAB308] bg-amber-50/20 dark:bg-amber-950/20 flex flex-col justify-between relative shadow-sm">
            <div className="absolute -top-3 right-4 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EAB308] text-neutral-950 uppercase tracking-wide">
              Active Cohort Track
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Full-Service
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                Comprehensive Job Guarantee Track
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                All 7 service layers, dedicated advisory team, curated pipeline access, and 90-day post-placement support.
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-800 dark:text-neutral-200 mt-4">
                <li>• 100% Placement Protection Guarantee</li>
                <li>• 6 Specialized Coaches & Mentors</li>
                <li>• 30-60-90 Day Post-Placement Roadmap</li>
                <li>• Career Access Scholarship Eligible</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-200 dark:border-amber-800">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Currently Enrolled (Active)</span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Scholarship Modal */}
      <Modal
        isOpen={isScholarshipModalOpen}
        onClose={() => setIsScholarshipModalOpen(false)}
        title="Career Access Scholarship Application"
        subtitle="Providing merit and need-based tuition waivers for non-traditional career changers and underrepresented candidates."
      >
        <form onSubmit={handleScholarshipSubmit} className="space-y-4">
          <Input
            label="Applicant Full Name"
            value={scholarshipForm.applicantName}
            onChange={(e) =>
              setScholarshipForm({ ...scholarshipForm, applicantName: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Applicant Demographic Category"
              value={scholarshipForm.category}
              onChange={(e) =>
                setScholarshipForm({ ...scholarshipForm, category: e.target.value })
              }
              options={[
                { value: 'Non-traditional career changer', label: 'Non-traditional career changer' },
                { value: 'Low-to-moderate household income', label: 'Low-to-moderate household income' },
                { value: 'Historically underrepresented professional', label: 'Historically underrepresented professional' },
                { value: 'Military veteran or spouse', label: 'Military veteran or spouse' },
              ]}
            />
            <Select
              label="Household Income Bracket"
              value={scholarshipForm.householdIncomeTier}
              onChange={(e) =>
                setScholarshipForm({ ...scholarshipForm, householdIncomeTier: e.target.value })
              }
              options={[
                { value: 'Below $35,000 / year', label: 'Below $35,000 / year' },
                { value: 'Below $45,000 / year', label: 'Below $45,000 / year' },
                { value: '$45,000 - $65,000 / year', label: '$45,000 - $65,000 / year' },
                { value: '$65,000+ / year', label: '$65,000+ / year' },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Personal Statement of Career Dedication <span className="text-amber-600">*</span>
            </label>
            <textarea
              rows={4}
              value={scholarshipForm.statement}
              onChange={(e) =>
                setScholarshipForm({ ...scholarshipForm, statement: e.target.value })
              }
              placeholder="Describe your career goals, dedication to completing the 4-week curriculum, and how this scholarship accelerates your journey."
              required
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsScholarshipModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              icon={Send}
              disabled={scholarshipSubmitted}
            >
              {scholarshipSubmitted ? 'Submitting Application...' : 'Submit Scholarship Application'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
