/**
 * Applications View (Application Tracking)
 *
 * Full lifecycle tracking for candidate applications:
 * Search, filter by status (Saved, Applied, Screening, Interview, Offer, Rejected, Withdrawn),
 * Add/Edit modal, qualification match rates, and follow-up alerts.
 *
 * Used By:
 * Main App navigation ('applications').
 */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
} from '../../store/applicationsSlice';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import ConfirmationDialog from '../common/ConfirmationDialog';
import {
  Briefcase,
  PlusCircle,
  Search,
  Building,
  Calendar,
  DollarSign,
  MapPin,
  Pencil,
  Trash2,
  Filter,
  CheckCircle,
  Clock,
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Saved', label: 'Saved' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Screening', label: 'Screening' },
  { value: 'Interview', label: 'Interview' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Withdrawn', label: 'Withdrawn' },
];

export default function ApplicationsView({ onNavigateToInterviews }) {
  const dispatch = useDispatch();
  const { items: applications = [], loading } = useSelector((state) => state.applications);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [appToDelete, setAppToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    location: '',
    salaryRange: '',
    applicationDate: new Date().toISOString().split('T')[0],
    qualificationMatchRate: 85,
    source: 'Staffing Bees Pipeline',
    notes: '',
    nextFollowUpDate: '',
  });

  // Global event listener for header trigger
  useEffect(() => {
    const handleOpenModal = () => {
      setEditingApp(null);
      setFormData({
        company: '',
        role: '',
        status: 'Applied',
        location: '',
        salaryRange: '',
        applicationDate: new Date().toISOString().split('T')[0],
        qualificationMatchRate: 85,
        source: 'Staffing Bees Pipeline',
        notes: '',
        nextFollowUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      setIsModalOpen(true);
    };

    window.addEventListener('open-new-application-modal', handleOpenModal);
    return () => window.removeEventListener('open-new-application-modal', handleOpenModal);
  }, []);

  const openCreateModal = () => {
    setEditingApp(null);
    setFormData({
      company: '',
      role: '',
      status: 'Applied',
      location: '',
      salaryRange: '',
      applicationDate: new Date().toISOString().split('T')[0],
      qualificationMatchRate: 85,
      source: 'Staffing Bees Pipeline',
      notes: '',
      nextFollowUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setFormData({
      company: app.company || '',
      role: app.role || '',
      status: app.status || 'Applied',
      location: app.location || '',
      salaryRange: app.salaryRange || '',
      applicationDate: app.applicationDate || '',
      qualificationMatchRate: app.qualificationMatchRate || 80,
      source: app.source || '',
      notes: app.notes || '',
      nextFollowUpDate: app.nextFollowUpDate || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingApp) {
      dispatch(updateApplication({ id: editingApp.id, data: formData }));
    } else {
      dispatch(addApplication(formData));
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (appToDelete) {
      dispatch(deleteApplication(appToDelete.id));
      setAppToDelete(null);
    }
  };

  // Filter and search
  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.location && app.location.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-600" />
            <span>Application Tracking System</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Monitor verified pipeline opportunities, submission history, qualification match scores, and interview handoffs.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={PlusCircle} onClick={openCreateModal}>
          Add Application
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company, role, or location..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#EAB308]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#EAB308]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <EmptyState
          title="No applications found"
          description={
            searchTerm || statusFilter !== 'all'
              ? 'No applications match your current search or status filter.'
              : 'You have not added any job applications yet.'
          }
          actionLabel="Add Application"
          onAction={openCreateModal}
          icon={Briefcase}
        />
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <Card
              key={app.id}
              className="border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {app.role}
                    </h3>
                    <StatusBadge status={app.status} />
                    {app.qualificationMatchRate && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {app.qualificationMatchRate}% Fit
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{app.company}</span>
                    </span>
                    {app.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{app.location}</span>
                      </span>
                    )}
                    {app.salaryRange && (
                      <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{app.salaryRange}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-neutral-500">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Applied: {app.applicationDate}</span>
                    </span>
                  </div>

                  {app.notes && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 pt-0.5 line-clamp-1 italic">
                      "{app.notes}"
                    </p>
                  )}

                  {app.nextFollowUpDate && (
                    <div className="text-[11px] text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Next Follow-up Due: {app.nextFollowUpDate}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-100 dark:border-neutral-800">
                  {/* Status Dropdown Quick Change */}
                  <select
                    value={app.status}
                    onChange={(e) =>
                      dispatch(
                        updateApplicationStatus({
                          id: app.id,
                          status: e.target.value,
                        })
                      )
                    }
                    className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2.5 py-1 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#EAB308]"
                  >
                    {STATUS_OPTIONS.filter((o) => o.value !== 'all').map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {app.status === 'Interview' && onNavigateToInterviews && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onNavigateToInterviews}
                    >
                      Prep Interview
                    </Button>
                  )}

                  <button
                    onClick={() => openEditModal(app)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Edit Application"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setAppToDelete(app)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete Application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Application Modal (Create / Edit) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingApp ? 'Edit Application' : 'Add New Application'}
        subtitle="Track employer details, salary benchmarks, submission dates, and follow-up timeline."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g. Northwestern Medicine"
              required
            />
            <Input
              label="Role / Position"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Healthcare Analytics Specialist"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Application Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={STATUS_OPTIONS.filter((o) => o.value !== 'all')}
            />
            <Input
              label="Application Date"
              type="date"
              value={formData.applicationDate}
              onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
              required
            />
            <Input
              label="Fit Match Rate (%)"
              type="number"
              value={formData.qualificationMatchRate}
              onChange={(e) => setFormData({ ...formData, qualificationMatchRate: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Chicago, IL (Hybrid)"
            />
            <Input
              label="Salary Range"
              value={formData.salaryRange}
              onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              placeholder="e.g. $95,000 - $110,000"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Source / Referral"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="e.g. Staffing Bees Pipeline, Recruiter Outreach"
            />
            <Input
              label="Next Follow-up Date"
              type="date"
              value={formData.nextFollowUpDate}
              onChange={(e) => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Notes & Application Context
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Include recruiter name, hiring manager info, or interview prep focus."
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingApp ? 'Save Changes' : 'Add Application'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(appToDelete)}
        onClose={() => setAppToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Application"
        message={`Are you sure you want to remove the application for "${appToDelete?.role}" at "${appToDelete?.company}"?`}
      />
    </div>
  );
}
