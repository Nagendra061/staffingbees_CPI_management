/**
 * Experts Service
 * Data access layer for expert discovery and alignment workflow:
 * Recommended -> Pending Alignment -> Aligned -> Completed
 */
import initialExperts from '../data/experts.json';

const STORAGE_KEY = 'staffingbees_experts';

export const expertsService = {
  async getExperts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse experts', e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialExperts));
    return initialExperts;
  },

  async requestAlignment(expertId, meetingRequestNote) {
    const current = await this.getExperts();
    const updated = current.map((exp) => {
      if (exp.id === expertId) {
        return {
          ...exp,
          alignmentStatus: 'Pending Alignment',
          notes: meetingRequestNote || 'Alignment request initiated by candidate. Awaiting confirmation.',
        };
      }
      return exp;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async updateExpertStatus(expertId, alignmentStatus, extraData = {}) {
    const current = await this.getExperts();
    const updated = current.map((exp) => {
      if (exp.id === expertId) {
        return {
          ...exp,
          alignmentStatus,
          ...extraData,
        };
      }
      return exp;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
