/**
 * Interviews Service
 * Data access layer for interview schedule, rounds, and preparation checklists.
 */
import initialInterviews from '../data/interviews.json';

const STORAGE_KEY = 'staffingbees_interviews';

export const interviewsService = {
  async getInterviews() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.some((i) => i.id === 'int-001' || i.company === 'Apex Care Solutions')) {
          localStorage.removeItem(STORAGE_KEY);
          return [];
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse interviews', e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialInterviews));
    return initialInterviews;
  },

  async addInterview(interviewData) {
    const current = await this.getInterviews();
    const newInterview = {
      id: `int-${Date.now()}`,
      status: 'Scheduled',
      preparationStatus: 'In Progress',
      prepChecklist: [
        { id: `pc-${Date.now()}-1`, task: 'Review company mission and role requirements', done: false },
        { id: `pc-${Date.now()}-2`, task: 'Rehearse key behavioral STAR scenario examples', done: false },
        { id: `pc-${Date.now()}-3`, task: 'Prepare questions for the interviewer', done: false },
      ],
      ...interviewData,
    };
    const updated = [newInterview, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async updateInterview(id, updatedFields) {
    const current = await this.getInterviews();
    const updated = current.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async deleteInterview(id) {
    const current = await this.getInterviews();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async togglePrepChecklist(interviewId, checkId) {
    const current = await this.getInterviews();
    const updated = current.map((item) => {
      if (item.id === interviewId) {
        const updatedList = (item.prepChecklist || []).map((chk) =>
          chk.id === checkId ? { ...chk, done: !chk.done } : chk
        );
        const allDone = updatedList.length > 0 && updatedList.every((chk) => chk.done);
        return {
          ...item,
          prepChecklist: updatedList,
          preparationStatus: allDone ? 'Ready' : 'In Progress',
        };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
