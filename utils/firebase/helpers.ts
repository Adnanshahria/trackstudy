
import { firestore, firebaseAuth } from './core';
import { UserData, UserSettings } from '../../types';
import { DEFAULT_SETTINGS } from '../../constants';
import { logger } from '../logger';

const FIREBASE_USER_COLLECTION = 'users';

// Prevent prototype pollution and remove undefined values
export const sanitize = (obj: any): any => {
    if (obj === undefined || obj === null) return null;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sanitize);
    const newObj: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const val = obj[key];
            if (val !== undefined) newObj[key] = sanitize(val);
        }
    }
    return newObj;
};

export const ensureUserDoc = async (uid: string, initialSettings?: UserSettings, initialData?: UserData) => {
    if (!firestore || !uid) return false;

    // SAFETY GUARD: Garbage Data Prevention
    // If the 'uid' argument is the raw Firebase Auth UID, but the user actually has a 
    // Custom ID (displayName), we must abort. This happens during race conditions.
    const currentUser = firebaseAuth.currentUser;
    if (currentUser && currentUser.uid === uid && currentUser.displayName && currentUser.displayName !== uid) {
        logger.warn("Prevented creation of garbage document for raw UID. Waiting for Custom ID.");
        return false;
    }

    const ref = firestore.collection(FIREBASE_USER_COLLECTION).doc(uid);
    try {
        const snap = await ref.get();
        // Check if doc exists OR if settings are missing (corrupted/wiped doc)
        if (!snap.exists || !snap.data()?.settings) {
            
            const payload: any = {
                createdAt: new Date().toISOString(),
                settings: sanitize(initialSettings || DEFAULT_SETTINGS)
            };

            // Only overwrite/merge 'data' if we actually have local data to migrate.
            if (initialData && Object.keys(initialData).length > 0) {
                payload.data = sanitize(initialData);
            }

            await ref.set(payload, { merge: true });
            return true;
        }
    } catch (e) { logger.error("Error checking user doc:", e); }
    return false;
};
