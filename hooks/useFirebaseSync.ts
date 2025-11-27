
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
    const [isAuthResolving, setIsAuthResolving] = useState(true);
    
    // Add a key state to force re-mounting/re-syncing
    const [syncKey, setSyncKey] = useState(0);

    const localDataRef = useRef<UserData>({});
    const localSettingsRef = useRef<UserSettings>(DEFAULT_SETTINGS);
    
    useEffect(() => { localDataRef.current = userData; }, [userData]);
    useEffect(() => { localSettingsRef.current = settings; }, [settings]);
    
    useEffect(() => { 
        setUserData({}); 
        setSettings(DEFAULT_SETTINGS); 
        
        if (!firebaseAuth) {
            console.error("Auth not initialized, skipping auth check.");
            setIsAuthResolving(false);
            return;
        }

        const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
            if (user) {
                // RACE CONDITION FIX:
                // New users (Guest or Created) might have their `displayName` set asynchronously.
                // If we use `user.uid` immediately, we might create a garbage document.
                // We attempt to reload the user metadata to ensure we get the fresh displayName (Custom ID).
                
                let finalId = user.displayName;
                
                if (!finalId) {
                    try {
                        await user.reload();
                        // Re-fetch current user after reload
                        const refreshedUser = firebaseAuth.currentUser;
                        finalId = refreshedUser?.displayName || refreshedUser?.uid || user.uid;
                    } catch (e) {
                        console.warn("User reload failed, falling back to UID", e);
                        finalId = user.uid;
                    }
                }

                setUserId(finalId);
            } else {
                setUserId(null);
            }
            setIsAuthResolving(false);
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

    return { userId, setUserId, isAuthResolving, userData, setUserData, settings, setSettings, isLoading, connectionStatus, forceSync, ...actions };
};
