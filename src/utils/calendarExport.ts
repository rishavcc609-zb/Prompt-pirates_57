/**
 * Calendar Export Utilities for PathFinder Study Sprints
 * Supports:
 * 1. RFC 5545 Compliant .ics iCalendar file generation & instant download
 * 2. One-click Google Calendar Web Intent URL generation
 */

import { DailyStudySprint } from '../types/roadmap';

function formatIcsDateTime(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generates an RFC 5545 compliant .ics file for a list of study sprints or a single sprint
 */
export function generateIcsCalendar(
  sprints: DailyStudySprint[],
  options?: {
    calendarTitle?: string;
    preferredHour?: number; // e.g. 19 for 7:00 PM
  }
): string {
  const calTitle = options?.calendarTitle || 'PathFinder Daily Study Sprints';
  const preferredHour = options?.preferredHour ?? 19; // default 7 PM
  const now = new Date();

  let icsLines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PathFinder//Career Sprint Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(calTitle)}`,
    'X-WR-TIMEZONE:UTC',
  ];

  sprints.forEach((sprint, idx) => {
    // Schedule each sprint on successive days starting today or tomorrow
    const eventDate = new Date();
    eventDate.setDate(now.getDate() + (sprint.dateOffsetDays ?? idx));
    eventDate.setHours(preferredHour, 0, 0, 0);

    const endDate = new Date(eventDate.getTime() + sprint.durationMinutes * 60 * 1000);

    const uid = `pathfinder-sprint-${sprint.id}-${Date.now()}@pathfinder.app`;
    const summary = `[PathFinder] ${sprint.title} (${sprint.skillName})`;
    const description = `Objective: ${sprint.objective}\n\nDeliverable: ${sprint.deliverable}\n\nAction Items:\n${sprint.actionItems.map(item => '• ' + item).join('\n')}${sprint.resourceLink ? `\n\nResource: ${sprint.resourceLink}` : ''}`;

    icsLines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatIcsDateTime(now)}`,
      `DTSTART:${formatIcsDateTime(eventDate)}`,
      `DTEND:${formatIcsDateTime(endDate)}`,
      `SUMMARY:${escapeIcsText(summary)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      `STATUS:CONFIRMED`,
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${escapeIcsText(sprint.title)} starts in 15 minutes`,
      'END:VALARM',
      'END:VEVENT'
    );
  });

  icsLines.push('END:VCALENDAR');
  return icsLines.join('\r\n');
}

/**
 * Triggers a browser download of the generated .ics file
 */
export function downloadIcsFile(icsContent: string, fileName = 'pathfinder-study-sprints.ics'): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a one-click Google Calendar Web Intent URL for a specific study sprint
 */
export function getGoogleCalendarIntentUrl(
  sprint: DailyStudySprint,
  options?: {
    preferredDate?: Date;
    preferredHour?: number;
  }
): string {
  const baseDate = options?.preferredDate || new Date();
  const eventDate = new Date(baseDate);
  eventDate.setDate(eventDate.getDate() + (sprint.dateOffsetDays ?? 0));
  eventDate.setHours(options?.preferredHour ?? 19, 0, 0, 0);

  const endDate = new Date(eventDate.getTime() + sprint.durationMinutes * 60 * 1000);

  const startIso = formatIcsDateTime(eventDate);
  const endIso = formatIcsDateTime(endDate);

  const title = encodeURIComponent(`[PathFinder] ${sprint.title} (${sprint.skillName})`);
  const details = encodeURIComponent(
    `Goal: ${sprint.objective}\n\nDeliverable: ${sprint.deliverable}\n\nAction Steps:\n${sprint.actionItems.map(a => '- ' + a).join('\n')}${sprint.resourceLink ? `\n\nReference: ${sprint.resourceLink}` : ''}\n\nReverse-Engineered via PathFinder`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=Deep+Work+Station`;
}
