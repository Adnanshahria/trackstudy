/**
 * useAdmin - Hook for admin detection and actions
 */

import { useState, useEffect, useCallback } from 'react';
import { firebaseAuth } from '../utils/firebase/core';

interface UseAdminResult {
    isAdmin: boolean;
    isLoading: boolean;
    userId: string | null;
    checkAdminStatus: () => Promise<boolean>;
}

// Admin display names (the app uses displayName as userId, not Firebase UID)
// Add your username/displayName here to grant admin access
const ADMIN_DISPLAY_NAMES: string[] = [
    'adnan',
    'Adnan',
    'admin',
    'asmedical',
    'adnanshahria2019@gmail.com', // Added by user request
];

export const useAdmin = (): UseAdminResult => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const checkAdminStatus = useCallback(async (): Promise<boolean> => {
        if (!firebaseAuth) return false;

        const user = firebaseAuth.currentUser;
        if (!user) {
            setIsAdmin(false);
            return false;
        }

        // Get the displayName (which is the userId in this app)
        const displayName = user.displayName;
        setUserId(displayName || user.uid);

        // Check against hardcoded admin display names
        if (displayName && ADMIN_DISPLAY_NAMES.includes(displayName)) {
            setIsAdmin(true);
            return true;
        }

        // Also check custom claims as fallback
        try {
            const tokenResult = await user.getIdTokenResult();
            const hasAdminClaim = tokenResult.claims.admin === true;
            setIsAdmin(hasAdminClaim);
            return hasAdminClaim;
        } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
            return false;
        }
    }, []);

    useEffect(() => {
        const checkStatus = async () => {
            setIsLoading(true);
            await checkAdminStatus();
            setIsLoading(false);
        };

        checkStatus();

        // Listen for auth state changes
        const unsubscribe = firebaseAuth?.onAuthStateChanged(() => {
            checkStatus();
        });

        return () => unsubscribe?.();
    }, [checkAdminStatus]);

    return { isAdmin, isLoading, userId, checkAdminStatus };
};
