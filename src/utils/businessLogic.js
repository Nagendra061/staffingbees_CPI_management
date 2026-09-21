/**
 * Staffing Bees - Domain Business Logic & Calculations
 * 
 * Reusable calculations kept outside presentation components.
 * Computes CPI summaries, career readiness, goal completion,
 * application conversion metrics, and program guarantee eligibility.
 */

export const calculateCpiSummary = (dimensions = {}) => {
  const entries = Object.entries(dimensions);
  if (entries.length === 0) return { overall: 0, lowest: [], strongest: [] };

  const total = entries.reduce((acc, [, data]) => acc + (data.score || 0), 0);
  const overall = Math.round(total / entries.length);

  const sorted = [...entries].sort((a, b) => (a[1].score || 0) - (b[1].score || 0));

  const lowest = sorted.slice(0, 3).map(([name, data]) => ({
    name,
    score: data.score,
    benchmark: data.benchmark || 80,
    category: data.category,
    summary: data.summary,
  }));

  const strongest = sorted.slice(-3).reverse().map(([name, data]) => ({
    name,
    score: data.score,
    benchmark: data.benchmark || 80,
    category: data.category,
    summary: data.summary,
  }));

  return { overall, lowest, strongest, count: entries.length };
};

export const calculateCareerReadiness = ({
  cpiScore = 0,
  goalsCompleted = 0,
  totalGoals = 1,
  servicesProgress = 0,
  applicationsCount = 0,
}) => {
  const cpiWeight = (cpiScore / 100) * 40; // 40% weight
  const goalsWeight = totalGoals > 0 ? (goalsCompleted / totalGoals) * 25 : 0; // 25% weight
  const servicesWeight = (servicesProgress / 100) * 20; // 20% weight
  const applicationActivity = Math.min(applicationsCount / 10, 1) * 15; // 15% weight

  const readiness = Math.round(cpiWeight + goalsWeight + servicesWeight + applicationActivity);
  return Math.min(Math.max(readiness, 0), 100);
};

export const calculateGoalStats = (tasks = []) => {
  if (!tasks || tasks.length === 0) {
    return { total: 0, completed: 0, inProgress: 0, notStarted: 0, percentComplete: 0 };
  }

  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const notStarted = tasks.filter((t) => t.status === 'Not Started').length;
  const percentComplete = Math.round((completed / tasks.length) * 100);

  return {
    total: tasks.length,
    completed,
    inProgress,
    notStarted,
    percentComplete,
  };
};

export const calculateApplicationConversion = (applications = []) => {
  if (!applications || applications.length === 0) {
    return {
      total: 0,
      qualified: 0,
      screenings: 0,
      interviews: 0,
      offers: 0,
      qualifiedRate: 0,
      interviewConversionRate: 0,
    };
  }

  const total = applications.length;
  const qualified = applications.filter((a) =>
    (a.qualificationStatus || '').toLowerCase().includes('qualified')
  ).length;
  const screenings = applications.filter((a) => a.status === 'Screening').length;
  const interviews = applications.filter((a) => a.status === 'Interview').length;
  const offers = applications.filter((a) => a.status === 'Offer').length;

  const qualifiedRate = Math.round((qualified / total) * 100);
  const interviewConversionRate =
    qualified > 0 ? Math.round(((interviews + screenings) / qualified) * 100) : 0;

  return {
    total,
    qualified,
    screenings,
    interviews,
    offers,
    qualifiedRate,
    interviewConversionRate,
  };
};

export const evaluateProgramEligibility = (conditions = []) => {
  if (!conditions || conditions.length === 0) {
    return { status: 'Not Yet Eligible', metCount: 0, totalCount: 0, percent: 0 };
  }

  const metCount = conditions.filter((c) => c.isMet).length;
  const totalCount = conditions.length;
  const percent = Math.round((metCount / totalCount) * 100);

  let status = 'Program Requirements In Progress';
  if (metCount === totalCount) {
    status = 'Eligible (Job Guarantee Active)';
  } else if (metCount < 3) {
    status = 'Not Yet Eligible';
  }

  return { status, metCount, totalCount, percent };
};
