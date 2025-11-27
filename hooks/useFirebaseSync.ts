
import { useState, useEffect, useRef } from 'react';
import { UserData, UserSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { useSyncActions } from './sync/useSyncActions';
import { useDataSync } from './sync/useDataSync';
import { useDataMigration } from './sync/useDataMigration';
import { firebaseAuth } from '../utils/firebase/core';
import firebase from 'firebase/compat/app';

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
    
    // Helper to wait for the custom ID (displayName) to appear
    const waitForCustomId = async (user: firebase.User): Promise<string> => {
        if (user.displayName) return user.displayName;

        // Poll for up to 2.5 seconds (5 attempts)
        console.log("⏳ Waiting for Custom ID...");
        for (let i = 0; i < 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            try {
                await user.reload();
                // Need to get the refreshed object from auth
                const refreshed = firebaseAuth.currentUser;
                if (refreshed?.displayName) {
                    console.log("✅ Custom ID found:", refreshed.displayName);
                    return refreshed.displayName;
                }
            } catch (e) {
                console.warn("Polling reload failed:", e);
            }
        }

        console.warn("⚠️ Custom ID timeout. Falling back to UID.");
        return user.uid;
    };

    useEffect(() => { 
        setUserData({}); 
        setSettings(DEFAULT_SETTINGS); 
        
        if (!firebaseAuth) {
            console.error("Auth not initialized, skipping auth check.");
            setIsAuthResolving(false);
            return;
        }

        const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
            try {
                if (user) {
                    // RACE CONDITION FIX:
                    // We await the polling function to ensure we get the 'guest_...' or 'username' ID
                    // instead of the raw Firebase UID.
                    const finalId = await waitForCustomId(user);
                    setUserId(finalId);
                } else {
                    setUserId(null);
                }
            } catch (error) {
                console.error("Auth State Change Error:", error);
                // Fallback to null if something catastrophic happens
                setUserId(null);
            } finally {
                // CRITICAL: Always resolve auth state to prevent infinite loading
                setIsAuthResolving(false);
            }
        });
        return () => unsubscribe && unsubscribe();
    }, []);

    useEffect(() => { document.documentElement.setAttribute('data-theme', settings.theme); }, [settings.theme]);

    const actions = useSyncActions(userId, userData, setUserData, settings, setSettings, localDataRef, localSettingsRef, setUserId);
    
    const { isLoading, connectionStatus } = useDataSync(userId, setUserData, setSettings, localSettingsRef, localDataRef, actions.handleLogout, syncKey);

    useDataMigration(userData, setUserData, settings, userId);

    const forceSync = () => {
        setSyncKey(prev => prev + 1);
    };

    return { userId, setUserId, isAuthResolving, userData, setUserData, settings, setSettings, isLoading, connectionStatus, forceSync, ...actions };
};
