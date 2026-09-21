/**
 * CPI Service
 * Data access layer for Candidate Performance Index (CPI) scores,
 * dimension breakdowns, assessment question bank, and development roadmaps.
 */
import initialCpi from '../data/cpi.json';
import initialQuestions from '../data/cpiQuestions.json';

const STORAGE_KEY = 'staffingbees_cpi';

export const cpiService = {
  async getCpi() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Purge old demo CPI with historical score 74 or specific date 2026-07-15
        if (
          parsed &&
          parsed.historicalScores &&
          parsed.historicalScores.some((h) => h.date === '2026-07-15' || h.date === '2026-08-15')
        ) {
          localStorage.removeItem(STORAGE_KEY);
          return initialCpi;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse stored cpi', e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCpi));
    return initialCpi;
  },

  async getQuestions() {
    return initialQuestions;
  },

  async submitAssessment(answersMap) {
    const current = await this.getCpi();
    const questions = await this.getQuestions();

    // Calculate updated dimensions based on answers
    const updatedDimensions = { ...current.dimensions };
    questions.forEach((q) => {
      const selectedScore = answersMap[q.id];
      if (selectedScore !== undefined && updatedDimensions[q.dimension]) {
        updatedDimensions[q.dimension] = {
          ...updatedDimensions[q.dimension],
          score: selectedScore,
        };
      }
    });

    // Recompute overall score
    const dimensionScores = Object.values(updatedDimensions).map((d) => d.score);
    const overallScore = Math.round(
      dimensionScores.reduce((a, b) => a + b, 0) / dimensionScores.length
    );

    const now = new Date().toISOString().split('T')[0];
    const newHistory = [
      ...(current.historicalScores || []),
      { date: now, score: overallScore },
    ];

    // Recalibrate roadmaps for dimensions < 80
    const developmentRoadmaps = Object.entries(updatedDimensions)
      .filter(([, val]) => val.score < 80)
      .map(([dimName, val], idx) => ({
        id: `rd-auto-${idx}`,
        dimension: dimName,
        currentScore: val.score,
        targetScore: 85,
        priority: val.score < 75 ? 'High' : 'Medium',
        status: 'In Progress',
        recommendedActivity: `Targeted ${dimName} development sprint & expert coaching session`,
        reassessmentStatus: 'Scheduled in next cycle',
        assignedCoach: 'Assigned Staffing Bees Specialist',
      }));

    const updated = {
      ...current,
      overallScore,
      lastAssessmentDate: now,
      dimensions: updatedDimensions,
      historicalScores: newHistory,
      developmentRoadmaps:
        developmentRoadmaps.length > 0 ? developmentRoadmaps : current.developmentRoadmaps,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async updateRoadmapItem(roadmapId, updateData) {
    const current = await this.getCpi();
    const updatedRoadmaps = (current.developmentRoadmaps || []).map((item) =>
      item.id === roadmapId ? { ...item, ...updateData } : item
    );
    const updated = { ...current, developmentRoadmaps: updatedRoadmaps };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
