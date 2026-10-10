import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Download,
  ExternalLink,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  ShieldCheck,
  FolderGit2,
  ListTodo,
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { DailyStudySprint, SkillCompetency } from '../types/roadmap';
import { generateIcsCalendar, downloadIcsFile, getGoogleCalendarIntentUrl } from '../utils/calendarExport';
import { SkillVerificationQuizModal } from './SkillVerificationQuizModal';

export const StudySprintPlannerView: React.FC = () => {
  const {
    currentRoadmap,
    sprints,
    toggleSprintCompleted,
    resetSprintsForCurrentRoadmap,
    sprintStreakDays,
    completedSprintsCount,
    stats,
  } = useRoadmap();

  // Focus Timer State
  const [activeSprintIndex, setActiveSprintIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(45 * 60); // default 45 min
  const [initialTimerMinutes, setInitialTimerMinutes] = useState(45);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [preferredHour, setPreferredHour] = useState(19); // 7:00 PM
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');

  // Quiz Modal State
  const [quizSkill, setQuizSkill] = useState<SkillCompetency | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const activeSprint: DailyStudySprint | undefined = sprints[activeSprintIndex] || sprints[0];

  // Timer countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Automatically toggle sprint as completed if not yet
      if (activeSprint && !activeSprint.completed) {
        toggleSprintCompleted(activeSprint.id);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, activeSprint, toggleSprintCompleted]);

  // Sync timer when active sprint changes
  useEffect(() => {
    if (activeSprint) {
      const mins = activeSprint.durationMinutes || 45;
      setInitialTimerMinutes(mins);
      setTimerSeconds(mins * 60);
      setIsTimerRunning(false);
    }
  }, [activeSprintIndex]);

  const handleStartTimer = (mins?: number) => {
    if (mins) {
      setInitialTimerMinutes(mins);
      setTimerSeconds(mins * 60);
    }
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(initialTimerMinutes * 60);
  };

  const handleDownloadAllIcs = () => {
    const icsString = generateIcsCalendar(sprints, {
      calendarTitle: `${currentRoadmap.title} - Study Sprints`,
      preferredHour,
    });
    downloadIcsFile(icsString, `${currentRoadmap.slug}-sprints.ics`);
  };

  const handleOpenGoogleCalendar = (sprint: DailyStudySprint) => {
    const url = getGoogleCalendarIntentUrl(sprint, { preferredHour });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenQuiz = (skillId: string) => {
    const skill = currentRoadmap.skills.find(s => s.id === skillId);
    if (skill) {
      setQuizSkill(skill);
      setIsQuizOpen(true);
    }
  };

  // Filter sprints
  const filteredSprints = sprints.filter(s => {
    if (filterMode === 'pending') return !s.completed;
    if (filterMode === 'completed') return s.completed;
    return true;
  });

  const minutesLeft = Math.floor(timerSeconds / 60);
  const secondsLeft = timerSeconds % 60;
  const timerProgress = initialTimerMinutes > 0 ? (1 - timerSeconds / (initialTimerMinutes * 60)) * 100 : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/20 border border-slate-800 p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily Execution & Calendar Integration Engine</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
            Structured Daily Study Sprints
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Eliminate career procrastination by turning your multi-month roadmap into bite-sized, 45-to-90 minute calendar commitments. Export directly to Google Calendar or Apple Calendar, run focused sprint sessions, and track your daily streak.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Current Streak:</span>
              <strong className="text-amber-300 font-bold">{sprintStreakDays} Days</strong>
            </div>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <div>
              <span>Completed Sprints:</span>{' '}
              <strong className="text-emerald-400 font-bold">
                {completedSprintsCount} / {sprints.length}
              </strong>
            </div>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <div>
              <span>Weekly Pace:</span>{' '}
              <strong className="text-white font-medium">{currentRoadmap.weeklyStudyHours}h / week</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Export & Scheduling Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Preferred Daily Study Hour:</span>
          </div>
          <select
            value={preferredHour}
            onChange={e => setPreferredHour(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value={7}>7:00 AM (Early Focus)</option>
            <option value={8}>8:00 AM (Morning)</option>
            <option value={12}>12:00 PM (Midday Sprint)</option>
            <option value={18}>6:00 PM (Evening)</option>
            <option value={19}>7:00 PM (Deep Work Prime)</option>
            <option value={20}>8:00 PM (Night Sprint)</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadAllIcs}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-colors cursor-pointer"
            title="Download .ics file for Google Calendar, Apple Calendar, or Outlook"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Calendar (.ICS)</span>
          </button>

          {activeSprint && (
            <button
              onClick={() => handleOpenGoogleCalendar(activeSprint)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors cursor-pointer"
              title="Add today's sprint directly into Google Calendar"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Calendar Event</span>
            </button>
          )}

          <button
            onClick={resetSprintsForCurrentRoadmap}
            className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="Re-synchronize sprints with roadmap updates"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Featured Focus Session & Interactive Pomodoro Stage */}
      {activeSprint && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sprint Details & Action Checklist (8 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 rounded-lg">
                    Day {activeSprint.dayNumber}
                  </span>
                  <span className="text-xs text-slate-400">
                    Stage: <span className="text-slate-300 font-medium">{activeSprint.stageTitle}</span>
                  </span>
                </div>

                <button
                  onClick={() => toggleSprintCompleted(activeSprint.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    activeSprint.completed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  {activeSprint.completed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5 text-slate-400" />
                      <span>Mark Complete</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{activeSprint.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  {activeSprint.objective}
                </p>
              </div>

              {/* Action Items Checklist */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ListTodo className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Action Items for Today's Session</span>
                </div>
                <div className="space-y-2">
                  {activeSprint.actionItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start gap-2.5 text-xs text-slate-300"
                    >
                      <span className="w-4 h-4 rounded bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concrete Deliverable */}
              <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-xs text-cyan-300">
                <strong className="text-cyan-200">Sprint Deliverable:</strong> {activeSprint.deliverable}
              </div>
            </div>

            {/* Sprint Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleOpenQuiz(activeSprint.skillId)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Test Knowledge ({activeSprint.skillName})</span>
              </button>

              <button
                onClick={() => handleOpenGoogleCalendar(activeSprint)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Schedule in Calendar</span>
              </button>
            </div>
          </div>

          {/* Integrated Pomodoro / Focus Timer (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between space-y-6 text-center">
            <div className="w-full">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Live Deep Work Station
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Target Competency: <span className="text-cyan-400 font-medium">{activeSprint.skillName}</span>
              </div>
            </div>

            {/* Timer Dial & Countdown */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              {/* Outer Progress Ring */}
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-slate-800"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-cyan-500 transition-all duration-500"
                  strokeWidth="6"
                  strokeDasharray="276"
                  strokeDashoffset={276 - (276 * timerProgress) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
                  {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 uppercase font-mono tracking-wider">
                  {isTimerRunning ? 'Sprint in Progress' : timerSeconds === 0 ? 'Sprint Done' : 'Focus Ready'}
                </div>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="w-full space-y-3">
              <div className="flex items-center justify-center gap-3">
                {!isTimerRunning ? (
                  <button
                    onClick={() => handleStartTimer()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Sprint</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePauseTimer}
                    className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  onClick={handleResetTimer}
                  className="p-2.5 bg-slate-950 text-slate-400 hover:text-white border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center justify-center gap-2 text-xs font-mono">
                <button
                  onClick={() => handleStartTimer(25)}
                  className={`px-2.5 py-1 rounded-lg border transition-colors ${
                    initialTimerMinutes === 25 ? 'bg-slate-800 border-cyan-500/50 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  25m Pomodoro
                </button>
                <button
                  onClick={() => handleStartTimer(45)}
                  className={`px-2.5 py-1 rounded-lg border transition-colors ${
                    initialTimerMinutes === 45 ? 'bg-slate-800 border-cyan-500/50 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  45m Standard
                </button>
                <button
                  onClick={() => handleStartTimer(60)}
                  className={`px-2.5 py-1 rounded-lg border transition-colors ${
                    initialTimerMinutes === 60 ? 'bg-slate-800 border-cyan-500/50 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  60m Deep Dive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 14-Day Sprint Queue List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Full Study Sprint Sequence</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any day to activate its focus session or export to calendar.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs self-start">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({sprints.length})
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'pending' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pending ({sprints.filter(s => !s.completed).length})
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'completed' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Done ({completedSprintsCount})
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredSprints.map((sprint, idx) => {
            const isSelected = sprint.id === activeSprint?.id;

            return (
              <div
                key={sprint.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/50 shadow-md shadow-cyan-500/5'
                    : sprint.completed
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => toggleSprintCompleted(sprint.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {sprint.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span className="font-bold text-cyan-400">Day {sprint.dayNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{sprint.durationMinutes} min</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-300 font-sans">{sprint.skillName}</span>
                    </div>

                    <h4
                      className={`text-sm font-semibold mt-0.5 ${
                        sprint.completed ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {sprint.title}
                    </h4>

                    <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {sprint.objective}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => setActiveSprintIndex(sprints.findIndex(s => s.id === sprint.id))}
                    className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Focus
                  </button>

                  <button
                    onClick={() => handleOpenGoogleCalendar(sprint)}
                    title="Export to Google Calendar"
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  </button>

                  <button
                    onClick={() => handleOpenQuiz(sprint.skillId)}
                    title="Take Skill Verification Quiz"
                    className="p-1.5 text-slate-400 hover:text-emerald-400 bg-slate-950 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification Quiz Modal */}
      <SkillVerificationQuizModal
        skill={quizSkill}
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </div>
  );
};
