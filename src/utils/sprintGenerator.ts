/**
 * Daily Study Sprint Generator
 * Converts high-level milestones and skill competencies into actionable 45-to-90 minute micro-sprints.
 */

import { JobRoadmap, DailyStudySprint, SkillCompetency } from '../types/roadmap';

export function generateDailyStudySprints(roadmap: JobRoadmap): DailyStudySprint[] {
  const sprints: DailyStudySprint[] = [];
  const skills = roadmap.skills || [];
  const stages = roadmap.stages || [];

  // Prioritize skills that are missing or partial gaps
  const gapSkills = skills.filter(s => s.gapStatus !== 'possessed');
  const prioritizedSkills = gapSkills.length > 0 ? gapSkills : skills;

  let sprintCounter = 1;

  // 1. Generate sprints based on unachieved milestones
  stages.forEach(stage => {
    (stage.milestones || []).forEach(milestone => {
      if (milestone.status !== 'achieved') {
        const linkedSkill = skills.find(s => milestone.linkedSkillIds?.includes(s.id)) || prioritizedSkills[0];
        const skillName = linkedSkill ? linkedSkill.name : 'Core Competency';
        const skillId = linkedSkill ? linkedSkill.id : (skills[0]?.id || 'skill-1');

        // Split deliverables into focused sprints
        const deliverables = milestone.deliverables && milestone.deliverables.length > 0
          ? milestone.deliverables
          : ['Study foundational concepts and architectural patterns', 'Implement prototype and verify benchmarks'];

        deliverables.slice(0, 3).forEach((deliv, dIdx) => {
          sprints.push({
            id: `sprint-${roadmap.id}-${sprintCounter}`,
            dayNumber: sprintCounter,
            roadmapId: roadmap.id,
            skillId,
            skillName,
            stageTitle: stage.title,
            title: `${milestone.title}: ${deliv.length > 40 ? deliv.slice(0, 37) + '...' : deliv}`,
            durationMinutes: dIdx === 0 ? 60 : 75,
            objective: `Master ${skillName} by completing: ${deliv}`,
            actionItems: [
              `Review official documentation & architectural specs for ${skillName}`,
              `Write unit tests or benchmark baseline for "${deliv}"`,
              `Document key architectural trade-offs in local engineering notes`,
            ],
            deliverable: deliv,
            resourceLink: milestone.notes || undefined,
            completed: false,
            dateOffsetDays: sprintCounter - 1,
          });
          sprintCounter++;
        });
      }
    });
  });

  // 2. Ensure each gap skill has at least 1-2 dedicated deep-dive sprints
  prioritizedSkills.forEach((skill, skIdx) => {
    const existingForSkill = sprints.filter(s => s.skillId === skill.id);
    if (existingForSkill.length === 0 || sprints.length < 14) {
      const topics = skill.keyTopics && skill.keyTopics.length > 0
        ? skill.keyTopics
        : ['Fundamentals', 'Implementation', 'Production Hardening'];

      topics.slice(0, 2).forEach((topic, tIdx) => {
        sprints.push({
          id: `sprint-${roadmap.id}-${sprintCounter}`,
          dayNumber: sprintCounter,
          roadmapId: roadmap.id,
          skillId: skill.id,
          skillName: skill.name,
          stageTitle: `Gap Bridge: ${skill.category}`,
          title: `${skill.name} — ${topic} Deep Dive`,
          durationMinutes: 60,
          objective: `Bridge competence gap in ${skill.name} focusing on ${topic}`,
          actionItems: [
            `Analyze real-world implementation patterns for ${topic}`,
            `Construct minimal reproducible example or sandbox exercise`,
            `Prepare for technical quiz verification and portfolio integration`,
          ],
          deliverable: `Working code snippet and technical breakdown for ${topic}`,
          completed: false,
          dateOffsetDays: sprintCounter - 1,
        });
        sprintCounter++;
      });
    }
  });

  // Limit to a standard rolling 14-day sprint queue if exceeded
  return sprints.slice(0, 21);
}
