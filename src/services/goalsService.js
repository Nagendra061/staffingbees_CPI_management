/**
 * Goals Service
 * Data access layer for Career Goals CRUD operations.
 */
import initialGoals from '../data/goals.json';

const STORAGE_KEY = 'staffingbees_goals';

export const goalsService = {
  async getGoals() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.some((g) => g.id === 'goal-01' || g.desiredRole === 'Senior Healthcare Analytics Specialist')) {
          localStorage.removeItem(STORAGE_KEY);
          return [];
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse goals', e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialGoals));
    return initialGoals;
  },

  async addGoal(newGoal) {
    const current = await this.getGoals();
    const item = {
      id: `goal-${Date.now()}`,
      isPrimary: current.length === 0,
      milestones: [],
      status: 'In Progress',
      ...newGoal,
    };
    const updated = [item, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async updateGoal(id, updatedFields) {
    const current = await this.getGoals();
    const updated = current.map((g) => (g.id === id ? { ...g, ...updatedFields } : g));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async deleteGoal(id) {
    const current = await this.getGoals();
    const updated = current.filter((g) => g.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async setPrimary(id) {
    const current = await this.getGoals();
    const updated = current.map((g) => ({
      ...g,
      isPrimary: g.id === id,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
