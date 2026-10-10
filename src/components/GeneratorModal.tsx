import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import {
  Sparkles,
  X,
  Loader2,
  Calendar,
  Layers,
  ArrowRight,
  Plus,
  Clock,
  Target,
} from 'lucide-react';

interface GeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INSPIRATION_ROLES = [
  'Autonomous Deep-Sea Robotics Lead',
  'Post-Quantum Satellite Cryptography Architect',
  'Neuromorphic Spiking Silicon Processor Designer',
  'Space Habitat Closed-Loop Bioreactor Director',
  'Autonomous Surgical Micro-Robotics Lead',
  'Brain-Computer Interface Motor Cortex Lead',
  'Wildfire Predictive Drone Swarm Fleet Commander',
  'High-Frequency Algorithmic Execution Systems Architect',
];

const SUGGESTED_FOUNDATIONAL_SKILLS = [
  'Python',
  'C++',
  'Rust',
  'Linear Algebra',
  'Linux Internals',
  'Git / Version Control',
  'Docker / Containers',
  'ROS / ROS2',
  'Machine Learning / PyTorch',
  'Calculus & ODEs',
  'Embedded Firmware / Microcontrollers',
  'Computer Networks / Sockets',
];

export const GeneratorModal: React.FC<GeneratorModalProps> = ({ isOpen, onClose }) => {
  const { createNewRoadmap, isGenerating, generationError } = useRoadmap();

  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [timelineMonths, setTimelineMonths] = useState<number>(12);
  const [weeklyHours, setWeeklyHours] = useState<number>(15);
  const [currentSkills, setCurrentSkills] = useState<string[]>(['Python', 'Git', 'Linux Internals']);
  const [skillInput, setSkillInput] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  if (!isOpen) return null;

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !currentSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setCurrentSkills(prev => [...prev, trimmed]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCurrentSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || isGenerating) return;

    // Simulate progressive status updates during Gemini generation
    setLoadingStep(1);
    const timer1 = setTimeout(() => setLoadingStep(2), 2200);
    const timer2 = setTimeout(() => setLoadingStep(3), 4500);

    try {
      await createNewRoadmap(jobTitle.trim(), {
        industry: industry.trim() || undefined,
        timelineMonths,
        currentSkills,
        weeklyHours,
      });
      onClose();
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setLoadingStep(0);
    }
  };

  const getLoadingMessage = () => {
    switch (loadingStep) {
      case 1:
        return 'Extracting required domain competencies & reverse-engineering prerequisites...';
      case 2:
        return 'Arranging level-wise dependency graph with Goal on Top...';
      case 3:
        return 'Conducting skill gap analysis & compiling month-wise resources...';
      default:
        return 'Synthesizing tailored dream career roadmap...';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Reverse-Engineer Any Dream Job
              </h2>
              <p className="text-xs text-slate-400">
                AI extracts required skills, maps backwards dependencies with Goal on Top, conducts gap analysis, and schedules month-wise resources.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {generationError && (
          <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs rounded-lg">
            {generationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Job Role */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 font-mono">
              Target Dream Job Role *
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="e.g. Autonomous Deep-Sea Robotics Lead, Post-Quantum Cryptography Architect..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-500"
              required
              disabled={isGenerating}
            />
          </div>

          {/* Quick Inspirations */}
          <div>
            <div className="text-[11px] font-mono text-slate-400 mb-1.5">
              Popular Frontier Inspiration Roles:
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {INSPIRATION_ROLES.map((role, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setJobTitle(role)}
                  disabled={isGenerating}
                  className="px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-colors text-left"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline and Weekly Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-400 font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target Timeline:</span>
                </label>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">
                  {timelineMonths} Months
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[3, 6, 12, 18, 24].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTimelineMonths(m)}
                    disabled={isGenerating}
                    className={`flex-1 py-1 rounded text-[11px] font-mono transition-colors ${
                      timelineMonths === m
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-400 font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Weekly Study Commitment:</span>
                </label>
                <span className="font-mono text-cyan-400 font-bold tabular-nums">
                  {weeklyHours} hrs/wk
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[10, 15, 20, 30].map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setWeeklyHours(h)}
                    disabled={isGenerating}
                    className={`flex-1 py-1 rounded text-[11px] font-mono transition-colors ${
                      weeklyHours === h
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User's Current Skills Input */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-semibold font-mono">
              Your Current Skills (For Automated Gap Analysis)
            </label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(skillInput);
                  }
                }}
                placeholder="Type a skill you currently have (e.g. Python, ROS, Linear Algebra) & press Enter..."
                className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                disabled={isGenerating}
              />
              <button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                disabled={isGenerating}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Current skill tags */}
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950/60 border border-slate-800 rounded-lg min-h-[38px]">
              {currentSkills.length === 0 ? (
                <span className="text-[11px] text-slate-500 italic p-1">
                  No skills entered yet. You can click below suggestions or type your own.
                </span>
              ) : (
                currentSkills.map(s => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-200 rounded text-xs font-mono"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      disabled={isGenerating}
                      className="text-slate-400 hover:text-rose-400 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Suggested skill chips */}
            <div>
              <span className="text-[10px] font-mono text-slate-500">Quick-Add Common Skills:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {SUGGESTED_FOUNDATIONAL_SKILLS.map(s => {
                  const alreadyAdded = currentSkills.some(cs => cs.toLowerCase() === s.toLowerCase());
                  if (alreadyAdded) return null;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddSkill(s)}
                      disabled={isGenerating}
                      className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      + {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">
              Server-Side Gemini 3.8 Flash
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isGenerating}
                className="px-3.5 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!jobTitle.trim() || isGenerating}
                className="px-5 py-2 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 rounded-lg flex items-center gap-2 transition-colors font-mono"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="truncate max-w-[280px]">{getLoadingMessage()}</span>
                  </>
                ) : (
                  <>
                    <span>Reverse-Engineer Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
