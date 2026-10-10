import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { RoadmapViewMode } from '../types/roadmap';
import {
  Compass,
  GitBranch,
  Award,
  Download,
  Upload,
  RotateCcw,
  Layers,
  ChevronDown,
  Check,
  Search,
  X,
  LogIn,
  LogOut,
  FolderArchive,
  Calendar,
  FolderGit2,
  Bot,
} from 'lucide-react';
import { DownloadWebsiteModal } from './DownloadWebsiteModal';

interface TopBarProps {
  onOpenGenerator?: () => void;
}

export const TopBar: React.FC<TopBarProps> = () => {
  const {
    currentRoadmap,
    allRoadmaps,
    switchRoadmap,
    viewMode,
    setViewMode,
    exportRoadmapJson,
    importRoadmapJson,
    resetCurrentRoadmapToDefault,
    currentUser,
    login,
    openAuthModal,
    logout,
  } = useRoadmap();

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [roleSearch, setRoleSearch] = useState('');
  const [dreamJobSearch, setDreamJobSearch] = useState('');
  const [isDreamJobSearchOpen, setIsDreamJobSearchOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const searchBarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        setIsDreamJobSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { mode: RoadmapViewMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'timeline', label: 'Month-Wise Plan', icon: <Layers className="w-4 h-4" /> },
    { mode: 'sprints', label: 'Study Sprints', icon: <Calendar className="w-4 h-4" /> },
    { mode: 'projectlab', label: 'Project Lab', icon: <FolderGit2 className="w-4 h-4" /> },
    { mode: 'advisor', label: 'AI Advisor', icon: <Bot className="w-4 h-4" /> },
    { mode: 'gap', label: 'Gap Analysis', icon: <Compass className="w-4 h-4" /> },
    { mode: 'nodegraph', label: 'Goal Graph', icon: <GitBranch className="w-4 h-4" /> },
    { mode: 'skills', label: 'Skill Gauges', icon: <Layers className="w-4 h-4" /> },
    { mode: 'vault', label: 'Certificate Vault', icon: <Award className="w-4 h-4" /> },
  ];

  const handleExport = () => {
    const jsonStr = exportRoadmapJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentRoadmap.slug}-roadmap.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsSettingsOpen(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      const success = importRoadmapJson(content);
      if (success) {
        setImportStatus('Roadmap imported successfully!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Invalid JSON roadmap format.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setIsSettingsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark & Active Role Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            PF
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                PathFinder
              </span>
              <span className="text-slate-500 text-xs hidden sm:inline">·</span>
              <span className="text-slate-400 text-xs font-mono hidden sm:inline truncate max-w-[200px]">
                {currentRoadmap.title}
              </span>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                aria-expanded={isSwitcherOpen}
              >
                <span>Switch Role ({allRoadmaps.length})</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isSwitcherOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 pb-2 border-b border-slate-800">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        value={roleSearch}
                        onChange={e => setRoleSearch(e.target.value)}
                        placeholder="Search roles..."
                        className="w-full pl-8 pr-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {allRoadmaps
                      .filter(r =>
                        !roleSearch.trim() ||
                        r.title.toLowerCase().includes(roleSearch.toLowerCase()) ||
                        r.industry.toLowerCase().includes(roleSearch.toLowerCase())
                      )
                      .map(r => (
                        <button
                          key={r.id}
                          onClick={() => {
                            switchRoadmap(r.id);
                            setIsSwitcherOpen(false);
                            setRoleSearch('');
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                            r.id === currentRoadmap.id ? 'text-emerald-400 bg-slate-800/50 font-medium' : 'text-slate-300'
                          }`}
                        >
                          <span className="truncate pr-2">{r.title}</span>
                          {r.id === currentRoadmap.id && <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dream Job Search Bar in Header */}
        <div ref={searchBarRef} className="relative hidden md:block max-w-xs w-56 lg:w-64">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={dreamJobSearch}
              onChange={e => {
                setDreamJobSearch(e.target.value);
                setIsDreamJobSearchOpen(true);
              }}
              onFocus={() => setIsDreamJobSearchOpen(true)}
              placeholder="Search dream jobs..."
              className="w-full pl-8 pr-7 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50"
            />
            {dreamJobSearch && (
              <button
                type="button"
                onClick={() => {
                  setDreamJobSearch('');
                  setIsDreamJobSearchOpen(false);
                }}
                className="absolute right-2 text-slate-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {isDreamJobSearchOpen && dreamJobSearch.trim() && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 max-h-64 overflow-y-auto">
              {allRoadmaps
                .filter(r =>
                  r.title.toLowerCase().includes(dreamJobSearch.toLowerCase()) ||
                  r.industry.toLowerCase().includes(dreamJobSearch.toLowerCase()) ||
                  (r.skills || []).some(s => s.name.toLowerCase().includes(dreamJobSearch.toLowerCase()))
                )
                .map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      switchRoadmap(r.id);
                      setDreamJobSearch('');
                      setIsDreamJobSearchOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-800/80 transition-colors flex items-center justify-between ${
                      r.id === currentRoadmap.id ? 'bg-emerald-500/10 text-emerald-300 font-medium' : 'text-slate-200'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold truncate">{r.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{r.industry}</div>
                    </div>
                    {r.id === currentRoadmap.id && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links (View Mode Controls) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800/80 rounded-lg">
          {navItems.map(item => {
            const isActive = viewMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => setViewMode(item.mode)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Tools & Auth */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Google Sign In / User Profile */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 transition-colors"
                aria-expanded={isUserMenuOpen}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-semibold">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-800">
                    <p className="font-semibold text-white truncate">{currentUser.displayName || 'Career Learner'}</p>
                    <p className="text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-2 transition-colors mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                title="Sign in with Google or Email"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Log In</span>
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm shadow-emerald-500/20"
                title="Create a new account"
              >
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Download Website Package Action */}
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer shadow-sm shadow-emerald-950"
            title="Download complete website source code package (.ZIP)"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download Website</span>
            <span className="text-[10px] bg-emerald-500/25 text-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">
              ZIP
            </span>
          </button>

          {/* Settings / Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
              title="Roadmap data options"
            >
              <Download className="w-4 h-4" />
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsDownloadModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 flex items-center gap-2 transition-colors font-medium border-b border-slate-800 pb-2 mb-1"
                >
                  <FolderArchive className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Website (.ZIP)</span>
                </button>
                <button
                  onClick={handleExport}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export Roadmap (JSON)</span>
                </button>
                <label className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Import Roadmap (JSON)</span>
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
                <div className="my-1 border-t border-slate-800" />
                <button
                  onClick={() => {
                    resetCurrentRoadmapToDefault();
                    setIsSettingsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Original Preset</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav tabs */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 border-t border-slate-800/60 gap-1 bg-slate-950">
        {navItems.map(item => (
          <button
            key={item.mode}
            onClick={() => setViewMode(item.mode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              viewMode === item.mode ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {importStatus && (
        <div className="bg-emerald-950 border-t border-emerald-800 px-4 py-1.5 text-center text-xs text-emerald-300">
          {importStatus}
        </div>
      )}

      <DownloadWebsiteModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </header>
  );
};
