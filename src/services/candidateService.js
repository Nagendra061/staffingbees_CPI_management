/**
 * Candidate Service
 * Data access layer for candidate profile and personal/career info.
 */
import initialCandidate from '../data/candidates.json';

const STORAGE_KEY = 'staffingbees_candidate';

export const candidateService = {
  async getCandidate() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // If old cached data was "Alex Morgan", purge it completely
        if (parsed.name === 'Alex Morgan' || parsed.email === 'alex.morgan@example.com') {
          localStorage.removeItem(STORAGE_KEY);
          return { ...initialCandidate };
        }

        const merged = {
          ...initialCandidate,
          ...parsed,
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          experienceHistory: Array.isArray(parsed.experienceHistory)
            ? parsed.experienceHistory
            : (Array.isArray(parsed.experience) ? parsed.experience : []),
          education: Array.isArray(parsed.education) ? parsed.education : [],
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
        };
        return merged;
      } catch (e) {
        console.error('Failed to parse stored candidate', e);
      }
    }
    return { ...initialCandidate };
  },

  async updateCandidate(updatedData) {
    const current = await this.getCandidate();
    const updated = {
      ...current,
      ...updatedData,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async saveExtractedProfile(extractedData) {
    const today = new Date().toISOString().split('T')[0];
    const updated = {
      ...initialCandidate,
      ...extractedData,
      id: extractedData.id || `cand-${Date.now()}`,
      hasUploadedResume: true,
      status: 'Active Candidate',
      joinedDate: today,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 1. Initialize candidate's primary goal if none exists
    const storedGoals = localStorage.getItem('staffingbees_goals');
    let goals = [];
    try { goals = storedGoals ? JSON.parse(storedGoals) : []; } catch (e) { goals = []; }
    if (!goals || goals.length === 0) {
      const primaryGoal = {
        id: `goal-${Date.now()}`,
        isPrimary: true,
        desiredRole: extractedData.targetRole || 'Specialist',
        targetIndustry: extractedData.targetIndustry || 'Technology & Innovation',
        targetLocation: extractedData.location || 'Open to Hybrid / Remote',
        targetCompensation: extractedData.targetSalary || '$95,000 - $125,000 / year',
        careerDirection: `${extractedData.targetRole || 'Professional'} Trajectory`,
        targetTimeline: '90 Days',
        targetDays: 90,
        startDate: today,
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        objective: `Secure a high-fit ${extractedData.targetRole || 'target'} position within 90 days, advancing skills and leadership.`,
        status: 'In Progress',
        milestones: [
          { id: 'm1', title: 'Complete skills verification and profile optimization', completed: true },
          { id: 'm2', title: 'Complete 14-dimension CPI employability assessment', completed: false },
          { id: 'm3', title: 'Prepare STAR behavioral interview stories', completed: false },
          { id: 'm4', title: 'Submit 10 targeted qualified applications', completed: false },
        ],
      };
      localStorage.setItem('staffingbees_goals', JSON.stringify([primaryGoal]));
    }

    // 2. Initialize CPI based on candidate skills & experience
    const skillsCount = Array.isArray(extractedData.skills) ? extractedData.skills.length : 0;
    const expCount = Array.isArray(extractedData.experienceHistory) ? extractedData.experienceHistory.length : 1;
    const calculatedBase = Math.min(88, Math.max(74, 70 + Math.min(12, skillsCount) + Math.min(8, expCount * 3)));

    const cpiObj = {
      overallScore: calculatedBase,
      lastAssessmentDate: today,
      historicalScores: [{ date: today, score: calculatedBase }],
      dimensions: {
        "Market Fit": { score: calculatedBase + 2, benchmark: 80, category: "Strong", summary: `High demand for ${extractedData.targetRole || 'profile'} capabilities.` },
        "Intent": { score: 90, benchmark: 85, category: "Optimal", summary: "Clear, motivated trajectory with active resume verification." },
        "Communication": { score: 76, benchmark: 82, category: "Development Priority", summary: "Targeted executive presentation and interview pitch recommended." },
        "Adaptability": { score: calculatedBase - 1, benchmark: 78, category: "Strong", summary: "Demonstrated versatility across past roles." },
        "Problem Solving": { score: calculatedBase + 1, benchmark: 80, category: "Strong", summary: "Strong analytical baseline from professional experience." },
        "Collaboration": { score: 82, benchmark: 80, category: "Target Met", summary: "Proven cross-functional teamwork experience." },
        "Reliability": { score: 88, benchmark: 85, category: "Optimal", summary: "Consistent execution across verified roles." },
        "Professionalism": { score: 86, benchmark: 82, category: "Strong", summary: "Clear presentation and verified credential integrity." },
        "Learning Agility": { score: calculatedBase, benchmark: 80, category: "Strong", summary: "High aptitude for continuous skill development." },
        "Technical Execution": { score: Math.min(95, calculatedBase + 3), benchmark: 85, category: "Strong", summary: `Validated technical competencies in ${skillsCount} core skill domains.` },
        "Domain Authority": { score: calculatedBase - 2, benchmark: 80, category: "Target Met", summary: `Applied domain experience in ${extractedData.targetIndustry || 'industry'}.` },
        "Interview Readiness": { score: 72, benchmark: 82, category: "Development Priority", summary: "Prepare mock simulations and STAR story alignment." },
        "Career Marketing": { score: 85, benchmark: 80, category: "Target Met", summary: "ATS resume successfully parsed and verified." },
        "Leadership & Initiative": { score: calculatedBase - 1, benchmark: 78, category: "Strong", summary: "Ownership and operational initiative demonstrated." }
      },
      developmentRoadmaps: [
        {
          id: 'rd-auto-1',
          dimension: 'Interview Readiness',
          currentScore: 72,
          targetScore: 85,
          priority: 'High',
          status: 'In Progress',
          recommendedActivity: '3 mock behavioral STAR simulations with Interview Coach',
          reassessmentStatus: 'Scheduled in next cycle',
          assignedCoach: 'Assigned Staffing Bees Specialist'
        },
        {
          id: 'rd-auto-2',
          dimension: 'Communication',
          currentScore: 76,
          targetScore: 85,
          priority: 'Medium',
          status: 'In Progress',
          recommendedActivity: 'Executive presentation workshop & pitch calibration',
          reassessmentStatus: 'Scheduled in next cycle',
          assignedCoach: 'Assigned Staffing Bees Specialist'
        }
      ]
    };
    localStorage.setItem('staffingbees_cpi', JSON.stringify(cpiObj));

    // 3. Initialize SMART plan tasks for the candidate's journey
    const initialTasks = [
      {
        id: `plan-${Date.now()}-1`,
        goalName: 'Complete Skills Verification & Profile Review',
        description: 'Review AI-extracted skills, add missing certifications, and finalize career goals.',
        week: 'Week 1',
        timeline: 'Days 1 - 7',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'High',
        status: 'In Progress',
        completionPercentage: 50,
        assignedActivity: 'Profile & Credentials Alignment',
        notes: 'Resume successfully ingested. Review and verify profile tags.'
      },
      {
        id: `plan-${Date.now()}-2`,
        goalName: 'Take Full 14-Dimension CPI Assessment',
        description: 'Take the interactive diagnostic to recalibrate your baseline employability index.',
        week: 'Week 1',
        timeline: 'Days 1 - 7',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'High',
        status: 'Not Started',
        completionPercentage: 0,
        assignedActivity: 'CPI Assessment Diagnostic',
        notes: 'Benchmark score calculated from resume. Take assessment to fine-tune.'
      },
      {
        id: `plan-${Date.now()}-3`,
        goalName: `Build Target Employer Pipeline for ${extractedData.targetRole || 'Target Role'}`,
        description: `Curate a list of 15-20 target companies hiring in ${extractedData.targetIndustry || 'your sector'}.`,
        week: 'Week 2',
        timeline: 'Days 8 - 14',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'Medium',
        status: 'Not Started',
        completionPercentage: 0,
        assignedActivity: 'Job Search & Pipeline Strategy',
        notes: 'Work with career counselor to rank highest-probability employers.'
      }
    ];
    localStorage.setItem('staffingbees_career_plans', JSON.stringify(initialTasks));

    // 4. Initialize progress analytics milestone
    const progressObj = {
      cpiProgression: [{ month: 'Initial Diagnostic', score: calculatedBase, note: 'Resume Ingestion Baseline' }],
      careerReadiness: Math.round(calculatedBase * 0.95),
      interviewReadiness: 72,
      marketFitIndex: calculatedBase + 2,
      smartGoalsTotal: 3,
      smartGoalsCompleted: 0,
      networkingContactsCount: 0,
      targetEmployersTracked: 0,
      historicalMilestones: [
        {
          id: `m-${Date.now()}-1`,
          title: 'Resume Uploaded & Candidate Journey Initialized',
          date: today,
          status: 'Completed',
          notes: `Verified skills and initialized roadmap targeting ${extractedData.targetRole || 'Target Role'}.`
        }
      ],
      networkingContacts: []
    };
    localStorage.setItem('staffingbees_progress', JSON.stringify(progressObj));

    return updated;
  },

  async resetCandidate() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('staffingbees_goals');
    localStorage.removeItem('staffingbees_cpi');
    localStorage.removeItem('staffingbees_career_plans');
    localStorage.removeItem('staffingbees_progress');
    localStorage.removeItem('staffingbees_applications');
    localStorage.removeItem('staffingbees_interviews');
    localStorage.removeItem('staffingbees_program');
    return { ...initialCandidate };
  }
};
