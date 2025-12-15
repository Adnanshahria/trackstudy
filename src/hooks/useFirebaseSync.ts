
import { useState, useEffect, useRef } from 'react';
import { UserData, UserSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { useSyncActions } from './sync/useSyncActions';
import { useDataSync } from './sync/useDataSync';

import { firebaseAuth } from '../utils/firebase/core';
import { logger } from '../utils/logger';
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

    // Track pending settings updates to prevent race conditions with Firebase listener
    // When this timestamp is set, incoming remote settings updates will be ignored
    // until the local change has been persisted (debounce period + network latency)
    const pendingSettingsUpdateRef = useRef<number>(0);

    useEffect(() => { localDataRef.current = userData; }, [userData]);
    useEffect(() => { localSettingsRef.current = settings; }, [settings]);

    // Helper to wait for the custom ID (displayName) to appear
    // Optimized with reduced polling iterations and faster timeout
    const waitForCustomId = async (user: firebase.User): Promise<string> => {
        if (user.displayName) return user.displayName;

        logger.debug("Waiting for Custom ID...");
        let backoffMs = 150; // Start with lower backoff
        for (let i = 0; i < 5; i++) { // Reduced from 10 to 5 iterations
            await new Promise(resolve => setTimeout(resolve, backoffMs));
            backoffMs = Math.min(backoffMs * 1.5, 400); // Faster exponential growth and lower cap
            try {
                await user.reload();
                const refreshed = firebaseAuth.currentUser;
                if (refreshed?.displayName) {
                    logger.debug("Custom ID found:", refreshed.displayName);
                    return refreshed.displayName;
                }
            } catch (e) {
                logger.debug("Polling reload failed");
            }
        }

        logger.warn("Custom ID timeout. Falling back to UID.");
        return user.uid;
    };

    useEffect(() => {
        // NOTE: Don't reset settings here - it would overwrite Firestore data
        // The initial state in useState is sufficient for empty/new users

        if (!firebaseAuth) {
            logger.error("Auth not initialized, skipping auth check.");
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
                logger.error("Auth State Change Error:", error);
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

    const actions = useSyncActions(userId, userData, setUserData, settings, setSettings, localDataRef, localSettingsRef, setUserId, pendingSettingsUpdateRef);

    const { isLoading, connectionStatus } = useDataSync(userId, setUserData, setSettings, localSettingsRef, localDataRef, actions.handleLogout, syncKey, pendingSettingsUpdateRef);



    const forceSync = () => {
        setSyncKey(prev => prev + 1);
    };

    return { userId, setUserId, isAuthResolving, userData, setUserData, settings, setSettings, isLoading, connectionStatus, forceSync, ...actions };
};
