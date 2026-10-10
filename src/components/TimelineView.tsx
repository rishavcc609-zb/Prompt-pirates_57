import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { Milestone, MilestoneStatus, MonthPlan, LearningResource } from '../types/roadmap';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
  BookOpen,
  Calendar,
  Sliders,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface TimelineViewProps {
  onSelectSkill: (skillId: string) => void;
  onOpenAddMilestone: (stageId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ onSelectSkill, onOpenAddMilestone }) => {
  const {
    currentRoadmap,
    updateMilestoneStatus,
    toggleDeliverable,
    toggleResourceCompleted,
    recalculateTimeline,
    stats,
    toggleSkillPossessed,
  } = useRoadmap();

  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({
    'month-1': true,
    'month-2': true,
  });
  const [viewFormat, setViewFormat] = useState<'month_wise' | 'strategic_phases'>('month_wise');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [customMonthsInput, setCustomMonthsInput] = useState(
    currentRoadmap.targetTimelineMonths || 12
  );

  const toggleMonthExpand = (id: string) => {
    setExpandedMonths(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApplyTimelineChange = (months: number) => {
    recalculateTimeline(months);
    setCustomMonthsInput(months);
    setIsRecalculating(false);
  };

  const getResourceTypeColor = (type: LearningResource['type']) => {
    switch (type) {
      case 'Course':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80';
      case 'Book':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/80';
      case 'Paper':
        return 'text-purple-400 bg-purple-950/60 border-purple-800/80';
      case 'Documentation':
        return 'text-slate-300 bg-slate-900 border-slate-800';
      case 'Project':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80';
      case 'Certification':
        return 'text-indigo-400 bg-indigo-950/60 border-indigo-800/80';
    }
  };

  const monthPlans = currentRoadmap.monthPlans || [];

  return (
    <div className="space-y-6">
      {/* Timeline Pacing & Recalculate Dashboard Banner */}
      <div className="bg-slate-900/70 border border-slate-800 p-4 sm:p-5 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Active Execution Schedule</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{currentRoadmap.targetTimelineMonths} Months Horizon</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{currentRoadmap.weeklyStudyHours} hrs/week Pace</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Month-Wise Learning Roadmap with Curated Resources
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle (Month-Wise vs Traditional Phases) */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setViewFormat('month_wise')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  viewFormat === 'month_wise'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Month Modules ({monthPlans.length})
              </button>
              <button
                onClick={() => setViewFormat('strategic_phases')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  viewFormat === 'strategic_phases'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Phases ({currentRoadmap.stages.length})
              </button>
            </div>

            <button
              onClick={() => setIsRecalculating(!isRecalculating)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recalculate Timeline</span>
            </button>
          </div>
        </div>

        {/* Live Timeline Recalculation Drawer */}
        {isRecalculating && (
          <div className="pt-3 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-white font-semibold">Change Target Timeline:</span>
                <span className="text-slate-400 ml-2">
                  Adjusting months immediately re-distributes weekly study commitments and milestone deadlines.
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[3, 6, 9, 12, 18, 24].map(m => (
                  <button
                    key={m}
                    onClick={() => handleApplyTimelineChange(m)}
                    className={`px-2.5 py-1 rounded-md font-mono transition-colors ${
                      currentRoadmap.targetTimelineMonths === m
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {m} mo
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="2"
                max="36"
                value={customMonthsInput}
                onChange={e => setCustomMonthsInput(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <span className="font-mono text-emerald-400 font-bold text-xs whitespace-nowrap">
                {customMonthsInput} Months
              </span>
              <button
                onClick={() => handleApplyTimelineChange(customMonthsInput)}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-md whitespace-nowrap"
              >
                Apply Recalculation
              </button>
            </div>
          </div>
        )}

        {/* Resource Progress Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-800/60 font-mono">
          <div className="flex items-center gap-4 text-slate-400">
            <span>
              Resources Completed:{' '}
              <span className="text-white font-bold tabular-nums">
                {stats.completedResourcesCount} / {stats.totalResourcesCount} ({stats.resourceCompletionPercentage}%)
              </span>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Milestones Achieved:{' '}
              <span className="text-emerald-400 font-bold tabular-nums">
                {stats.achievedMilestones} / {stats.totalMilestones} ({stats.completionPercentage}%)
              </span>
            </span>
          </div>

          <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${stats.resourceCompletionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Month-Wise View */}
      {viewFormat === 'month_wise' && (
        <div className="space-y-6">
          {monthPlans.map(month => {
            const isExpanded = !!expandedMonths[month.id];
            const completedResources = (month.resources || []).filter(r => r.completed).length;
            const totalResources = (month.resources || []).length;
            const allResourcesDone = totalResources > 0 && completedResources === totalResources;

            return (
              <div
                key={month.id}
                className={`bg-slate-950 border rounded-xl transition-all overflow-hidden ${
                  allResourcesDone
                    ? 'border-emerald-500/30'
                    : 'border-slate-800 hover:border-slate-750'
                }`}
              >
                {/* Month Card Header */}
                <div
                  onClick={() => toggleMonthExpand(month.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer bg-slate-950 hover:bg-slate-900/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        allResourcesDone
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-900 text-slate-300 border border-slate-800'
                      }`}
                    >
                      M{month.monthNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="text-emerald-400 font-medium">{month.theme}</span>
                        <span aria-hidden="true">·</span>
                        <span>{month.weeklyHoursTarget} hrs/week Target</span>
                      </div>
                      <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                        {month.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-xs font-mono text-slate-400">
                      {completedResources} / {totalResources} Resources
                    </span>
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-white rounded"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Month Details: Focus Skills, Milestones, Curated Resources */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-900 space-y-5">
                    {/* Focus Skills for this Month with Checkbox Toggles */}
                    {month.focusSkillIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-slate-400 font-mono text-[11px]">Core Skills Targeted:</span>
                        {month.focusSkillIds.map(skId => {
                          const skill = currentRoadmap.skills.find(s => s.id === skId);
                          if (!skill) return null;
                          const isPossessed = skill.gapStatus === 'possessed';
                          return (
                            <div
                              key={skId}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] transition-colors ${
                                isPossessed
                                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isPossessed}
                                onChange={() => toggleSkillPossessed(skill.id)}
                                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30 cursor-pointer"
                                title="Tick to mark skill as possessed / matched"
                              />
                              <button
                                type="button"
                                onClick={() => onSelectSkill(skId)}
                                className="hover:underline text-left truncate max-w-[160px]"
                              >
                                {skill.name}
                              </button>
                              <span className="font-mono text-[10px] text-slate-400">
                                {isPossessed ? '✓ Matched' : `~${skill.estimatedHoursToBridge || 40}h`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Curated Resources Section */}
                    <div>
                      <h4 className="text-xs font-mono font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Curated Learning Resources ({month.resources.length}):</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {month.resources.map(res => (
                          <div
                            key={res.id}
                            className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                              res.completed
                                ? 'bg-emerald-950/20 border-emerald-500/30'
                                : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${getResourceTypeColor(
                                    res.type
                                  )}`}
                                >
                                  {res.type}
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">
                                  {res.provider}
                                </span>
                              </div>

                              <div
                                className={`text-xs font-semibold leading-snug ${
                                  res.completed ? 'line-through text-slate-400' : 'text-white'
                                }`}
                              >
                                {res.title}
                              </div>

                              {res.estimatedHours && (
                                <div className="text-[11px] text-slate-500 font-mono">
                                  Est. {res.estimatedHours} study hours
                                </div>
                              )}
                            </div>

                            <label className="flex items-center gap-1.5 cursor-pointer shrink-0 mt-1">
                              <input
                                type="checkbox"
                                checked={res.completed}
                                onChange={() => toggleResourceCompleted(month.id, res.id)}
                                className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0 cursor-pointer w-4 h-4"
                              />
                              <span className="text-[11px] font-mono text-slate-400">
                                {res.completed ? 'Done' : 'Study'}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Month Milestone Deliverables */}
                    {month.milestones.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs font-mono font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Month Project Deliverables:</span>
                        </h4>

                        <div className="space-y-2.5">
                          {month.milestones.map(ms => (
                            <div
                              key={ms.id}
                              className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-lg space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-white">{ms.title}</span>
                                <div className="flex items-center gap-1">
                                  {(['not_started', 'in_progress', 'achieved'] as const).map(st => (
                                    <button
                                      key={st}
                                      onClick={() => updateMilestoneStatus(ms.id, st)}
                                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                                        ms.status === st
                                          ? st === 'achieved'
                                            ? 'bg-emerald-500 text-slate-950 font-bold'
                                            : 'bg-cyan-500 text-slate-950 font-bold'
                                          : 'bg-slate-800 text-slate-400 hover:text-white'
                                      }`}
                                    >
                                      {st === 'achieved' ? 'Achieved' : st === 'in_progress' ? 'Active' : 'To Do'}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1">
                                {ms.deliverables.map((deliv, dIdx) => {
                                  const isDone = (ms.completedDeliverables || []).includes(deliv);
                                  return (
                                    <label
                                      key={dIdx}
                                      className="flex items-start gap-2 text-xs cursor-pointer text-slate-300"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isDone}
                                        onChange={() => toggleDeliverable(ms.id, deliv)}
                                        className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                                      />
                                      <span className={isDone ? 'line-through text-slate-400' : ''}>
                                        {deliv}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Strategic Phases View (Alternative) */}
      {viewFormat === 'strategic_phases' && (
        <div className="space-y-6">
          {currentRoadmap.stages.map(stage => (
            <div key={stage.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-emerald-400">{stage.timeframe}</span>
                  <h3 className="text-base font-bold text-white">{stage.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{stage.objective}</p>
                </div>
                <button
                  onClick={() => onOpenAddMilestone(stage.id)}
                  className="px-3 py-1.5 text-xs text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {stage.milestones.map(ms => (
                  <div
                    key={ms.id}
                    className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{ms.title}</div>
                      <div className="text-xs text-slate-400 mt-1">{ms.description}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-2">
                        Timeframe: {ms.targetTimeframe} · Difficulty: {ms.difficulty}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {(['not_started', 'in_progress', 'achieved'] as const).map(st => (
                        <button
                          key={st}
                          onClick={() => updateMilestoneStatus(ms.id, st)}
                          className={`px-2.5 py-1 rounded text-xs font-medium ${
                            ms.status === st
                              ? st === 'achieved'
                                ? 'bg-emerald-500 text-slate-950 font-bold'
                                : 'bg-cyan-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {st === 'achieved' ? 'Achieved' : st === 'in_progress' ? 'Active' : 'To Do'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
