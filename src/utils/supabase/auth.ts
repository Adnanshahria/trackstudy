
import { supabase } from './client';
import { DEFAULT_SETTINGS } from '../../constants';

const USER_TABLE = 'users';

const getErrorMessage = (error: any) => {
    return error.message || 'Authentication failed.';
};

const sanitizeId = (id: string) => id.replace(/[/#\?]/g, '_');

// Helper: Promise with timeout
const withTimeout = <T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error(errorMsg)), ms))
    ]);
};

// Helper to check if a user exists in the public 'users' table
const checkUserExists = async (username: string): Promise<boolean> => {
    try {
        console.log('🔐 checkUserExists: Starting query for', username);

        // Create a proper Promise from the Supabase query
        const queryPromise = new Promise<{ data: any, error: any }>((resolve) => {
            supabase
                .from(USER_TABLE)
                .select('id')
                .eq('id', username)
                .maybeSingle()
                .then(result => resolve(result));
        });

        // Race with timeout (5 seconds)
        const timeoutPromise = new Promise<{ data: any, error: any }>((_, reject) =>
            setTimeout(() => reject(new Error('User check timed out')), 5000)
        );

        const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
        console.log('🔐 checkUserExists: Result', { found: !!data, error: error?.message });
        return !!data && !error;
    } catch (e: any) {
        console.error('🔐 checkUserExists: TIMEOUT or ERROR', e.message);
        return false; // Assume user doesn't exist on timeout/error
    }
};



export const createUser = async (rawId: string, pass: string) => {
    console.log('🔐 createUser: Starting signup for', rawId);
    const DOMAIN = '@study-dashboard.com';
    const id = sanitizeId(rawId);
    const email = rawId.includes('@') ? rawId : rawId + DOMAIN;
    console.log('🔐 createUser: Using email:', email);

    try {
        // Check if username already taken in our public table
        console.log('🔐 createUser: Checking if user exists...');
        const exists = await checkUserExists(id);
        console.log('🔐 createUser: User exists?', exists);
        if (exists) {
            return { success: false, error: 'User ID already exists.' };
        }

        console.log('🔐 createUser: Calling supabase.auth.signUp...');
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: pass,
            options: {
                data: {
                    displayName: id, // Store custom ID in metadata
                    // academicLevel is NOT set here - it's set during onboarding
                },
            },
        });
        console.log('🔐 createUser: signUp returned', { user: authData?.user?.id, error: authError?.message });

        if (authError) throw authError;
        if (!authData.user) throw new Error("User creation failed");

        // User profile creation is now handled by a Database Trigger on auth.users insert.
        // We trust the trigger to create the public.users row.

        // IMPORTANT: Sign out immediately to prevent auto-redirect to dashboard
        // Supabase creates an active session on signup when email verification is disabled
        // We want the user to manually log in after seeing the success message
        console.log('🔐 createUser: Signing out to prevent auto-login...');
        await supabase.auth.signOut();

        console.log('🔐 createUser: SUCCESS!');
        return { success: true, id: id };
    } catch (e: any) {
        console.error("🔐 createUser: ERROR", e);
        return { success: false, error: getErrorMessage(e) };
    }
};

export const loginAnonymously = async () => {
    try {
        const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
        if (authError) throw authError;
        if (!authData.user) throw new Error("Guest session failed");

        // Generate Guest ID
        const now = new Date();
        const fmt = (n: number) => n.toString().padStart(2, '0');
        const dateStr = `${now.getFullYear()}${fmt(now.getMonth() + 1)}${fmt(now.getDate())}`;
        const timeStr = `${fmt(now.getHours())}${fmt(now.getMinutes())}${fmt(now.getSeconds())}`;
        const rand = Math.floor(Math.random() * 1000000);
        const uidPrefix = authData.user.id.slice(0, 6);
        const guestDisplayName = `guest_${dateStr}_${timeStr}_${rand}_${uidPrefix}`;

        // Update metadata - Supabase needs User Management API for this usually, but client can update own data? 
        // actually signInAnonymously options might allow it? No.
        // We will just update our table.

        await supabase.auth.updateUser({
            data: { displayName: guestDisplayName }
        });

        const { error: dbError } = await supabase
            .from(USER_TABLE)
            .insert([
                {
                    id: guestDisplayName,
                    auth_id: authData.user.id,
                    created_at: new Date().toISOString(),
                    settings: DEFAULT_SETTINGS,
                    data: { username: guestDisplayName, isGuest: true },
                },
            ]);

        if (dbError) throw dbError;

        return { success: true, id: guestDisplayName };
    } catch (e: any) {
        return { success: false, error: getErrorMessage(e) };
    }
};

