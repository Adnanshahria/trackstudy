import { firestore } from './core';
import { UserSettings } from '../../types';
import { sanitize } from './helpers';
import { logger } from '../logger';

const FIREBASE_USER_COLLECTION = 'users';

export const saveSettings = async (uid: string, settings: UserSettings) => {
    if (!firestore || !uid) return;
    try { 
        await firestore.collection(FIREBASE_USER_COLLECTION).doc(uid).update({ settings: sanitize(settings) }); 
    } catch (e) { 
        logger.error("Save Settings Failed", e); 
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