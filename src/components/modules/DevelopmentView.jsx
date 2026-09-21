/**
 * Development View (Candidate Development Services)
 *
 * Displays the 7 core service layers of Staffing Bees:
 * Career Counseling, Career Coaching, Industry Mentoring, Skill Training,
 * Interview Preparation, Career Marketing, and CPI Development.
 *
 * Used By:
 * Main App navigation ('development').
 */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../common/Card';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import {
  Compass,
  Calendar,
  CheckCircle,
  ExternalLink,
  Users,
  Award,
  BookOpen,
} from 'lucide-react';

export default function DevelopmentView({ onNavigateToExperts, onNavigateToPlan }) {
  const { items: services = [], loading } = useSelector((state) => state.services);
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            <span>Staffing Bees Development Services</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            The 7 integrated service layers accelerating your career readiness and CPI progression.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToExperts && (
            <Button variant="outline" size="sm" onClick={onNavigateToExperts} icon={Users}>
              Advisory Specialists
            </Button>
          )}
        </div>
      </div>

      {/* 7 Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service) => (
          <Card
            key={service.id}
            className="flex flex-col justify-between border border-neutral-200 dark:border-neutral-800 hover:border-amber-400 dark:hover:border-amber-600/70 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  Layer {service.layerNumber}
                </span>
                <StatusBadge status={service.status} />
              </div>

              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {service.serviceName}
              </h3>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {service.description}
              </p>

              {/* Progress */}
              <div className="pt-1">
                <ProgressBar
                  value={service.progressPercentage}
                  showPercentage={true}
                  label="Curriculum Progress"
                  height="h-1.5"
                />
              </div>

              {/* Meta */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <div className="text-neutral-600 dark:text-neutral-400">
                  Assigned Expert: <strong className="text-neutral-800 dark:text-neutral-200">{service.assignedExpert}</strong>
                </div>

                {service.nextActivity && (
                  <div className="text-neutral-700 dark:text-neutral-300 flex items-start gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>Next: {service.nextActivity}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">
                {service.deliverables?.length || 0} Core Deliverables
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedService(service)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <Modal
          isOpen={Boolean(selectedService)}
          onClose={() => setSelectedService(null)}
          title={`Layer ${selectedService.layerNumber}: ${selectedService.serviceName}`}
          subtitle={`Assigned Specialist: ${selectedService.assignedExpert}`}
        >
          <div className="space-y-4">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              {selectedService.description}
            </p>

            <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Progress & Schedule
              </div>
              <ProgressBar
                value={selectedService.progressPercentage}
                height="h-2"
                label="Module Completion"
                className="mb-2"
              />
              <div className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                Next Milestone: <strong>{selectedService.nextActivity}</strong>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Curriculum Deliverables:
              </div>
              <ul className="space-y-2">
                {selectedService.deliverables?.map((del, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400"
                  >
                    <CheckCircle className="w-4 h-4 text-[#EAB308] shrink-0" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Button variant="primary" size="sm" onClick={() => setSelectedService(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
