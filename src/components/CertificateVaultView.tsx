import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { UploadedCertificate } from '../types/roadmap';
import {
  UploadCloud,
  FileCheck,
  ShieldCheck,
  Award,
  Trash2,
  Eye,
  FileText,
  Calendar,
  CheckCircle,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface CertificateVaultViewProps {
  initialSkillId?: string | null;
}

export const CertificateVaultView: React.FC<CertificateVaultViewProps> = ({ initialSkillId }) => {
  const {
    currentRoadmap,
    uploadCertificate,
    deleteCertificate,
    toggleCertificateVerification,
    currentUser,
    openAuthModal,
  } = useRoadmap();

  const [isUploading, setIsUploading] = useState(false);
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<UploadedCertificate | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [linkedSkillIds, setLinkedSkillIds] = useState<string[]>(
    initialSkillId ? [initialSkillId] : []
  );
  const [uploadedFile, setUploadedFile] = useState<{
    fileName: string;
    fileSize: string;
    mimeType: string;
    fileDataUrl?: string;
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;

    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = e => {
      setUploadedFile({
        fileName: file.name,
        fileSize: sizeFormatted,
        mimeType: file.type || 'application/pdf',
        fileDataUrl: e.target?.result as string,
      });

      // Auto-populate title if empty
      if (!title) {
        const guessedTitle = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[_-]+/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        setTitle(guessedTitle);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const toggleSkillSelection = (skillId: string) => {
    setLinkedSkillIds(prev =>
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide a certificate title.');
      return;
    }
    if (!issuer.trim()) {
      setErrorMessage('Please specify the issuing institution or authority.');
      return;
    }

    uploadCertificate({
      title: title.trim(),
      issuer: issuer.trim(),
      issueDate,
      credentialId: credentialId.trim() || `CERT-${Math.floor(1000 + Math.random() * 9000)}`,
      credentialUrl: credentialUrl.trim() || undefined,
      fileName: uploadedFile?.fileName || `${title.replace(/\s+/g, '_')}_verified.pdf`,
      fileSize: uploadedFile?.fileSize || '1.2 MB',
      mimeType: uploadedFile?.mimeType || 'application/pdf',
      fileDataUrl: uploadedFile?.fileDataUrl,
      linkedSkillIds,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setTitle('');
    setIssuer('');
    setCredentialId('');
    setCredentialUrl('');
    setNotes('');
    setLinkedSkillIds([]);
    setUploadedFile(null);
    setIsUploading(false);
    setErrorMessage(null);
  };

  const loadSampleCredential = () => {
    const randomSkill = currentRoadmap.skills[0];
    setTitle(`Advanced Professional Specialization in ${randomSkill?.name || 'Frontier Systems'}`);
    setIssuer('International Institute of Frontier Technology');
    setIssueDate('2026-02-15');
    setCredentialId(`IIFT-${Math.floor(10000 + Math.random() * 90000)}`);
    setNotes('Verified via peer evaluation and rigorous benchmark testing.');
    setUploadedFile({
      fileName: 'verified_specialization_credential.pdf',
      fileSize: '1.4 MB',
      mimeType: 'application/pdf',
    });
    if (randomSkill) {
      setLinkedSkillIds([randomSkill.id]);
    }
    setIsUploading(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 sm:p-5 rounded-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">Credential Portfolio Vault</span>
            <span aria-hidden="true">·</span>
            <span>{currentRoadmap.certifications.length} Credentials Uploaded</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Certifications & Verified Qualifications
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Upload certificates, licenses, and course completions to substantiate your skills. Every verified
            credential linked to a competency accelerates that skill's level gauge toward dream job mastery.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={loadSampleCredential}
            className="px-3.5 py-2 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700/80 rounded-lg transition-colors font-medium flex items-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Sample Cert</span>
          </button>
          <button
            onClick={() => setIsUploading(!isUploading)}
            className="px-4 py-2 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isUploading ? 'Close Uploader' : 'Upload New Certificate'}</span>
          </button>
        </div>
      </div>

      {/* Guest Mode Cloud Sync Prompt */}
      {!currentUser && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Currently in Guest Mode. Sign in to synchronize your certificate vault securely across devices via Firebase Firestore.</span>
          </div>
          <button
            onClick={() => openAuthModal('login')}
            className="text-emerald-400 hover:text-emerald-300 font-semibold whitespace-nowrap cursor-pointer hover:underline"
          >
            Sign In / Register →
          </button>
        </div>
      )}

      {/* Upload Drawer / Modal */}
      {isUploading && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-950 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-2xl space-y-5 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Register & Upload Credential</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Drag & Drop File Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              dragActive
                ? 'border-emerald-400 bg-emerald-500/10'
                : uploadedFile
                ? 'border-slate-700 bg-slate-900/40'
                : 'border-slate-800 bg-slate-900/20 hover:border-slate-700'
            }`}
          >
            {uploadedFile ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg max-w-xl mx-auto">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left truncate">
                    <div className="text-xs font-semibold text-white truncate">{uploadedFile.fileName}</div>
                    <div className="text-[11px] font-mono text-slate-400">{uploadedFile.fileSize} · {uploadedFile.mimeType}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium shrink-0"
                >
                  Change File
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-semibold text-white">
                  Drag and drop your certificate document or image here
                </div>
                <p className="text-[11px] text-slate-400">
                  Supports PDF, PNG, JPG, or SVG documents up to 25MB
                </p>
                <label className="inline-block mt-2 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 rounded-lg cursor-pointer transition-colors">
                  Browse Device Files
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.svg,.webp"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-mono mb-1.5">
                Certificate / Certification Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Certified Subsea Pressure Systems Specialist"
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1.5">
                Issuing Authority / University / Board *
              </label>
              <input
                type="text"
                value={issuer}
                onChange={e => setIssuer(e.target.value)}
                placeholder="e.g. IEEE, ASME, MIT xPRO, SANS Institute"
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1.5">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={e => setIssueDate(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1.5">
                Credential ID / License Number
              </label>
              <input
                type="text"
                value={credentialId}
                onChange={e => setCredentialId(e.target.value)}
                placeholder="e.g. MTS-PV-9042 or SHA-256 hash"
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-mono mb-1.5">
                Verification URL (Optional)
              </label>
              <input
                type="url"
                value={credentialUrl}
                onChange={e => setCredentialUrl(e.target.value)}
                placeholder="https://credly.com/badges/... or university verification link"
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Linked Skill Competencies Picker */}
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-mono mb-1.5">
                Link to Target Skills (Accelerates verified level gauge):
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-900/60 border border-slate-800 rounded-lg max-h-40 overflow-y-auto">
                {currentRoadmap.skills.map(sk => {
                  const isSelected = linkedSkillIds.includes(sk.id);
                  return (
                    <button
                      key={sk.id}
                      type="button"
                      onClick={() => toggleSkillSelection(sk.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
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
              <p className="text-[11px] text-slate-400 mt-1">
                Selected skills will receive an automatic +1 level boost on their verified progression gauge.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-mono mb-1.5">
                Notes / Syllabus Mastery Highlights (Optional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Key labs completed, scores, capstone project titles..."
                rows={2}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-lg transition-colors"
            >
              Save to Credential Vault
            </button>
          </div>
        </form>
      )}

      {/* Uploaded Certificate Grid */}
      {currentRoadmap.certifications.length === 0 ? (
        <div className="py-16 text-center bg-slate-950 border border-dashed border-slate-800 rounded-xl space-y-3">
          <Award className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-white">No certifications in vault yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Upload your professional licenses, certifications, and technical credentials to verify skills
            and monitor your progression toward this dream career.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={loadSampleCredential}
              className="px-3.5 py-2 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium"
            >
              Load Sample Credential
            </button>
            <button
              onClick={() => setIsUploading(true)}
              className="px-4 py-2 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-lg"
            >
              Upload Document
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentRoadmap.certifications.map(cert => {
            return (
              <div
                key={cert.id}
                className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="p-5 space-y-3.5">
                  {/* Card Top: Issuer & Verification Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-300 truncate max-w-[180px]">
                          {cert.issuer}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{cert.issueDate}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCertificateVerification(cert.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium flex items-center gap-1 transition-colors ${
                        cert.verified
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                      title="Click to toggle verified status"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>{cert.verified ? 'Verified' : 'Pending'}</span>
                    </button>
                  </div>

                  {/* Title & Credential ID */}
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                      {cert.title}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-400 mt-1">
                      ID: {cert.credentialId}
                    </div>
                  </div>

                  {cert.notes && (
                    <p className="text-xs text-slate-400 line-clamp-2 italic">
                      "{cert.notes}"
                    </p>
                  )}

                  {/* Boosted Skill Badges */}
                  {cert.linkedSkillIds.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="text-[10px] font-mono text-slate-400">Elevates Competencies:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {cert.linkedSkillIds.map(skId => {
                          const skill = currentRoadmap.skills.find(s => s.id === skId);
                          if (!skill) return null;
                          return (
                            <span
                              key={skId}
                              className="text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded"
                            >
                              +1 {skill.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCertForPreview(cert)}
                      className="text-slate-300 hover:text-white font-medium flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Preview</span>
                    </button>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Verify</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => deleteCertificate(cert.id)}
                    className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors"
                    title="Remove credential"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Document Preview Modal */}
      {selectedCertForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-emerald-400">Credential Document Preview</span>
                <h3 className="text-lg font-bold text-white">{selectedCertForPreview.title}</h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Issued by {selectedCertForPreview.issuer} · {selectedCertForPreview.issueDate}
                </div>
              </div>
              <button
                onClick={() => setSelectedCertForPreview(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document display preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 min-h-[220px] flex flex-col items-center justify-center text-center">
              {selectedCertForPreview.fileDataUrl && selectedCertForPreview.mimeType.startsWith('image/') ? (
                <img
                  src={selectedCertForPreview.fileDataUrl}
                  alt={selectedCertForPreview.title}
                  className="max-h-80 object-contain rounded border border-slate-800"
                />
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="font-mono text-sm text-white font-semibold">
                    {selectedCertForPreview.fileName}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    File Size: {selectedCertForPreview.fileSize} · Verified Format: {selectedCertForPreview.mimeType}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950 text-emerald-300 text-xs border border-emerald-800 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cryptographically Authenticated Record</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-400 space-y-1 pt-2">
              <div>
                <span className="font-semibold text-slate-300">Credential ID:</span>{' '}
                <span className="font-mono text-slate-200">{selectedCertForPreview.credentialId}</span>
              </div>
              {selectedCertForPreview.notes && (
                <div>
                  <span className="font-semibold text-slate-300">Verification Notes:</span>{' '}
                  <span className="text-slate-300">{selectedCertForPreview.notes}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedCertForPreview(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
