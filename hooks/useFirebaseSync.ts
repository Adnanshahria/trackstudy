import { useState, useEffect, useRef, useCallback } from 'react';
import { UserData, UserSettings } from '../types';
import { DEFAULT_SETTINGS, INITIAL_SYLLABUS_DATA } from '../constants';
import { openDB, dbPut, dbClear, initFirebase, cleanupStorage, saveSettings, saveUserProgress } from '../utils/storage';

export const useFirebaseSync = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState<UserData>({});
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('disconnected');
    const [userId, setUserId] = useState<string | null>(null);

    // Refs for data migration and cleanup to avoid stale closures in listeners
    const localDataRef = useRef<UserData>({});
    const localSettingsRef = useRef<UserSettings>(DEFAULT_SETTINGS);

    useEffect(() => { localDataRef.current = userData; }, [userData]);
    useEffect(() => { localSettingsRef.current = settings; }, [settings]);

    // Initial Cleanup
    useEffect(() => {
        setUserData({});
        setSettings(DEFAULT_SETTINGS);
        setUserId(null);
    }, []);

    // Theme Effect
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings.theme]);

    // Sync Logic
    useEffect(() => {
        if (!userId) return;

        setIsLoading(true);
        let unsub: () => void = () => {};
        
        const init = async () => {
            try {
                await openDB();
                await dbClear('userData'); 
                
                unsub = await initFirebase(
                    userId, 
                    (remoteData, remoteSettings) => {
                        if (remoteData) {
                            setUserData(prev => ({ ...prev, ...remoteData }));
                            dbPut('userData', { id: 'main', value: remoteData });
                        }
                        
                        if (remoteSettings) {
                            setSettings(prev => {
                                const merged: UserSettings = { 
                                    ...DEFAULT_SETTINGS, 
                                    ...remoteSettings,
                                    // Ensure deep merge for nested objects if they are missing in remote
                                    syllabus: remoteSettings.syllabus || JSON.parse(JSON.stringify(INITIAL_SYLLABUS_DATA)),
                                    trackableItems: remoteSettings.trackableItems || DEFAULT_SETTINGS.trackableItems,
                                    subjectConfigs: remoteSettings.subjectConfigs || {},
                                    subjectWeights: remoteSettings.subjectWeights || {}
                                };
                                
                                dbPut('userData', { id: 'settings', value: merged });
                                return merged;
                            });
                        }
                        setIsLoading(false);
                    }, 
                    (status) => setConnectionStatus(status),
                    localSettingsRef.current, 
                    localDataRef.current      
                );

            } catch (e) {
                console.error("Init failed", e);
                setIsLoading(false);
            }
        };

        init();

        return () => {
            unsub();
            cleanupStorage();
            setUserData({});
            setSettings(DEFAULT_SETTINGS);
        };
    }, [userId]);

    const handleStatusUpdate = async (key: string) => {
        if(!userId) return;
        const current = userData[key] ?? 0;
        const next = (current + 1) % 7;
        
        const newData = { ...userData, [key]: next, [`timestamp_${key}`]: new Date().toISOString() };
        setUserData(newData);
        await saveUserProgress(userId, { [key]: next, [`timestamp_${key}`]: new Date().toISOString() });
    };

    const handleNoteUpdate = async (key: string, text: string) => {
        if(!userId) return;
        const newData = { ...userData, [`note_${key}`]: text };
        setUserData(newData);
        await saveUserProgress(userId, { [`note_${key}`]: text });
    }

    const handleSettingsUpdate = async (newSettings: UserSettings) => {
        setSettings(newSettings);
        if(!userId) return;
        await saveSettings(userId, newSettings);
    };

    const toggleTheme = () => {
        handleSettingsUpdate({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' });
    };

    const handleLogout = () => {
        setUserId(null);
        setUserData({});
        setSettings(DEFAULT_SETTINGS);
        localDataRef.current = {};
        localSettingsRef.current = DEFAULT_SETTINGS;
        cleanupStorage();
    };

    return {
        userId, setUserId,
        userData, setUserData,
        settings, setSettings,
        isLoading,
        connectionStatus,
        handleStatusUpdate,
        handleNoteUpdate,
        handleSettingsUpdate,
        toggleTheme,
        handleLogout
    };
};