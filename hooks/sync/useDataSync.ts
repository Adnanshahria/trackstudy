
import React, { useEffect, useState, useRef } from 'react';
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
    syncKey: number = 0 // Add syncKey prop
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('disconnected');
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        if (!userId) return;

        let unsub: () => void = () => {};

        const syncProcess = async () => {
            if (isMounted.current) setIsLoading(true);

            try {
                const [cachedData, cachedSettings] = await Promise.all([
                    dbGet('main'),
                    dbGet('settings')
                ]);

                if (isMounted.current && (cachedData || cachedSettings)) {
                    if (cachedData) setUserData(prev => ({ ...prev, ...cachedData }));
                    if (cachedSettings) setSettings(prev => ({ ...prev, ...cachedSettings }));
                }
            } catch (e) {
                logger.debug("Local cache load failed");
            }

            try {
                const unsubscribe = await initFirebase(userId, (remoteData, remoteSettings) => {
                    if (!isMounted.current) return;

                    if (remoteData) {
                        setUserData(prev => ({ ...prev, ...remoteData }));
                        dbPut('userData', { id: 'main', value: remoteData }).catch(console.warn);
                    }
                    if (remoteSettings) {
                        setSettings(prev => {
                            const merged: UserSettings = { ...DEFAULT_SETTINGS, ...remoteSettings,
                                syllabus: remoteSettings.syllabus || JSON.parse(JSON.stringify(INITIAL_SYLLABUS_DATA)),
                                trackableItems: remoteSettings.trackableItems || DEFAULT_SETTINGS.trackableItems,
                                subjectConfigs: remoteSettings.subjectConfigs || {},
                                subjectWeights: remoteSettings.subjectWeights || {}
                            };
                            dbPut('userData', { id: 'settings', value: merged }).catch(console.warn);
                            return merged;
                        });
                    }
                    setIsLoading(false);
                }, (status) => {
                    if (isMounted.current) setConnectionStatus(status);
                });

                if (isMounted.current) unsub = unsubscribe;
                else unsubscribe();

            } catch (e) {
                logger.error("Sync init failed", e);
                if (isMounted.current) setIsLoading(false);
            }
        };

        syncProcess();

        return () => {
            unsub();
        };
    }, [userId, syncKey, setUserData, setSettings]); // Depend on syncKey

    return { isLoading, connectionStatus };
};
