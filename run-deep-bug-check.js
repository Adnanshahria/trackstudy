#!/usr/bin/env node

/**
 * Deep Bug Check Runner
 * Executes deep bug tests for the TrackStudy application
 */

const { runDeepBugChecks } = require('./deep-bug-check.test.ts');

console.log('🚀 TrackStudy Deep Bug Checker');
console.log('=====================================\n');

// Run the tests
const allTestsPassed = runDeepBugChecks();

// Exit with appropriate code
process.exit(allTestsPassed ? 0 : 1);