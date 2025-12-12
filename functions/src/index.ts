/**
 * TrackStudy Cloud Functions
 * 
 * Server-side tick logging for audit history.
 * Triggered when progress documents are updated.
 * 
 * IMPORTANT: This is the ONLY authorized source for creating tickLogs.
 * Client code is read-only for tickLogs collection.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

// Collection name for user data
const USERS_COLLECTION = 'users';
const TICK_LOGS_COLLECTION = 'tickLogs';

/**
 * Interface for a tick log document
 */
interface TickLogDoc {
    boxId: string;
    subjectId: string;
    chapterId: string;
    fieldKey: string;
    userId: string;
    timestamp: admin.firestore.FieldValue;
    iso: string;
    percentAfter: number;
    percentBefore: number;
    source: 'manual' | 'auto' | 'import';
}

/**
 * Parses a progress key to extract components
 * Key format: s_{subjectId}_{chapterId}_{fieldKey}
 */
function parseProgressKey(key: string): { subjectId: string; chapterId: string; fieldKey: string } | null {
    if (!key.startsWith('s_')) return null;

    const parts = key.slice(2).split('_');
    if (parts.length < 3) return null;

    return {
        subjectId: parts[0],
        chapterId: parts[1],
        fieldKey: parts.slice(2).join('_') // Handle field keys with underscores
    };
}

/**
 * Converts status value (0-5) to percentage (0-100)
 */
function statusToPercent(status: unknown): number {
    if (status === null || status === undefined) return 0;
    const num = typeof status === 'number' ? status : Number(status);
    if (isNaN(num) || !isFinite(num)) return 0;
    const clamped = Math.max(0, Math.min(5, Math.floor(num)));
    return clamped * 20;
}

/**
 * Cloud Function: onUserDataUpdate
 * 
 * Triggers when any user document is updated.
 * Compares before/after data to detect progress changes and logs them.
 */
export const onUserDataUpdate = functions.firestore
    .document(`${USERS_COLLECTION}/{userId}`)
    .onUpdate(async (change, context) => {
        const userId = context.params.userId;

        const beforeData = change.before.data()?.data || {};
        const afterData = change.after.data()?.data || {};

        // Find all progress keys that changed (keys starting with 's_')
        const changedKeys: string[] = [];

        for (const key of Object.keys(afterData)) {
            if (!key.startsWith('s_')) continue;
            if (key.includes('timestamp_')) continue; // Skip timestamp keys

            const beforeVal = beforeData[key];
            const afterVal = afterData[key];

            // Only log if value actually changed
            if (beforeVal !== afterVal) {
                changedKeys.push(key);
            }
        }

        if (changedKeys.length === 0) {
            return null; // No progress changes
        }

        // Create tick logs for each changed progress field
        const batch = db.batch();
        const now = new Date();

        for (const key of changedKeys) {
            const parsed = parseProgressKey(key);
            if (!parsed) continue;

            const beforePercent = statusToPercent(beforeData[key]);
            const afterPercent = statusToPercent(afterData[key]);

            // Skip if percent didn't actually change (edge case)
            if (beforePercent === afterPercent) continue;

            const logDoc: TickLogDoc = {
                boxId: key,
                subjectId: parsed.subjectId,
                chapterId: parsed.chapterId,
                fieldKey: parsed.fieldKey,
                userId: userId,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                iso: now.toISOString(),
                percentAfter: afterPercent,
                percentBefore: beforePercent,
                source: 'manual'
            };

            const logRef = db.collection(TICK_LOGS_COLLECTION).doc();
            batch.set(logRef, logDoc);
        }

        // Commit all tick logs
        await batch.commit();

        functions.logger.info(`Created ${changedKeys.length} tick logs for user ${userId}`);

        return null;
    });

// Export admin resource functions
export { adminUpdateResourceLabel, seedResourceDefaults } from './adminResources';
