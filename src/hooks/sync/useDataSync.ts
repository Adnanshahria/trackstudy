
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { UserData, UserSettings } from '../../types';
import { DEFAULT_SETTINGS, INITIAL_SYLLABUS_DATA } from '../../constants';
import { dbPut, dbGet, initFirebase } from '../../utils/storage';
import { logger } from '../../utils/logger';

export const useDataSync = (
    userId: string | null,
    setUserData: React.Dispatch<React.SetStateAction<UserData>>,
    setSettings: React.Dispatch<React.SetStateAction<UserSettings>>,
    localSettingsRef: React.MutableRefObject<UserSettings>,
    localDataRef: React.MutableRefObject<UserData>,
    handleLogout: () => void,
    syncKey: number = 0
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('disconnected');
    const isMounted = useRef(true);
    const currentSyncId = useRef<number>(0);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        if (!userId) return;

        const thisSyncId = ++currentSyncId.current;
        let unsub: (() => void) | null = null;
        let isCleanedUp = false;

        const syncProcess = async () => {
            if (!isMounted.current || isCleanedUp || thisSyncId !== currentSyncId.current) return;

            setIsLoading(true);

            try {
                const [cachedData, cachedSettings] = await Promise.all([
                    dbGet('main').catch(() => null),
                    dbGet('settings').catch(() => null)
                ]);

                if (!isMounted.current || isCleanedUp || thisSyncId !== currentSyncId.current) return;

                if (cachedData && typeof cachedData === 'object') {
                    setUserData(prev => ({ ...prev, ...cachedData }));
                }
                if (cachedSettings && typeof cachedSettings === 'object') {
                    setSettings(prev => ({ ...prev, ...cachedSettings }));
                }
            } catch (e) {
                logger.debug("Local cache load failed");
            }

            if (!isMounted.current || isCleanedUp || thisSyncId !== currentSyncId.current) return;

            try {
                const unsubscribe = await initFirebase(userId, (remoteData, remoteSettings) => {
                    if (!isMounted.current || isCleanedUp || thisSyncId !== currentSyncId.current) return;

                    if (remoteData && typeof remoteData === 'object') {
                        setUserData(prev => ({ ...prev, ...remoteData }));
                        dbPut('userData', { id: 'main', value: remoteData }).catch(() => { });
                    }
                    if (remoteSettings && typeof remoteSettings === 'object') {
                        // DEBUG: Log RAW data from Firestore BEFORE merging
                        console.log('[DEBUG LOAD] RAW remoteSettings.subjectConfigs from Firestore:',
                            remoteSettings.subjectConfigs ? JSON.stringify(remoteSettings.subjectConfigs, null, 2) : 'UNDEFINED');

                        setSettings(prev => {
                            const merged: UserSettings = {
                                ...DEFAULT_SETTINGS,
                                ...remoteSettings,
                                syllabus: remoteSettings.syllabus || JSON.parse(JSON.stringify(INITIAL_SYLLABUS_DATA)),
                                trackableItems: remoteSettings.trackableItems || DEFAULT_SETTINGS.trackableItems,
                                // Fix: Don't overwrite local subjectConfigs with empty/undefined remote data
                                // This prevents the 'flash' issue where local data loads then gets wiped by delayed/partial remote sync
                                subjectConfigs: (remoteSettings.subjectConfigs && Object.keys(remoteSettings.subjectConfigs).length > 0)
                                    ? remoteSettings.subjectConfigs
                                    : (prev.subjectConfigs && Object.keys(prev.subjectConfigs).length > 0 ? prev.subjectConfigs : {}),
                                subjectWeights: remoteSettings.subjectWeights || {}
                            };
                            // DEBUG: Log subjectConfigs AFTER merge
                            console.log('[DEBUG LOAD] MERGED subjectConfigs:', JSON.stringify(merged.subjectConfigs, null, 2));
                            dbPut('userData', { id: 'settings', value: merged }).catch(() => { });
                            return merged;
                        });
                    }
                    setIsLoading(false);
                }, (status) => {
                    if (isMounted.current && !isCleanedUp && thisSyncId === currentSyncId.current) {
                        setConnectionStatus(status);
                    }
                });

                if (isMounted.current && !isCleanedUp && thisSyncId === currentSyncId.current) {
                    unsub = unsubscribe;
                } else if (unsubscribe) {
                    unsubscribe();
                }

            } catch (e) {
                logger.error("Sync init failed", e);
                if (isMounted.current && !isCleanedUp) {
                    setIsLoading(false);
                }
            }
        };

        syncProcess();

        return () => {
            isCleanedUp = true;
            if (unsub) {
                unsub();
            }
        };
    }, [userId, syncKey, setUserData, setSettings]);

    return { isLoading, connectionStatus };
};
