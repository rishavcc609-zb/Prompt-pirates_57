import { JobRoadmap, MonthPlan, SkillCompetency, LearningResource, SkillGapStatus } from '../types/roadmap';

export interface GenerationParams {
  industry?: string;
  timelineMonths?: number;
  currentSkills?: string[];
  weeklyHours?: number;
}

export async function requestRoadmapGeneration(
  jobTitle: string,
  context?: GenerationParams
): Promise<JobRoadmap> {
  try {
    const res = await fetch('/api/roadmap/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobTitle,
        industry: context?.industry,
        timelineMonths: context?.timelineMonths || 12,
        currentSkills: context?.currentSkills || [],
        weeklyHours: context?.weeklyHours || 15,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.roadmap) {
        return data.roadmap;
      }
    }
  } catch (err) {
    console.warn('Server generation unavailable, activating client synthesis engine...', err);
  }

  return generateSyntheticRoadmap(jobTitle, context);
}

/**
 * Intelligent client-side reverse-engineering fallback generator
 */
export function generateSyntheticRoadmap(
  jobTitle: string,
  context?: GenerationParams
): JobRoadmap {
  const cleanTitle = jobTitle.trim();
  const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const now = new Date().toISOString().split('T')[0];
  const timelineMonths = context?.timelineMonths || 12;
  const weeklyHours = context?.weeklyHours || 15;
  const currentSkills = context?.currentSkills || [];
  const industry = context?.industry || 'Frontier Systems & Deep-Tech';

  // Domain keywords based on title
  const words = cleanTitle.split(' ');
  const primaryDomain = words[0] || 'Core';
  const secondaryDomain = words[1] || 'Systems';

  // Reverse engineered hierarchical skill levels (Goal on Top = 0)
  // Level 1: Specialized Pinnacle (Top)
  // Level 2: Core Engineering (Middle)
  // Level 3: Theoretical Foundations (Bottom)
  const requiredSkillsRaw = [
    {
      id: 'sk-capstone-1',
      name: `${cleanTitle} Architecture & Synthesis`,
      category: 'Pinnacle Systems',
      tierLevel: 1,
      targetLevel: 5 as const,
      description: `Autonomous leadership and system-level synthesis in high-consequence ${cleanTitle.toLowerCase()} environments.`,
      prerequisites: ['sk-core-1', 'sk-core-2'],
      keyTopics: ['System FMEA', 'Mission Autonomy', 'Fault Mitigation', 'Architectural Specs'],
      hours: 90
    },
    {
      id: 'sk-capstone-2',
      name: `Real-Time Deterministic ${secondaryDomain} Pipelines`,
      category: 'Pinnacle Systems',
      tierLevel: 1,
      targetLevel: 5 as const,
      description: 'Zero-downtime deterministic execution, microsecond latency budget control, and hardware integration.',
      prerequisites: ['sk-core-2', 'sk-core-3'],
      keyTopics: ['Real-Time Kernels', 'Zero-Copy IPC', 'Deterministic QoS', 'Hardware Sync'],
      hours: 80
    },
    {
      id: 'sk-core-1',
      name: `Advanced ${primaryDomain} Algorithm Modeling`,
      category: 'Applied Engineering',
      tierLevel: 2,
      targetLevel: 4 as const,
      description: 'Algorithmic state estimation, optimization routines, and stochastic domain modeling.',
      prerequisites: ['sk-found-1', 'sk-found-2'],
      keyTopics: ['Nonlinear Optimization', 'State Estimation', 'Algorithmic Profiling'],
      hours: 60
    },
    {
      id: 'sk-core-2',
      name: 'High-Performance Systems & Modern C++/Rust',
      category: 'Applied Engineering',
      tierLevel: 2,
      targetLevel: 4 as const,
      description: 'Memory safety, SIMD vectorization, concurrency models, and low-level device interfacing.',
      prerequisites: ['sk-found-2', 'sk-found-3'],
      keyTopics: ['RAII Memory Models', 'SIMD Intrinsics', 'Lock-Free Queues', 'Async Runtimes'],
      hours: 50
    },
    {
      id: 'sk-core-3',
      name: 'Verification, Hardware-in-the-Loop & Benchmarking',
      category: 'Applied Engineering',
      tierLevel: 2,
      targetLevel: 4 as const,
      description: 'Automated continuous fuzzing, simulated environments, and physical bench test execution.',
      prerequisites: ['sk-found-1', 'sk-found-3'],
      keyTopics: ['HIL Simulation', 'Continuous Fuzzing', 'Regression Testing', 'Telemetry Tracing'],
      hours: 45
    },
    {
      id: 'sk-found-1',
      name: 'Applied Linear Algebra & Numerical Methods',
      category: 'Foundations',
      tierLevel: 3,
      targetLevel: 4 as const,
      description: 'Matrix decompositions, spectral analysis, differential equations, and numerical stability.',
      prerequisites: [],
      keyTopics: ['SVD Decomposition', 'Eigenvalues', 'Numerical ODEs', 'Vector Spaces'],
      hours: 35
    },
    {
      id: 'sk-found-2',
      name: 'Data Structures & Algorithmic Complexity',
      category: 'Foundations',
      tierLevel: 3,
      targetLevel: 4 as const,
      description: 'Asymptotic notation, graph algorithms, dynamic programming, and cache-conscious layout.',
      prerequisites: [],
      keyTopics: ['Graph Traversals', 'Cache Locality', 'Dynamic Programming', 'B-Trees'],
      hours: 30
    },
    {
      id: 'sk-found-3',
      name: 'Computer Architecture & Operating System Internals',
      category: 'Foundations',
      tierLevel: 3,
      targetLevel: 4 as const,
      description: 'Virtual memory paging, cache hierarchies, interrupts, and POSIX system call tracing.',
      prerequisites: [],
      keyTopics: ['Virtual Memory', 'L1/L2/L3 Caching', 'Context Switching', 'Syscall Tracing'],
      hours: 30
    }
  ];

  // Perform Gap Analysis against user's current skills
  const normalizedUserSkills = currentSkills.map(s => s.toLowerCase().trim());

  let possessedCount = 0;
  let partialCount = 0;
  let missingCount = 0;
  let totalBridgeHours = 0;

  const skills: SkillCompetency[] = requiredSkillsRaw.map(sk => {
    const skillNameLower = sk.name.toLowerCase();
    const isDirectMatch = normalizedUserSkills.some(us => 
      skillNameLower.includes(us) || us.includes(skillNameLower.split(' ')[0].toLowerCase())
    );
    const isPartialMatch = !isDirectMatch && normalizedUserSkills.some(us => 
      sk.keyTopics.some(topic => topic.toLowerCase().includes(us) || us.includes(topic.toLowerCase()))
    );

    let gapStatus: SkillGapStatus = 'missing';
    let currentLevel: any = 1;
    let matchReason = `Target competency needed for ${cleanTitle}.`;
    let hours = sk.hours;

    if (isDirectMatch) {
      gapStatus = 'possessed';
      currentLevel = Math.min(5, sk.targetLevel);
      matchReason = 'Directly matches your documented skill background.';
      hours = 0;
      possessedCount++;
    } else if (isPartialMatch) {
      gapStatus = 'partial';
      currentLevel = 2;
      matchReason = 'Foundational background present; requires domain-specific specialization.';
      hours = Math.round(sk.hours * 0.5);
      partialCount++;
    } else {
      missingCount++;
    }

    totalBridgeHours += hours;

    return {
      id: sk.id,
      name: sk.name,
      category: sk.category,
      tierLevel: sk.tierLevel,
      currentLevel,
      targetLevel: sk.targetLevel,
      verifiedLevel: currentLevel,
      gapStatus,
      matchReason,
      estimatedHoursToBridge: hours,
      description: sk.description,
      prerequisites: sk.prerequisites,
      keyTopics: sk.keyTopics
    };
  });

  const totalSkillsCount = skills.length;
  const readinessQuotient = Math.round(((possessedCount * 1.0 + partialCount * 0.5) / totalSkillsCount) * 100);

  // Generate Month-wise Roadmap with Resources
  const monthCount = Math.max(3, Math.min(timelineMonths, 12));
  const monthPlans: MonthPlan[] = [];

  for (let m = 1; m <= monthCount; m++) {
    const isEarly = m <= Math.ceil(monthCount * 0.33);
    const isMid = m > Math.ceil(monthCount * 0.33) && m <= Math.ceil(monthCount * 0.66);

    const theme = isEarly
      ? 'Foundations & Mathematical Tooling'
      : isMid
      ? 'Advanced Subsystem Implementation & Integration'
      : 'Capstone Systems Mastery & Mission Readiness';

    const focusSkills = isEarly
      ? ['sk-found-1', 'sk-found-2', 'sk-found-3']
      : isMid
      ? ['sk-core-1', 'sk-core-2', 'sk-core-3']
      : ['sk-capstone-1', 'sk-capstone-2'];

    const resources: LearningResource[] = [
      {
        id: `res-${m}-1`,
        title: isEarly
          ? `MIT OCW: Foundations of ${primaryDomain} & Linear Algebra`
          : isMid
          ? `High-Performance ${secondaryDomain} Systems in C++ and Rust`
          : `Advanced IEEE Transactions: ${cleanTitle} State of the Art`,
        type: isEarly ? 'Course' : isMid ? 'Book' : 'Paper',
        provider: isEarly ? 'MIT OpenCourseWare' : isMid ? "O'Reilly Media" : 'IEEE Xplore',
        estimatedHours: Math.round(weeklyHours * 2),
        completed: false,
        linkedSkillId: focusSkills[0]
      },
      {
        id: `res-${m}-2`,
        title: isEarly
          ? 'Algorithms & Hardware Cache Optimization Documentation'
          : isMid
          ? `${cleanTitle} Benchmark Test Harness Repository`
          : 'National Industry Standards & Compliance Framework',
        type: isEarly ? 'Documentation' : isMid ? 'Project' : 'Documentation',
        provider: isEarly ? 'Official Documentation' : isMid ? 'GitHub Open Source' : 'Industry Standards Body',
        estimatedHours: Math.round(weeklyHours * 1.5),
        completed: false,
        linkedSkillId: focusSkills[1] || focusSkills[0]
      }
    ];

    monthPlans.push({
      id: `month-${m}`,
      monthNumber: m,
      title: `Month ${m}: ${isEarly ? 'Foundations Sprint' : isMid ? 'Core Systems Specialization' : 'Capstone Production Polish'}`,
      theme,
      weeklyHoursTarget: weeklyHours,
      focusSkillIds: focusSkills,
      completed: false,
      milestones: [
        {
          id: `ms-synth-${m}-1`,
          stageId: `month-${m}`,
          title: isEarly
            ? `Implement and benchmark mathematical foundations for ${primaryDomain}`
            : isMid
            ? `Construct working end-to-end prototype pipeline with telemetry`
            : `Lead high-stakes qualification audit and production capstone trial`,
          description: `Deliver verifiable artifact meeting industrial standard criteria for Month ${m}.`,
          status: 'not_started',
          difficulty: isEarly ? 'Foundational' : isMid ? 'Advanced' : 'Pinnacle',
          targetTimeframe: `Month ${m}`,
          deliverables: [
            `Pass 100% of automated unit test specifications for Month ${m}`,
            `Document latency, memory footprint, and architectural tradeoffs in technical report`
          ],
          completedDeliverables: [],
          linkedSkillIds: focusSkills
        }
      ],
      resources
    });
  }

  // Generate traditional phases for overview compatibility
  const stages = [
    {
      id: 'stg-1',
      stageIndex: 1,
      title: 'Phase 1: Foundational Prerequisites',
      timeframe: `Months 1 - ${Math.max(1, Math.round(timelineMonths * 0.33))}`,
      objective: 'Bridge core mathematical and low-level computer science foundations.',
      milestones: monthPlans.slice(0, Math.max(1, Math.round(monthCount * 0.33))).flatMap(m => m.milestones)
    },
    {
      id: 'stg-2',
      stageIndex: 2,
      title: 'Phase 2: Core Engineering Competencies',
      timeframe: `Months ${Math.round(timelineMonths * 0.33) + 1} - ${Math.round(timelineMonths * 0.66)}`,
      objective: 'Develop high-performance systems and domain-specific modeling.',
      milestones: monthPlans.slice(Math.round(monthCount * 0.33), Math.round(monthCount * 0.66)).flatMap(m => m.milestones)
    },
    {
      id: 'stg-3',
      stageIndex: 3,
      title: 'Phase 3: Pinnacle Role Mastery',
      timeframe: `Months ${Math.round(timelineMonths * 0.66) + 1} - ${timelineMonths}`,
      objective: 'Achieve production-grade capstone leadership and industry credentials.',
      milestones: monthPlans.slice(Math.round(monthCount * 0.66)).flatMap(m => m.milestones)
    }
  ];

  return {
    id: `custom-${Date.now()}`,
    title: cleanTitle,
    slug,
    industry,
    summary: `Reverse-engineered qualification roadmap for ${cleanTitle}. Deconstructs target goal into structured prerequisite tiers, maps skill gaps against your current profile, and establishes month-wise execution pacing.`,
    targetHorizon: `${timelineMonths} Months`,
    targetTimelineMonths: timelineMonths,
    weeklyStudyHours: weeklyHours,
    salaryRange: '$185,000 - $280,000 / yr',
    marketDemand: 'Frontier High-Growth Specialty (+36% YoY)',
    requiredDegreeOrEquivalent: 'M.S. or proven equivalent engineering track record',
    userCurrentSkills: currentSkills,
    keyResponsibilities: [
      `Direct architecture and reliability protocols for mission-critical ${cleanTitle.toLowerCase()} projects`,
      'Decompose complex technical goals into verifiable prerequisite engineering pipelines',
      'Ensure zero-downtime integration and adherence to international industry standards'
    ],
    stages,
    skills,
    monthPlans,
    gapAnalysisSummary: {
      possessedCount,
      partialCount,
      missingCount,
      totalRequiredSkills: totalSkillsCount,
      estimatedTotalHoursToBridge: totalBridgeHours,
      currentReadinessQuotient: readinessQuotient
    },
    certifications: [],
    recommendedCertifications: [
      {
        id: 'rec-1',
        name: `Professional Certificate in ${cleanTitle}`,
        issuer: 'IEEE / ACM Professional Consortium',
        estimatedCost: '$495',
        relevance: 'Benchmark industry verification for principal practitioners.',
        linkedSkillIds: ['sk-capstone-1']
      },
      {
        id: 'rec-2',
        name: 'Principal Systems Engineering Board Certification',
        issuer: 'INCOSE (International Council on Systems Engineering)',
        estimatedCost: '$650',
        relevance: 'Recognized validation of architecture governance in complex disciplines.',
        linkedSkillIds: ['sk-capstone-2']
      }
    ],
    createdAt: now,
    lastUpdated: now,
    isCustom: true
  };
}

