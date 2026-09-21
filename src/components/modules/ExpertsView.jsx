/**
 * Experts View (Expert Matching & Alignment)
 *
 * Dedicated section for connecting candidates with verified specialists:
 * Career Counselor, Career Coach, Industry Mentor, Technical Trainer,
 * Interview Coach, and Career Marketing Specialist.
 * Supports the documented alignment workflow:
 * Recommended -> Request Alignment -> Pending Alignment -> Aligned -> Completed
 *
 * Used By:
 * Main App navigation ('experts').
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  requestExpertAlignment,
  updateExpertAlignmentStatus,
} from '../../store/expertsSlice';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import {
  Users,
  Briefcase,
  Clock,
  Sparkles,
  CheckCircle,
  Calendar,
  Send,
  MessageSquare,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export default function ExpertsView() {
  const dispatch = useDispatch();
  const { items: experts = [], loading } = useSelector((state) => state.experts);

  const [selectedExpert, setSelectedExpert] = useState(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [isAlignmentModalOpen, setIsAlignmentModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const openAlignmentModal = (expert) => {
    setSelectedExpert(expert);
    setRequestNotes(
      `Hi ${expert.name}, I would like to request an introductory alignment session to review my CPI assessment and target goals for ${expert.expertise}.`
    );
    setIsAlignmentModalOpen(true);
  };

  const handleSendAlignmentRequest = () => {
    if (!selectedExpert) return;
    dispatch(
      requestExpertAlignment({
        expertId: selectedExpert.id,
        notes: requestNotes,
      })
    );
    setIsAlignmentModalOpen(false);
  };

  const handleToggleDirectStatus = (expertId, newStatus) => {
    dispatch(
      updateExpertAlignmentStatus({
        expertId,
        status: newStatus,
      })
    );
  };

  // Filter experts
  const filteredExperts = experts.filter((e) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'aligned') return e.alignmentStatus === 'Aligned';
    if (categoryFilter === 'pending') return e.alignmentStatus === 'Pending Alignment';
    if (categoryFilter === 'recommended') return e.alignmentStatus === 'Recommended';
    return true;
  });

  const alignedCount = experts.filter((e) => e.alignmentStatus === 'Aligned').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            <span>Expert Matching & Alignment</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            "Know who can help you." Match with verified specialists tailored to your specific CPI development vectors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200">
            Active Advisory Team: <strong>{alignedCount} Aligned Specialists</strong>
          </span>
        </div>
      </div>

      {/* Alignment Workflow Guide */}
      <div className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/70 rounded-xl p-4">
        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
          Staffing Bees Alignment Process:
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">1. Candidate Review</span>
          <span>→</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">2. Alignment Requested</span>
          <span>→</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">3. Calendar & Scope Sync</span>
          <span>→</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">4. Aligned for Development Sprints</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
          Filter:
        </span>
        {[
          { id: 'all', label: `All Experts (${experts.length})` },
          { id: 'aligned', label: `Aligned (${alignedCount})` },
          { id: 'pending', label: 'Pending Alignment' },
          { id: 'recommended', label: 'Recommended' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              categoryFilter === tab.id
                ? 'bg-[#EAB308] text-neutral-950 font-bold shadow-xs'
                : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Experts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExperts.map((expert) => {
          const isAligned = expert.alignmentStatus === 'Aligned';
          const isPending = expert.alignmentStatus === 'Pending Alignment';
          const isRecommended = expert.alignmentStatus === 'Recommended';

          return (
            <Card
              key={expert.id}
              className={`flex flex-col justify-between transition-all border ${
                isAligned
                  ? 'border-amber-300 dark:border-amber-700/60 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                      {expert.category}
                    </span>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1.5">
                      {expert.name}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-1">{expert.title}</p>
                  </div>
                  <StatusBadge status={expert.alignmentStatus} />
                </div>

                {/* Match Reason Banner */}
                <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{expert.matchReason}</span>
                </div>

                {/* Expert Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Briefcase className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>
                      {expert.industry} • <strong>{expert.experience} exp</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{expert.availability}</span>
                  </div>

                  {expert.nextSession && (
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Next Session: {expert.nextSession}</span>
                    </div>
                  )}

                  {expert.specialization && (
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500">
                      Specialization: <span className="text-neutral-700 dark:text-neutral-300">{expert.specialization}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                {isRecommended && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    icon={Send}
                    onClick={() => openAlignmentModal(expert)}
                  >
                    Request Alignment
                  </Button>
                )}

                {isPending && (
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs text-amber-800 dark:text-amber-300 font-medium italic">
                      Awaiting response...
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleDirectStatus(expert.id, 'Aligned')}
                    >
                      Confirm Alignment
                    </Button>
                  </div>
                )}

                {isAligned && (
                  <div className="w-full flex items-center justify-between text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <UserCheck className="w-4 h-4" />
                      <span>Aligned & Active</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleDirectStatus(expert.id, 'Completed')}
                    >
                      Mark Completed
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Alignment Request Modal */}
      <Modal
        isOpen={isAlignmentModalOpen}
        onClose={() => setIsAlignmentModalOpen(false)}
        title={`Request Alignment with ${selectedExpert?.name}`}
        subtitle={`Category: ${selectedExpert?.category} • Match: ${selectedExpert?.expertise}`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-xs space-y-1">
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">
              Why this expert was recommended for you:
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              {selectedExpert?.matchReason}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Alignment Request Note & Availability
            </label>
            <textarea
              rows={4}
              value={requestNotes}
              onChange={(e) => setRequestNotes(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
              placeholder="Introduce your target objectives and request a meeting date."
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <Button variant="outline" size="sm" onClick={() => setIsAlignmentModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Send}
              onClick={handleSendAlignmentRequest}
            >
              Send Alignment Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