export const resetUserPassword = async (id: string) => {
    // Legacy app stored password in the document. We fetch it.
    try {
        const { data, error } = await supabase
            .from(USER_TABLE)
            .select('password')
            .eq('id', id)
            .single();

        if (error || !data) return { success: false, error: "User not found" };

        return { success: true, message: "Password retrieved", password: data.password };
    } catch (e: any) {
        return { success: false, error: "Failed to retrieve password" };
    }
};

export const changeUserPassword = async (id: string, oldPassword: string, newPassword: string) => {
    // 1. Verify old password by trying to sign in (re-auth)
    // 2. Update Auth password
    // 3. Update 'users' table 'password' field
    const DOMAIN = '@study-dashboard.com';
    const email = id.includes('@') ? id : id + DOMAIN;

    try {
        // Re-auth
        const { error: loginError } = await supabase.auth.signInWithPassword({
            email: email,
            password: oldPassword
        });

        if (loginError) return { success: false, error: "Incorrect old password." };

        // Update Auth
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (updateError) throw updateError;

        // Update DB
        const { error: dbError } = await supabase
            .from(USER_TABLE)
            .update({ password: newPassword, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (dbError) throw dbError;

        await supabase.auth.signOut();

        return { success: true, message: "Password changed successfully. Please login again." };
    } catch (e: any) {
        return { success: false, error: getErrorMessage(e) };
    }
};

// Export signOut for useSyncActions
export const signOut = async () => {
    console.log('🚪 signOut: Starting logout...');

    // 1. Attempt Supabase SignOut with timeout protection
    try {
        const signOutPromise = supabase.auth.signOut();
        const timeoutPromise = new Promise<{ error: any }>((_, reject) =>
            setTimeout(() => reject(new Error('SignOut timed out')), 3000)
        );

        try {
            const { error } = await Promise.race([signOutPromise, timeoutPromise]);
            if (error) console.error("SignOut Error", error);
            console.log('🚪 signOut: Supabase signOut completed');
        } catch (timeoutErr) {
            console.warn('🚪 signOut: Supabase signOut timed out, proceeding with local cleanup');
        }
    } catch (e) {
        console.error("SignOut Exception", e);
    }

    // 2. Force Clear LocalStorage Tokens (Scorched Earth) - ALWAYS runs
    console.log('🚪 signOut: Clearing local storage tokens...');
    try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        console.log("🚪 signOut: Cleared Supabase Tokens from Storage:", keysToRemove.length, "keys");
    } catch (e) {
        console.warn("LocalStorage clear failed", e);
    }

    console.log('🚪 signOut: COMPLETE');
};

export const shadowLogin = async () => ({ success: false, error: "Shadow login disabled." });

// Google OAuth
export const signInWithGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin, // Redirect back to app
                queryParams: {
                    access_type: 'offline',
                },
            },
        });
        if (error) throw error;
        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: getErrorMessage(e) };
    }
};

// Unified Login (ID/Email)
export const authenticateUser = async (rawId: string, pass: string) => {
    const DOMAIN = '@study-dashboard.com';
    const email = rawId.includes('@') ? rawId : rawId + DOMAIN;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: pass,
        });

        if (error) throw error;

        return { success: true, id: data.user.user_metadata?.displayName || rawId };
    } catch (e: any) {
        return { success: false, error: getErrorMessage(e) };
    }
};


