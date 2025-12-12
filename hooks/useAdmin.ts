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

// Hardcoded admin UIDs (update with your actual admin UIDs)
const ADMIN_UIDS: string[] = [
    // Add your UID here
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

        setUserId(user.uid);

        // Check hardcoded admin UIDs
        if (ADMIN_UIDS.includes(user.uid)) {
            setIsAdmin(true);
            return true;
        }

        // Check custom claims
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