/**
 * Live Recalculation Engine:
 * When the user adjusts the timeline (e.g. from 12 months down to 6 months or up to 24 months),
 * recalculates weekly study commitment, re-paces month plans, updates target dates,
 * and maintains progress state.
 */
export function recalculateRoadmapForNewTimeline(
  roadmap: JobRoadmap,
  newTimelineMonths: number
): JobRoadmap {
  const currentMonths = roadmap.targetTimelineMonths || 12;
  const ratio = currentMonths / newTimelineMonths;
  
  // Recalculate weekly hours needed to cover remaining gap hours
  const remainingHours = roadmap.gapAnalysisSummary?.estimatedTotalHoursToBridge || 250;
  const totalWeeks = Math.max(4, newTimelineMonths * 4.3);
  const newWeeklyHours = Math.max(5, Math.min(60, Math.round(remainingHours / totalWeeks * 1.3)));

  // Re-scale month plans
  const targetMonthCount = Math.max(2, Math.min(newTimelineMonths, 12));
  const existingPlans = roadmap.monthPlans || [];
  
  const reallocatedMonthPlans: MonthPlan[] = [];

  for (let m = 1; m <= targetMonthCount; m++) {
    const existingIndex = Math.min(
      existingPlans.length - 1,
      Math.floor(((m - 1) / targetMonthCount) * existingPlans.length)
    );
    const basePlan = existingPlans[existingIndex] || existingPlans[0];

    reallocatedMonthPlans.push({
      ...basePlan,
      id: `month-recalc-${m}`,
      monthNumber: m,
      title: `Month ${m}: ${basePlan.theme || 'Milestone Acceleration'}`,
      weeklyHoursTarget: newWeeklyHours,
      milestones: (basePlan.milestones || []).map(ms => ({
        ...ms,
        targetTimeframe: `Month ${m}`
      }))
    });
  }

  // Update stages timeframe
  const updatedStages = roadmap.stages.map((stg, idx) => {
    const startM = Math.round((idx / roadmap.stages.length) * newTimelineMonths) + 1;
    const endM = Math.round(((idx + 1) / roadmap.stages.length) * newTimelineMonths);
    return {
      ...stg,
      timeframe: `Months ${startM} - ${endM}`
    };
  });

  return {
    ...roadmap,
    targetHorizon: `${newTimelineMonths} Months`,
    targetTimelineMonths: newTimelineMonths,
    weeklyStudyHours: newWeeklyHours,
    monthPlans: reallocatedMonthPlans,
    stages: updatedStages,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
}
