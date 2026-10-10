import React, { useState } from 'react';
import {
  FolderGit2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Terminal,
  ExternalLink,
  Code2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Flame,
  FileCode,
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { PortfolioProject, SkillCompetency } from '../types/roadmap';
import { ProjectModal } from './ProjectModal';
import { SkillVerificationQuizModal } from './SkillVerificationQuizModal';

export const ProjectLabView: React.FC = () => {
  const {
    currentRoadmap,
    portfolioProjects,
    generateProjectForSkill,
    stats,
    hasVerifiedBadge,
  } = useRoadmap();

  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [activeQuizSkill, setActiveQuizSkill] = useState<SkillCompetency | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'gaps' | 'ready'>('all');

  // Gaps that need portfolio projects
  const gapSkills = currentRoadmap.skills.filter(s => s.gapStatus !== 'possessed');
  const allSkills = currentRoadmap.skills;

  const handleOpenProject = (proj: PortfolioProject) => {
    setActiveProject(proj);
    setIsProjectModalOpen(true);
  };

  const handleGenerateForSkill = (skill: SkillCompetency) => {
    const proj = generateProjectForSkill(skill.id);
    setActiveProject(proj);
    setIsProjectModalOpen(true);
  };

  const handleStartQuiz = (skillId: string) => {
    const skill = currentRoadmap.skills.find(s => s.id === skillId);
    if (skill) {
      setActiveQuizSkill(skill);
      setIsQuizModalOpen(true);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/20 border border-slate-800 p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Portfolio Project Architect</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
            Proof of Competence: Real-World Portfolio Repositories
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Hiring managers and technical leads ignore theoretical checklists. PathFinder auto-generates concrete, deployable project specifications, architecture diagrams, datasets, and GitHub README starters tailored to your exact skill gaps.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
            <div>
              <span className="text-slate-400">Total Gaps to Bridge:</span>{' '}
              <span className="text-rose-400 font-bold">{stats.gapsCount} skills</span>
            </div>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <div>
              <span className="text-slate-400">Estimated Effort:</span>{' '}
              <span className="text-emerald-400 font-bold">~{stats.remainingHoursToBridge} hours</span>
            </div>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <div>
              <span className="text-slate-400">Target Role:</span>{' '}
              <span className="text-white font-medium">{currentRoadmap.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Projects for Unmastered Gaps */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Recommended Projects to Bridge Skill Gaps</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any missing skill to auto-generate an end-to-end repository specification with downloadable README.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs self-start">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Skills ({allSkills.length})
            </button>
            <button
              onClick={() => setFilterMode('gaps')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'gaps' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gaps Only ({gapSkills.length})
            </button>
          </div>
        </div>

        {/* Skills & Generator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(filterMode === 'gaps' ? gapSkills : allSkills).map(skill => {
            const isVerified = skill.gapStatus === 'possessed' || hasVerifiedBadge(skill.id);
            const existingProject = portfolioProjects.find(p => p.targetSkillId === skill.id);

            return (
              <div
                key={skill.id}
                className={`relative rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isVerified
                    ? 'bg-slate-900/60 border-slate-800/80 hover:border-emerald-500/30'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                      {skill.category}
                    </span>

                    {isVerified ? (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Matched</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Gap to Bridge</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">{skill.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span>Est. {skill.estimatedHoursToBridge || 40}h effort</span>
                    <span aria-hidden="true">·</span>
                    <span>Tier {skill.tierLevel}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {existingProject ? (
                    <button
                      onClick={() => handleOpenProject(existingProject)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors cursor-pointer"
                    >
                      <FolderGit2 className="w-3.5 h-3.5" />
                      <span>View Blueprint</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleGenerateForSkill(skill)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Generate Project</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setActiveQuizSkill(skill);
                      setIsQuizModalOpen(true);
                    }}
                    title="Take Technical Drill Quiz"
                    className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generated Project Portfolio Collection */}
      {portfolioProjects.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-emerald-400" />
              <span>Your Active Portfolio Blueprints ({portfolioProjects.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ready-to-build repositories with architecture specifications, milestones, and downloadable README files.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioProjects.map(proj => (
              <div
                key={proj.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium text-emerald-400">
                      {proj.targetSkillName}
                    </div>
                    <h4 className="text-base font-bold text-white mt-0.5">{proj.projectTitle}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{proj.tagline}</p>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 text-[10px] font-mono uppercase font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 rounded-md">
                    {proj.difficulty}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] font-mono text-slate-300 bg-slate-950 border border-slate-800 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {proj.techStack.length > 4 && (
                    <span className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 rounded">
                      +{proj.techStack.length - 4} more
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-400 font-mono">
                    {proj.milestones.length} implementation phases
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenProject(proj)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Open Blueprint</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Inspector Modal */}
      <ProjectModal
        project={activeProject}
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onStartQuizForSkill={handleStartQuiz}
      />

      {/* Skill Quiz Modal */}
      <SkillVerificationQuizModal
        skill={activeQuizSkill}
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />
    </div>
  );
};
