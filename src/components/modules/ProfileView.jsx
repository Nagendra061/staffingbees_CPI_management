/**
 * Profile View (Candidate Profile)
 *
 * Comprehensive candidate profile management:
 * Personal contact information, career parameters, verified skills with interactive tags,
 * work experience timeline, and executive summary statement.
 *
 * Used By:
 * Main App navigation ('profile').
 */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../store/candidateSlice';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import StatusBadge from '../common/StatusBadge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  GraduationCap,
  Pencil,
  Plus,
  X,
  Building,
  Calendar,
  CheckCircle2,
  Trash2,
  FileUp,
  AlertCircle,
} from 'lucide-react';

const defaultExperienceHistory = [];

export default function ProfileView({ onNavigate }) {
  const dispatch = useDispatch();
  const { data: candidate } = useSelector((state) => state.candidate);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddExpModalOpen, setIsAddExpModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: candidate?.name || '',
    email: candidate?.email || '',
    phone: candidate?.phone || '',
    location: candidate?.location || '',
    currentRole: candidate?.currentRole || '',
    targetRole: candidate?.targetRole || '',
    experienceYears: candidate?.experienceYears || (typeof candidate?.experience === 'string' ? candidate.experience : ''),
    targetIndustry: candidate?.targetIndustry || '',
    targetSalary: candidate?.targetSalary || '',
    bio: candidate?.bio || '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [skillsList, setSkillsList] = useState(
    Array.isArray(candidate?.skills) ? candidate.skills : []
  );

  const [expFormData, setExpFormData] = useState({
    title: '',
    company: '',
    period: '',
    location: '',
    description: '',
  });

  // Sync state when candidate data loads from redux store
  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        location: candidate.location || '',
        currentRole: candidate.currentRole || '',
        targetRole: candidate.targetRole || '',
        experienceYears: candidate.experienceYears || (typeof candidate.experience === 'string' ? candidate.experience : ''),
        targetIndustry: candidate.targetIndustry || '',
        targetSalary: candidate.targetSalary || '',
        bio: candidate.bio || '',
      });
      if (Array.isArray(candidate.skills)) {
        setSkillsList(candidate.skills);
      }
    }
  }, [candidate]);

  const experienceHistory = Array.isArray(candidate?.experienceHistory)
    ? candidate.experienceHistory
    : Array.isArray(candidate?.experience)
    ? candidate.experience
    : defaultExperienceHistory;

  const handleOpenEdit = () => {
    setFormData({
      name: candidate?.name || '',
      email: candidate?.email || '',
      phone: candidate?.phone || '',
      location: candidate?.location || '',
      currentRole: candidate?.currentRole || '',
      targetRole: candidate?.targetRole || '',
      experienceYears: candidate?.experienceYears || (typeof candidate?.experience === 'string' ? candidate.experience : ''),
      targetIndustry: candidate?.targetIndustry || '',
      targetSalary: candidate?.targetSalary || '',
      bio: candidate?.bio || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch(
      updateProfile({
        ...formData,
        skills: Array.isArray(skillsList) ? skillsList : [],
        experience: formData.experienceYears,
        experienceHistory,
      })
    );
    setIsEditModalOpen(false);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    const currentList = Array.isArray(skillsList) ? skillsList : [];
    if (!currentList.includes(trimmed)) {
      const updated = [...currentList, trimmed];
      setSkillsList(updated);
      dispatch(updateProfile({ skills: updated }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const currentList = Array.isArray(skillsList) ? skillsList : [];
    const updated = currentList.filter((s) => s !== skillToRemove);
    setSkillsList(updated);
    dispatch(updateProfile({ skills: updated }));
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!expFormData.title.trim() || !expFormData.company.trim()) return;

    const newEntry = {
      id: `exp-${Date.now()}`,
      title: expFormData.title.trim(),
      company: expFormData.company.trim(),
      period: expFormData.period.trim() || 'Present',
      location: expFormData.location.trim() || formData.location || 'Remote',
      description: expFormData.description.trim() || '',
    };

    const updatedHistory = [newEntry, ...(Array.isArray(experienceHistory) ? experienceHistory : [])];
    dispatch(updateProfile({ experienceHistory: updatedHistory }));
    setExpFormData({
      title: '',
      company: '',
      period: '',
      location: '',
      description: '',
    });
    setIsAddExpModalOpen(false);
  };

  const handleDeleteExperience = (idToRemove) => {
    const currentHistory = Array.isArray(experienceHistory) ? experienceHistory : [];
    const updatedHistory = currentHistory.filter((item) => item.id !== idToRemove);
    dispatch(updateProfile({ experienceHistory: updatedHistory }));
  };

  const getInitials = (name) => {
    if (!name) return 'AM';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-600" />
            <span>Candidate Profile & Credentials</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Verified candidate parameters synchronizing your CPI assessments, marketing collateral, and employer pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <Button
              variant="outline"
              size="sm"
              icon={FileUp}
              onClick={() => onNavigate('resume')}
            >
              {candidate?.hasUploadedResume ? 'Update Resume' : 'Upload Resume'}
            </Button>
          )}
          <Button variant="primary" size="sm" icon={Pencil} onClick={handleOpenEdit}>
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Notice if no resume uploaded */}
      {!candidate?.hasUploadedResume && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 shrink-0">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Populate Profile with Resume AI Extraction
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Upload your resume PDF/Word doc or paste text to automatically fill skills, employment history, and career targets.
              </p>
            </div>
          </div>
          {onNavigate && (
            <Button
              variant="primary"
              size="sm"
              icon={FileUp}
              onClick={() => onNavigate('resume')}
              className="shrink-0"
            >
              Upload Resume
            </Button>
          )}
        </div>
      )}

      {/* Candidate Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Personal Snapshot */}
        <Card className="space-y-4">
          <div className="flex items-center gap-3.5 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 flex items-center justify-center font-black text-xl border border-amber-300 dark:border-amber-700">
              {getInitials(candidate?.name)}
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {candidate?.name || 'New Candidate'}
              </h3>
              <p className="text-xs text-neutral-500">{candidate?.currentRole || 'Role not specified'}</p>
              <div className="mt-1">
                <StatusBadge status={candidate?.status || 'Active Candidate'} />
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>{candidate?.email || 'Email not provided'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>{candidate?.phone || 'Phone not provided'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>{candidate?.location || 'Location not specified'}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">CPI Score:</span>
              <strong className="text-neutral-900 dark:text-neutral-100">
                {candidate?.cpiScore ? `${candidate.cpiScore} / 100` : '--'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Total Experience:</span>
              <strong className="text-neutral-900 dark:text-neutral-100">
                {candidate?.experienceYears || (typeof candidate?.experience === 'string' ? candidate.experience : 'Not specified')}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Target Compensation:</span>
              <strong className="text-emerald-600 dark:text-emerald-400">
                {candidate?.targetSalary || 'Flexible / Benchmark'}
              </strong>
            </div>
          </div>
        </Card>

        {/* Right 2 Columns: Bio & Career Objectives */}
        <div className="lg:col-span-2 space-y-5">
          <Card title="Candidate Executive Narrative">
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {candidate?.bio ||
                'No candidate executive narrative provided yet. Upload your resume or click "Edit Profile" above to outline your background, key strengths, and target industry focus.'}
            </p>
          </Card>

          {/* Verified Skills */}
          <Card
            title="Verified Competencies & Technical Skills"
            subtitle="Skills verified through technical diagnostic sprints and portfolio reviews."
          >
            {skillsList.length === 0 ? (
              <p className="text-xs text-neutral-400 italic mb-4">
                No skills listed yet. Add skills below or upload your resume to extract them automatically.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 mb-4">
                {skillsList.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-rose-600 transition-colors p-0.5"
                      aria-label={`Remove skill ${skill}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add verified skill (e.g. Snowflake, dbt)..."
                className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#EAB308]"
              />
              <Button variant="primary" size="sm" type="submit" icon={Plus}>
                Add Skill
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Experience History */}
      <Card
        title="Experience History"
        subtitle="Chronological career record and quantifiable achievements."
        action={
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setIsAddExpModalOpen(true)}
          >
            Add Role
          </Button>
        }
      >
        {experienceHistory.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
            <Building className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              No experience records found
            </p>
            <p className="text-[11px] text-neutral-400 max-w-xs mx-auto mt-1 mb-3">
              Upload your resume to automatically parse your employment history or click Add Role to enter manually.
            </p>
            {onNavigate && (
              <Button
                variant="primary"
                size="sm"
                icon={FileUp}
                onClick={() => onNavigate('resume')}
              >
                Upload Resume
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {experienceHistory.map((exp) => (
              <div
                key={exp.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {exp.title}
                    </h4>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exp.period}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors p-1 opacity-60 hover:opacity-100"
                        title="Remove experience entry"
                        aria-label="Remove experience entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1 mb-2">
                    <Building className="w-3.5 h-3.5 text-neutral-400" />
                    <span>
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Candidate Profile"
        subtitle="Update personal parameters, role targets, and compensation expectations."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Role"
              value={formData.currentRole}
              onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
            />
            <Input
              label="Target Role Title"
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Target Compensation"
              value={formData.targetSalary}
              onChange={(e) => setFormData({ ...formData, targetSalary: e.target.value })}
            />
            <Input
              label="Experience Level"
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Candidate Executive Narrative
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Experience Modal */}
      <Modal
        isOpen={isAddExpModalOpen}
        onClose={() => setIsAddExpModalOpen(false)}
        title="Add Work Experience"
        subtitle="Log a past or current role to strengthen employer alignment."
      >
        <form onSubmit={handleAddExperience} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Job Title"
              placeholder="e.g. Healthcare Data Analyst"
              value={expFormData.title}
              onChange={(e) => setExpFormData({ ...expFormData, title: e.target.value })}
              required
            />
            <Input
              label="Company / Health System"
              placeholder="e.g. Northwestern Medicine"
              value={expFormData.company}
              onChange={(e) => setExpFormData({ ...expFormData, company: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Timeline / Period"
              placeholder="e.g. 2023 - Present (1.5 Yrs)"
              value={expFormData.period}
              onChange={(e) => setExpFormData({ ...expFormData, period: e.target.value })}
            />
            <Input
              label="Location"
              placeholder="e.g. Chicago, IL (Hybrid)"
              value={expFormData.location}
              onChange={(e) => setExpFormData({ ...expFormData, location: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Key Responsibilities & Quantifiable Impact
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Managed EHR data pipelines, reduced claims denials by 14% via SQL validation queries..."
              value={expFormData.description}
              onChange={(e) => setExpFormData({ ...expFormData, description: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button variant="outline" size="sm" onClick={() => setIsAddExpModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Add Position
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
