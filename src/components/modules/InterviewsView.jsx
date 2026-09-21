/**
 * Interviews View (Interviews & Preparation)
 *
 * Comprehensive interview management module:
 * Phone Screen, Video Interview, Technical Interview, Behavioral Interview, Final Interview.
 * Features an interactive preparation checklist for each round, interview notes,
 * and outcome tracking.
 *
 * Used By:
 * Main App navigation ('interviews').
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addInterview,
  updateInterview,
  deleteInterview,
  toggleInterviewChecklistItem,
} from '../../store/interviewsSlice';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import ConfirmationDialog from '../common/ConfirmationDialog';
import {
  Calendar,
  PlusCircle,
  Clock,
  Building,
  Video,
  CheckSquare,
  Square,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const ROUND_OPTIONS = [
  { value: 'Phone Screen', label: 'Phone Screen' },
  { value: 'Video Interview', label: 'Video Interview' },
  { value: 'Technical Interview', label: 'Technical Interview' },
  { value: 'Behavioral Interview', label: 'Behavioral Interview' },
  { value: 'Final Interview', label: 'Final Interview' },
];

export default function InterviewsView({ onNavigateToExperts }) {
  const dispatch = useDispatch();
  const { items: interviews = [], loading } = useSelector((state) => state.interviews);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [interviewToDelete, setInterviewToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    round: 'Behavioral Interview',
    dateTime: '',
    interviewer: '',
    platform: 'Microsoft Teams',
    status: 'Scheduled',
    preparationStatus: 'In Progress',
    notes: '',
    preparationChecklist: [
      { id: 'chk-1', text: 'Review target job description and required competencies', completed: false },
      { id: 'chk-2', text: 'Prepare STAR behavioral scenario examples', completed: false },
      { id: 'chk-3', text: 'Research company background and recent initiatives', completed: false },
      { id: 'chk-4', text: 'Prepare 3-5 thoughtful questions for interviewer', completed: false },
    ],
  });

  const openCreateModal = () => {
    setEditingInterview(null);
    setFormData({
      company: '',
      role: '',
      round: 'Screening / Initial Round',
      dateTime: '',
      interviewer: '',
      platform: 'Microsoft Teams',
      status: 'Scheduled',
      preparationStatus: 'In Progress',
      notes: '',
      preparationChecklist: [
        { id: `c-${Date.now()}-1`, text: 'Review role requirements and core responsibilities', completed: false },
        { id: `c-${Date.now()}-2`, text: 'Prepare STAR stories matching required skills', completed: false },
        { id: `c-${Date.now()}-3`, text: 'Conduct mock simulation or practice elevator pitch', completed: false },
        { id: `c-${Date.now()}-4`, text: 'Prepare questions for the interview team', completed: false },
      ],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (interview) => {
    setEditingInterview(interview);
    setFormData({
      company: interview.company || '',
      role: interview.role || '',
      round: interview.round || 'Behavioral Interview',
      dateTime: interview.dateTime || '',
      interviewer: interview.interviewer || '',
      platform: interview.platform || 'Zoom',
      status: interview.status || 'Scheduled',
      preparationStatus: interview.preparationStatus || 'In Progress',
      notes: interview.notes || '',
      preparationChecklist: interview.preparationChecklist || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingInterview) {
      dispatch(updateInterview({ id: editingInterview.id, data: formData }));
    } else {
      dispatch(addInterview(formData));
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (interviewToDelete) {
      dispatch(deleteInterview(interviewToDelete.id));
      setInterviewToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            <span>Interviews & Interactive Preparation</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Stage-by-stage interview tracking, personalized prep checklists, and mock simulation feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToExperts && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToExperts}
              icon={Sparkles}
            >
              Book Mock Session
            </Button>
          )}
          <Button variant="primary" size="sm" icon={PlusCircle} onClick={openCreateModal}>
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Interview List */}
      {interviews.length === 0 ? (
        <EmptyState
          title="No interviews scheduled yet"
          description="Schedule your upcoming phone screens, technical rounds, or behavioral interviews to generate customized preparation checklists."
          actionLabel="Schedule Interview"
          onAction={openCreateModal}
          icon={Calendar}
        />
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => {
            const checklist = interview.preparationChecklist || [];
            const completedItems = checklist.filter((i) => i.completed).length;
            const isFinished = interview.status === 'Completed';

            return (
              <Card
                key={interview.id}
                className="border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200">
                        {interview.round}
                      </span>
                      <StatusBadge status={interview.status} />
                      <span className="text-xs text-neutral-500 font-medium">
                        Prep Status: <strong className="text-neutral-700 dark:text-neutral-300">{interview.preparationStatus}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                      <button
                        onClick={() => openEditModal(interview)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Edit Interview"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setInterviewToDelete(interview)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete Interview"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Header info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {interview.role}
                      </h3>
                      <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 mt-0.5">
                        <Building className="w-4 h-4 text-neutral-400" />
                        <span>{interview.company}</span>
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        Interviewer: <strong className="text-neutral-700 dark:text-neutral-300">{interview.interviewer}</strong>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start md:items-end space-y-1 text-xs">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-100 dark:border-neutral-800">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>
                          {interview.dateTime
                            ? new Date(interview.dateTime).toLocaleString([], {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })
                            : 'Date TBD'}
                        </span>
                      </div>
                      <div className="text-neutral-500 flex items-center gap-1 pt-1">
                        <Video className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Platform: {interview.platform}</span>
                      </div>
                    </div>
                  </div>

                  {/* Preparation Checklist */}
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 border border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2.5">
                      <span className="uppercase tracking-wider text-[11px] text-neutral-500">
                        Interview Preparation Checklist
                      </span>
                      <span className="text-amber-800 dark:text-amber-300">
                        {completedItems} of {checklist.length} Completed
                      </span>
                    </div>

                    <div className="space-y-2">
                      {checklist.map((item) => (
                        <div
                          key={item.id}
                          onClick={() =>
                            dispatch(
                              toggleInterviewChecklistItem({
                                interviewId: interview.id,
                                itemId: item.id,
                              })
                            )
                          }
                          className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none hover:text-neutral-950 dark:hover:text-white"
                        >
                          <div className="mt-0.5 shrink-0 text-amber-600">
                            {item.completed ? (
                              <CheckSquare className="w-4 h-4 text-[#EAB308]" />
                            ) : (
                              <Square className="w-4 h-4 text-neutral-300 dark:text-neutral-600" />
                            )}
                          </div>
                          <span
                            className={
                              item.completed
                                ? 'line-through text-neutral-400 dark:text-neutral-500'
                                : 'font-medium'
                            }
                          >
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes / Feedback */}
                  {interview.notes && (
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        Focus Notes:
                      </span>{' '}
                      {interview.notes}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Interview Modal (Create / Edit) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingInterview ? 'Edit Interview Details' : 'Schedule New Interview'}
        subtitle="Manage round, interviewer information, video platform, and preparation focus."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g. Rush University Medical Center"
              required
            />
            <Input
              label="Role Title"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Clinical Data Analyst"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Interview Round"
              value={formData.round}
              onChange={(e) => setFormData({ ...formData, round: e.target.value })}
              options={ROUND_OPTIONS}
            />
            <Input
              label="Date & Time"
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Interviewer(s) & Titles"
              value={formData.interviewer}
              onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
              placeholder="e.g. Dr. Sarah Lin (Director of Informatics)"
            />
            <Input
              label="Video / Phone Platform"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              placeholder="e.g. Zoom, Microsoft Teams, On-site"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Interview Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Scheduled', label: 'Scheduled' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Pending Feedback', label: 'Pending Feedback' },
                { value: 'Advanced to Next Round', label: 'Advanced to Next Round' },
                { value: 'Offer Extended', label: 'Offer Extended' },
              ]}
            />
            <Select
              label="Preparation Status"
              value={formData.preparationStatus}
              onChange={(e) => setFormData({ ...formData, preparationStatus: e.target.value })}
              options={[
                { value: 'Not Started', label: 'Not Started' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Mock Completed', label: 'Mock Completed' },
                { value: 'Ready', label: 'Ready for Interview' },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Preparation Focus & Questions
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Key talking points, STAR behavioral stories, or technical requirements."
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingInterview ? 'Save Changes' : 'Schedule Interview'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(interviewToDelete)}
        onClose={() => setInterviewToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Interview"
        message={`Are you sure you want to remove the ${interviewToDelete?.round} with ${interviewToDelete?.company}?`}
      />
    </div>
  );
}
