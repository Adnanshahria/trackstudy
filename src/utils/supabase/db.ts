
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

        // 1. Initial Fetch with timeout to prevent hanging
        console.log('📡 initFirebase: Fetching user data...');

        let initialData = null;
        let fetchError = null;

        try {
            const fetchPromise = supabase
                .from(USER_TABLE)
                .select('*')
                .eq('id', uid)
                .maybeSingle();

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Fetch timeout after 3s')), 3000)
            );

            const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
            initialData = result?.data || null;
            fetchError = result?.error || null;
        } catch (e: any) {
            console.warn('📡 initFirebase: Fetch timed out or failed:', e.message);
            fetchError = e;
        }

        console.log('📡 initFirebase: Fetch result:', { found: !!initialData, error: fetchError?.message });

        // 1.1 Self-Repair if not found
        if (!initialData) {
            console.log('📡 initFirebase: User not found, attempting self-repair...');
            logger.debug("User doc not found on init. Attempting self-repair...");

            // Wrap self-repair with timeout to prevent hanging
            try {
                const selfRepairPromise = (async () => {
                    // 1.1 Self-Repair: Create missing user row
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        console.log('📡 initFirebase: Auth user found, creating profile...');
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
                            if (insertError.code === '23505') {
                                logger.debug("Race condition detected. Re-fetching by Auth ID...");
                                const { data: retryData } = await supabase
                                    .from(USER_TABLE)
                                    .select('*')
                                    .eq('auth_id', newUserData.auth_id)
                                    .maybeSingle();

                                if (retryData) {
                                    console.log('📡 initFirebase: Recovered via auth_id lookup');
                                    return { data: retryData.data || {}, settings: retryData.settings || null };
                                }
                            }
                            // Insert failed - return defaults
                            console.error('📡 initFirebase: Insert error:', insertError);
                            return { data: {}, settings: DEFAULT_SETTINGS };
                        } else {
                            console.log('📡 initFirebase: Self-repair SUCCESS');
                            return { data: newUserData.data, settings: newUserData.settings };
                        }
                    }
                    console.error('📡 initFirebase: No auth user found for self-repair!');
                    return { data: {}, settings: DEFAULT_SETTINGS };
                })();

                const timeoutPromise = new Promise<{ data: any; settings: any }>((_, reject) =>
                    setTimeout(() => reject(new Error('Self-repair timeout after 2s')), 2000)
                );

                const result = await Promise.race([selfRepairPromise, timeoutPromise]);
                debouncedOnData(result.data, result.settings);
            } catch (e: any) {
                console.warn('📡 initFirebase: Self-repair timed out or failed:', e.message);
                // CRITICAL: Always call onData to prevent hang
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
