/**
 * Admin Resource Update Cloud Function
 * 
 * Only authorized admin users can update global resource defaults.
 * This function validates admin status and updates the resource label.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize only if not already done (for multi-function files)
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();
const RESOURCE_DEFAULTS_COLLECTION = 'resourceDefaults';

interface UpdateResourceRequest {
    resourceId: number;
    newLabel: string;
}

/**
 * Cloud Function: adminUpdateResourceLabel
 * 
 * Callable function that updates a resource default label.
 * Only authorized admin users can call this.
 */
export const adminUpdateResourceLabel = functions.https.onCall(
    async (data: UpdateResourceRequest, context) => {
        // 1. Authentication check
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'User must be authenticated to update resources.'
            );
        }

        // 2. Admin authorization check
        // Check for admin custom claim or specific admin UIDs
        const isAdmin = context.auth.token.admin === true;
        // Alternatively, check hardcoded admin UIDs for simplicity:
        const adminUids = ['admin_uid_here']; // Replace with actual admin UIDs
        const isHardcodedAdmin = adminUids.includes(context.auth.uid);

        if (!isAdmin && !isHardcodedAdmin) {
            throw new functions.https.HttpsError(
                'permission-denied',
                'Only administrators can update resource defaults.'
            );
        }

        // 3. Validate input
        const { resourceId, newLabel } = data;

        if (typeof resourceId !== 'number' || resourceId < 1 || resourceId > 20) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Resource ID must be a number between 1 and 20.'
            );
        }

        if (typeof newLabel !== 'string' || newLabel.trim().length === 0) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Label must be a non-empty string.'
            );
        }

        if (newLabel.length > 40) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Label must be 40 characters or less.'
            );
        }

        // 4. Update the resource document
        const docRef = db.collection(RESOURCE_DEFAULTS_COLLECTION).doc(String(resourceId));

        try {
            await docRef.update({
                label: newLabel.trim(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedBy: context.auth.uid
            });

            functions.logger.info(`Resource ${resourceId} updated to "${newLabel}" by ${context.auth.uid}`);

            return {
                success: true,
                message: `Resource ${resourceId} renamed to "${newLabel}"`
            };
        } catch (error: any) {
            // If document doesn't exist, create it
            if (error.code === 5) { // NOT_FOUND
                throw new functions.https.HttpsError(
                    'not-found',
                    `Resource ${resourceId} not found. Please seed the database first.`
                );
            }

            functions.logger.error('Error updating resource:', error);
            throw new functions.https.HttpsError(
                'internal',
                'Failed to update resource. Please try again.'
            );
        }
    }
);

/**
 * Cloud Function: seedResourceDefaults
 * 
 * One-time setup function to create initial resource defaults.
 * Can only be called by admins.
 */
export const seedResourceDefaults = functions.https.onCall(
    async (_data, context) => {
        // Auth check
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
        }

        const isAdmin = context.auth.token.admin === true;
        if (!isAdmin) {
            throw new functions.https.HttpsError('permission-denied', 'Admins only.');
        }

        const defaults = [
            { id: 1, order: 1, key: 'mainbook', label: 'Lecture', color: 'bg-sky-500' },
            { id: 2, order: 2, key: 'class', label: 'Book', color: 'bg-blue-500' },
            { id: 3, order: 3, key: 'revclass', label: 'Resource 1', color: 'bg-indigo-500' },
            { id: 4, order: 4, key: 'meditrics', label: 'Resource 2', color: 'bg-teal-500' },
            { id: 5, order: 5, key: 'mqb', label: 'Resource 3', color: 'bg-amber-500' },
            { id: 6, order: 6, key: 'sfexam', label: 'Resource 4', color: 'bg-rose-500' },
            { id: 7, order: 7, key: 'rev1', label: 'Resource 5', color: 'bg-violet-500' },
            { id: 8, order: 8, key: 'rev2', label: 'Resource 6', color: 'bg-purple-500' }
        ];

        const batch = db.batch();
        const now = admin.firestore.FieldValue.serverTimestamp();

        for (const resource of defaults) {
            const docRef = db.collection(RESOURCE_DEFAULTS_COLLECTION).doc(String(resource.id));
            batch.set(docRef, {
                ...resource,
                createdAt: now,
                updatedAt: now,
                updatedBy: context.auth.uid
            }, { merge: true });
        }

        await batch.commit();

        functions.logger.info(`Seeded ${defaults.length} resource defaults by ${context.auth.uid}`);

        return { success: true, message: `Seeded ${defaults.length} resource defaults.` };
    }
);
