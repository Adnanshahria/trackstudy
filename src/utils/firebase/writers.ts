import { firestore } from './core';
import { UserSettings } from '../../types';
import { sanitize } from './helpers';
import { logger } from '../logger';
import { debounce } from '../debounce';

const FIREBASE_USER_COLLECTION = 'users';

// Raw save function (internal use)
const saveSettingsImmediate = async (uid: string, settings: UserSettings) => {
    if (!firestore || !uid) return;
    try {
        await firestore.collection(FIREBASE_USER_COLLECTION).doc(uid).update({ settings: sanitize(settings) });
    } catch (e) {
        logger.error("Save Settings Failed", e);
    }
};

// Per-user debounced save functions to coalesce rapid updates
const debouncedSavers = new Map<string, ReturnType<typeof debounce>>();

export const saveSettings = (uid: string, settings: UserSettings) => {
    if (!uid) return;

    // Get or create debounced saver for this user
    if (!debouncedSavers.has(uid)) {
        debouncedSavers.set(uid, debounce((s: UserSettings) => {
            saveSettingsImmediate(uid, s);
        }, 300)); // 300ms debounce
    }

    const debouncedSave = debouncedSavers.get(uid)!;
    debouncedSave(settings);
};

// Flush pending saves (call before logout)
export const flushPendingSaves = (uid: string) => {
    const saver = debouncedSavers.get(uid);
    if (saver) {
        saver.flush();
    }
};

export const saveUserProgress = async (uid: string, updates: Record<string, any>) => {
    if (!firestore || !uid) return;
    try {
        const dotNotationUpdates: Record<string, any> = {};
        Object.entries(updates).forEach(([key, val]) => {
            if (val !== undefined && !key.includes('.') && !key.includes('/')) {
                dotNotationUpdates[`data.${key}`] = val;
            }
        });
        await firestore.collection(FIREBASE_USER_COLLECTION).doc(uid).update(dotNotationUpdates);
    } catch (e) {
        logger.error("Save Progress Failed", e);
    }
};
