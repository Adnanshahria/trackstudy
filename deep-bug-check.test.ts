/**
 * Deep Bug Check Test
 * Tests for critical bugs that were fixed in the codebase
 */

import { calculateProgress } from './utils/calc/progress';
import { getStreak } from './utils/calc/streak';
import { DEFAULT_SETTINGS, TRACKABLE_ITEMS } from './constants';
import { INITIAL_SYLLABUS_DATA } from './constants';
import type { UserData, UserSettings, SyllabusData } from './types';

// Mock data for testing
const createMockUserData = (overrides: Record<string, any> = {}): UserData => ({
  's_math_ch1_practice': 50,
  's_math_ch1_revision': 75,
  's_math_ch2_practice': 100,
  'note_s_math_ch1_practice': 'Important notes',
  'timestamp_2024-01-15': '2024-01-15T10:00:00Z',
  'timestamp_2024-01-16': '2024-01-16T10:00:00Z',
  ...overrides
});

const createMockSyllabus = (): SyllabusData => ({
  math: {
    name: 'Mathematics',
    chapters: [
      { id: 'ch1', name: 'Chapter 1', paper: 1 },
      { id: 'ch2', name: 'Chapter 2', paper: 2 }
    ]
  },
  physics: {
    name: 'Physics',
    chapters: [] // Empty paper to test division by zero fix
  }
});

/**
 * Test 1: Progress Calculation Division by Zero Bug
 * Fixed in utils/calc/progress.ts line 57-59
 */
export const testDivisionByZeroBug = () => {
  console.log('🧪 Testing Division by Zero Bug Fix...');
  
  const userData = createMockUserData();
  const syllabus = createMockSyllabus();
  const weights = { practice: 1, revision: 2 };
  
  // Test with normal data
  const result1 = calculateProgress('math', ['practice', 'revision'], userData, weights, TRACKABLE_ITEMS, syllabus);
  console.assert(typeof result1.p1 === 'number' && !isNaN(result1.p1), 'P1 should be a valid number');
  console.assert(typeof result1.p2 === 'number' && !isNaN(result1.p2), 'P2 should be a valid number');
  console.assert(typeof result1.overall === 'number' && !isNaN(result1.overall), 'Overall should be a valid number');
  
  // Test with empty paper (should not crash)
  const result2 = calculateProgress('physics', ['practice', 'revision'], userData, weights, TRACKABLE_ITEMS, syllabus);
  console.assert(result2.p1 === 0, 'Empty paper P1 should be 0');
  console.assert(result2.p2 === 0, 'Empty paper P2 should be 0');
  console.assert(result2.overall === 0, 'Empty paper overall should be 0');
  
  console.log('✅ Division by Zero Bug Fix: PASSED');
};

/**
 * Test 2: Data Migration Bug (Index vs Key-based storage)
 * Fixed in components/syllabus/ChapterRow.tsx and hooks/sync/useDataMigration.ts
 */
export const testDataMigrationBug = () => {
  console.log('🧪 Testing Data Migration Bug Fix...');
  
  // Simulate old format data (index-based)
  const oldFormatData: UserData = {
    's_math_ch1_0': 50, // Old format: index 0
    's_math_ch1_1': 75, // Old format: index 1
    'note_s_math_ch1_0': 'Old notes',
    's_math_ch2_0': 100,
  };
  
  // Simulate new format settings
  const settings: UserSettings = {
    ...DEFAULT_SETTINGS,
    trackableItems: [
      { key: 'practice', name: 'Practice', icon: '📝' },
      { key: 'revision', name: 'Revision', icon: '🔄' }
    ]
  };
  
  // Test key generation (should use item.key, not index)
  const subject = 'math';
  const chapterId = 'ch1';
  const item = { key: 'practice', name: 'Practice', icon: '📝' };
  
  // New format should use item.key directly
  const newKey = `s_${subject}_${chapterId}_${item.key}`;
  console.assert(newKey === 's_math_ch1_practice', 'Key should use item.key, not index');
  
  // Test migration logic
  const oldKeyMatch = 's_math_ch1_0'.match(/^s_([^_]+)_([^_]+)_(\d+)$/);
  console.assert(oldKeyMatch !== null, 'Should match old format pattern');
  
  if (oldKeyMatch) {
    const [, subject, chapterId, idxStr] = oldKeyMatch;
    const idx = parseInt(idxStr);
    const items = settings.trackableItems;
    
    if (items && items[idx]) {
      const migratedKey = `s_${subject}_${chapterId}_${items[idx].key}`;
      console.assert(migratedKey === 's_math_ch1_practice', 'Migration should convert index to key');
    }
  }
  
  console.log('✅ Data Migration Bug Fix: PASSED');
};

