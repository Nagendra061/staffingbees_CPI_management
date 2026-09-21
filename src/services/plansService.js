/**
 * SMART Career Plan Service
 * Data access layer for weekly SMART objectives & activities.
 */
import initialPlans from '../data/careerPlans.json';

const STORAGE_KEY = 'staffingbees_career_plans';

export const plansService = {
  async getPlans() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.some((p) => p.id === 'plan-101' || p.goalName?.includes('Complete CPI Assessment & Foundation'))) {
          localStorage.removeItem(STORAGE_KEY);
          return [];
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse career plans', e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPlans));
    return initialPlans;
  },

  async addPlanTask(taskData) {
    const current = await this.getPlans();
    const newTask = {
      id: `plan-${Date.now()}`,
      priority: 'Medium',
      status: 'Not Started',
      completionPercentage: 0,
      notes: '',
      ...taskData,
    };
    const updated = [newTask, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async updatePlanTask(id, updatedFields) {
    const current = await this.getPlans();
    const updated = current.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async deletePlanTask(id) {
    const current = await this.getPlans();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async toggleTaskComplete(id) {
    const current = await this.getPlans();
    const updated = current.map((item) => {
      if (item.id === id) {
        const isDone = item.status === 'Completed';
        return {
          ...item,
          status: isDone ? 'In Progress' : 'Completed',
          completionPercentage: isDone ? 50 : 100,
        };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
