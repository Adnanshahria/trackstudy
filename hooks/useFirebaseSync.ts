
import { useState, useEffect, useRef } from 'react';
import { UserData, UserSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { useSyncActions } from './sync/useSyncActions';
import { useDataSync } from './sync/useDataSync';
import { useDataMigration } from './sync/useDataMigration';
import { firebaseAuth } from '../utils/firebase/core';

export const useFirebaseSync = () => {
    const [userData, setUserData] = useState<UserData>({});
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [userId, setUserId] = useState<string | null>(null);
    
    // Add a key state to force re-mounting/re-syncing
    const [syncKey, setSyncKey] = useState(0);

    const localDataRef = useRef<UserData>({});
    const localSettingsRef = useRef<UserSettings>(DEFAULT_SETTINGS);
    
    useEffect(() => { localDataRef.current = userData; }, [userData]);
    useEffect(() => { localSettingsRef.current = settings; }, [settings]);
    
    useEffect(() => { 
        setUserData({}); 
        setSettings(DEFAULT_SETTINGS); 
        const unsubscribe = firebaseAuth?.onAuthStateChanged(user => {
            if (user) setUserId(user.uid);
        });
        return () => unsubscribe && unsubscribe();
    }, []);

    useEffect(() => { document.documentElement.setAttribute('data-theme', settings.theme); }, [settings.theme]);

    const actions = useSyncActions(userId, userData, setUserData, settings, setSettings, localDataRef, localSettingsRef, setUserId);
    
    // Pass syncKey to useDataSync so changing it triggers the sync process again
    const { isLoading, connectionStatus } = useDataSync(userId, setUserData, setSettings, localSettingsRef, localDataRef, actions.handleLogout, syncKey);

    useDataMigration(userData, setUserData, settings, userId);

    // Force Sync Function: Just incrementing key triggers useDataSync useEffect
    const forceSync = () => {
        setSyncKey(prev => prev + 1);
    };

    return { userId, setUserId, userData, setUserData, settings, setSettings, isLoading, connectionStatus, forceSync, ...actions };
};