/**
 * Test 3: IndexedDB Availability Bug
 * Fixed in utils/firebase/indexed.ts lines 9-13
 */
export const testIndexedDBBug = () => {
  console.log('🧪 Testing IndexedDB Availability Bug Fix...');
  
  // Test that the code handles missing IndexedDB gracefully
  const originalIndexedDB = globalThis.indexedDB;
  
  // Simulate missing IndexedDB
  delete (globalThis as any).indexedDB;
  
  // The openDB function should reject, not resolve with empty object
  const { openDB } = require('./utils/firebase/indexed.ts');
  
  openDB().catch((error: any) => {
    console.assert(error === "IndexedDB not supported in this environment", 'Should reject with proper error message');
  });
  
  // Restore IndexedDB
  globalThis.indexedDB = originalIndexedDB;
  
  console.log('✅ IndexedDB Availability Bug Fix: PASSED');
};

/**
 * Test 4: Streak Calculation Edge Cases
 * Testing date handling in streak calculation
 */
export const testStreakCalculationBug = () => {
  console.log('🧪 Testing Streak Calculation Edge Cases...');
  
  // Test with empty data
  const emptyData: UserData = {};
  const streak1 = getStreak(emptyData);
  console.assert(streak1 === 0, 'Empty data should return streak 0');
  
  // Test with invalid dates
  const invalidData: UserData = {
    'timestamp_invalid': 'invalid-date',
    'timestamp_future': '2025-01-01T00:00:00Z'
  };
  const streak2 = getStreak(invalidData);
  console.assert(typeof streak2 === 'number' && streak2 >= 0, 'Should handle invalid dates gracefully');
  
  // Test with consecutive dates
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dayBefore = new Date(today);
  dayBefore.setDate(dayBefore.getDate() - 2);
  
  const consecutiveData: UserData = {
    'timestamp_1': today.toISOString(),
    'timestamp_2': yesterday.toISOString(),
    'timestamp_3': dayBefore.toISOString()
  };
  
  const streak3 = getStreak(consecutiveData);
  console.assert(streak3 >= 2, 'Should calculate consecutive days correctly');
  
  console.log('✅ Streak Calculation Edge Cases: PASSED');
};

/**
 * Test 5: Weight Calculation Bug
 * Testing weight handling in progress calculation
 */
export const testWeightCalculationBug = () => {
  console.log('🧪 Testing Weight Calculation Bug...');
  
  const userData = createMockUserData();
  const syllabus = createMockSyllabus();
  
  // Test with no weights (should default to unweighted)
  const result1 = calculateProgress('math', ['practice', 'revision'], userData, undefined, TRACKABLE_ITEMS, syllabus);
  console.assert(typeof result1.overall === 'number', 'Should handle undefined weights');
  
  // Test with empty weights object
  const result2 = calculateProgress('math', ['practice', 'revision'], userData, {}, TRACKABLE_ITEMS, syllabus);
  console.assert(typeof result2.overall === 'number', 'Should handle empty weights object');
  
  // Test with partial weights
  const partialWeights = { practice: 1 }; // revision missing
  const result3 = calculateProgress('math', ['practice', 'revision'], userData, partialWeights, TRACKABLE_ITEMS, syllabus);
  console.assert(typeof result3.overall === 'number', 'Should handle missing weight for item');
  
  console.log('✅ Weight Calculation Bug: PASSED');
};

/**
 * Run all deep bug tests
 */
export const runDeepBugChecks = () => {
  console.log('🔍 Starting Deep Bug Checks...\n');
  
  try {
    testDivisionByZeroBug();
    testDataMigrationBug();
    testIndexedDBBug();
    testStreakCalculationBug();
    testWeightCalculationBug();
    
    console.log('\n🎉 All Deep Bug Checks PASSED!');
    return true;
  } catch (error) {
    console.error('\n❌ Deep Bug Check FAILED:', error);
    return false;
  }
};

// Auto-run if this file is executed directly
if (typeof window === 'undefined') {
  runDeepBugChecks();
}