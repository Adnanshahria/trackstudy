
import { UserSettings, ProgressBarConfig } from '../types';
import { INITIAL_SYLLABUS_DATA, TRACKABLE_ITEMS } from './data';

export const DEFAULT_PROGRESS_CONFIG: ProgressBarConfig[] = [
  { id: 'p1', title: 'Concept & Learning', items: ['mainbook', 'class', 'revclass'], color: 'from-sky-400 to-sky-600', visible: true },
  { id: 'p2', title: 'Practice & Solve', items: ['meditrics', 'mqb'], color: 'from-amber-400 to-amber-600', visible: true },
  { id: 'p3', title: 'Revision & Exams', items: ['sfexam', 'rev1', 'rev2'], color: 'from-rose-400 to-rose-600', visible: true }
];

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  soundVolume: 0.3,
  glowColor: 'green', // Default Glow changed to Green
  weights: {
    mainbook: 15, class: 10, revclass: 10, meditrics: 10,
    mqb: 25, sfexam: 10, rev1: 10, rev2: 10
  },
  progressBars: JSON.parse(JSON.stringify(DEFAULT_PROGRESS_CONFIG)),
  syllabusOpenState: {},
  subjectProgressItems: TRACKABLE_ITEMS.map(t => t.key),
  customNames: {},
  trackableItems: JSON.parse(JSON.stringify(TRACKABLE_ITEMS)),
  syllabus: JSON.parse(JSON.stringify(INITIAL_SYLLABUS_DATA)),
  countdownLabel: 'Time Remaining',
  countdownTarget: '2025-12-12T00:00:00+06:00'
};