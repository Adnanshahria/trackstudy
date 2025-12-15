import React from 'react';
import { UserData, UserSettings } from '../../types';
import { saveUserProgress, saveSettings, flushPendingSaves, firebaseAuth } from '../../utils/storage';
import { logger } from '../../utils/logger';
import { DEFAULT_SETTINGS } from '../../constants';

// Debounce wait time (must match writers.ts) + buffer for network latency
const PENDING_UPDATE_TIMEOUT_MS = 300 + 500; // 300ms debounce + 500ms buffer

export const useSyncActions = (
    userId: string | null,
    userData: UserData,
    setUserData: React.Dispatch<React.SetStateAction<UserData>>,
    settings: UserSettings,
    setSettings: React.Dispatch<React.SetStateAction<UserSettings>>,
    localDataRef: React.MutableRefObject<UserData>,
    localSettingsRef: React.MutableRefObject<UserSettings>,
    setUserId: React.Dispatch<React.SetStateAction<string | null>>,
    pendingSettingsUpdateRef: React.MutableRefObject<number>
) => {
    const handleStatusUpdate = async (key: string) => {
        if (!userId || !key || typeof key !== 'string') return;
        try {
            const current = userData[key];
            const currentNum = typeof current === 'number' && Number.isFinite(current) ? current : 0;
            const validated = Math.max(0, Math.min(5, Math.floor(currentNum)));
            const next = (validated + 1) % 6;
            const timestamp = new Date().toISOString();
            const newData = { ...userData, [key]: next, [`timestamp_${key}`]: timestamp };
            setUserData(newData);
            await saveUserProgress(userId, { [key]: next, [`timestamp_${key}`]: timestamp });

            // Create tick log directly (client-side)
            try {
                const { firestore } = await import('../../utils/firebase/core');
                if (firestore && key.startsWith('s_')) {
                    const parts = key.slice(2).split('_');
                    if (parts.length >= 3) {
                        await firestore.collection('tickLogs').add({
                            boxId: key,
                            subjectId: parts[0],
                            chapterId: parts[1],
                            fieldKey: parts.slice(2).join('_'),
                            userId: userId,
                            timestamp: new Date(),
                            iso: timestamp,
                            percentBefore: validated * 20,
                            percentAfter: next * 20,
                            source: 'manual'
                        });
                    }
                }
            } catch (logErr: any) {
                console.error('❌ TICK LOG FAILED:', logErr?.code || 'unknown', logErr?.message || logErr);
            }
        } catch (error) {
            console.error('Status update failed:', error);
        }
    };

    const handleNoteUpdate = async (key: string, text: string) => {
        if (!userId || !key || typeof key !== 'string') return;
        try {
            const safeText = typeof text === 'string' ? text.slice(0, 10000) : '';
            const newData = { ...userData, [`note_${key}`]: safeText };
            setUserData(newData);
            await saveUserProgress(userId, { [`note_${key}`]: safeText });
        } catch (error) {
            console.error('Note update failed:', error);
        }
    };

    const handleSettingsUpdate = async (newSettingsOrUpdater: UserSettings | ((prev: UserSettings) => UserSettings)) => {
        try {
            let newSettings: UserSettings;
            if (typeof newSettingsOrUpdater === 'function') {
                newSettings = newSettingsOrUpdater(settings);
            } else {
                newSettings = newSettingsOrUpdater;
            }

            if (!newSettings || typeof newSettings !== 'object') return;

            // RACE CONDITION FIX: Mark that we have a pending local update
            // This timestamp tells useDataSync to ignore incoming remote updates
            // until the debounced save has been persisted
            pendingSettingsUpdateRef.current = Date.now() + PENDING_UPDATE_TIMEOUT_MS;

            setSettings(newSettings);

            if (!userId) return;

            await saveSettings(userId, newSettings);
        } catch (error) {
            console.error('Settings update failed:', error);
        }
    };

    const toggleTheme = () => {
        handleSettingsUpdate({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' });
    };

    const handleLogout = async () => {
        // Flush any pending debounced saves before logout
        if (userId) {
            flushPendingSaves(userId);
        }

        // Clear UI state
        setUserId(null);
        setUserData({});
        setSettings(DEFAULT_SETTINGS);
        localDataRef.current = {};
        localSettingsRef.current = DEFAULT_SETTINGS;

        // THEN sign out from Firebase to properly disconnect
        try {
            if (firebaseAuth) {
                await firebaseAuth.signOut();
                logger.debug("Firebase signOut successful");
            }
        } catch (error) {
            logger.error("Firebase signOut error:", error);
        }
    };

    return { handleStatusUpdate, handleNoteUpdate, handleSettingsUpdate, toggleTheme, handleLogout };
};