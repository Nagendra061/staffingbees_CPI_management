/**
 * Program Service
 * Data access layer for Job Guarantee eligibility verification,
 * Career Access Scholarship status, and modular payment selection.
 */
import initialProgram from '../data/programEligibility.json';

const STORAGE_KEY = 'staffingbees_program';

export const programService = {
  async getProgramData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.completionPercentage === 82 || (parsed.conditions && parsed.conditions.some(c => c.current === '82 / 100')))) {
          localStorage.removeItem(STORAGE_KEY);
          return initialProgram;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse program data', e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProgram));
    return initialProgram;
  },

  async selectPaymentPlan(planId) {
    const current = await this.getProgramData();
    const updated = {
      ...current,
      paymentOptions: {
        ...current.paymentOptions,
        selectedPlan: planId,
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async toggleCondition(conditionId) {
    const current = await this.getProgramData();
    const updatedConditions = current.conditions.map((c) =>
      c.id === conditionId ? { ...c, isMet: !c.isMet, status: !c.isMet ? 'Met' : 'In Progress' } : c
    );
    const metCount = updatedConditions.filter((c) => c.isMet).length;
    const allMet = metCount === updatedConditions.length;
    const updated = {
      ...current,
      conditions: updatedConditions,
      eligibilityStatus: allMet ? 'Eligible (Job Guarantee Active)' : 'Program Requirements In Progress',
      completionPercentage: Math.round((metCount / updatedConditions.length) * 100),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
