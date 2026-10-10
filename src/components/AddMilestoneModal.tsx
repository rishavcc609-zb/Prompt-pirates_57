import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { Milestone } from '../types/roadmap';
import { X, Plus, Layers, Trash2 } from 'lucide-react';

interface AddMilestoneModalProps {
  stageId: string | null;
  onClose: () => void;
}

export const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({ stageId, onClose }) => {
  const { currentRoadmap, addCustomMilestone } = useRoadmap();

  const stage = currentRoadmap.stages.find(s => s.id === stageId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Milestone['difficulty']>('Intermediate');
  const [targetTimeframe, setTargetTimeframe] = useState('Month 6');
  const [deliverables, setDeliverables] = useState<string[]>(['']);
  const [linkedSkillIds, setLinkedSkillIds] = useState<string[]>([]);

  if (!stageId || !stage) return null;

  const handleAddDeliverable = () => {
    setDeliverables(prev => [...prev, '']);
  };

  const handleUpdateDeliverable = (index: number, val: string) => {
    setDeliverables(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSkill = (skillId: string) => {
    setLinkedSkillIds(prev =>
      prev.includes(skillId) ? prev.filter(s => s !== skillId) : [...prev, skillId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const filteredDeliverables = deliverables
      .map(d => d.trim())
      .filter(d => d.length > 0);

    addCustomMilestone(stageId, {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      targetTimeframe: targetTimeframe.trim() || 'Next Phase',
      deliverables:
        filteredDeliverables.length > 0 ? filteredDeliverables : ['Complete milestone specification'],
      linkedSkillIds,
      status: 'not_started',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-mono text-emerald-400">{stage.title}</span>
            <h2 className="text-base font-bold text-white">Add Custom Milestone</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-mono mb-1">Milestone Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Publish open-source acoustic SLAM ROS2 driver"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Objective & Context</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what this milestone achieves and how it advances your readiness..."
              rows={2}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="Foundational">Foundational</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Pinnacle">Pinnacle</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Target Timeframe</label>
              <input
                type="text"
                value={targetTimeframe}
                onChange={e => setTargetTimeframe(e.target.value)}
                placeholder="e.g. Month 8 or Q3 2026"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Deliverables Checklist builder */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-400 font-mono">Deliverables / Acceptance Criteria</label>
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>
            <div className="space-y-2">
              {deliverables.map((deliv, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={deliv}
                    onChange={e => handleUpdateDeliverable(idx, e.target.value)}
                    placeholder={`Deliverable ${idx + 1}...`}
                    className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                  />
                  {deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(idx)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Linked Skills */}
          <div>
            <label className="block text-slate-400 font-mono mb-1.5">
              Link to Relevant Skills (Boosts skill progress):
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-lg">
              {currentRoadmap.skills.map(sk => {
                const isSelected = linkedSkillIds.includes(sk.id);
                return (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => toggleSkill(sk.id)}
                    className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sk.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-3.5 py-2 text-slate-400 hover:text-white">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold rounded-lg"
            >
              Add to Timeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
