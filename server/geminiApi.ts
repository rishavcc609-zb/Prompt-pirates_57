import { GoogleGenAI, Type } from '@google/genai';
import { JobRoadmap, SkillGapStatus, MonthPlan } from '../src/types/roadmap';

export async function generateCareerRoadmapWithGemini(
  jobTitle: string,
  userContext?: {
    timelineMonths?: number;
    currentSkills?: string[];
    weeklyHours?: number;
    industry?: string;
  }
): Promise<JobRoadmap> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const timelineMonths = userContext?.timelineMonths || 12;
  const currentSkillsList = userContext?.currentSkills || [];
  const weeklyHours = userContext?.weeklyHours || 15;
  const industry = userContext?.industry || 'Frontier & Advanced Technology';

  const prompt = `You are an elite frontier engineering career architect.
A user wants to land their dream job role:
TARGET JOB ROLE: "${jobTitle}"
TARGET TIMELINE: ${timelineMonths} months (${weeklyHours} hours/week study commitment)
USER'S CURRENT SKILLS: ${currentSkillsList.length > 0 ? JSON.stringify(currentSkillsList) : 'None specified / Beginner starting from scratch'}
INDUSTRY: "${industry}"

Perform reverse-engineering career architecture:
1. EXTRACT REQUIRED SKILLS & REVERSE-ENGINEER PREREQUISITES BACKWARDS:
   - Level 0 (Peak): The Goal (${jobTitle}).
   - Level 1 (Specialized Pinnacle Capstone): 2-3 elite domain systems skills directly required for the goal.
   - Level 2 (Advanced Core Competencies): 2-3 technical engineering competencies that serve as prerequisites for Level 1.
   - Level 3 (Foundational Core Prerequisites): 2-3 foundational math/systems/programming prerequisites needed for Level 2.
   - For each skill, list its prerequisite skill IDs (pointing to skills in lower tiers) so they form a clean DAG culminating in the goal.

2. PERFORM SKILL GAP ANALYSIS:
   - Compare each required skill against the user's current skills: ${JSON.stringify(currentSkillsList)}.
   - Mark gapStatus as "possessed" (already proficient), "partial" (some overlap, needs domain upgrade), or "missing" (critical gap).
   - Estimate hours needed to bridge the gap.

3. GENERATE MONTH-WISE ROADMAP WITH RESOURCES:
   - Divide the ${timelineMonths} months into ${Math.min(timelineMonths, 8)} structured month modules (e.g. Month 1, Month 2... up to Month ${timelineMonths}).
   - For each month, specify the theme, focus skills, concrete milestone deliverables, and 2-3 REAL, curated learning resources (Courses e.g. MIT OCW/Coursera, Books, Official Documentation, Research Papers, or GitHub benchmark repos).

4. CERTIFICATIONS & STAGES:
   - 2-3 prestigious real-world certifications for this niche.
   - 3-4 chronological strategic career phases matching the timeline.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: 'You are an expert career architect specializing in technical reverse-engineering, prerequisite skill trees, gap analysis, and month-wise resource roadmaps. Output strict JSON adhering to schema.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          industry: { type: Type.STRING },
          summary: { type: Type.STRING },
          salaryRange: { type: Type.STRING },
          marketDemand: { type: Type.STRING },
          requiredDegreeOrEquivalent: { type: Type.STRING },
          keyResponsibilities: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                tierLevel: { type: Type.INTEGER, description: '1 for Capstone/Specialized, 2 for Advanced Core, 3 for Foundations' },
                currentLevel: { type: Type.INTEGER },
                targetLevel: { type: Type.INTEGER },
                gapStatus: { type: Type.STRING, enum: ['possessed', 'partial', 'missing'] },
                matchReason: { type: Type.STRING },
                estimatedHoursToBridge: { type: Type.INTEGER },
                description: { type: Type.STRING },
                prerequisites: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                keyTopics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['id', 'name', 'category', 'tierLevel', 'currentLevel', 'targetLevel', 'gapStatus', 'matchReason', 'estimatedHoursToBridge', 'description', 'prerequisites', 'keyTopics']
            }
          },
          monthPlans: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                monthNumber: { type: Type.INTEGER },
                title: { type: Type.STRING },
                theme: { type: Type.STRING },
                weeklyHoursTarget: { type: Type.INTEGER },
                focusSkillIds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                milestones: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      difficulty: { type: Type.STRING },
                      deliverables: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      }
                    },
                    required: ['id', 'title', 'description', 'difficulty', 'deliverables']
                  }
                },
                resources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ['Course', 'Book', 'Documentation', 'Paper', 'Project', 'Certification'] },
                      provider: { type: Type.STRING },
                      estimatedHours: { type: Type.INTEGER }
                    },
                    required: ['id', 'title', 'type', 'provider', 'estimatedHours']
                  }
                }
              },
              required: ['id', 'monthNumber', 'title', 'theme', 'weeklyHoursTarget', 'focusSkillIds', 'milestones', 'resources']
            }
          },
          recommendedCertifications: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                issuer: { type: Type.STRING },
                estimatedCost: { type: Type.STRING },
                relevance: { type: Type.STRING },
                linkedSkillIds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['id', 'name', 'issuer', 'estimatedCost', 'relevance', 'linkedSkillIds']
            }
          }
        },
        required: ['title', 'industry', 'summary', 'salaryRange', 'marketDemand', 'requiredDegreeOrEquivalent', 'keyResponsibilities', 'skills', 'monthPlans', 'recommendedCertifications']
      }
    }
  });

  const rawJson = response.text;
  if (!rawJson) {
    throw new Error('Gemini API returned empty response');
  }

  const parsed = JSON.parse(rawJson);
  const now = new Date().toISOString().split('T')[0];

  // Compute Gap Analysis Summary
  let possessedCount = 0;
  let partialCount = 0;
  let missingCount = 0;
  let totalBridgeHours = 0;

  const sanitizedSkills = (parsed.skills || []).map((skill: any, sIdx: number) => {
    const gap = (['possessed', 'partial', 'missing'].includes(skill.gapStatus)
      ? skill.gapStatus
      : 'missing') as SkillGapStatus;

    if (gap === 'possessed') possessedCount++;
    else if (gap === 'partial') partialCount++;
    else missingCount++;

    const hours = skill.estimatedHoursToBridge || (gap === 'possessed' ? 0 : gap === 'partial' ? 40 : 80);
    totalBridgeHours += hours;

    const baseLevel = gap === 'possessed' ? (skill.targetLevel || 4) : gap === 'partial' ? 2 : 1;

    return {
      id: skill.id || `skill-${sIdx + 1}`,
      name: skill.name,
      category: skill.category || 'Domain Competency',
      tierLevel: skill.tierLevel || (sIdx < 2 ? 1 : sIdx < 5 ? 2 : 3),
      currentLevel: Math.max(1, Math.min(5, baseLevel)) as any,
      targetLevel: Math.max(1, Math.min(5, skill.targetLevel || 5)) as any,
      verifiedLevel: Math.max(1, Math.min(5, baseLevel)) as any,
      gapStatus: gap,
      matchReason: skill.matchReason || (gap === 'possessed' ? 'Matches your current skills' : 'Target capability to acquire'),
      estimatedHoursToBridge: hours,
      description: skill.description || '',
      prerequisites: skill.prerequisites || [],
      keyTopics: skill.keyTopics || []
    };
  });

  const totalSkills = sanitizedSkills.length || 1;
  const readinessQuotient = Math.round(((possessedCount * 1.0 + partialCount * 0.5) / totalSkills) * 100);

  // Month Plans sanitize
  const sanitizedMonthPlans: MonthPlan[] = (parsed.monthPlans || []).map((m: any, mIdx: number) => ({
    id: m.id || `month-${m.monthNumber || mIdx + 1}`,
    monthNumber: m.monthNumber || mIdx + 1,
    title: m.title || `Month ${mIdx + 1}`,
    theme: m.theme || 'Core Skill Mastery',
    weeklyHoursTarget: m.weeklyHoursTarget || weeklyHours,
    focusSkillIds: m.focusSkillIds || [],
    completed: false,
    milestones: (m.milestones || []).map((ms: any, msIdx: number) => ({
      id: ms.id || `ms-m${mIdx + 1}-${msIdx + 1}`,
      stageId: `month-${m.monthNumber || mIdx + 1}`,
      title: ms.title,
      description: ms.description || '',
      status: 'not_started' as const,
      difficulty: ms.difficulty || 'Intermediate',
      targetTimeframe: `Month ${m.monthNumber || mIdx + 1}`,
      deliverables: ms.deliverables || ['Complete hands-on lab and project checkpoint'],
      completedDeliverables: [],
      linkedSkillIds: m.focusSkillIds || []
    })),
    resources: (m.resources || []).map((r: any, rIdx: number) => ({
      id: r.id || `res-m${mIdx + 1}-${rIdx + 1}`,
      title: r.title,
      type: r.type || 'Course',
      provider: r.provider || 'Technical Documentation',
      estimatedHours: r.estimatedHours || 15,
      completed: false,
      linkedSkillId: m.focusSkillIds?.[0]
    }))
  }));

  // Build traditional stages from month plans for compatibility
  const stages = [
    {
      id: 'stage-1',
      stageIndex: 1,
      title: 'Foundations & Prerequisite Core',
      timeframe: `Months 1 - ${Math.max(1, Math.round(timelineMonths * 0.3))}`,
      objective: 'Acquire root theoretical foundations and eliminate foundational skill gaps.',
      milestones: sanitizedMonthPlans.slice(0, Math.max(1, Math.round(sanitizedMonthPlans.length * 0.3))).flatMap(m => m.milestones)
    },
    {
      id: 'stage-2',
      stageIndex: 2,
      title: 'Advanced Technical Specialization',
      timeframe: `Months ${Math.round(timelineMonths * 0.3) + 1} - ${Math.round(timelineMonths * 0.7)}`,
      objective: 'Build intermediate systems, optimize performance, and bridge partial gaps.',
      milestones: sanitizedMonthPlans.slice(Math.round(sanitizedMonthPlans.length * 0.3), Math.round(sanitizedMonthPlans.length * 0.7)).flatMap(m => m.milestones)
    },
    {
      id: 'stage-3',
      stageIndex: 3,
      title: 'Capstone Engineering & Peak Readiness',
      timeframe: `Months ${Math.round(timelineMonths * 0.7) + 1} - ${timelineMonths}`,
      objective: 'Lead domain implementations, pass credentials, and achieve goal requirements.',
      milestones: sanitizedMonthPlans.slice(Math.round(sanitizedMonthPlans.length * 0.7)).flatMap(m => m.milestones)
    }
  ];

  return {
    id: `roadmap-${Date.now()}`,
    title: parsed.title || jobTitle,
    slug: (parsed.title || jobTitle).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    industry: parsed.industry || industry,
    summary: parsed.summary || `Reverse-engineered roadmap for ${jobTitle}`,
    targetHorizon: `${timelineMonths} Months`,
    targetTimelineMonths: timelineMonths,
    weeklyStudyHours: weeklyHours,
    salaryRange: parsed.salaryRange || '$185,000 - $275,000 / yr',
    marketDemand: parsed.marketDemand || 'High Growth Specialty',
    requiredDegreeOrEquivalent: parsed.requiredDegreeOrEquivalent || 'B.S./M.S. or equivalent proven experience',
    userCurrentSkills: currentSkillsList,
    keyResponsibilities: parsed.keyResponsibilities || [],
    stages,
    skills: sanitizedSkills,
    monthPlans: sanitizedMonthPlans,
    gapAnalysisSummary: {
      possessedCount,
      partialCount,
      missingCount,
      totalRequiredSkills: totalSkills,
      estimatedTotalHoursToBridge: totalBridgeHours,
      currentReadinessQuotient: readinessQuotient
    },
    certifications: [],
    recommendedCertifications: (parsed.recommendedCertifications || []).map((rc: any, idx: number) => ({
      id: rc.id || `rc-${idx + 1}`,
      name: rc.name,
      issuer: rc.issuer,
      estimatedCost: rc.estimatedCost || '$400',
      relevance: rc.relevance || 'Industry recognized credential',
      linkedSkillIds: rc.linkedSkillIds || []
    })),
    createdAt: now,
    lastUpdated: now,
    isCustom: true
  };
}
