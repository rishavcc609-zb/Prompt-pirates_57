import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  FolderGit2,
  Terminal,
  ExternalLink,
  Code2,
  BookOpen,
  Award,
  Sparkles,
  Layers,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { PortfolioProject } from '../types/roadmap';
import { generateProjectReadme } from '../utils/projectGenerator';

interface ProjectModalProps {
  project: PortfolioProject | null;
  isOpen: boolean;
  onClose: () => void;
  onStartQuizForSkill?: (skillId: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onStartQuizForSkill,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'readme' | 'interview'>('overview');

  if (!isOpen || !project) return null;

  const fullReadme = project.githubReadmeTemplate || generateProjectReadme(project);

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(fullReadme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReadme = () => {
    const blob = new Blob([fullReadme], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.id}-README.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl mt-0.5">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-emerald-400 font-medium">{project.targetSkillName}</span>
                <span aria-hidden="true">·</span>
                <span className="uppercase text-[10px] tracking-wider font-semibold text-slate-400">
                  {project.difficulty} Level
                </span>
                <span aria-hidden="true">·</span>
                <span>~{project.estimatedHours}h build</span>
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white mt-0.5">
                {project.projectTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {project.tagline}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Quick Actions */}
        <div className="px-6 py-2.5 border-b border-slate-800 bg-slate-950/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-white border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              System Specification
            </button>
            <button
              onClick={() => setActiveTab('readme')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'readme'
                  ? 'bg-slate-800 text-white border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>GitHub README Starter</span>
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'interview'
                  ? 'bg-slate-800 text-white border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interview Defense Script</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReadme}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy README'}</span>
            </button>
            <button
              onClick={handleDownloadReadme}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download README.md</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Problem Statement Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4.5 space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Target Engineering Problem
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {project.problemStatement}
                </p>
              </div>

              {/* Tech Stack Badges */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  Production Tech Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-mono text-cyan-300 bg-cyan-950/30 border border-cyan-500/20 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Architecture Diagram */}
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Architecture Overview & Data Flow</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed whitespace-pre">
                  {project.architectureOverview}
                </div>
              </div>

              {/* Step-by-Step Deliverable Milestones */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Implementation Milestones (Phases 1-4)
                </div>
                <div className="space-y-3">
                  {project.milestones.map(m => (
                    <div
                      key={m.step}
                      className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center">
                          {m.step}
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold text-white">{m.title}</h4>
                      </div>
                      <div className="text-xs text-slate-300 pl-7 space-y-1">
                        <div>
                          <strong className="text-slate-400 font-medium">Deliverable:</strong>{' '}
                          {m.deliverable}
                        </div>
                        <div>
                          <strong className="text-slate-400 font-medium">Acceptance Criteria:</strong>{' '}
                          <span className="text-emerald-400">{m.acceptanceCriteria}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Datasets & APIs */}
              {project.datasetsOrApis.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                    Datasets & Telemetry Tools
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.datasetsOrApis.map((data, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs"
                      >
                        <div className="font-semibold text-slate-200">{data.name}</div>
                        <div className="text-slate-400 mt-1">{data.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'readme' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Production GitHub README Template (Ready to paste into your repository)</span>
                <button
                  onClick={handleCopyReadme}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to clipboard' : 'Copy markdown'}</span>
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-text max-h-[55vh]">
                {fullReadme}
              </div>
            </div>
          )}

          {activeTab === 'interview' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs sm:text-sm text-emerald-300 leading-relaxed">
                <strong>Hiring Manager Defense Strategy:</strong> Speak to these architectural decisions when defending this project in system design and staff engineering interviews.
              </div>

              <div className="space-y-3">
                {project.interviewTalkingPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 hidden sm:block">
            Target Competency: <span className="text-slate-200 font-medium">{project.targetSkillName}</span>
          </div>

          <div className="flex items-center gap-3">
            {onStartQuizForSkill && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartQuizForSkill(project.targetSkillId);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Verify Skill with Quiz</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
