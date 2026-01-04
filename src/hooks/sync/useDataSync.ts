
import React, { useEffect, useState, useRef } from 'react';
import { UserData, UserSettings } from '../../types';
import { initFirebase } from '../../utils/storage';
import { logger } from '../../utils/logger';
import { DEFAULT_SETTINGS } from '../../constants';

export const useDataSync = (
    userId: string | null,
    setUserData: React.Dispatch<React.SetStateAction<UserData>>,
    setSettings: React.Dispatch<React.SetStateAction<UserSettings>>,
    localSettingsRef: React.MutableRefObject<UserSettings>,
    localDataRef: React.MutableRefObject<UserData>,
    handleLogout: () => void,
    syncKey: number = 0,
    pendingSettingsUpdateRef: React.MutableRefObject<number>
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

            // NO IndexedDB cache - Firestore is the only source of truth

            try {
                const unsubscribe = await initFirebase(userId, (remoteData, remoteSettings) => {
                    if (!isMounted.current || isCleanedUp || thisSyncId !== currentSyncId.current) return;

                    if (remoteData && typeof remoteData === 'object') {
                        setUserData(prev => ({ ...prev, ...remoteData }));
                    }
                    if (remoteSettings && typeof remoteSettings === 'object') {
                        // RACE CONDITION FIX: Check if there's a pending local settings update
                        // If so, skip applying remote settings to avoid overwriting local changes
                        const now = Date.now();
                        if (pendingSettingsUpdateRef.current > now) {
                            logger.debug('Skipping remote settings update - pending local change');
                            setIsLoading(false);
                            return;
                        }

                        // MERGE STRATEGY:
                        // 1. Start with DEFAULT_SETTINGS (sets academicLevel='HSC' for legacy users)
                        // 2. Spread remoteSettings on top
                        setSettings(prev => ({
                            ...DEFAULT_SETTINGS,
                            ...remoteSettings
                        }));
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
