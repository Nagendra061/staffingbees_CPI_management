/**
 * Applications Service
 * Data access layer for candidate Job Applications CRUD tracking.
 */
import initialApplications from '../data/applications.json';

const STORAGE_KEY = 'staffingbees_applications';

export const applicationsService = {
  async getApplications() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Purge old demo applications
        if (Array.isArray(parsed) && parsed.some((a) => a.id === 'app-001' || a.employer === 'Apex Care Solutions')) {
          localStorage.removeItem(STORAGE_KEY);
          return [];
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse applications', e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialApplications));
    return initialApplications;
  },

  async addApplication(appData) {
    const current = await this.getApplications();
    const newApp = {
      id: `app-${Date.now()}`,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      qualificationStatus: 'Qualified (Review In Progress)',
      ...appData,
    };
    const updated = [newApp, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async updateApplication(id, updatedFields) {
    const current = await this.getApplications();
    const updated = current.map((app) => (app.id === id ? { ...app, ...updatedFields } : app));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async deleteApplication(id) {
    const current = await this.getApplications();
    const updated = current.filter((app) => app.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
