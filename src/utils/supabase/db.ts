
import { UserData, UserSettings } from '../../types';
import { supabase } from './client';

import { DEFAULT_SETTINGS } from '../../constants';
// import { logger } from '../logger'; 
// Re-implementing a simple logger to avoid dependency circles if logger depends on others
const logger = { error: console.error, debug: console.log };

// Helper helper
const debounce = (func: Function, wait: number) => {
    let timeout: any;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const USER_TABLE = 'users';

export const initFirebase = async (
    uid: string,
    onData: (data: UserData | null, settings: UserSettings | null) => void,
    onStatus: (status: 'connected' | 'disconnected') => void,
    localSettingsToMigrate?: UserSettings,
    localDataToMigrate?: UserData
) => {
    try {
        if (!uid) throw new Error("No UID");
        console.log('📡 initFirebase: Starting for uid:', uid);
        onStatus('connected');
        const debouncedOnData = debounce(onData, 100);

        // 1. Initial Fetch
        console.log('📡 initFirebase: Fetching user data...');
        const { data: initialData, error: fetchError } = await supabase
            .from(USER_TABLE)
            .select('*')
            .eq('id', uid)
            .maybeSingle();

        console.log('📡 initFirebase: Fetch result:', { found: !!initialData, error: fetchError?.message });

        // 1.1 Self-Repair if not found
        if (!initialData) {
            console.log('📡 initFirebase: User not found, attempting self-repair...');
            logger.debug("User doc not found on init. Attempting self-repair...");

            // 1.1 Self-Repair: Create missing user row
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                console.log('📡 initFirebase: Auth user found, creating profile...');
                // Determine username/id using same logic as SQL trigger if possible, or fallback to UID
                // Determine username/id using same logic as SQL trigger if possible, or fallback to UID
                const meta = user.user_metadata || {};
                let username = meta.displayName || meta.full_name || meta.name;
                if (!username && user.email) username = user.email.split('@')[0];
                if (!username) username = user.id;

                // Do NOT set academicLevel or syllabus here - let onboarding modal handle it
                const initialSettings = localSettingsToMigrate || { ...DEFAULT_SETTINGS };

                const newUserData = {
                    id: username, // PK
                    auth_id: user.id,
                    settings: initialSettings,
                    data: localDataToMigrate || { username }, // Keep minimal
                };

                const { error: insertError } = await supabase
                    .from(USER_TABLE)
                    .insert(newUserData);

                if (insertError) {
                    console.log('📡 initFirebase: Insert failed:', insertError.code, insertError.message);
                    // Handle Race Condition (Trigger vs Client Init) - 409 Conflict / Unique Violation
                    if (insertError.code === '23505') {
                        logger.debug("Race condition detected (User exists or Auth ID conflict). Re-fetching by Auth ID...");
                        const { data: retryData } = await supabase
                            .from(USER_TABLE)
                            .select('*')
                            .eq('auth_id', newUserData.auth_id) // Query by Auth ID, which is the source of truth
                            .maybeSingle();

                        if (retryData) {
                            console.log('📡 initFirebase: Recovered via auth_id lookup, calling onData');
                            debouncedOnData(retryData.data || {}, retryData.settings || null);
                        } else {
                            console.error('📡 initFirebase: CRITICAL - Recovery failed!');
                            logger.error("Failed to recover from 409 Conflict: User still not found.");
                            // CRITICAL FIX: Call onData with defaults so isLoading can be set to false
                            debouncedOnData({}, DEFAULT_SETTINGS);
                        }
                    } else {
                        console.error('📡 initFirebase: Insert error:', insertError);
                        logger.error("Failed to self-repair user profile:", insertError);
                        // CRITICAL FIX: Call onData with defaults so isLoading can be set to false
                        debouncedOnData({}, DEFAULT_SETTINGS);
                    }
                } else {
                    console.log('📡 initFirebase: Self-repair SUCCESS, calling onData');
                    logger.debug("Self-repaired user profile successfully.");
                    debouncedOnData(newUserData.data, newUserData.settings);
                }
            } else {
                console.error('📡 initFirebase: No auth user found for self-repair!');
                // CRITICAL FIX: Still call onData to prevent hang
                debouncedOnData({}, DEFAULT_SETTINGS);
            }

        } else if (initialData) {
            console.log('📡 initFirebase: User found, calling onData with data');
            debouncedOnData(initialData.data || {}, initialData.settings || null);
        }

        // 2. Realtime Subscription
        const channel = supabase
            .channel(`public:${USER_TABLE}:${uid}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: USER_TABLE,
                    filter: `id=eq.${uid}`,
                },
                (payload) => {
                    if (payload.new) {
                        const newData = payload.new as any; // Cast to any to access internal fields
                        debouncedOnData(newData.data || {}, newData.settings || null);
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    onStatus('connected');
                } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                    onStatus('disconnected');
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };

    } catch (e) {
        logger.error("Init Supabase failed", e);
        onStatus('disconnected');
        return () => { };
    }
};
