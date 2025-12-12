
import { UserData, UserSettings } from '../../types';
import { firestore, firebaseAuth } from './core';
import { ensureUserDoc } from './helpers';
import { DEFAULT_SETTINGS } from '../../constants';
import { debounce } from '../debounce';
import { logger } from '../logger';

const FIREBASE_USER_COLLECTION = 'users';

export const initFirebase = async (
    uid: string,
    onData: (data: UserData | null, settings: UserSettings | null) => void,
    onStatus: (status: 'connected' | 'disconnected') => void,
    localSettingsToMigrate?: UserSettings,
    localDataToMigrate?: UserData
) => {
    try {
        if (!firestore) throw new Error("Firestore not initialized");
        if (!uid) throw new Error("No UID");

        onStatus('connected');

        const debouncedOnData = debounce(onData, 100);

        const unsub = firestore.collection(FIREBASE_USER_COLLECTION).doc(uid).onSnapshot((docSnap) => {
            if (docSnap.exists) {
                const val = docSnap.data();
                debouncedOnData(val?.data || {}, val?.settings || null);
            } else {
                ensureUserDoc(uid, localSettingsToMigrate || DEFAULT_SETTINGS, localDataToMigrate).then((created) => {
                   if (created) {
                       debouncedOnData(localDataToMigrate || {}, localSettingsToMigrate || DEFAULT_SETTINGS);
                   }
                });
            }
        }, (error) => {
            logger.error("Firestore listener error", error);
            onStatus('disconnected');
        });

        return unsub;
    } catch (e) {
        logger.error("Init Firebase failed", e);
        onStatus('disconnected');
        return () => {};
    }
};
