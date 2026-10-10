import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { SkillCompetency, SkillLevel } from '../types/roadmap';
import {
  Compass,
  Award,
  BookOpen,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { SkillVerificationQuizModal } from './SkillVerificationQuizModal';

interface SkillMatrixViewProps {
  onNavigateToVault: () => void;
  onOpenUploadWithSkill?: (skillId: string) => void;
}

export const SkillMatrixView: React.FC<SkillMatrixViewProps> = ({
  onNavigateToVault,
  onOpenUploadWithSkill,
}) => {
  const { currentRoadmap, adjustSkillLevel, stats, toggleSkillPossessed, hasVerifiedBadge } = useRoadmap();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showLevelLegend, setShowLevelLegend] = useState(false);
  const [quizSkill, setQuizSkill] = useState<SkillCompetency | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Group skills by category
  const categories = Array.from(new Set(currentRoadmap.skills.map(s => s.category)));

  const filteredSkills = currentRoadmap.skills.filter(
    s => selectedCategory === 'all' || s.category === selectedCategory
  );

  const getLevelName = (lvl: number) => {
    switch (lvl) {
      case 1:
        return 'Novice';
      case 2:
        return 'Advanced Beginner';
      case 3:
        return 'Competent';
      case 4:
        return 'Proficient Specialist';
      case 5:
        return 'Principal / World-Class';
      default:
        return 'Developing';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-mono mb-1">Total Competencies</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {stats.totalSkills} Domain Skills
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Mapped across {categories.length} technical disciplines
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-mono mb-1">Target Mastery Achieved</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {stats.masteredSkillsCount} / {stats.totalSkills} Skills
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Meeting or exceeding dream job principal thresholds
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono mb-1">Verified Credentials</div>
            <div className="text-2xl font-bold text-cyan-400 font-mono tabular-nums">
              {stats.verifiedCertificates} Badges
            </div>
            <div className="text-xs text-slate-400 mt-1">Directly boosting competency gauges</div>
          </div>
          <button
            onClick={onNavigateToVault}
            className="px-3 py-1.5 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-lg transition-colors whitespace-nowrap"
          >
            Upload Certificate
          </button>
        </div>
      </div>

      {/* Toolbar: Category Selector & Level Info Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/40 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Disciplines ({currentRoadmap.skills.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowLevelLegend(!showLevelLegend)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-mono self-end sm:self-auto"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Understanding Skill Levels (1-5)</span>
        </button>
      </div>

      {/* Level Legend Box */}
      {showLevelLegend && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
          <div className="font-semibold text-white font-mono mb-2">
            Standard 5-Tier Competency Framework:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-slate-300">
            <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
              <div className="font-bold text-slate-300 font-mono">Level 1: Novice</div>
              <p className="text-[11px] text-slate-400 mt-1">Rule-based textbook understanding with supervision.</p>
            </div>
            <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
              <div className="font-bold text-cyan-400 font-mono">Level 2: Adv. Beginner</div>
              <p className="text-[11px] text-slate-400 mt-1">Can complete guided implementations and benchmark tasks.</p>
            </div>
            <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
              <div className="font-bold text-indigo-400 font-mono">Level 3: Competent</div>
              <p className="text-[11px] text-slate-400 mt-1">Autonomous production delivery and independent troubleshooting.</p>
            </div>
            <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
              <div className="font-bold text-violet-400 font-mono">Level 4: Proficient</div>
              <p className="text-[11px] text-slate-400 mt-1">Deep architectural intuition, optimization, and system integration.</p>
            </div>
            <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
              <div className="font-bold text-emerald-400 font-mono">Level 5: Principal</div>
              <p className="text-[11px] text-slate-400 mt-1">Industry authority, patent-level innovations, and standard author.</p>
            </div>
          </div>
        </div>
      )}

      {/* Skill Gauges Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredSkills.map(skill => {
          const isMastered = skill.verifiedLevel >= skill.targetLevel;
          const certsForThisSkill = currentRoadmap.certifications.filter(c =>
            c.linkedSkillIds.includes(skill.id)
          );
          const recommendedCerts = currentRoadmap.recommendedCertifications.filter(rc =>
            rc.linkedSkillIds.includes(skill.id)
          );

          return (
            <div
              key={skill.id}
              className={`bg-slate-950 border rounded-xl p-5 transition-all ${
                isMastered ? 'border-emerald-500/30' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[11px] font-mono text-slate-400">{skill.category}</span>
                  <h3 className="text-base font-bold text-white tracking-tight">{skill.name}</h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <label className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skill.gapStatus === 'possessed'}
                      onChange={() => toggleSkillPossessed(skill.id)}
                      className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <span className={skill.gapStatus === 'possessed' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                      {skill.gapStatus === 'possessed' ? 'Matched' : 'Gap'}
                    </span>
                  </label>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                      isMastered
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {isMastered ? 'Mastery Met' : `Lvl ${skill.verifiedLevel} / ${skill.targetLevel}`}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {skill.description}
              </p>

              {/* Visual 5-Stage Gauge */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    Current Verified Level:{' '}
                    <span className="text-emerald-400 font-bold">{getLevelName(skill.verifiedLevel)}</span>
                  </span>
                  <span className="text-slate-400">
                    Target: <span className="text-indigo-300 font-bold">{getLevelName(skill.targetLevel)}</span>
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map(lvl => {
                    const isVerified = lvl <= skill.verifiedLevel;
                    const isTarget = lvl === skill.targetLevel;

                    return (
                      <div
                        key={lvl}
                        className={`h-3 rounded-sm relative transition-all ${
                          isVerified
                            ? 'bg-emerald-400'
                            : isTarget
                            ? 'bg-indigo-500/30 border border-dashed border-indigo-400'
                            : 'bg-slate-800'
                        }`}
                        title={`Level ${lvl}: ${getLevelName(lvl)}${isTarget ? ' (Dream Job Target)' : ''}`}
                      >
                        {isTarget && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-400" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                  <span>1 (Novice)</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5 (Principal)</span>
                </div>
              </div>

              {/* Topics Breakdown */}
              <div className="mb-4">
                <div className="text-[11px] font-mono text-slate-400 mb-1.5">Key Core Topics:</div>
                <div className="flex flex-wrap gap-1.5">
                  {skill.keyTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="text-[11px] text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Assessment Controls & Credentials Link */}
              <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                {/* Manual self-assessment buttons */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Self-Assess:</span>
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => adjustSkillLevel(skill.id, lvl as SkillLevel)}
                      className={`w-6 h-6 text-xs font-mono font-medium rounded transition-colors ${
                        skill.currentLevel === lvl
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title={`Set practice level to ${lvl}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                {/* Actions: Drill Quiz & Upload/Link Cert */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setQuizSkill(skill);
                      setIsQuizOpen(true);
                    }}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium whitespace-nowrap self-end sm:self-auto cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{hasVerifiedBadge(skill.id) ? 'Retake Drill' : 'Verify with Drill'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenUploadWithSkill) {
                        onOpenUploadWithSkill(skill.id);
                      } else {
                        onNavigateToVault();
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium whitespace-nowrap self-end sm:self-auto"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {certsForThisSkill.length > 0
                        ? `${certsForThisSkill.length} Credential Attached`
                        : 'Attach Certificate'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Recommended Credentials Spotlight */}
              {recommendedCerts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-900/60 bg-slate-900/30 p-2.5 rounded-lg text-xs">
                  <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center justify-between">
                    <span>Target Industry Qualification:</span>
                    <span className="text-amber-400 font-medium">{recommendedCerts[0].estimatedCost}</span>
                  </div>
                  <div className="font-semibold text-slate-200">{recommendedCerts[0].name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {recommendedCerts[0].issuer} · {recommendedCerts[0].relevance}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Skill Quiz Drill Modal */}
      <SkillVerificationQuizModal
        skill={quizSkill}
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </div>
  );
};
