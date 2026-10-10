import React, { useState } from 'react';
import { RoadmapProvider, useRoadmap } from './context/RoadmapContext';
import { TopBar } from './components/TopBar';
import { RoadmapHero } from './components/RoadmapHero';
import { TimelineView } from './components/TimelineView';
import { NodeGraphView } from './components/NodeGraphView';
import { GapAnalysisView } from './components/GapAnalysisView';
import { SkillMatrixView } from './components/SkillMatrixView';
import { CertificateVaultView } from './components/CertificateVaultView';
import { StudySprintPlannerView } from './components/StudySprintPlannerView';
import { ProjectLabView } from './components/ProjectLabView';
import { GeminiChatbot } from './components/GeminiChatbot';
import { AuthModal } from './components/AuthModal';
import { GeneratorModal } from './components/GeneratorModal';
import { AddMilestoneModal } from './components/AddMilestoneModal';
import { Sparkles, MessageSquare } from 'lucide-react';

function RoadmapDashboard() {
  const {
    viewMode,
    setViewMode,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalInitialMode,
  } = useRoadmap();

  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [addMilestoneStageId, setAddMilestoneStageId] = useState<string | null>(null);
  const [vaultInitialSkillId, setVaultInitialSkillId] = useState<string | null>(null);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  const handleSelectSkill = (skillId: string) => {
    setViewMode('skills');
  };

  const handleOpenUploadWithSkill = (skillId: string) => {
    setVaultInitialSkillId(skillId);
    setViewMode('vault');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <TopBar />

      {/* Hero Overview */}
      <RoadmapHero />

      {/* Main Interactive Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'timeline' && (
          <TimelineView
            onSelectSkill={handleSelectSkill}
            onOpenAddMilestone={stageId => setAddMilestoneStageId(stageId)}
          />
        )}

        {viewMode === 'nodegraph' && (
          <NodeGraphView
            onNavigateToVault={() => setViewMode('vault')}
          />
        )}

        {viewMode === 'gap' && (
          <GapAnalysisView
            onNavigateToMonthRoadmap={() => setViewMode('timeline')}
            onNavigateToGraph={() => setViewMode('nodegraph')}
          />
        )}

        {viewMode === 'skills' && (
          <SkillMatrixView
            onNavigateToVault={() => setViewMode('vault')}
            onOpenUploadWithSkill={handleOpenUploadWithSkill}
          />
        )}

        {viewMode === 'vault' && (
          <CertificateVaultView
            initialSkillId={vaultInitialSkillId}
          />
        )}

        {viewMode === 'sprints' && (
          <StudySprintPlannerView />
        )}

        {viewMode === 'projectlab' && (
          <ProjectLabView />
        )}

        {viewMode === 'advisor' && (
          <GeminiChatbot isFullPage={true} />
        )}
      </main>

      {/* Floating Gemini AI Career Advisor Widget Launcher */}
      {!isFloatingChatOpen && viewMode !== 'advisor' && (
        <button
          onClick={() => setIsFloatingChatOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-full shadow-2xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-300/40"
          title="Open Gemini Multi-Turn Career Advisor"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Ask AI Advisor</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
        </button>
      )}

      {/* Floating Chatbot Overlay */}
      {isFloatingChatOpen && viewMode !== 'advisor' && (
        <GeminiChatbot
          isOpenFloating={isFloatingChatOpen}
          onCloseFloating={() => setIsFloatingChatOpen(false)}
        />
      )}

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">PathFinder</span>
            <span aria-hidden="true">·</span>
            <span>Reverse-Engineered Career Roadmap & Competency Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Goal on Top Hierarchy</span>
            <span aria-hidden="true">·</span>
            <span>Dynamic Gap Analysis</span>
            <span aria-hidden="true">·</span>
            <span>Gemini Multi-Turn AI</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
      />

      <AddMilestoneModal
        stageId={addMilestoneStageId}
        onClose={() => setAddMilestoneStageId(null)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalInitialMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <RoadmapProvider>
      <RoadmapDashboard />
    </RoadmapProvider>
  );
}
