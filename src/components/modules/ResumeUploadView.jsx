/**
 * ResumeUploadView Component
 *
 * Dedicated Resume Ingestion and Extraction Hub.
 * Allows candidates to upload a resume file (PDF, DOCX, TXT) or paste resume text.
 * Powered by Gemini extraction with heuristic fallback.
 * Generates the candidate profile, initializes the 10-step Candidate Journey,
 * and calibrates the baseline CPI assessment.
 *
 * Used By:
 * AppShell navigation ('resume') and onboarding flows.
 */
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveExtractedResumeProfile,
  resetCandidateProfile,
} from '../../store/candidateSlice';
import {
  parseResume,
  SAMPLE_RESUMES,
  heuristicParse,
} from '../../services/resumeParserService';

import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import StatusBadge from '../common/StatusBadge';

import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Trash2,
  Plus,
  X,
  Briefcase,
  Calendar,
  Building,
  GraduationCap,
  Award,
  AlertCircle,
  FileUp,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';

export default function ResumeUploadView({ onNavigate }) {
  const dispatch = useDispatch();
  const { data: candidate, loading: storeLoading } = useSelector(
    (state) => state.candidate
  );

  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'paste' | 'sample'
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionStage, setExtractionStage] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [extractionSource, setExtractionSource] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const fileInputRef = useRef(null);

  const hasActiveResume = Boolean(candidate?.hasUploadedResume && candidate?.name);

  // File selection handler
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
  };

  const processSelectedFile = async (file) => {
    setSelectedFile(file);
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.txt') || fileName.endsWith('.json') || fileName.endsWith('.md')) {
      const text = await file.text();
      setRawText(text);
    } else if (fileName.endsWith('.pdf')) {
      // Read array buffer for base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result).split(',')[1];
        // We'll pass base64 to extraction
        setRawText(`[PDF Document: ${file.name} - ${(file.size / 1024).toFixed(1)} KB]`);
        setSelectedFile({ file, base64, name: file.name, size: file.size, type: file.type });
      };
      reader.readAsDataURL(file);
    } else {
      // DOCX / generic fallback reading
      const text = await file.text();
      setRawText(text || `[Document: ${file.name}]`);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  // Run extraction
  const handleExtractResume = async () => {
    if (!rawText.trim() && !selectedFile) return;

    setIsExtracting(true);
    setExtractionStage('Reading and tokenizing resume content...');

    try {
      setTimeout(() => {
        setExtractionStage('Extracting contact details, career timeline & skills...');
      }, 700);

      setTimeout(() => {
        setExtractionStage('Synthesizing target role and baseline CPI metrics...');
      }, 1400);

      const fileData = selectedFile?.base64 || null;
      const mimeType = selectedFile?.type || 'text/plain';

      const parsed = await parseResume(rawText, fileData, mimeType);

      if (parsed) {
        setExtractedData(parsed);
        setExtractionSource(parsed._source || 'AI Extraction');
      } else {
        // Fallback
        const fallback = heuristicParse(rawText);
        setExtractedData(fallback);
        setExtractionSource('Heuristic Analyzer');
      }
    } catch (err) {
      console.error('Extraction error', err);
      const fallback = heuristicParse(rawText);
      setExtractedData(fallback);
      setExtractionSource('Heuristic Analyzer');
    } finally {
      setIsExtracting(false);
      setExtractionStage('');
    }
  };

  // Load sample resume
  const handleLoadSample = (sample) => {
    setRawText(sample.text);
    setSelectedFile({ name: `${sample.name.replace(/\s+/g, '_')}_Resume.txt`, size: sample.text.length });
    const parsed = heuristicParse(sample.text);
    setExtractedData(parsed);
    setExtractionSource('Sample Profile');
    setInputMode('paste');
  };

  // Add / remove skills in review panel
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim() || !extractedData) return;
    const skill = newSkillInput.trim();
    if (!extractedData.skills.includes(skill)) {
      setExtractedData({
        ...extractedData,
        skills: [...extractedData.skills, skill],
      });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    if (!extractedData) return;
    setExtractedData({
      ...extractedData,
      skills: extractedData.skills.filter((s) => s !== skillToRemove),
    });
  };

  // Confirm and start Candidate Journey
  const handleConfirmAndStartJourney = async () => {
    if (!extractedData) return;

    await dispatch(saveExtractedResumeProfile(extractedData));
    setSuccessToast(`Candidate journey successfully unlocked for ${extractedData.name}!`);

    setTimeout(() => {
      if (onNavigate) {
        onNavigate('dashboard');
      }
    }, 1200);
  };

  // Reset current candidate data
  const handleReset = async () => {
    if (window.confirm('Reset all extracted candidate profile data? You can upload a new resume anytime.')) {
      await dispatch(resetCandidateProfile());
      setExtractedData(null);
      setSelectedFile(null);
      setRawText('');
      setSuccessToast('Candidate profile reset. Ready for a new resume.');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-500 text-white font-medium flex items-center justify-between shadow-lg shadow-emerald-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast('')}
            className="text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Page Header & Purpose */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#EAB308] text-neutral-950 uppercase tracking-wider">
            Step 0 • Journey Catalyst
          </span>
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Resume Ingestion & Verification Engine
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
          Upload Your Resume to Start Candidate Journey
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
          Upload your resume in PDF, Word, or plain text format. Our extraction engine automatically parses your career timeline, extracts verified technical competencies, estimates your baseline Candidate Performance Index (CPI), and unlocks your personalized 10-stage career journey.
        </p>
      </div>

      {/* 2. Active Resume Status Bar (if already uploaded) */}
      {hasActiveResume && !extractedData && (
        <div className="p-5 rounded-2xl border border-amber-300 dark:border-amber-700/70 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#EAB308] text-neutral-950 flex items-center justify-center font-black text-lg shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {candidate.name}
                </h3>
                <StatusBadge status="Resume Active" />
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                Targeting <strong>{candidate.targetRole || 'Target Role'}</strong> in {candidate.targetIndustry || 'Industry'} • {candidate.skills?.length || 0} skills verified
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => {
                setExtractedData(null);
                setSelectedFile(null);
                setRawText('');
              }}
            >
              Upload New Resume
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              onClick={() => onNavigate && onNavigate('dashboard')}
            >
              Go to Candidate Journey
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={handleReset}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              Reset Data
            </Button>
          </div>
        </div>
      )}

      {/* 3. Ingestion Methods: Tabs & Presets */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setInputMode('upload')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                inputMode === 'upload'
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>File Upload (PDF/DOCX/TXT)</span>
            </button>
            <button
              onClick={() => setInputMode('paste')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                inputMode === 'paste'
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Resume Text</span>
            </button>
          </div>

          {/* Quick Demo Resumes */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mr-1">
              Sample Resumes:
            </span>
            {SAMPLE_RESUMES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleLoadSample(sample)}
                className="text-xs px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 font-medium transition-colors"
                title={`Click to load ${sample.name}'s resume`}
              >
                {sample.name.split(' ')[0]} ({sample.industry.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Tab A: File Upload Dropzone */}
        {inputMode === 'upload' && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-[#EAB308] bg-amber-500/10 scale-[0.99]'
                : selectedFile
                ? 'border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10'
                : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-amber-400 hover:bg-amber-50/30 dark:hover:bg-neutral-800/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt,.rtf,.json"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800">
              <UploadCloud className="w-8 h-8" />
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>File Selected: {selectedFile.name}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Click or drag to replace
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Drag & drop your resume file here, or{' '}
                  <span className="text-[#EAB308] underline underline-offset-2">browse files</span>
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                  Supports PDF, DOCX, TXT, and RTF formats. All data is securely extracted into your local candidate profile.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab B: Paste Resume Text */}
        {inputMode === 'paste' && (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              Paste Complete Resume Content:
            </label>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste text from LinkedIn, Word, or your PDF here..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 text-xs font-mono text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#EAB308] leading-relaxed"
            />
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Characters: {rawText.length}</span>
              {rawText.length > 0 && (
                <button
                  onClick={() => setRawText('')}
                  className="text-rose-600 hover:underline"
                >
                  Clear text
                </button>
              )}
            </div>
          </div>
        )}

        {/* Extract Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Extracts: Contact info, job history, technical skills, and computes baseline CPI score.
            </span>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Sparkles}
            onClick={handleExtractResume}
            disabled={(!rawText.trim() && !selectedFile) || isExtracting}
            className="w-full sm:w-auto"
          >
            {isExtracting ? 'Extracting Resume...' : 'Extract & Build Candidate Journey'}
          </Button>
        </div>
      </div>

      {/* Extraction Progress Indicator */}
      {isExtracting && (
        <div className="p-6 rounded-2xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/50 dark:bg-amber-950/20 text-center space-y-3 animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Analyzing Resume & Calibrating Profile...
          </h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            {extractionStage}
          </p>
        </div>
      )}

      {/* 4. Extracted Data Verification Panel */}
      {extractedData && (
        <div className="space-y-6 animate-in fade-in duration-300 border-t border-neutral-200 dark:border-neutral-800 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  Extraction Complete
                </span>
                <span className="text-xs text-neutral-400">
                  Source: {extractionSource}
                </span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                Verify Extracted Profile Information
              </h3>
              <p className="text-xs text-neutral-500">
                Review and adjust the extracted details before confirming your Candidate Journey.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={CheckCircle2}
              onClick={handleConfirmAndStartJourney}
              className="shadow-md"
            >
              Confirm & Launch Journey
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Personal Identity & Targets */}
            <div className="space-y-4">
              <Card title="Candidate Identity" subtitle="Primary contact & location">
                <div className="space-y-3">
                  <Input
                    label="Full Name"
                    value={extractedData.name}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Email Address"
                    value={extractedData.email}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, email: e.target.value })
                    }
                  />
                  <Input
                    label="Phone"
                    value={extractedData.phone}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, phone: e.target.value })
                    }
                  />
                  <Input
                    label="Location"
                    value={extractedData.location}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, location: e.target.value })
                    }
                  />
                </div>
              </Card>

              <Card title="Career Targets" subtitle="Target role and compensation benchmark">
                <div className="space-y-3">
                  <Input
                    label="Current Role / Title"
                    value={extractedData.currentRole}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, currentRole: e.target.value })
                    }
                  />
                  <Input
                    label="Target Desired Role"
                    value={extractedData.targetRole}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, targetRole: e.target.value })
                    }
                  />
                  <Input
                    label="Target Industry"
                    value={extractedData.targetIndustry}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, targetIndustry: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Experience"
                      value={extractedData.experienceYears}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, experienceYears: e.target.value })
                      }
                    />
                    <Input
                      label="Target Salary"
                      value={extractedData.targetSalary}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, targetSalary: e.target.value })
                      }
                    />
                  </div>
                </div>
              </Card>

              {/* CPI Calibration Estimate */}
              <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/60 dark:bg-amber-950/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Baseline CPI Calibrated:
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-[#EAB308] text-neutral-950">
                    {extractedData.cpiEstimate?.overallScore || 82}/100
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  Ready to seed your Step 1 (CPI Diagnostic) assessment score.
                </p>
              </div>
            </div>

            {/* Right Column (2 spans): Skills, Experience History, Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Executive Summary */}
              <Card title="Professional Summary" subtitle="Executive bio for employer alignment">
                <textarea
                  rows={3}
                  value={extractedData.bio}
                  onChange={(e) =>
                    setExtractedData({ ...extractedData, bio: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#EAB308] leading-relaxed"
                />
              </Card>

              {/* Extracted Skills */}
              <Card
                title={`Verified Skills (${extractedData.skills?.length || 0})`}
                subtitle="Technical competencies parsed from your background"
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {(extractedData.skills || []).map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-600 transition-colors p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add an additional skill..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
                  />
                  <Button variant="outline" size="sm" type="submit" icon={Plus}>
                    Add
                  </Button>
                </form>
              </Card>

              {/* Work Experience History */}
              <Card
                title={`Work Experience History (${extractedData.experienceHistory?.length || 0})`}
                subtitle="Chronological roles parsed from your resume"
              >
                <div className="space-y-3">
                  {(extractedData.experienceHistory || []).map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-1.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {exp.title}
                        </h4>
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{exp.period}</span>
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                        <Building className="w-3 h-3 text-neutral-400" />
                        <span>
                          {exp.company} {exp.location ? `• ${exp.location}` : ''}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Launch CTA Banner */}
              <div className="p-5 rounded-2xl bg-[#EAB308] text-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div>
                  <h4 className="text-base font-black tracking-tight">
                    Ready to Begin Your Staffing Bees Candidate Journey?
                  </h4>
                  <p className="text-xs font-medium text-neutral-900/80 mt-0.5">
                    Your profile, CPI baseline, and goals will be synced across all 10 journey modules.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleConfirmAndStartJourney}
                  className="bg-neutral-950 text-white hover:bg-neutral-800 border-none shrink-0 font-bold"
                >
                  Confirm & Launch Journey →
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
