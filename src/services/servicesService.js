/**
 * Services Service
 * Data access layer for Staffing Bees 7 Development Service layers:
 * Career Counseling, Career Coaching, Mentoring, Skill Training,
 * Interview Preparation, Career Marketing, CPI Development.
 */
import initialServices from '../data/services.json';

const STORAGE_KEY = 'staffingbees_services';

export const servicesService = {
  async getServices() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse services', e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialServices));
    return initialServices;
  },

  async updateService(id, updatedFields) {
    const current = await this.getServices();
    const updated = current.map((srv) => (srv.id === id ? { ...srv, ...updatedFields } : srv));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async toggleServiceStatus(id, newStatus) {
    const current = await this.getServices();
    const updated = current.map((srv) =>
      srv.id === id ? { ...srv, status: newStatus } : srv
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
