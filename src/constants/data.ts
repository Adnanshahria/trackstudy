import { SyllabusData, TrackableItem } from '../types';
import { HSC_SYLLABUS_DATA } from './syllabus/hsc';
import { SSC_SYLLABUS_DATA } from './syllabus/ssc';

export { HSC_SYLLABUS_DATA, SSC_SYLLABUS_DATA };

export const SYLLABUS_REGISTRY = {
  HSC: HSC_SYLLABUS_DATA,
  SSC: SSC_SYLLABUS_DATA
};

export const getSyllabusData = (level: 'HSC' | 'SSC'): SyllabusData => {
  return SYLLABUS_REGISTRY[level] || HSC_SYLLABUS_DATA;
};

// @deprecated Use HSC_SYLLABUS_DATA or SYLLABUS_REGISTRY instead
export const INITIAL_SYLLABUS_DATA = HSC_SYLLABUS_DATA;

export const TRACKABLE_ITEMS: TrackableItem[] = [
  { name: "Lecture", color: "bg-sky-500", key: "mainbook" },
  { name: "Book", color: "bg-blue-500", key: "class" },
  { name: "Resource 1", color: "bg-indigo-500", key: "revclass" },
  { name: "Resource 2", color: "bg-teal-500", key: "meditrics" },
  { name: "Resource 3", color: "bg-amber-500", key: "mqb" },
  { name: "Resource 4", color: "bg-rose-500", key: "sfexam" },
  { name: "Resource 5", color: "bg-violet-500", key: "rev1" },
  { name: "Resource 6", color: "bg-purple-500", key: "rev2" }
];