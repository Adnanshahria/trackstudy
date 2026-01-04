
import { useState, useEffect, useRef } from 'react';
import { UserData, UserSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { useSyncActions } from './sync/useSyncActions';
import { useDataSync } from './sync/useDataSync';
import { supabase } from '../utils/supabase/client';
import { logger } from '../utils/logger';

export const useSupabaseSync = () => {
    const [userData, setUserData] = useState<UserData>({});
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthResolving, setIsAuthResolving] = useState(true);

    // Add a key state to force re-mounting/re-syncing
    const [syncKey, setSyncKey] = useState(0);

    const localDataRef = useRef<UserData>({});
    const localSettingsRef = useRef<UserSettings>(DEFAULT_SETTINGS);

    const pendingSettingsUpdateRef = useRef<number>(0);

    useEffect(() => { localDataRef.current = userData; }, [userData]);
    useEffect(() => { localSettingsRef.current = settings; }, [settings]);

    useEffect(() => {
        // Manual Hash Check with Optimistic Update (Instant Load)
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
            const params = new URLSearchParams(hash.substring(1));
            const access_token = params.get('access_token');
            const refresh_token = params.get('refresh_token');

            if (access_token) {
                try {
                    // 1. Optimistic Decode
                    const base64Url = access_token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));

                    const jwt = JSON.parse(jsonPayload);

                    if (jwt && jwt.sub) {
                        console.log("Optimistic Auth: User detected", jwt.sub);

                        let resolvedId = jwt.user_metadata?.displayName;
                        if (!resolvedId && jwt.email) resolvedId = jwt.email.split('@')[0];
                        if (!resolvedId) resolvedId = jwt.sub;

                        // UNLOCK UI INSTANTLY
                        setUserId(resolvedId);
                        setIsAuthResolving(false);

                        // 2. Validate & Persist in Background
                        supabase.auth.setSession({ access_token, refresh_token: refresh_token || '' })
                            .then(() => {
                                // Clean up URL hash only after ensuring persist logic started
                                window.history.replaceState(null, '', window.location.pathname);
                            })
                            .catch(err => console.error("Background auth persist failed:", err));
                    }
                } catch (e) {
                    console.error("Optimistic decode failed:", e);
                    // Fallback to slow method will happen naturally via onAuthStateChange or timeout
                }
            }
        }


        // Initial Check (Explicit)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                // If no session exists initially, we might be logged out. 
                // But onAuthStateChange will also fire.
                // We'll let onAuthStateChange handle the definitive state change.
                console.log("Initial Session Check: No Session", session);
            } else {
                console.log("Initial Session Check: Found Session", session.user.id);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth State Change:", event, session?.user?.id);

            // Check for pending hash redirect - crucial for prevents flash of landing page
            const hasPendingHash = window.location.hash && window.location.hash.includes('access_token');

            try {
                if (session?.user) {
                    // Resolve the correct public.users ID (Username)
                    let resolvedId = session.user.user_metadata?.displayName;

                    if (!resolvedId) {
                        try {
                            // 2. Try fetching from DB (Best source of truth for existing Google/OAuth users)
                            const { data, error } = await supabase
                                .from('users')
                                .select('id')
                                .eq('auth_id', session.user.id)
                                .maybeSingle();

                            if (data?.id) {
                                resolvedId = data.id;
                            }
                        } catch (dbErr) {
                            console.warn('DB Fetch failed during auth resolution', dbErr);
                        }
                    }

                    if (!resolvedId) {
                        // 3. Fallback derivation
                        if (session.user.email) {
                            resolvedId = session.user.email.split('@')[0];
                        } else {
                            resolvedId = session.user.id;
                        }
                    }

                    console.log("Resolved UserID:", resolvedId);
                    setUserId(resolvedId);
                    setIsAuthResolving(false);
                } else {
                    console.log("No User in Session. Clearing ID.");
                    setUserId(null);

                    if (hasPendingHash) {
                        console.log("Auth: Pending hash detected, waiting for resolution...");
                        // Do NOT clear resolving state yet
                    } else {
                        setIsAuthResolving(false);
                    }
                }
            } catch (e) {
                console.error("Auth resolution error:", e);
                setUserId(null);
                setIsAuthResolving(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Safety net: If auth resolution hangs for coverage, force it to complete
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAuthResolving(prev => {
                if (prev) {
                    if (window.location.hash && window.location.hash.includes('access_token')) {
                        console.warn("Auth resolution timeout, but hash token detected. Extending wait...");
                        return prev;
                    }
                    console.warn("⚠️ Auth resolution timed out. Forcing completion.");
                    return false;
                }
                return prev;
            });
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => { document.documentElement.setAttribute('data-theme', settings.theme); }, [settings.theme]);

    const actions = useSyncActions(userId, userData, setUserData, settings, setSettings, localDataRef, localSettingsRef, setUserId, pendingSettingsUpdateRef);

    const { isLoading, connectionStatus } = useDataSync(userId, setUserData, setSettings, localSettingsRef, localDataRef, actions.handleLogout, syncKey, pendingSettingsUpdateRef);

    const forceSync = () => {
        setSyncKey(prev => prev + 1);
    };

    return { userId, setUserId, isAuthResolving, userData, setUserData, settings, setSettings, isLoading, connectionStatus, forceSync, ...actions };
};
