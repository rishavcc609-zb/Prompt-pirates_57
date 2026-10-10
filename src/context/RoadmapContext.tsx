import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  JobRoadmap,
  Milestone,
  MilestoneStatus,
  RoadmapViewMode,
  SkillCompetency,
  UploadedCertificate,
  SkillLevel,
  SkillGapStatus,
  MonthPlan,
  LearningResource,
  DailyStudySprint,
  PortfolioProject,
  SkillBadge,
} from '../types/roadmap';
import { PRESET_ROADMAPS } from '../data/presets';
import { requestRoadmapGeneration, recalculateRoadmapForNewTimeline } from '../utils/roadmapGenerator';
import { generateDailyStudySprints } from '../utils/sprintGenerator';
import { generatePortfolioProjectForSkill } from '../utils/projectGenerator';
import {
  auth,
  db,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
  logOutUser,
  onAuthStateChanged,
  doc,
  setDoc,
  collection,
  onSnapshot,
  deleteDoc,
  handleFirestoreError,
  OperationType,
  User,
} from '../lib/firebase';

interface RoadmapContextType {
  currentRoadmap: JobRoadmap;
  allRoadmaps: JobRoadmap[];
  viewMode: RoadmapViewMode;
  setViewMode: (mode: RoadmapViewMode) => void;
  selectedMilestoneId: string | null;
  setSelectedMilestoneId: (id: string | null) => void;
  selectedSkillId: string | null;
  setSelectedSkillId: (id: string | null) => void;
  selectedCertificateId: string | null;
  setSelectedCertificateId: (id: string | null) => void;
  isGenerating: boolean;
  generationError: string | null;

  // Authentication & Cloud Sync
  currentUser: User | null;
  isAuthReady: boolean;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'guest';
  login: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  authModalInitialMode: 'login' | 'signup';

  // Actions
  switchRoadmap: (roadmapId: string) => void;
  updateMilestoneStatus: (milestoneId: string, status: MilestoneStatus) => void;
  toggleDeliverable: (milestoneId: string, deliverableText: string) => void;
  updateMilestoneNotes: (milestoneId: string, notes: string) => void;
  addCustomMilestone: (stageId: string, milestoneData: Partial<Milestone>) => void;
  adjustSkillLevel: (skillId: string, newLevel: SkillLevel) => void;
  toggleSkillPossessed: (skillId: string) => void;
  setSkillGapStatus: (skillId: string, status: SkillGapStatus) => void;
  toggleResourceCompleted: (monthPlanId: string, resourceId: string) => void;
  recalculateTimeline: (newTimelineMonths: number) => void;
  updateUserSkills: (skills: string[]) => void;
  uploadCertificate: (cert: Omit<UploadedCertificate, 'id' | 'uploadedAt' | 'verified'>) => void;
  deleteCertificate: (certId: string) => void;
  toggleCertificateVerification: (certId: string) => void;
  createNewRoadmap: (
    title: string,
    options?: {
      industry?: string;
      timelineMonths?: number;
      currentSkills?: string[];
      weeklyHours?: number;
    }
  ) => Promise<void>;
  resetCurrentRoadmapToDefault: () => void;
  exportRoadmapJson: () => string;
  importRoadmapJson: (jsonStr: string) => boolean;

  // Daily Study Sprints
  sprints: DailyStudySprint[];
  toggleSprintCompleted: (sprintId: string) => void;
  resetSprintsForCurrentRoadmap: () => void;
  sprintStreakDays: number;
  completedSprintsCount: number;

  // Portfolio Project Lab
  portfolioProjects: PortfolioProject[];
  addPortfolioProject: (project: PortfolioProject) => void;
  updateProjectStatus: (projectId: string, status: 'idea' | 'in_progress' | 'completed') => void;
  generateProjectForSkill: (skillId: string) => PortfolioProject;

  // Skill Verification & Badges
  verifiedBadges: SkillBadge[];
  recordQuizPass: (skillId: string, score: number) => SkillBadge;
  hasVerifiedBadge: (skillId: string) => boolean;

  // Computed analytics
  stats: {
    totalMilestones: number;
    achievedMilestones: number;
    inProgressMilestones: number;
    completionPercentage: number;
    totalSkills: number;
    masteredSkillsCount: number;
    matchedSkillsCount: number;
    gapsCount: number;
    goalPreparednessPercentage: number;
    remainingHoursToBridge: number;
    overallReadinessPercentage: number;
    totalCertificates: number;
    verifiedCertificates: number;
    totalResourcesCount: number;
    completedResourcesCount: number;
    resourceCompletionPercentage: number;
    gapPossessedCount: number;
    gapPartialCount: number;
    gapMissingCount: number;
    estimatedTotalHoursToBridge: number;
    totalVerifiedBadges: number;
  };
}

