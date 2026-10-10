import React, { useState, useMemo, useRef } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { SkillCompetency, SkillLevel } from '../types/roadmap';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Award,
  BookOpen,
  ShieldCheck,
  Target,
  Clock,
  ArrowUp,
} from 'lucide-react';

interface NodeGraphViewProps {
  onNavigateToVault: () => void;
}

interface GraphNode {
  id: string;
  isGoalNode?: boolean;
  title: string;
  category: string;
  tierLevel: number; // 0 = Goal on Top, 1 = Capstone, 2 = Core, 3 = Foundations
  x: number;
  y: number;
  width: number;
  height: number;
  skill?: SkillCompetency;
}

export const NodeGraphView: React.FC<NodeGraphViewProps> = ({ onNavigateToVault }) => {
  const { currentRoadmap, adjustSkillLevel, toggleSkillPossessed } = useRoadmap();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    currentRoadmap.skills[0]?.id || null
  );
  const [zoom, setZoom] = useState(0.95);
  const [pan, setPan] = useState({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const selectedSkill = useMemo(() => {
    return currentRoadmap.skills.find(s => s.id === selectedNodeId) || null;
  }, [currentRoadmap.skills, selectedNodeId]);

  // Build Level-Wise Graph with GOAL ON TOP (Layer 0)
  const { nodes, connections, graphDimensions } = useMemo(() => {
    const skills = currentRoadmap.skills;

    // Group skills by tier level:
    // Tier 1: Capstone (just below goal)
    // Tier 2: Core
    // Tier 3: Foundations (at bottom)
    const tier1 = skills.filter(s => s.tierLevel === 1);
    const tier2 = skills.filter(s => s.tierLevel === 2);
    const tier3 = skills.filter(s => s.tierLevel === 3 || (!s.tierLevel && s.prerequisites.length === 0));

    // Fallback if tiers are empty
    const fallbackTier1 = tier1.length > 0 ? tier1 : skills.slice(0, 2);
    const fallbackTier2 = tier2.length > 0 ? tier2 : skills.slice(2, 5);
    const fallbackTier3 = tier3.length > 0 ? tier3 : skills.slice(5);

    const nodeWidth = 230;
    const nodeHeight = 84;
    const verticalGap = 130;

    const computedNodes: GraphNode[] = [];
    const nodeCoordMap = new Map<string, { x: number; y: number }>();

    // Determine max width needed
    const maxRowItems = Math.max(1, fallbackTier1.length, fallbackTier2.length, fallbackTier3.length);
    const rowWidth = maxRowItems * (nodeWidth + 40);
    const centerX = Math.max(450, rowWidth / 2);

    // Layer 0: GOAL NODE ON TOP
    const goalNodeWidth = 320;
    const goalNodeHeight = 90;
    const goalX = centerX - goalNodeWidth / 2;
    const goalY = 40;

    computedNodes.push({
      id: 'goal-node-top',
      isGoalNode: true,
      title: currentRoadmap.title,
      category: currentRoadmap.industry,
      tierLevel: 0,
      x: goalX,
      y: goalY,
      width: goalNodeWidth,
      height: goalNodeHeight,
    });
    nodeCoordMap.set('goal-node-top', { x: goalX, y: goalY });

    // Helper to position rows
    const layoutRow = (items: SkillCompetency[], layerIndex: number) => {
      const y = goalY + layerIndex * verticalGap;
      const count = items.length;
      const totalWidth = count * nodeWidth + (count - 1) * 35;
      const startX = centerX - totalWidth / 2;

      items.forEach((skill, idx) => {
        const x = startX + idx * (nodeWidth + 35);
        computedNodes.push({
          id: skill.id,
          title: skill.name,
          category: skill.category,
          tierLevel: skill.tierLevel || layerIndex,
          x,
          y,
          width: nodeWidth,
          height: nodeHeight,
          skill,
        });
        nodeCoordMap.set(skill.id, { x, y });
      });
    };

    // Layer 1: Capstones
    layoutRow(fallbackTier1, 1);
    // Layer 2: Core
    layoutRow(fallbackTier2, 2);
    // Layer 3: Foundations
    layoutRow(fallbackTier3, 3);

    // Build connections flowing UPWARDS (Foundations -> Core -> Capstone -> Goal on Top)
    const computedConnections: { id: string; from: string; to: string; d: string; isActive: boolean }[] = [];

    // Connect Tier 1 directly into Goal Node at top
    fallbackTier1.forEach(capstone => {
      const fromCoord = nodeCoordMap.get(capstone.id);
      const toCoord = nodeCoordMap.get('goal-node-top');
      if (fromCoord && toCoord) {
        const startX = fromCoord.x + nodeWidth / 2;
        const startY = fromCoord.y;
        const endX = toCoord.x + goalNodeWidth / 2;
        const endY = toCoord.y + goalNodeHeight;

        const dy = endY - startY;
        const d = `M ${startX} ${startY} C ${startX} ${startY + dy * 0.5}, ${endX} ${endY - dy * 0.5}, ${endX} ${endY}`;
        computedConnections.push({
          id: `${capstone.id}->goal`,
          from: capstone.id,
          to: 'goal-node-top',
          d,
          isActive: selectedNodeId === capstone.id || selectedNodeId === 'goal-node-top',
        });
      }
    });

    // Connect skills based on prerequisites
    skills.forEach(skill => {
      skill.prerequisites.forEach(preId => {
        const fromCoord = nodeCoordMap.get(preId);
        const toCoord = nodeCoordMap.get(skill.id);

        if (fromCoord && toCoord) {
          // Bottom-to-top flow: start from top of prerequisite node up to bottom of higher node
          const startX = fromCoord.x + nodeWidth / 2;
          const startY = fromCoord.y;
          const endX = toCoord.x + nodeWidth / 2;
          const endY = toCoord.y + nodeHeight;

          const dy = endY - startY;
          const d = `M ${startX} ${startY} C ${startX} ${startY + dy * 0.4}, ${endX} ${endY - dy * 0.4}, ${endX} ${endY}`;
          const isActive = selectedNodeId === skill.id || selectedNodeId === preId;

          computedConnections.push({
            id: `${preId}->${skill.id}`,
            from: preId,
            to: skill.id,
            d,
            isActive,
          });
        }
      });
    });

    return {
      nodes: computedNodes,
      connections: computedConnections,
      graphDimensions: { width: Math.max(900, rowWidth + 150), height: 580 },
    };
  }, [currentRoadmap, selectedNodeId]);

  // Pan dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-node')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Inspector details
  const isGoalSelected = selectedNodeId === 'goal-node-top';

  return (
    <div className="space-y-4">
      {/* Hierarchy Graph Header Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Reverse-Engineered Hierarchy</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>Goal on Top (Peak) with Prerequisite Foundations beneath</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend Badges */}
          <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Possessed</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Partial Gap</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Missing Gap</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-slate-800 rounded-lg">
            <button
              onClick={() => setZoom(prev => Math.min(1.6, prev + 0.15))}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(0.45, prev - 0.15))}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoom(0.95);
                setPan({ x: 40, y: 30 });
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Reset View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph Grid with Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Viewport */}
        <div
          className="lg:col-span-8 h-[640px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative select-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Upward flow label at left */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-widest pointer-events-none">
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="[writing-mode:vertical-rl] rotate-180">Prerequisite Hierarchy</span>
          </div>

          <svg className="w-full h-full" style={{ overflow: 'visible' }}>
            <defs>
              <marker
                id="arrow-hierarchy-default"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#475569" />
              </marker>
              <marker
                id="arrow-hierarchy-active"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
              </marker>
            </defs>

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Connector Lines */}
              {connections.map(conn => (
                <path
                  key={conn.id}
                  d={conn.d}
                  fill="none"
                  stroke={conn.isActive ? '#10b981' : '#334155'}
                  strokeWidth={conn.isActive ? 2.5 : 1.5}
                  strokeDasharray={conn.isActive ? 'none' : '3 3'}
                  markerEnd={conn.isActive ? 'url(#arrow-hierarchy-active)' : 'url(#arrow-hierarchy-default)'}
                  className="transition-colors duration-200"
                />
              ))}

              {/* Graph Nodes */}
              {nodes.map(node => {
                const isSelected = selectedNodeId === node.id;

                if (node.isGoalNode) {
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className="interactive-node cursor-pointer group"
                      onClick={() => setSelectedNodeId(node.id)}
                    >
                      <rect
                        width={node.width}
                        height={node.height}
                        rx="12"
                        className={`transition-all duration-150 ${
                          isSelected
                            ? 'fill-slate-900 stroke-emerald-400 stroke-2'
                            : 'fill-slate-950 stroke-emerald-500/50 stroke-2'
                        } group-hover:stroke-emerald-400`}
                      />

                      <text
                        x="20"
                        y="26"
                        className="fill-emerald-400 text-[11px] font-mono font-bold select-none uppercase tracking-wide"
                      >
                        TARGET GOAL (PEAK)
                      </text>

                      <text
                        x="20"
                        y="48"
                        className="fill-white text-[14px] font-extrabold select-none tracking-tight"
                      >
                        {node.title.length > 32 ? `${node.title.slice(0, 30)}...` : node.title}
                      </text>

                      <text
                        x="20"
                        y="70"
                        className="fill-slate-400 text-[11px] font-mono select-none"
                      >
                        {node.category} · 100% Milestone Capstone
                      </text>
                    </g>
                  );
                }

                // Regular Skill Node
                const skill = node.skill!;
                const isPossessed = skill.gapStatus === 'possessed';
                const isPartial = skill.gapStatus === 'partial';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="interactive-node cursor-pointer group"
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    <rect
                      width={node.width}
                      height={node.height}
                      rx="8"
                      className={`transition-all duration-150 ${
                        isSelected
                          ? 'fill-slate-900 stroke-cyan-400 stroke-2'
                          : isPossessed
                          ? 'fill-slate-950 stroke-emerald-600/70 stroke-1'
                          : isPartial
                          ? 'fill-slate-950 stroke-amber-500/50 stroke-1'
                          : 'fill-slate-950 stroke-slate-800 stroke-1'
                      } group-hover:stroke-slate-500`}
                    />

                    {/* Tier Level & Gap Badge */}
                    <text
                      x="14"
                      y="20"
                      className="fill-slate-400 text-[10px] font-mono select-none"
                    >
                      Tier {node.tierLevel}: {node.tierLevel === 1 ? 'Pinnacle' : node.tierLevel === 2 ? 'Core' : 'Foundation'}
                    </text>

                    {/* Gap status indicator pill dot */}
                    <circle
                      cx={node.width - 20}
                      cy="16"
                      r="4.5"
                      className={
                        isPossessed
                          ? 'fill-emerald-400'
                          : isPartial
                          ? 'fill-amber-400'
                          : 'fill-rose-400'
                      }
                    />

                    {/* Skill Title */}
                    <text
                      x="14"
                      y="40"
                      className="fill-white text-[12px] font-semibold select-none"
                    >
                      {skill.name.length > 26 ? `${skill.name.slice(0, 24)}...` : skill.name}
                    </text>

                    {/* Level Progress Bars */}
                    <g transform="translate(14, 55)">
                      {[1, 2, 3, 4, 5].map(lvl => {
                        const filled = lvl <= skill.verifiedLevel;
                        return (
                          <rect
                            key={lvl}
                            x={(lvl - 1) * 22}
                            y="0"
                            width="18"
                            height="4"
                            rx="1.5"
                            className={
                              filled
                                ? 'fill-emerald-400'
                                : lvl === skill.targetLevel
                                ? 'fill-indigo-500/50'
                                : 'fill-slate-800'
                            }
                          />
                        );
                      })}
                    </g>

                    <text
                      x="145"
                      y="61"
                      className="fill-slate-400 text-[10px] font-mono select-none tabular-nums"
                    >
                      Lvl {skill.verifiedLevel}/{skill.targetLevel}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Competency Detail Inspector Drawer */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          {isGoalSelected ? (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold">PEAK ARCHITECTURAL GOAL</span>
                <h3 className="text-xl font-extrabold text-white mt-1">{currentRoadmap.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {currentRoadmap.summary}
                </p>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Target Timeline:</span>
                  <span className="font-mono text-white font-semibold">{currentRoadmap.targetTimelineMonths} Months</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pace Commitment:</span>
                  <span className="font-mono text-white font-semibold">{currentRoadmap.weeklyStudyHours} hrs/week</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Readiness Score:</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {currentRoadmap.gapAnalysisSummary?.currentReadinessQuotient || 0}%
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-semibold text-slate-300 mb-2">
                  Direct Capstone Predecessors (Layer 1):
                </h4>
                <div className="space-y-1.5">
                  {currentRoadmap.skills.filter(s => s.tierLevel === 1).map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedNodeId(s.id)}
                      className="w-full p-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-lg text-left text-xs flex items-center justify-between text-slate-200 transition-colors"
                    >
                      <span className="truncate pr-2">{s.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400 shrink-0">Inspect →</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedSkill ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>Tier {selectedSkill.tierLevel}: {selectedSkill.category}</span>
                  <span
                    className={`font-semibold ${
                      selectedSkill.gapStatus === 'possessed'
                        ? 'text-emerald-400'
                        : selectedSkill.gapStatus === 'partial'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {selectedSkill.gapStatus === 'possessed'
                      ? 'Possessed'
                      : selectedSkill.gapStatus === 'partial'
                      ? 'Partial Gap'
                      : 'Missing Gap'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{selectedSkill.name}</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  {selectedSkill.description}
                </p>
              </div>

              {/* Possessed / Gap Status Toggle */}
              <label className="flex items-center justify-between p-3 bg-slate-900/90 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSkill.gapStatus === 'possessed'}
                    onChange={() => toggleSkillPossessed(selectedSkill.id)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-white">
                    {selectedSkill.gapStatus === 'possessed'
                      ? 'Marked as Possessed (Matched)'
                      : 'Mark Skill as Possessed'}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    selectedSkill.gapStatus === 'possessed' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {selectedSkill.gapStatus === 'possessed'
                    ? '0h needed'
                    : `~${selectedSkill.estimatedHoursToBridge || 40}h`}
                </span>
              </label>

              {/* Match Reason Callout */}
              <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                  <span>Gap Analysis Reason:</span>
                  <span className="text-cyan-400">
                    Est. ~{selectedSkill.estimatedHoursToBridge || 0} hrs to bridge
                  </span>
                </div>
                <p className="text-slate-200">{selectedSkill.matchReason}</p>
              </div>

              {/* Level Progress */}
              <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Verified Competency:</span>
                  <span className="font-mono text-white font-semibold">
                    Level {selectedSkill.verifiedLevel} of {selectedSkill.targetLevel}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                  <span className="text-[11px] text-slate-400">Self-Assess:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => adjustSkillLevel(selectedSkill.id, lvl as SkillLevel)}
                        className={`w-5 h-5 text-[11px] font-mono rounded ${
                          selectedSkill.currentLevel === lvl
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key topics */}
              <div>
                <h4 className="text-xs font-mono font-semibold text-slate-300 mb-1.5">
                  Knowledge Sub-Topics:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {selectedSkill.keyTopics.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prerequisite dependencies beneath this skill */}
              <div>
                <h4 className="text-xs font-mono font-semibold text-slate-300 mb-1.5">
                  Prerequisites Required Beneath This Node:
                </h4>
                {selectedSkill.prerequisites.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">
                    Foundational root node (no lower prerequisites).
                  </p>
                ) : (
                  <div className="space-y-1">
                    {selectedSkill.prerequisites.map(pId => {
                      const pSkill = currentRoadmap.skills.find(s => s.id === pId);
                      return (
                        <div
                          key={pId}
                          onClick={() => setSelectedNodeId(pId)}
                          className="p-1.5 bg-slate-900 border border-slate-800/80 rounded text-xs flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
                        >
                          <span className="text-slate-300 truncate">{pSkill?.name || pId}</span>
                          <span className="text-[10px] font-mono text-emerald-400">Inspect →</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Select any node in the level-wise graph to inspect reverse-engineered prerequisites.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
