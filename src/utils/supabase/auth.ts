
import { supabase } from './client';
import { DEFAULT_SETTINGS } from '../../constants';

const USER_TABLE = 'users';

const getErrorMessage = (error: any) => {
    return error.message || 'Authentication failed.';
};

const sanitizeId = (id: string) => id.replace(/[/#\?]/g, '_');

// Helper to check if a user exists in the public 'users' table
const checkUserExists = async (username: string) => {
    const { data, error } = await supabase
        .from(USER_TABLE)
        .select('id')
        .eq('id', username)
        .single();
    return !!data && !error;
};



export const createUser = async (rawId: string, pass: string) => {
    const DOMAIN = '@study-dashboard.com';
    const id = sanitizeId(rawId);
    const email = rawId.includes('@') ? rawId : rawId + DOMAIN;

    try {
        // Check if username already taken in our public table
        const exists = await checkUserExists(id);
        if (exists) {
            return { success: false, error: 'User ID already exists.' };
        }

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

        if (authError) throw authError;
        if (!authData.user) throw new Error("User creation failed");

        // User profile creation is now handled by a Database Trigger on auth.users insert.
        // We trust the trigger to create the public.users row.


        return { success: true, id: id };
    } catch (e: any) {
        console.error("Signup Error:", e);
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
    // 1. Attempt Supabase SignOut
    try {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("SignOut Error", error);
    } catch (e) {
        console.error("SignOut Exception", e);
    }

    // 2. Force Clear LocalStorage Tokens (Scorched Earth)
    try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        console.log("Cleared Supabase Tokens from Storage");
    } catch (e) {
        console.warn("LocalStorage clear failed", e);
    }
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


