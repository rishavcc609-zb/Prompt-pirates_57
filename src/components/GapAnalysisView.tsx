import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Plus,
  X,
  Target,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  FolderGit2,
  Sparkles,
} from 'lucide-react';
import { SkillCompetency, PortfolioProject } from '../types/roadmap';
import { SkillVerificationQuizModal } from './SkillVerificationQuizModal';
import { ProjectModal } from './ProjectModal';

interface GapAnalysisViewProps {
  onNavigateToMonthRoadmap: () => void;
  onNavigateToGraph: () => void;
}

export const GapAnalysisView: React.FC<GapAnalysisViewProps> = ({
  onNavigateToMonthRoadmap,
  onNavigateToGraph,
}) => {
  const {
    currentRoadmap,
    updateUserSkills,
    stats,
    toggleSkillPossessed,
    generateProjectForSkill,
    hasVerifiedBadge,
  } = useRoadmap();
  const [newSkillInput, setNewSkillInput] = useState('');
  const [selectedQuizSkill, setSelectedQuizSkill] = useState<SkillCompetency | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const handleLaunchQuiz = (skill: SkillCompetency) => {
    setSelectedQuizSkill(skill);
    setIsQuizModalOpen(true);
  };

  const handleGenerateProject = (skill: SkillCompetency) => {
    const proj = generateProjectForSkill(skill.id);
    setSelectedProject(proj);
    setIsProjectModalOpen(true);
  };

  const currentSkills = currentRoadmap.userCurrentSkills || [];

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const trimmed = newSkillInput.trim();
    if (!currentSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...currentSkills, trimmed];
      updateUserSkills(updated);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = currentSkills.filter(s => s !== skillToRemove);
    updateUserSkills(updated);
  };

  const getTierLabel = (tier: number) => {
    switch (tier) {
      case 1:
        return 'Pinnacle Capstone';
      case 2:
        return 'Core Technical';
      case 3:
        return 'Foundational Core';
      default:
        return 'Domain Competency';
    }
  };

  return (
    <div className="space-y-6">
      {/* Gap Analysis Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>Goal Preparedness</span>
            <Target className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {stats.goalPreparednessPercentage}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Calculated as matched skills / total skills
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>Possessed Skills</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
            {stats.matchedSkillsCount}
            <span className="text-sm font-normal text-slate-400"> / {stats.totalSkills} Matched</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Proficiency verified from your background
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>Gaps to Bridge</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
            {stats.gapsCount}
            <span className="text-sm font-normal text-slate-400"> Gaps to Bridge</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {stats.gapPartialCount} partial match · {stats.gapMissingCount} missing prerequisites
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>Total Effort to Bridge</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono tabular-nums">
            ~{stats.remainingHoursToBridge} hrs
          </div>
          <div className="text-xs text-slate-400 mt-1">
            ~{Math.round(stats.remainingHoursToBridge / (currentRoadmap.targetTimelineMonths * 4.3))} hrs/week over {currentRoadmap.targetTimelineMonths} months
          </div>
        </div>
      </div>

      {/* Interactive Current Skills Manager */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Your Documented Skill Profile</h3>
            <p className="text-xs text-slate-400">
              Add or remove skills you currently possess. The gap analysis and readiness quotient recalculate dynamically.
            </p>
          </div>

          <form onSubmit={handleAddSkill} className="flex items-center gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={e => setNewSkillInput(e.target.value)}
              placeholder="e.g. Rust, PyTorch, C++, Docker..."
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </form>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {currentSkills.length === 0 ? (
            <span className="text-xs text-slate-400 italic">
              No skills added yet. Add your current skills to calculate tailored gap analysis.
            </span>
          ) : (
            currentSkills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg text-xs font-mono"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Detailed Skill Gap Breakdown Matrix */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Reverse-Engineered Skill Gap Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated backwards from the target goal: Level 1 (Pinnacle) ← Level 2 (Core) ← Level 3 (Foundations)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToGraph}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>Inspect in Hierarchy Graph</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={onNavigateToMonthRoadmap}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>View Month-Wise Plan</span>
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold text-center">Possessed Toggle</th>
                <th className="py-3 px-4 font-semibold">Hierarchy Tier</th>
                <th className="py-3 px-4 font-semibold">Required Competency</th>
                <th className="py-3 px-4 font-semibold">Gap Status</th>
                <th className="py-3 px-4 font-semibold">Match Assessment</th>
                <th className="py-3 px-4 font-semibold text-right">Est. Effort</th>
                <th className="py-3 px-4 font-semibold text-right">Proof of Work</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {currentRoadmap.skills.map(skill => {
                const isPossessed = skill.gapStatus === 'possessed';
                const isPartial = skill.gapStatus === 'partial';
                const isVerified = isPossessed || hasVerifiedBadge(skill.id);

                return (
                  <tr key={skill.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-md bg-slate-900/60 hover:bg-slate-900 border border-slate-800 transition-colors">
                        <input
                          type="checkbox"
                          checked={isPossessed}
                          onChange={() => toggleSkillPossessed(skill.id)}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30 cursor-pointer"
                        />
                        <span className={`text-[11px] font-mono font-medium ${isPossessed ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {isPossessed ? 'Possessed' : 'Mark Gap'}
                        </span>
                      </label>
                    </td>
                    <td className="py-3 px-4 font-mono whitespace-nowrap">
                      <span className="text-slate-400">Tier {skill.tierLevel}:</span>{' '}
                      <span className="text-white font-medium">{getTierLabel(skill.tierLevel)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{skill.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{skill.category}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium ${
                          isPossessed
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : isPartial
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {isPossessed ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Possessed</span>
                          </>
                        ) : isPartial ? (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            <span>Partial Gap</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Critical Gap</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs">
                      {skill.matchReason || (isPossessed ? 'Direct skill match' : 'Required gap')}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-right text-slate-300 whitespace-nowrap">
                      {isPossessed ? (
                        <span className="text-emerald-400 font-medium">0 hrs</span>
                      ) : (
                        <span className="text-amber-300 font-semibold">{skill.estimatedHoursToBridge || 40} hrs</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleLaunchQuiz(skill)}
                          title="Take 5-Question Technical Quiz Drill to verify competence"
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{isVerified ? 'Drill' : 'Verify'}</span>
                        </button>
                        <button
                          onClick={() => handleGenerateProject(skill)}
                          title="Generate GitHub Portfolio Project Specification"
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <FolderGit2 className="w-3 h-3 text-cyan-400" />
                          <span>Project</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiz Verification Drill Modal */}
      <SkillVerificationQuizModal
        skill={selectedQuizSkill}
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />

      {/* Portfolio Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onStartQuizForSkill={skillId => {
          const sk = currentRoadmap.skills.find(s => s.id === skillId);
          if (sk) handleLaunchQuiz(sk);
        }}
      />
    </div>
  );
};
