/**
 * CPI Assessment Modal
 *
 * Multi-step interactive diagnostic workflow allowing candidates to answer
 * structured questions for the 14 CPI dimensions, save intermediate progress,
 * and submit to recompute their employability score and development roadmap.
 *
 * Used By:
 * CPI View and Header action triggers.
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitCpiAssessment } from '../../store/cpiSlice';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { CheckCircle2, ArrowLeft, ArrowRight, Save, Sparkles } from 'lucide-react';

export default function CpiAssessmentModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { questions = [], assessmentSubmitting } = useSelector((state) => state.cpi);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentIndex] || null;
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const completionPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const handleSelectOption = (score) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: score,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    await dispatch(submitCpiAssessment(answers));
    setIsCompleted(true);
  };

  const handleFinish = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setAnswers({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Performance Index (CPI) Assessment"
      subtitle="Comprehensive 14-dimension employability and career readiness diagnostic."
      maxWidth="max-w-2xl"
    >
      {isCompleted ? (
        <div className="text-center py-8 px-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h4 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Assessment Submitted Successfully
          </h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-md mx-auto">
            Your CPI scores, dimension benchmarks, and personalized development roadmaps
            have been updated in your profile.
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="primary" onClick={handleFinish}>
              View Updated CPI Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {/* Progress Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-500 mb-1.5">
              <span>
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span>{completionPercent}% Completed</span>
            </div>
            <ProgressBar value={completionPercent} showPercentage={false} height="h-2" />
          </div>

          {/* Current Question */}
          {currentQuestion ? (
            <div className="space-y-4">
              <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 rounded-lg p-3.5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                  Dimension: {currentQuestion.dimension}
                </span>
                <span className="text-[11px] text-amber-700 dark:text-amber-300">
                  Staffing Bees Diagnostic Framework
                </span>
              </div>

              <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                {currentQuestion.prompt}
              </h4>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = answers[currentQuestion.id] === opt.score;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt.score)}
                      className={`w-full text-left p-3.5 rounded-lg border text-sm transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-[#EAB308] bg-amber-50/60 dark:bg-amber-950/30 text-neutral-950 dark:text-neutral-100 font-medium ring-1 ring-[#EAB308]'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-[#EAB308] bg-[#EAB308]'
                            : 'border-neutral-400'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-neutral-950" />}
                      </div>
                      <span className="flex-1">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Question Navigation Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-neutral-100 dark:border-neutral-800 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  icon={ArrowLeft}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    icon={Save}
                  >
                    Save & Continue Later
                  </Button>

                  {currentIndex < totalQuestions - 1 ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleNext}
                      disabled={answers[currentQuestion.id] === undefined}
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSubmit}
                      disabled={assessmentSubmitting || answeredCount < totalQuestions}
                      icon={Sparkles}
                    >
                      {assessmentSubmitting ? 'Calculating CPI...' : 'Submit Assessment'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-500">No questions available.</p>
          )}
        </div>
      )}
    </Modal>
  );
}
