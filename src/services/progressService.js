/**
 * Progress Service
 * Data access layer for historical CPI progression, networking log, and career readiness analytics.
 */
import initialProgress from '../data/progress.json';

const STORAGE_KEY = 'staffingbees_progress';

export const progressService = {
  async getProgress() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.careerReadiness === 78 || parsed.networkingContactsCount === 14 || (parsed.historicalMilestones && parsed.historicalMilestones.some(m => m.date === '2026-08-05')))) {
          localStorage.removeItem(STORAGE_KEY);
          return initialProgress;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse progress data', e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProgress));
    return initialProgress;
  },

  async addNetworkingContact(contactData) {
    const current = await this.getProgress();
    const newContact = {
      id: `net-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Initial Outreach',
      notes: '',
      ...contactData,
    };
    const contacts = [newContact, ...(current.networkingContacts || [])];
    const updated = {
      ...current,
      networkingContacts: contacts,
      networkingContactsCount: contacts.length,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
