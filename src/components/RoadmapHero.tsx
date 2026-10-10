import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import {
  Target,
  TrendingUp,
  DollarSign,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Search,
  X,
  Sparkles,
  Loader2,
  ArrowRight,
  Briefcase,
  Check,
  FolderArchive,
  Calendar,
  FolderGit2,
  Award,
} from 'lucide-react';

export const RoadmapHero: React.FC = () => {
  const {
    currentRoadmap,
    allRoadmaps,
    switchRoadmap,
    createNewRoadmap,
    isGenerating,
    stats,
    toggleSkillPossessed,
    setViewMode,
    sprintStreakDays,
  } = useRoadmap();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showQuickChecklist, setShowQuickChecklist] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter roadmaps matching the query
  const filteredRoadmaps = useMemo(() => {
    if (!searchQuery.trim()) return allRoadmaps;
    const q = searchQuery.toLowerCase().trim();
    return allRoadmaps.filter(r => {
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchIndustry = r.industry.toLowerCase().includes(q);
      const matchSummary = r.summary?.toLowerCase().includes(q);
      const matchSkills = (r.skills || []).some(s => s.name.toLowerCase().includes(q));
      return matchTitle || matchIndustry || matchSummary || matchSkills;
    });
  }, [allRoadmaps, searchQuery]);

  const handleSelectRole = (roleId: string) => {
    switchRoadmap(roleId);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleGenerateCustomRole = async (roleTitle: string) => {
    if (!roleTitle.trim() || isGenerating) return;
    try {
      await createNewRoadmap(roleTitle.trim());
      setSearchQuery('');
      setIsSearchOpen(false);
    } catch (err) {
      console.error('Failed to generate custom role:', err);
    }
  };

  const gap = currentRoadmap.gapAnalysisSummary || {
    possessedCount: stats.gapPossessedCount,
    partialCount: stats.gapPartialCount,
    missingCount: stats.gapMissingCount,
    totalRequiredSkills: stats.totalSkills,
    estimatedTotalHoursToBridge: stats.estimatedTotalHoursToBridge,
    currentReadinessQuotient: stats.overallReadinessPercentage,
  };

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 pb-8 pt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* Prominent Dream Job Search Bar */}
        <div ref={searchContainerRef} className="relative z-30">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-emerald-400">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search dream job roles (e.g. AI Engineer, ML Engineer, Quant, Professor, Teacher, Trainer...)"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all shadow-inner"
            />

            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-3.5 p-0.5 text-slate-400 hover:text-white rounded-md transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Interactive Search Suggestions Dropdown */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden py-1.5 z-50 max-h-96 overflow-y-auto">
              <div className="px-3.5 py-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-800 flex items-center justify-between">
                <span>
                  {searchQuery ? `Matching Dream Roles (${filteredRoadmaps.length})` : 'Available Dream Roles'}
                </span>
                <span className="text-[10px] text-slate-400">Click to switch roadmap</span>
              </div>

              {filteredRoadmaps.length > 0 ? (
                <div className="divide-y divide-slate-800/50">
                  {filteredRoadmaps.map(r => {
                    const isSelected = r.id === currentRoadmap.id;
                    const sampleSkills = (r.skills || []).slice(0, 3).map(s => s.name).join(' · ');
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleSelectRole(r.id)}
                        className={`w-full text-left px-3.5 py-2.5 hover:bg-slate-800/70 transition-colors flex items-start justify-between gap-3 ${
                          isSelected ? 'bg-emerald-500/10' : ''
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Briefcase className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                            <span className={`text-sm font-semibold truncate ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                              {r.title}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                              {r.industry}
                            </span>
                          </div>

                          {sampleSkills && (
                            <p className="text-xs text-slate-400 truncate mt-1">
                              Key skills: <span className="text-slate-300">{sampleSkills}</span>
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                            <span>{r.targetTimelineMonths || 12} mo plan</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-400 font-sans">{r.salaryRange}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="shrink-0 flex items-center gap-1 text-xs text-emerald-400 font-medium pt-0.5">
                            <Check className="w-4 h-4" />
                            <span>Active</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-6 text-center space-y-3">
                  <p className="text-sm text-slate-400">
                    No predefined role matching <span className="text-white font-medium">"{searchQuery}"</span>
                  </p>
                  <button
                    onClick={() => handleGenerateCustomRole(searchQuery)}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating {searchQuery} Roadmap...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Custom Roadmap for "{searchQuery}"</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Role Selection Chips Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/60 text-xs">
          <span className="text-slate-400 font-mono shrink-0">Quick Roles:</span>
          {(searchQuery ? filteredRoadmaps : allRoadmaps).map(r => (
            <button
              key={r.id}
              onClick={() => handleSelectRole(r.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                r.id === currentRoadmap.id
                  ? 'bg-emerald-500/15 text-emerald-300 font-medium border border-emerald-500/30 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <span>{r.title}</span>
              {r.id === currentRoadmap.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Job Scope & Overview */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-medium">{currentRoadmap.industry}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{currentRoadmap.targetTimelineMonths || 12} Months Reverse-Engineered Plan</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-cyan-400">{currentRoadmap.weeklyStudyHours || 15} hrs/wk Pace</span>
              {currentRoadmap.isCustom && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400">Custom Generated</span>
                </>
              )}
              <a
                href="/career-roadmap-website.zip"
                download="career-roadmap-website.zip"
                className="sm:ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 text-[11px] font-medium transition-colors shadow-xs"
                title="Download this entire website code (.zip)"
              >
                <FolderArchive className="w-3 h-3" />
                <span>Download Website (.ZIP)</span>
              </a>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              {currentRoadmap.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {currentRoadmap.summary}
            </p>

            {/* Frontier Role Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Timeline Pace</span>
                </div>
                <div className="text-sm font-semibold text-white font-mono tabular-nums">
                  {currentRoadmap.targetTimelineMonths || 12} mo · {currentRoadmap.weeklyStudyHours || 15}h/wk
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Estimated Comp</span>
                </div>
                <div className="text-sm font-semibold text-white font-mono tabular-nums">
                  {currentRoadmap.salaryRange}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Market Demand</span>
                </div>
                <div className="text-sm font-semibold text-white truncate" title={currentRoadmap.marketDemand}>
                  {currentRoadmap.marketDemand}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Accreditation Base</span>
                </div>
                <div className="text-sm font-semibold text-white truncate" title={currentRoadmap.requiredDegreeOrEquivalent}>
                  {currentRoadmap.requiredDegreeOrEquivalent}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Composite Readiness & Gap Engine */}
          <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Skill Gap & Readiness Index</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Recalculation
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-white font-mono tabular-nums transition-all">
                {stats.goalPreparednessPercentage}%
              </span>
              <span className="text-xs text-slate-400 font-medium">Goal Preparedness</span>
            </div>

            {/* Gauge progress bar with dynamic width */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, stats.goalPreparednessPercentage))}%` }}
              />
            </div>

            {/* Breakdown Indicators */}
            <div className="space-y-2.5 text-xs pt-1 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Possessed Skills</span>
                </span>
                <span className="font-mono text-emerald-300 tabular-nums font-semibold">
                  {stats.matchedSkillsCount} / {stats.totalSkills} Matched
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gaps to Bridge</span>
                </span>
                <span className="font-mono text-amber-300 tabular-nums font-semibold">
                  {stats.gapsCount} Competencies (~{stats.remainingHoursToBridge}h)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Resources Completed</span>
                </span>
                <span className="font-mono text-cyan-300 tabular-nums">
                  {stats.completedResourcesCount} / {stats.totalResourcesCount} Modules
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Skill Badges</span>
                </span>
                <span className="font-mono text-emerald-300 font-semibold tabular-nums">
                  {stats.totalVerifiedBadges} Passed
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Verified Credentials</span>
                </span>
                <span className="font-mono text-slate-200 tabular-nums">
                  {stats.verifiedCertificates} Uploaded
                </span>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setViewMode('sprints')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Daily Sprints</span>
                {sprintStreakDays > 0 && (
                  <span className="text-[10px] bg-cyan-500/20 px-1 rounded font-mono">
                    {sprintStreakDays}d
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setViewMode('projectlab')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Project Lab</span>
              </button>
            </div>

            {/* Interactive Live Skill Checklist */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowQuickChecklist(!showQuickChecklist)}
                className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors py-1 font-mono"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Interactive Skill Simulator ({currentRoadmap.skills.length})</span>
                </span>
                <span className="text-[11px] text-emerald-400">
                  {showQuickChecklist ? 'Hide ▲' : 'Tick Skills ▼'}
                </span>
              </button>

              {showQuickChecklist && (
                <div className="mt-2.5 space-y-1.5 max-h-56 overflow-y-auto pr-1 animate-in fade-in duration-150">
                  <p className="text-[11px] text-slate-400 pb-1">
                    Tick or untick any skill below to watch Goal Preparedness %, gaps, remaining hours, and progress bar recalculate instantly:
                  </p>
                  {currentRoadmap.skills.map(skill => {
                    const isPossessed = skill.gapStatus === 'possessed';
                    return (
                      <label
                        key={skill.id}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                          isPossessed
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-white'
                            : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <input
                            type="checkbox"
                            checked={isPossessed}
                            onChange={() => toggleSkillPossessed(skill.id)}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30 cursor-pointer shrink-0"
                          />
                          <span className={`truncate text-xs ${isPossessed ? 'text-emerald-300 font-medium' : 'text-slate-200'}`}>
                            {skill.name}
                          </span>
                        </div>
                        <span
                          className={`font-mono text-[11px] shrink-0 font-medium ${
                            isPossessed ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {isPossessed ? 'Matched' : `~${skill.estimatedHoursToBridge || 40}h`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
