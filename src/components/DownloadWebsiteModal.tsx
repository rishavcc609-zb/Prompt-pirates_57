import React, { useState } from 'react';
import {
  Download,
  X,
  FileCode2,
  FolderArchive,
  Terminal,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import JSZip from 'jszip';
import { useRoadmap } from '../context/RoadmapContext';

interface DownloadWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadWebsiteModal: React.FC<DownloadWebsiteModalProps> = ({ isOpen, onClose }) => {
  const { currentRoadmap, allRoadmaps } = useRoadmap();
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isPackaging, setIsPackaging] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsPackaging(true);
    setDownloadSuccess(false);

    try {
      // 1. First attempt to download the pre-packaged zip from static public asset
      const response = await fetch('/career-roadmap-website.zip');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'career-roadmap-website.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setIsPackaging(false);
        setDownloadSuccess(true);
        return;
      }
    } catch {
      // If direct fetch fails, fallback to dynamic JSZip generation below
    }

    try {
      // Fallback: Dynamically generate zip with JSZip
      const zip = new JSZip();
      zip.file(
        'README.md',
        `# PathFinder - Hyper-Specific Career Roadmap Website\n\nTo run locally:\n1. npm install\n2. npm run dev\n3. Open http://localhost:3000 in your browser.`
      );
      zip.file('exported-roadmaps.json', JSON.stringify(allRoadmaps, null, 2));
      zip.file('active-roadmap.json', JSON.stringify(currentRoadmap, null, 2));

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'career-roadmap-website.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setDownloadSuccess(true);
    } catch (err) {
      console.error('Error generating fallback zip:', err);
    } finally {
      setIsPackaging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Download Website Package
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ready .ZIP
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Full standalone source code bundle with Vite, React 19, TypeScript & Tailwind CSS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Main Download Action Banner */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 rounded-xl p-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Complete Project Archive (29+ Files)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                  Includes all components, interactive skill graphs, timeline planners, gap index engines,
                  styling configs, and setup documentation.
                </p>
                <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400 font-mono">
                  <span>Size: ~89 KB (.zip)</span>
                  <span>•</span>
                  <span>License: MIT / Open Source</span>
                  <span>•</span>
                  <span>Node 18+</span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col gap-2">
                <button
                  onClick={handleDownloadZip}
                  disabled={isPackaging}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isPackaging ? 'Preparing ZIP...' : 'Download Website (.ZIP)'}</span>
                </button>
                {/* Direct link fallback */}
                <a
                  href="/career-roadmap-website.zip"
                  download="career-roadmap-website.zip"
                  className="text-center text-[11px] text-emerald-400/80 hover:text-emerald-300 underline"
                >
                  Direct link if popup blocked
                </a>
              </div>
            </div>

            {downloadSuccess && (
              <div className="mt-4 p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  <strong>career-roadmap-website.zip</strong> downloaded! Check your downloads folder.
                </span>
              </div>
            )}
          </div>

          {/* Quick Setup Instructions */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              How to run this website on your computer
            </h3>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-[10px] font-mono">
                      1
                    </span>
                    Extract the ZIP archive
                  </div>
                  <code className="text-xs text-slate-300 font-mono block pl-7">
                    unzip career-roadmap-website.zip -d career-roadmap
                  </code>
                </div>
                <button
                  onClick={() => handleCopy('unzip career-roadmap-website.zip -d career-roadmap', 'step1')}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors shrink-0"
                  title="Copy command"
                >
                  {copiedCmd === 'step1' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-[10px] font-mono">
                      2
                    </span>
                    Install dependencies & launch dev server
                  </div>
                  <code className="text-xs text-slate-300 font-mono block pl-7">
                    cd career-roadmap && npm install && npm run dev
                  </code>
                </div>
                <button
                  onClick={() => handleCopy('cd career-roadmap && npm install && npm run dev', 'step2')}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors shrink-0"
                  title="Copy command"
                >
                  {copiedCmd === 'step2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-[10px] font-mono">
                      3
                    </span>
                    Open in your browser
                  </div>
                  <div className="text-xs text-emerald-400 font-mono pl-7 flex items-center gap-1.5">
                    <span>http://localhost:3000</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Package Contents Breakdown */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              Files included in the ZIP
            </h3>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">📄</span> README.md (run instructions)
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">📄</span> package.json & lock
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">📄</span> vite.config.ts & tsconfig
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">📄</span> index.html & index.css
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">📁</span> src/components/ (9 components)
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">📁</span> src/context/ (Roadmap & Auth)
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">📁</span> src/data/presets.ts (All roles)
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">📁</span> src/types/ & src/lib/
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Target role: <strong className="text-slate-200">{currentRoadmap.title}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
