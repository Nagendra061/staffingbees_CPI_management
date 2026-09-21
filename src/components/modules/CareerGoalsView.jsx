/**
 * Career Goals View
 *
 * Enables candidates to define, prioritize, and manage their Target Career Goals,
 * compensation benchmarks, timeline, milestones, and strategic objectives.
 *
 * Used By:
 * Main App navigation ('goals').
 */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addGoal,
  updateGoal,
  deleteGoal,
  setPrimaryGoal,
} from '../../store/goalsSlice';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import ConfirmationDialog from '../common/ConfirmationDialog';
import {
  Target,
  PlusCircle,
  Calendar,
  DollarSign,
  MapPin,
  Building,
  CheckCircle,
  Pencil,
  Trash2,
  Star,
  Compass,
} from 'lucide-react';

export default function CareerGoalsView({ onNavigateToPlan }) {
  const dispatch = useDispatch();
  const { items: goals = [], loading } = useSelector((state) => state.goals);
  const { data: candidate } = useSelector((state) => state.candidate);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    desiredRole: '',
    targetIndustry: '',
    targetLocation: '',
    targetCompensation: '',
    careerDirection: '',
    targetTimeline: '90 Days',
    objective: '',
    status: 'In Progress',
  });

  // Listen for global custom events from header
  useEffect(() => {
    const handleOpenModal = () => {
      setEditingGoal(null);
      setFormData({
        desiredRole: candidate?.targetRole || '',
        targetIndustry: candidate?.targetIndustry || '',
        targetLocation: candidate?.location || 'Open to Hybrid / Remote',
        targetCompensation: candidate?.targetSalary || '',
        careerDirection: candidate?.targetRole ? `${candidate.targetRole} Trajectory` : '',
        targetTimeline: '90 Days',
        objective: '',
        status: 'In Progress',
      });
      setIsModalOpen(true);
    };

    window.addEventListener('open-new-goal-modal', handleOpenModal);
    return () => window.removeEventListener('open-new-goal-modal', handleOpenModal);
  }, [candidate]);

  const openCreateModal = () => {
    setEditingGoal(null);
    setFormData({
      desiredRole: candidate?.targetRole || '',
      targetIndustry: candidate?.targetIndustry || '',
      targetLocation: candidate?.location || 'Open to Hybrid / Remote',
      targetCompensation: candidate?.targetSalary || '',
      careerDirection: candidate?.targetRole ? `${candidate.targetRole} Trajectory` : '',
      targetTimeline: '90 Days',
      objective: '',
      status: 'In Progress',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      desiredRole: goal.desiredRole || '',
      targetIndustry: goal.targetIndustry || '',
      targetLocation: goal.targetLocation || '',
      targetCompensation: goal.targetCompensation || '',
      careerDirection: goal.careerDirection || '',
      targetTimeline: goal.targetTimeline || '90 Days',
      objective: goal.objective || '',
      status: goal.status || 'In Progress',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingGoal) {
      dispatch(updateGoal({ id: editingGoal.id, data: formData }));
    } else {
      dispatch(addGoal(formData));
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (goalToDelete) {
      dispatch(deleteGoal(goalToDelete.id));
      setGoalToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600" />
            <span>Target Career Goals</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            "Know where you want to go." Connect clear milestones directly to your SMART Career Plan.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={PlusCircle} onClick={openCreateModal}>
          Add Career Goal
        </Button>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <EmptyState
          title="No career goals defined yet"
          description="Create your first career goal to begin building your SMART Career Plan and expert alignment."
          actionLabel="Create Career Goal"
          onAction={openCreateModal}
          icon={Target}
        />
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const isPrimary = goal.isPrimary;

            return (
              <Card
                key={goal.id}
                className={`relative border-2 ${
                  isPrimary
                    ? 'border-amber-400 dark:border-amber-500/80 bg-gradient-to-br from-amber-50/20 to-transparent'
                    : 'border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    {/* Header Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isPrimary && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAB308] text-neutral-950">
                          <Star className="w-3 h-3 fill-neutral-950" />
                          <span>Primary Career Goal</span>
                        </span>
                      )}
                      <StatusBadge status={goal.status} />
                      <span className="text-xs text-neutral-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{goal.targetTimeline}</span>
                      </span>
                    </div>

                    {/* Desired Role */}
                    <div>
                      <h3 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100">
                        {goal.desiredRole}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium mt-1">
                        {goal.objective}
                      </p>
                    </div>

                    {/* Attributes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                      <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
                        <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                          <Building className="w-3 h-3 text-neutral-500" />
                          <span>Industry</span>
                        </div>
                        <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-1 truncate">
                          {goal.targetIndustry}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
                        <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-500" />
                          <span>Location</span>
                        </div>
                        <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-1 truncate">
                          {goal.targetLocation}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
                        <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-neutral-500" />
                          <span>Target Compensation</span>
                        </div>
                        <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-1 truncate">
                          {goal.targetCompensation}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
                        <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                          <Compass className="w-3 h-3 text-neutral-500" />
                          <span>Trajectory</span>
                        </div>
                        <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-1 truncate">
                          {goal.careerDirection}
                        </div>
                      </div>
                    </div>

                    {/* Milestones Preview */}
                    {goal.milestones && goal.milestones.length > 0 && (
                      <div className="pt-2">
                        <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                          Key Milestones ({goal.milestones.filter((m) => m.completed).length}/
                          {goal.milestones.length} Completed):
                        </div>
                        <div className="space-y-1.5">
                          {goal.milestones.map((m) => (
                            <div
                              key={m.id}
                              className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400"
                            >
                              <CheckCircle
                                className={`w-3.5 h-3.5 ${
                                  m.completed
                                    ? 'text-emerald-500 fill-emerald-100'
                                    : 'text-neutral-300'
                                }`}
                              />
                              <span className={m.completed ? 'line-through text-neutral-400' : ''}>
                                {m.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-100 dark:border-neutral-800">
                    {!isPrimary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => dispatch(setPrimaryGoal(goal.id))}
                      >
                        Set as Primary
                      </Button>
                    )}
                    {onNavigateToPlan && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onNavigateToPlan()}
                      >
                        View in Plan
                      </Button>
                    )}
                    <div className="flex items-center gap-1 ml-auto lg:ml-0">
                      <button
                        onClick={() => openEditModal(goal)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Edit Goal"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setGoalToDelete(goal)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Goal Modal (Create / Edit) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGoal ? 'Edit Career Goal' : 'Create Career Goal'}
        subtitle="Specify desired role, compensation parameters, timeline, and objective."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Desired Role / Job Title"
            value={formData.desiredRole}
            onChange={(e) => setFormData({ ...formData, desiredRole: e.target.value })}
            placeholder="e.g. Senior Healthcare Analytics Specialist"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Target Industry"
              value={formData.targetIndustry}
              onChange={(e) => setFormData({ ...formData, targetIndustry: e.target.value })}
              placeholder="e.g. Healthcare & Life Sciences"
              required
            />
            <Input
              label="Target Location"
              value={formData.targetLocation}
              onChange={(e) => setFormData({ ...formData, targetLocation: e.target.value })}
              placeholder="e.g. Chicago, IL (Hybrid / Remote)"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Target Salary / Compensation"
              value={formData.targetCompensation}
              onChange={(e) => setFormData({ ...formData, targetCompensation: e.target.value })}
              placeholder="e.g. $95,000 - $115,000 / year"
              required
            />
            <Select
              label="Target Timeline"
              value={formData.targetTimeline}
              onChange={(e) => setFormData({ ...formData, targetTimeline: e.target.value })}
              options={[
                { value: '30 Days', label: '30 Days (Fast-Track Sprint)' },
                { value: '60 Days', label: '60 Days (Accelerated)' },
                { value: '90 Days', label: '90 Days (Standard Staffing Bees Program)' },
                { value: '120 Days', label: '120 Days (Comprehensive)' },
              ]}
            />
          </div>

          <Input
            label="Career Direction / Specialization"
            value={formData.careerDirection}
            onChange={(e) => setFormData({ ...formData, careerDirection: e.target.value })}
            placeholder="e.g. Healthcare Informatics & Clinical Decision Systems"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Career Objective Statement <span className="text-amber-600">*</span>
            </label>
            <textarea
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              rows={3}
              placeholder="e.g. Obtain an entry-level healthcare analyst position within 90 days with $95k-$115k compensation."
              required
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#EAB308] focus:border-[#EAB308]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingGoal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(goalToDelete)}
        onClose={() => setGoalToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Career Goal"
        message={`Are you sure you want to delete the goal "${goalToDelete?.desiredRole}"? This will remove its associated roadmap linkages.`}
      />
    </div>
  );
}