const STORAGE_KEY = 'pathfinder_roadmaps_v2';
const ACTIVE_ID_KEY = 'pathfinder_active_id_v2';
const SPRINTS_KEY = 'pathfinder_sprints_v2';
const PROJECTS_KEY = 'pathfinder_projects_v2';
const BADGES_KEY = 'pathfinder_badges_v2';

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const RoadmapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'guest'>('guest');

  const [allRoadmaps, setAllRoadmaps] = useState<JobRoadmap[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((r: JobRoadmap) => r.id));
          const missingPresets = PRESET_ROADMAPS.filter(p => !existingIds.has(p.id));
          if (missingPresets.length > 0) {
            return [...missingPresets, ...parsed];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load roadmaps from storage:', e);
    }
    return PRESET_ROADMAPS;
  });

  const [activeRoadmapId, setActiveRoadmapId] = useState<string>(() => {
    try {
      const savedActive = localStorage.getItem(ACTIVE_ID_KEY);
      if (savedActive && allRoadmaps.some(r => r.id === savedActive)) {
        return savedActive;
      }
    } catch (e) {
      console.error('Failed to load active id:', e);
    }
    return PRESET_ROADMAPS[0]?.id || 'ai-engineer';
  });

  const [viewMode, setViewMode] = useState<RoadmapViewMode>('timeline');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'signup'>('login');

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  // Daily study sprints mapped by roadmapId
  const [sprintsMap, setSprintsMap] = useState<Record<string, DailyStudySprint[]>>(() => {
    try {
      const saved = localStorage.getItem(SPRINTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse sprints:', e);
    }
    return {};
  });

  // Portfolio projects across roadmaps
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>(() => {
    try {
      const saved = localStorage.getItem(PROJECTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse projects:', e);
    }
    return [];
  });

  // Verified Skill Badges
  const [verifiedBadges, setVerifiedBadges] = useState<SkillBadge[]>(() => {
    try {
      const saved = localStorage.getItem(BADGES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse badges:', e);
    }
    return [];
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allRoadmaps));
    } catch (e) {
      console.error('Failed to save roadmaps to storage:', e);
    }
  }, [allRoadmaps]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_ID_KEY, activeRoadmapId);
    } catch (e) {
      console.error('Failed to save active roadmap ID:', e);
    }
  }, [activeRoadmapId]);

  useEffect(() => {
    try {
      localStorage.setItem(SPRINTS_KEY, JSON.stringify(sprintsMap));
    } catch (e) {
      console.error('Failed to save sprints:', e);
    }
  }, [sprintsMap]);

  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(portfolioProjects));
    } catch (e) {
      console.error('Failed to save projects:', e);
    }
  }, [portfolioProjects]);

  useEffect(() => {
    try {
      localStorage.setItem(BADGES_KEY, JSON.stringify(verifiedBadges));
    } catch (e) {
      console.error('Failed to save badges:', e);
    }
  }, [verifiedBadges]);

  // Auth State Listener & Firestore Real-Time Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setIsAuthReady(true);
      if (user) {
        setCloudSyncStatus('synced');
      } else {
        setCloudSyncStatus('guest');
      }
    });

    return () => unsubscribe();
  }, []);

  // Firestore roadmaps listener when user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    const collectionPath = `users/${currentUser.uid}/roadmaps`;
    const roadmapsColRef = collection(db, 'users', currentUser.uid, 'roadmaps');

    const unsubscribe = onSnapshot(
      roadmapsColRef,
      snapshot => {
        if (!snapshot.empty) {
          const loadedDocs: JobRoadmap[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data() as JobRoadmap;
            if (data && data.id && data.title) {
              loadedDocs.push(data);
            }
          });
          if (loadedDocs.length > 0) {
            setAllRoadmaps(loadedDocs);
            setCloudSyncStatus('synced');
          }
        } else {
          // If Firestore is empty for this user, seed their initial roadmaps into Firestore
          const initial = allRoadmaps.length > 0 ? allRoadmaps : PRESET_ROADMAPS;
          initial.forEach(async r => {
            try {
              const docRef = doc(db, 'users', currentUser.uid, 'roadmaps', r.id);
              await setDoc(docRef, r, { merge: true });
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/roadmaps/${r.id}`);
            }
          });
          setCloudSyncStatus('synced');
        }
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, collectionPath);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Helper to persist changes to Firestore if user is logged in
  const syncRoadmapToCloud = async (roadmap: JobRoadmap) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/roadmaps/${roadmap.id}`;
    setCloudSyncStatus('syncing');
    try {
      const docRef = doc(db, 'users', currentUser.uid, 'roadmaps', roadmap.id);
      await setDoc(docRef, roadmap, { merge: true });
      setCloudSyncStatus('synced');
    } catch (err) {
      setCloudSyncStatus('offline');
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const login = async () => {
    try {
      await signInWithGoogle();
      setIsAuthModalOpen(false);
    } catch (err) {
      console.error('Sign-in error:', err);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmail(email, pass);
      setIsAuthModalOpen(false);
    } catch (err) {
      console.error('Email sign-in error:', err);
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      await signUpWithEmail(email, pass, name);
      setIsAuthModalOpen(false);
    } catch (err) {
      console.error('Sign-up error:', err);
      throw err;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await resetPassword(email);
    } catch (err) {
      console.error('Password reset error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logOutUser();
    } catch (err) {
      console.error('Sign-out error:', err);
      throw err;
    }
  };

  const currentRoadmap = useMemo(() => {
    const found = allRoadmaps.find(r => r.id === activeRoadmapId);
    return found || allRoadmaps[0] || PRESET_ROADMAPS[0];
  }, [allRoadmaps, activeRoadmapId]);

  // Recalculate skill levels and progress metrics dynamically
  const enrichedRoadmap = useMemo(() => {
    // Calculate achieved milestones per skill
    const achievedMilestonesBySkill: Record<string, number> = {};
    const totalMilestonesBySkill: Record<string, number> = {};

    currentRoadmap.stages.forEach(stage => {
      stage.milestones.forEach(ms => {
        (ms.linkedSkillIds || []).forEach(skId => {
          totalMilestonesBySkill[skId] = (totalMilestonesBySkill[skId] || 0) + 1;
          if (ms.status === 'achieved') {
            achievedMilestonesBySkill[skId] = (achievedMilestonesBySkill[skId] || 0) + 1;
          }
        });
      });
    });

    // Also include month plans milestones
    (currentRoadmap.monthPlans || []).forEach(mp => {
      (mp.milestones || []).forEach(ms => {
        (ms.linkedSkillIds || []).forEach(skId => {
          totalMilestonesBySkill[skId] = (totalMilestonesBySkill[skId] || 0) + 1;
          if (ms.status === 'achieved') {
            achievedMilestonesBySkill[skId] = (achievedMilestonesBySkill[skId] || 0) + 1;
          }
        });
      });
    });

    // Calculate verified certs per skill
    const certsBySkill: Record<string, number> = {};
    (currentRoadmap.certifications || []).forEach(cert => {
      if (cert.verified) {
        (cert.linkedSkillIds || []).forEach(skId => {
          certsBySkill[skId] = (certsBySkill[skId] || 0) + 1;
        });
      }
    });

    const updatedSkills: SkillCompetency[] = (currentRoadmap.skills || []).map(skill => {
      const msAchieved = achievedMilestonesBySkill[skill.id] || 0;
      const msTotal = totalMilestonesBySkill[skill.id] || 1;
      const certsCount = certsBySkill[skill.id] || 0;

      // Base self-assessed level
      let verifiedCalc = skill.currentLevel;

      // Boost from milestone completions
      if (msTotal > 0 && msAchieved > 0) {
        const milestoneBoost = Math.floor((msAchieved / msTotal) * 1.5);
        verifiedCalc = Math.min(5, verifiedCalc + milestoneBoost) as SkillLevel;
      }

      // Boost from verified credentials
      if (certsCount > 0) {
        verifiedCalc = Math.min(5, verifiedCalc + certsCount) as SkillLevel;
      }

      return {
        ...skill,
        verifiedLevel: Math.max(1, Math.min(5, verifiedCalc)) as SkillLevel,
      };
    });

    const totalSkillsCount = updatedSkills.length > 0 ? updatedSkills.length : 1;
    const possessedSkillsCount = updatedSkills.filter(s => s.gapStatus === 'possessed').length;
    const partialCount = updatedSkills.filter(s => s.gapStatus === 'partial').length;
    const missingCount = updatedSkills.filter(s => s.gapStatus === 'missing').length;
    const remainingHours = updatedSkills
      .filter(s => s.gapStatus !== 'possessed')
      .reduce((acc, s) => acc + (s.estimatedHoursToBridge || 40), 0);
    const rawGoalPreparedness = (possessedSkillsCount / totalSkillsCount) * 100;
    const dynamicPreparedness = Number.isInteger(rawGoalPreparedness)
      ? rawGoalPreparedness
      : Number(rawGoalPreparedness.toFixed(1));

    return {
      ...currentRoadmap,
      skills: updatedSkills,
      gapAnalysisSummary: {
        possessedCount: possessedSkillsCount,
        partialCount,
        missingCount,
        totalRequiredSkills: totalSkillsCount,
        estimatedTotalHoursToBridge: remainingHours,
        currentReadinessQuotient: dynamicPreparedness,
      },
    };
  }, [currentRoadmap]);

  const stats = useMemo(() => {
    let totalMs = 0;
    let achievedMs = 0;
    let inProgMs = 0;

    enrichedRoadmap.stages.forEach(stage => {
      stage.milestones.forEach(ms => {
        totalMs += 1;
        if (ms.status === 'achieved') achievedMs += 1;
        if (ms.status === 'in_progress') inProgMs += 1;
      });
    });

    // Month plans calculation
    let totalResourcesCount = 0;
    let completedResourcesCount = 0;
    (enrichedRoadmap.monthPlans || []).forEach(mp => {
      (mp.resources || []).forEach(res => {
        totalResourcesCount += 1;
        if (res.completed) completedResourcesCount += 1;
      });
    });

    const totalSkills = enrichedRoadmap.skills.length > 0 ? enrichedRoadmap.skills.length : 1;
    let totalCurrentLvl = 0;
    let totalTargetLvl = 0;
    let masteredCount = 0;

    enrichedRoadmap.skills.forEach(sk => {
      totalCurrentLvl += sk.verifiedLevel || sk.currentLevel;
      totalTargetLvl += sk.targetLevel;
      if ((sk.verifiedLevel || sk.currentLevel) >= sk.targetLevel) {
        masteredCount += 1;
      }
    });

    const totalCerts = enrichedRoadmap.certifications?.length || 0;
    const verifiedCerts = enrichedRoadmap.certifications?.filter(c => c.verified).length || 0;

    const completionPercentage = totalMs > 0 ? Math.round((achievedMs / totalMs) * 100) : 0;
    const resourcePercentage = totalResourcesCount > 0 ? Math.round((completedResourcesCount / totalResourcesCount) * 100) : 0;

    // Live Gap Analysis & Goal Preparedness index calculation
    const matchedSkillsCount = enrichedRoadmap.skills.filter(s => s.gapStatus === 'possessed').length;
    const gapPartialCount = enrichedRoadmap.skills.filter(s => s.gapStatus === 'partial').length;
    const gapMissingCount = enrichedRoadmap.skills.filter(s => s.gapStatus === 'missing').length;

    // Goal Preparedness % = matched skills / total skills * 100
    const rawGoalPreparedness = (matchedSkillsCount / totalSkills) * 100;
    const goalPreparednessPercentage = Number.isInteger(rawGoalPreparedness)
      ? rawGoalPreparedness
      : Number(rawGoalPreparedness.toFixed(1));

    // Gaps to Bridge (count + remaining hours)
    const gapsCount = totalSkills - matchedSkillsCount;
    const remainingHoursToBridge = enrichedRoadmap.skills
      .filter(s => s.gapStatus !== 'possessed')
      .reduce((acc, s) => acc + (s.estimatedHoursToBridge || 40), 0);

    return {
      totalMilestones: totalMs,
      achievedMilestones: achievedMs,
      inProgressMilestones: inProgMs,
      completionPercentage,
      totalSkills,
      masteredSkillsCount: masteredCount,
      matchedSkillsCount,
      gapsCount,
      goalPreparednessPercentage,
      remainingHoursToBridge,
      overallReadinessPercentage: goalPreparednessPercentage,
      totalCertificates: totalCerts,
      verifiedCertificates: verifiedCerts,
      totalResourcesCount,
      completedResourcesCount,
      resourceCompletionPercentage: resourcePercentage,
      gapPossessedCount: matchedSkillsCount,
      gapPartialCount,
      gapMissingCount,
      estimatedTotalHoursToBridge: remainingHoursToBridge,
      totalVerifiedBadges: verifiedBadges.length,
    };
  }, [enrichedRoadmap, verifiedBadges]);

  const switchRoadmap = (roadmapId: string) => {
    const target = allRoadmaps.find(r => r.id === roadmapId);
    if (target) {
      setActiveRoadmapId(roadmapId);
      setSelectedMilestoneId(null);
      setSelectedSkillId(null);
      setSelectedCertificateId(null);
    }
  };

  const updateCurrentRoadmapState = (updater: (prev: JobRoadmap) => JobRoadmap) => {
    setAllRoadmaps(prevAll => {
      const updatedList = prevAll.map(roadmap => {
        if (roadmap.id === activeRoadmapId) {
          const updated = updater(roadmap);
          syncRoadmapToCloud(updated);
          return updated;
        }
        return roadmap;
      });
      return updatedList;
    });
  };

  const updateMilestoneStatus = (milestoneId: string, status: MilestoneStatus) => {
    updateCurrentRoadmapState(roadmap => {
      const updatedStages = roadmap.stages.map(stage => {
        const hasMs = stage.milestones.some(m => m.id === milestoneId);
        if (!hasMs) return stage;

        const updatedMilestones = stage.milestones.map(m => {
          if (m.id === milestoneId) {
            return {
              ...m,
              status,
              completedDeliverables:
                status === 'achieved' ? [...m.deliverables] : status === 'not_started' ? [] : (m.completedDeliverables || []),
            };
          }
          return m;
        });
        return { ...stage, milestones: updatedMilestones };
      });

      // Also update in monthPlans if present
      const updatedMonthPlans = (roadmap.monthPlans || []).map(mp => {
        const updatedMs = (mp.milestones || []).map(m => {
          if (m.id === milestoneId) {
            return { ...m, status };
          }
          return m;
        });
        return { ...mp, milestones: updatedMs };
      });

      return { ...roadmap, stages: updatedStages, monthPlans: updatedMonthPlans };
    });
  };

  const toggleDeliverable = (milestoneId: string, deliverableText: string) => {
    updateCurrentRoadmapState(roadmap => {
      const updatedStages = roadmap.stages.map(stage => {
        const hasMs = stage.milestones.some(m => m.id === milestoneId);
        if (!hasMs) return stage;

        const updatedMilestones = stage.milestones.map(m => {
          if (m.id === milestoneId) {
            const currentCompleted = m.completedDeliverables || [];
            const alreadyCompleted = currentCompleted.includes(deliverableText);
            const newCompleted = alreadyCompleted
              ? currentCompleted.filter(d => d !== deliverableText)
              : [...currentCompleted, deliverableText];

            let newStatus: MilestoneStatus = m.status;
            if (newCompleted.length === m.deliverables.length && m.deliverables.length > 0) {
              newStatus = 'achieved';
            } else if (newCompleted.length > 0) {
              newStatus = 'in_progress';
            } else {
              newStatus = 'not_started';
            }

            return {
              ...m,
              completedDeliverables: newCompleted,
              status: newStatus,
            };
          }
          return m;
        });
        return { ...stage, milestones: updatedMilestones };
      });

      return { ...roadmap, stages: updatedStages };
    });
  };

  const updateMilestoneNotes = (milestoneId: string, notes: string) => {
    updateCurrentRoadmapState(roadmap => {
      const updatedStages = roadmap.stages.map(stage => {
        const updatedMilestones = stage.milestones.map(m => {
          if (m.id === milestoneId) {
            return { ...m, notes };
          }
          return m;
        });
        return { ...stage, milestones: updatedMilestones };
      });
      return { ...roadmap, stages: updatedStages };
    });
  };

  const toggleSkillPossessed = (skillId: string) => {
    updateCurrentRoadmapState(roadmap => {
      let isNowPossessed = false;
      let targetSkillName = '';

      const updatedSkills = (roadmap.skills || []).map(sk => {
        if (sk.id === skillId) {
          targetSkillName = sk.name;
          const wasPossessed = sk.gapStatus === 'possessed';
          isNowPossessed = !wasPossessed;
          const nextStatus: SkillGapStatus = wasPossessed ? 'missing' : 'possessed';
          return {
            ...sk,
            gapStatus: nextStatus,
            currentLevel: (wasPossessed ? 2 : Math.max(sk.currentLevel, 4)) as SkillLevel,
            verifiedLevel: (wasPossessed ? 2 : Math.max(sk.verifiedLevel, 4)) as SkillLevel,
            matchReason: wasPossessed
              ? 'Required core competency to bridge.'
              : 'Directly verified proficiency from your profile.',
          };
        }
        return sk;
      });

      // Synchronize userCurrentSkills list
      let updatedUserSkills = [...(roadmap.userCurrentSkills || [])];
      if (isNowPossessed && targetSkillName) {
        if (!updatedUserSkills.some(s => s.toLowerCase() === targetSkillName.toLowerCase())) {
          updatedUserSkills.push(targetSkillName);
        }
      } else if (!isNowPossessed && targetSkillName) {
        updatedUserSkills = updatedUserSkills.filter(
          s => s.toLowerCase() !== targetSkillName.toLowerCase()
        );
      }

      return {
        ...roadmap,
        skills: updatedSkills,
        userCurrentSkills: updatedUserSkills,
      };
    });
  };

  const setSkillGapStatus = (skillId: string, status: SkillGapStatus) => {
    updateCurrentRoadmapState(roadmap => {
      let targetSkillName = '';
      const updatedSkills = (roadmap.skills || []).map(sk => {
        if (sk.id === skillId) {
          targetSkillName = sk.name;
          return {
            ...sk,
            gapStatus: status,
            currentLevel: (status === 'possessed' ? Math.max(sk.currentLevel, 4) : 2) as SkillLevel,
            verifiedLevel: (status === 'possessed' ? Math.max(sk.verifiedLevel, 4) : 2) as SkillLevel,
            matchReason: status === 'possessed'
              ? 'Directly verified proficiency from your profile.'
              : status === 'partial'
              ? 'Foundational basis exists; needs deeper domain mastery.'
              : 'Required core capability to achieve.',
          };
        }
        return sk;
      });

      let updatedUserSkills = [...(roadmap.userCurrentSkills || [])];
      if (status === 'possessed' && targetSkillName) {
        if (!updatedUserSkills.some(s => s.toLowerCase() === targetSkillName.toLowerCase())) {
          updatedUserSkills.push(targetSkillName);
        }
      } else if (status !== 'possessed' && targetSkillName) {
        updatedUserSkills = updatedUserSkills.filter(
          s => s.toLowerCase() !== targetSkillName.toLowerCase()
        );
      }

      return {
        ...roadmap,
        skills: updatedSkills,
        userCurrentSkills: updatedUserSkills,
      };
    });
  };

  const toggleResourceCompleted = (monthPlanId: string, resourceId: string) => {
    updateCurrentRoadmapState(roadmap => {
      const updatedMonthPlans = (roadmap.monthPlans || []).map(mp => {
        if (mp.id === monthPlanId) {
          const updatedResources = (mp.resources || []).map(res => {
            if (res.id === resourceId) {
              return { ...res, completed: !res.completed };
            }
            return res;
          });
          return { ...mp, resources: updatedResources };
        }
        return mp;
      });
      return { ...roadmap, monthPlans: updatedMonthPlans };
    });
  };

  const recalculateTimeline = (newTimelineMonths: number) => {
    updateCurrentRoadmapState(roadmap => {
      return recalculateRoadmapForNewTimeline(roadmap, newTimelineMonths);
    });
  };

  const updateUserSkills = (newSkills: string[]) => {
    updateCurrentRoadmapState(roadmap => {
      // Re-run gap analysis on skills
      const updatedSkills = (roadmap.skills || []).map(sk => {
        const matchesCurrent = newSkills.some(
          curr =>
            sk.name.toLowerCase().includes(curr.toLowerCase()) ||
            curr.toLowerCase().includes(sk.name.toLowerCase())
        );

        let gapStatus: SkillGapStatus = sk.gapStatus || 'missing';
        let currentLevel = sk.currentLevel;

        if (matchesCurrent) {
          gapStatus = 'possessed';
          currentLevel = Math.max(currentLevel, 4) as SkillLevel;
        } else if (sk.prerequisites.length === 0) {
          gapStatus = 'partial';
        } else {
          gapStatus = 'missing';
        }

        return {
          ...sk,
          gapStatus,
          currentLevel,
        };
      });

      return {
        ...roadmap,
        userCurrentSkills: newSkills,
        skills: updatedSkills,
      };
    });
  };

  const addCustomMilestone = (stageId: string, milestoneData: Partial<Milestone>) => {
    const newId = `ms-custom-${Date.now()}`;
    const newMilestone: Milestone = {
      id: newId,
      stageId,
      title: milestoneData.title || 'New Career Milestone',
      description: milestoneData.description || '',
      status: milestoneData.status || 'not_started',
      difficulty: milestoneData.difficulty || 'Intermediate',
      targetTimeframe: milestoneData.targetTimeframe || 'Next Quarter',
      deliverables: milestoneData.deliverables || ['Define milestone scope and acceptance criteria'],
      completedDeliverables: [],
      linkedSkillIds: milestoneData.linkedSkillIds || [],
      notes: milestoneData.notes || '',
    };

    updateCurrentRoadmapState(roadmap => {
      const updatedStages = roadmap.stages.map(stage => {
        if (stage.id === stageId) {
          return {
            ...stage,
            milestones: [...stage.milestones, newMilestone],
          };
        }
        return stage;
      });
      return { ...roadmap, stages: updatedStages };
    });

    setSelectedMilestoneId(newId);
  };

  const adjustSkillLevel = (skillId: string, newLevel: SkillLevel) => {
    updateCurrentRoadmapState(roadmap => {
      const updatedSkills = roadmap.skills.map(sk => {
        if (sk.id === skillId) {
          return {
            ...sk,
            currentLevel: newLevel,
          };
        }
        return sk;
      });
      return { ...roadmap, skills: updatedSkills };
    });
  };

  const uploadCertificate = (certData: Omit<UploadedCertificate, 'id' | 'uploadedAt' | 'verified'>) => {
    const newCert: UploadedCertificate = {
      ...certData,
      id: `cert-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      verified: true,
    };

    updateCurrentRoadmapState(roadmap => {
      return {
        ...roadmap,
        certifications: [newCert, ...(roadmap.certifications || [])],
      };
    });

    if (currentUser) {
      const certDocRef = doc(db, 'users', currentUser.uid, 'certificates', newCert.id);
      setDoc(
        certDocRef,
        {
          id: newCert.id,
          userId: currentUser.uid,
          title: newCert.title,
          issuer: newCert.issuer,
          issueDate: newCert.issueDate,
          credentialId: newCert.credentialId,
          verified: newCert.verified,
          uploadedAt: newCert.uploadedAt,
        },
        { merge: true }
      ).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/certificates/${newCert.id}`);
      });
    }

    setSelectedCertificateId(newCert.id);
  };

  const deleteCertificate = (certId: string) => {
    updateCurrentRoadmapState(roadmap => {
      return {
        ...roadmap,
        certifications: (roadmap.certifications || []).filter(c => c.id !== certId),
      };
    });
    if (currentUser) {
      const certDocRef = doc(db, 'users', currentUser.uid, 'certificates', certId);
      deleteDoc(certDocRef).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/certificates/${certId}`);
      });
    }
    if (selectedCertificateId === certId) {
      setSelectedCertificateId(null);
    }
  };

  const toggleCertificateVerification = (certId: string) => {
    updateCurrentRoadmapState(roadmap => {
      const updated = (roadmap.certifications || []).map(c => {
        if (c.id === certId) {
          return { ...c, verified: !c.verified };
        }
        return c;
      });
      return { ...roadmap, certifications: updated };
    });
  };

  const createNewRoadmap = async (
    title: string,
    options?: {
      industry?: string;
      timelineMonths?: number;
      currentSkills?: string[];
      weeklyHours?: number;
    }
  ) => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const generated = await requestRoadmapGeneration(title, options);
      setAllRoadmaps(prev => [generated, ...prev]);
      setActiveRoadmapId(generated.id);
      setViewMode('timeline');
      syncRoadmapToCloud(generated);
    } catch (err: any) {
      console.error('Failed to create roadmap:', err);
      setGenerationError(err?.message || 'Error generating roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetCurrentRoadmapToDefault = () => {
    const original = PRESET_ROADMAPS.find(r => r.id === activeRoadmapId);
    if (original) {
      setAllRoadmaps(prev => prev.map(r => (r.id === activeRoadmapId ? JSON.parse(JSON.stringify(original)) : r)));
    }
  };

  const exportRoadmapJson = () => {
    return JSON.stringify(enrichedRoadmap, null, 2);
  };

  const importRoadmapJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr) as JobRoadmap;
      if (parsed.id && parsed.title && Array.isArray(parsed.stages) && Array.isArray(parsed.skills)) {
        parsed.id = `imported-${Date.now()}`;
        setAllRoadmaps(prev => [parsed, ...prev]);
        setActiveRoadmapId(parsed.id);
        syncRoadmapToCloud(parsed);
        return true;
      }
    } catch (e) {
      console.error('Failed to parse imported JSON:', e);
    }
    return false;
  };

  // Daily study sprints for active roadmap
  const currentSprints = useMemo(() => {
    const fromMap = sprintsMap[activeRoadmapId];
    if (fromMap && fromMap.length > 0) {
      return fromMap;
    }
    return generateDailyStudySprints(enrichedRoadmap);
  }, [sprintsMap, activeRoadmapId, enrichedRoadmap]);

  const toggleSprintCompleted = (sprintId: string) => {
    setSprintsMap(prev => {
      const list = prev[activeRoadmapId] || currentSprints;
      const updated = list.map(sp => {
        if (sp.id === sprintId) {
          const nextCompleted = !sp.completed;
          return {
            ...sp,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return sp;
      });
      return { ...prev, [activeRoadmapId]: updated };
    });
  };

  const resetSprintsForCurrentRoadmap = () => {
    const freshlyGenerated = generateDailyStudySprints(enrichedRoadmap);
    setSprintsMap(prev => ({
      ...prev,
      [activeRoadmapId]: freshlyGenerated,
    }));
  };

  const completedSprintsCount = currentSprints.filter(s => s.completed).length;
  const sprintStreakDays = completedSprintsCount > 0 ? Math.min(completedSprintsCount, 7) : 0;

  // Portfolio Project Lab
  const addPortfolioProject = (project: PortfolioProject) => {
    setPortfolioProjects(prev => {
      const filtered = prev.filter(p => p.id !== project.id);
      return [project, ...filtered];
    });
  };

  const updateProjectStatus = (projectId: string, status: 'idea' | 'in_progress' | 'completed') => {
    setPortfolioProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, status } : p))
    );
  };

  const generateProjectForSkill = (skillId: string): PortfolioProject => {
    const targetSkill = enrichedRoadmap.skills.find(s => s.id === skillId) || {
      id: skillId,
      name: 'Specialized Engineering Competency',
      category: 'Core Engineering',
      currentLevel: 2,
      targetLevel: 5,
      verifiedLevel: 2,
      description: 'Core domain capability',
      prerequisites: [],
      keyTopics: ['Architecture', 'Implementation', 'Benchmarking'],
      tierLevel: 2,
      gapStatus: 'missing' as const,
    };

    const newProject = generatePortfolioProjectForSkill(targetSkill, enrichedRoadmap);
    addPortfolioProject(newProject);
    return newProject;
  };

  // Skill Verification & Badges
  const recordQuizPass = (skillId: string, score: number): SkillBadge => {
    const targetSkill = enrichedRoadmap.skills.find(s => s.id === skillId);
    const skillName = targetSkill ? targetSkill.name : 'Technical Competency';
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const verificationCode = `VERIFIED-${randomHex}-${Date.now().toString(36).toUpperCase()}`;

    const newBadge: SkillBadge = {
      id: `badge-${skillId}-${Date.now()}`,
      skillId,
      skillName,
      score,
      passedAt: new Date().toISOString(),
      verificationCode,
    };

    setVerifiedBadges(prev => {
      const filtered = prev.filter(b => b.skillId !== skillId);
      return [newBadge, ...filtered];
    });

    // Directly flip skill to possessed and boost readiness index live!
    setSkillGapStatus(skillId, 'possessed');

    return newBadge;
  };

  const hasVerifiedBadge = (skillId: string): boolean => {
    return verifiedBadges.some(b => b.skillId === skillId);
  };

  return (
    <RoadmapContext.Provider
      value={{
        currentRoadmap: enrichedRoadmap,
        allRoadmaps,
        viewMode,
        setViewMode,
        selectedMilestoneId,
        setSelectedMilestoneId,
        selectedSkillId,
        setSelectedSkillId,
        selectedCertificateId,
        setSelectedCertificateId,
        isGenerating,
        generationError,
        currentUser,
        isAuthReady,
        cloudSyncStatus,
        login,
        loginWithEmail,
        registerWithEmail,
        sendPasswordReset,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        openAuthModal,
        authModalInitialMode,
        switchRoadmap,
        updateMilestoneStatus,
        toggleDeliverable,
        updateMilestoneNotes,
        addCustomMilestone,
        adjustSkillLevel,
        toggleSkillPossessed,
        setSkillGapStatus,
        toggleResourceCompleted,
        recalculateTimeline,
        updateUserSkills,
        uploadCertificate,
        deleteCertificate,
        toggleCertificateVerification,
        createNewRoadmap,
        resetCurrentRoadmapToDefault,
        exportRoadmapJson,
        importRoadmapJson,
        sprints: currentSprints,
        toggleSprintCompleted,
        resetSprintsForCurrentRoadmap,
        sprintStreakDays,
        completedSprintsCount,
        portfolioProjects,
        addPortfolioProject,
        updateProjectStatus,
        generateProjectForSkill,
        verifiedBadges,
        recordQuizPass,
        hasVerifiedBadge,
        stats,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};
