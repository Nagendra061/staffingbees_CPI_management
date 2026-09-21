/**
 * SMART Career Plan View
 *
 * Dedicated weekly objective tracking module mapping to the Staffing Bees
 * 4-week acceleration methodology. Supports full task CRUD, completion toggle,
 * priority filtering, and week grouping.
 *
 * Used By:
 * Main App navigation ('plan').
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addPlanTask,
  updatePlanTask,
  deletePlanTask,
  toggleTaskComplete,
} from '../../store/plansSlice';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import EmptyState from '../common/EmptyState';
import ConfirmationDialog from '../common/ConfirmationDialog';
import {
  CheckSquare,
  PlusCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
  Filter,
  AlertTriangle,
} from 'lucide-react';

export default function SmartPlanView() {
  const dispatch = useDispatch();
  const { items: tasks = [], loading } = useSelector((state) => state.plans);

  const [activeWeekFilter, setActiveWeekFilter] = useState('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    goalName: '',
    description: '',
    week: 'Week 3',
    timeline: 'Sep 16 - Sep 30',
    dueDate: '2026-09-25',
    priority: 'High',
    status: 'In Progress',
    completionPercentage: 50,
    assignedActivity: '',
    notes: '',
  });

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData({
      goalName: '',
      description: '',
      week: 'Week 3',
      timeline: 'Sep 16 - Sep 30',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'High',
      status: 'In Progress',
      completionPercentage: 0,
      assignedActivity: 'Candidate Action Deliverable',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      goalName: task.goalName || '',
      description: task.description || '',
      week: task.week || 'Week 1',
      timeline: task.timeline || '',
      dueDate: task.dueDate || '',
      priority: task.priority || 'Medium',
      status: task.status || 'Not Started',
      completionPercentage: task.completionPercentage || 0,
      assignedActivity: task.assignedActivity || '',
      notes: task.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      dispatch(updatePlanTask({ id: editingTask.id, data: formData }));
    } else {
      dispatch(addPlanTask(formData));
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      dispatch(deletePlanTask(taskToDelete.id));
      setTaskToDelete(null);
    }
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    if (activeWeekFilter !== 'all' && t.week !== activeWeekFilter) return false;
    if (activeStatusFilter !== 'all' && t.status !== activeStatusFilter) return false;
    return true;
  });

  // Calculate stats
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const overallCompletion = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-600" />
            <span>SMART Career Plan</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            "Know what you need to do." Structured 4-week accountability curriculum tracking clear deliverables.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-xs font-semibold text-neutral-500">
              Completed: {completedCount}/{totalCount} Goals
            </div>
            <div className="text-sm font-bold text-[#EAB308]">
              {overallCompletion}% Progress
            </div>
          </div>
          <Button variant="primary" size="sm" icon={PlusCircle} onClick={openCreateModal}>
            Add Objective
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3">
        {/* Week Filter */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mr-1.5">
            Week:
          </span>
          {['all', 'Week 1', 'Week 2', 'Week 3', 'Week 4'].map((w) => (
            <button
              key={w}
              onClick={() => setActiveWeekFilter(w)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeWeekFilter === w
                  ? 'bg-[#EAB308] text-neutral-950 font-bold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {w === 'all' ? 'All Weeks' : w}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-neutral-400 mr-1" />
          {['all', 'In Progress', 'Completed', 'Not Started'].map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatusFilter(s)}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeStatusFilter === s
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {s === 'all' ? 'All Statuses' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No objectives found"
          description="No SMART tasks match your selected filters. Create a new objective or reset filters."
          actionLabel="Add Objective"
          onAction={openCreateModal}
          icon={CheckSquare}
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';

            return (
              <Card
                key={task.id}
                className={`transition-all border ${
                  isCompleted
                    ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Completion Toggle Button */}
                  <button
                    onClick={() => dispatch(toggleTaskComplete(task.id))}
                    className={`mt-1 p-1 rounded-md border transition-colors cursor-pointer shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-neutral-300 dark:border-neutral-600 hover:border-amber-500 text-transparent'
                    }`}
                    title={isCompleted ? 'Mark as In Progress' : 'Mark as Completed'}
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  </button>

                  {/* Task Details */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        {task.week}
                      </span>
                      <StatusBadge status={task.status} />
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          task.priority === 'High'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                      <span className="text-[11px] text-neutral-500 flex items-center gap-1 ml-auto">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        <span>Due: {task.dueDate}</span>
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-bold text-neutral-900 dark:text-neutral-100 ${
                        isCompleted ? 'line-through text-neutral-500 dark:text-neutral-400' : ''
                      }`}
                    >
                      {task.goalName}
                    </h4>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {task.description}
                    </p>

                    {/* Assigned Activity & Notes */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-neutral-500">
                      {task.assignedActivity && (
                        <span>
                          Activity: <strong className="text-neutral-700 dark:text-neutral-300">{task.assignedActivity}</strong>
                        </span>
                      )}
                      {task.notes && (
                        <span className="italic text-neutral-500">
                          "{task.notes}"
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-1 max-w-xs">
                      <ProgressBar
                        value={task.completionPercentage || (isCompleted ? 100 : 0)}
                        height="h-1.5"
                        showPercentage={true}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Edit Task"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTaskToDelete(task)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Task Modal (Create / Edit) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit SMART Objective' : 'Add SMART Objective'}
        subtitle="Specify timeline, assigned activity, priority, and completion milestones."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Objective Name"
            value={formData.goalName}
            onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
            placeholder="e.g. Complete 3 Mock Interviews with Sarah Jenkins"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Description <span className="text-amber-600">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Outline the deliverable and expected outcome."
              required
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Week / Milestone"
              value={formData.week}
              onChange={(e) => setFormData({ ...formData, week: e.target.value })}
              options={[
                { value: 'Week 1', label: 'Week 1: Foundation & Audit' },
                { value: 'Week 2', label: 'Week 2: Upskilling & Branding' },
                { value: 'Week 3', label: 'Week 3: Execution & Outbound' },
                { value: 'Week 4', label: 'Week 4: Evaluation & Conversion' },
              ]}
            />
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { value: 'High', label: 'High Priority' },
                { value: 'Medium', label: 'Medium Priority' },
                { value: 'Low', label: 'Low Priority' },
              ]}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value,
                  completionPercentage: e.target.value === 'Completed' ? 100 : formData.completionPercentage,
                })
              }
              options={[
                { value: 'Not Started', label: 'Not Started' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Overdue', label: 'Overdue' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
            <Input
              label="Assigned Activity / Module"
              value={formData.assignedActivity}
              onChange={(e) => setFormData({ ...formData, assignedActivity: e.target.value })}
              placeholder="e.g. Interview Preparation Coaching"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Completion Percentage ({formData.completionPercentage}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.completionPercentage}
              onChange={(e) => setFormData({ ...formData, completionPercentage: Number(e.target.value) })}
              className="w-full accent-[#EAB308] cursor-pointer"
            />
          </div>

          <Input
            label="Notes / Progress Feedback"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Feedback from coach or milestone blocker details."
          />

          <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingTask ? 'Save Objective' : 'Create Objective'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete SMART Objective"
        message={`Are you sure you want to delete "${taskToDelete?.goalName}"?`}
      />
    </div>
  );
}
