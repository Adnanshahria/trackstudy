
import { firestore, firebaseAuth } from './core';
import { DEFAULT_SETTINGS } from '../../constants';
import firebase from 'firebase/compat/app';

const FIREBASE_USER_COLLECTION = 'users';
const DOMAIN = '@study-dashboard.com';

const sanitizeId = (id: string) => id.replace(/[/#\?]/g, '_');
const getEmail = (id: string) => id.includes('@') ? id : id + DOMAIN;

const getErrorMessage = (error: any) => {
    const code = error.code;
    if (code === 'auth/invalid-email') return 'Invalid User ID/Email format.';
    if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') return 'Account not found or incorrect password.';
    if (code === 'auth/wrong-password') return 'Incorrect password.';
    if (code === 'auth/email-already-in-use') return 'User ID/Email already exists.';
    if (code === 'auth/weak-password') return 'Password should be at least 6 characters.';
    if (code === 'auth/unauthorized-domain') return `Domain '${window.location.hostname}' is not authorized. Add it to Firebase Console.`;
    if (code === 'auth/network-request-failed') return 'Network error. Check internet connection.';
    return error.message || 'Authentication failed.';
};

export const authenticateUser = async (rawId: string, pass: string) => {
    if (!firebaseAuth || !firestore) return { success: false, error: "Database not connected. Check internet." };
    const email = getEmail(rawId);
    
    // We expect the user to login with credentials that map to a Custom ID (displayName).
    // The listener in useFirebaseSync will pick up the displayName.
    try {
        const result = await firebaseAuth.signInWithEmailAndPassword(email, pass);
        return { success: true, uid: result.user?.displayName || result.user?.uid };
    } catch (e: any) { return { success: false, error: getErrorMessage(e) }; }
};

export const createUser = async (rawId: string, pass: string) => {
    if (!firebaseAuth || !firestore) return { success: false, error: "Database not connected. Check internet." };
    const id = sanitizeId(rawId);
    
    try {
        const result = await firebaseAuth.createUserWithEmailAndPassword(getEmail(rawId), pass);
        if (result.user) {
            // CRITICAL: Set the Auth Profile Display Name to the Custom ID.
            await result.user.updateProfile({ displayName: id });

            // Create Firestore Doc using the Custom ID (id), NOT the random UID.
            await firestore.collection(FIREBASE_USER_COLLECTION).doc(id).set({
                createdAt: new Date().toISOString(),
                settings: DEFAULT_SETTINGS,
                data: { username: id, password: pass }
            }, { merge: true });
            
            return { success: true, uid: id };
        }
        return { success: false, error: "User creation failed" };
    } catch (e: any) { return { success: false, error: getErrorMessage(e) }; }
};

export const loginAnonymously = async () => {
    if (!firebaseAuth) return { success: false, error: "Firebase Auth not initialized" };
    try {
        const result = await firebaseAuth.signInAnonymously();
        
        if (result.user) {
            // Generate Custom Guest ID
            const now = new Date();
            const fmt = (n: number) => n.toString().padStart(2, '0');
            const dateStr = `${now.getFullYear()}${fmt(now.getMonth()+1)}${fmt(now.getDate())}`;
            const timeStr = `${fmt(now.getHours())}${fmt(now.getMinutes())}${fmt(now.getSeconds())}`;
            const rand = Math.floor(1000 + Math.random() * 9000);
            const guestDisplayName = `guest_${dateStr}_${timeStr}_${rand}`;

            // CRITICAL: Set Auth Profile to use Guest ID
            await result.user.updateProfile({ displayName: guestDisplayName });

            // Save to Firestore under the Guest ID
            await firestore.collection(FIREBASE_USER_COLLECTION).doc(guestDisplayName).set({
                createdAt: new Date().toISOString(),
                settings: DEFAULT_SETTINGS,
                data: { username: guestDisplayName, isGuest: true }
            }, { merge: true });

            return { success: true, uid: guestDisplayName };
        }
        return { success: false, error: "Guest session failed to start" };
    } catch (e: any) { return { success: false, error: getErrorMessage(e) }; }
};

export const resetUserPassword = async (id: string) => {
    if (!firebaseAuth) return { success: false, error: "Auth not initialized" };
    try {
        await firebaseAuth.sendPasswordResetEmail(getEmail(id));
        return { success: true, message: "Reset email sent." };
    } catch (e: any) { return { success: false, error: getErrorMessage(e) }; }
};

export const shadowLogin = async (id: string, pass: string) => ({ success: false, error: "Shadow login disabled." });
