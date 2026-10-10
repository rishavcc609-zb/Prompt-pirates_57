import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Code2,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { SkillCompetency, SkillQuizQuestion, SkillBadge } from '../types/roadmap';
import { getQuizForSkill } from '../utils/quizBank';
import { useRoadmap } from '../context/RoadmapContext';

interface SkillVerificationQuizModalProps {
  skill: SkillCompetency | null;
  isOpen: boolean;
  onClose: () => void;
  onQuizPassed?: (badge: SkillBadge) => void;
}

export const SkillVerificationQuizModal: React.FC<SkillVerificationQuizModalProps> = ({
  skill,
  isOpen,
  onClose,
  onQuizPassed,
}) => {
  const { currentRoadmap, recordQuizPass, hasVerifiedBadge, verifiedBadges } = useRoadmap();

  const [questions, setQuestions] = useState<SkillQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<SkillBadge | null>(null);

  // Initialize quiz whenever skill changes or opens
  useEffect(() => {
    if (skill && isOpen) {
      const qList = getQuizForSkill(skill, currentRoadmap.title);
      setQuestions(qList);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowExplanation(false);
      setIsFinished(false);
      setEarnedBadge(null);
    }
  }, [skill, isOpen, currentRoadmap.title]);

  if (!isOpen || !skill) return null;

  const currentQ = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const selectedOptionIndex = selectedAnswers[currentQuestionIndex];
  const hasAnsweredCurrent = selectedOptionIndex !== undefined;

  // Calculate score
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, ansIdx]) => questions[Number(qIdx)]?.correctIndex === ansIdx
  ).length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isPassed = scorePercent >= 70;

  const handleSelectOption = (optIdx: number) => {
    if (showExplanation || isFinished) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: optIdx }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsFinished(true);
      if (isPassed) {
        const badge = recordQuizPass(skill.id, scorePercent);
        setEarnedBadge(badge);
        if (onQuizPassed) onQuizPassed(badge);
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setIsFinished(false);
    setEarnedBadge(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Technical Skill Verification Drill</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-medium">{skill.category}</span>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-white truncate max-w-md">
                {skill.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {!isFinished && totalQuestions > 0 && (
          <div className="w-full bg-slate-800 h-1.5">
            <div
              className="bg-emerald-500 h-1.5 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {!isFinished ? (
            currentQ && (
              <div className="space-y-5">
                {/* Question Info Bar */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-slate-300">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-emerald-400/90">Pass threshold: 70% (≥ 4 correct)</span>
                </div>

                {/* Question Prompt */}
                <div className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                  {currentQ.question}
                </div>

                {/* Code Snippet if applicable */}
                {currentQ.codeSnippet && (
                  <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-3.5 overflow-x-auto text-xs font-mono text-cyan-300">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-2 uppercase tracking-wider">
                      <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Architecture / Code Benchmark</span>
                    </div>
                    <pre className="whitespace-pre">{currentQ.codeSnippet}</pre>
                  </div>
                )}

                {/* Options List */}
                <div className="space-y-2.5 pt-1">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOptionIndex === idx;
                    const isCorrect = currentQ.correctIndex === idx;

                    let buttonClass = 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 text-slate-200';
                    if (showExplanation) {
                      if (isCorrect) {
                        buttonClass = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 shadow-sm';
                      } else if (isSelected && !isCorrect) {
                        buttonClass = 'border-rose-500/80 bg-rose-950/40 text-rose-200';
                      } else {
                        buttonClass = 'border-slate-800/60 bg-slate-900/30 text-slate-400 opacity-60';
                      }
                    } else if (isSelected) {
                      buttonClass = 'border-emerald-500 bg-emerald-950/30 text-white';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={showExplanation}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm flex items-start gap-3 ${buttonClass}`}
                      >
                        <span className="shrink-0 w-6 h-6 rounded-lg bg-slate-800/80 text-slate-300 font-mono text-xs flex items-center justify-center border border-slate-700/60 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 leading-snug">{option}</span>
                        {showExplanation && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        {showExplanation && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Immediate Explanation Box */}
                {showExplanation && (
                  <div
                    className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                      selectedOptionIndex === currentQ.correctIndex
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="font-semibold mb-1 flex items-center gap-1.5">
                      {selectedOptionIndex === currentQ.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Correct Invariant</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span>Technical Rationale</span>
                        </>
                      )}
                    </div>
                    <p className="text-slate-300">{currentQ.explanation}</p>
                  </div>
                )}
              </div>
            )
          ) : (
            /* Results Screen */
            <div className="text-center py-4 space-y-6">
              <div
                className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border ${
                  isPassed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                {isPassed ? <Award className="w-8 h-8" /> : <RotateCcw className="w-8 h-8" />}
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Verification Drill Results
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {isPassed ? 'Competence Verified!' : 'Practice Drill Incomplete'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                  {isPassed
                    ? `Congratulations! You answered ${correctCount} of ${totalQuestions} questions correctly (${scorePercent}%). Your skill status has been updated to Matched.`
                    : `You answered ${correctCount} of ${totalQuestions} questions correctly (${scorePercent}%). Review the key topics and try again to unlock your badge.`}
                </p>
              </div>

              {/* Verified Badge Display Card */}
              {isPassed && (
                <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 max-w-md mx-auto text-left shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                        Verified Credential
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Score: {scorePercent}%
                    </span>
                  </div>

                  <div className="pt-3">
                    <div className="text-sm font-bold text-white">{skill.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Target Role: {currentRoadmap.title}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Code: {earnedBadge?.verificationCode || 'VERIFIED-OK'}</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Goal Preparedness % automatically recalculated</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          {!isFinished ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel Drill
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!hasAnsweredCurrent}
                className={`flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  hasAnsweredCurrent
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 cursor-pointer'
                    : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{isLastQuestion ? 'Complete Assessment' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              {!isPassed ? (
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Drill</span>
                </button>
              ) : (
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Readiness quotient updated</span>
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
