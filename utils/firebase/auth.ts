import { firestore, firebaseAuth } from './core';
import { DEFAULT_SETTINGS } from '../../constants';
import firebase from 'firebase/compat/app';

const FIREBASE_USER_COLLECTION = 'users';
const DOMAIN = '@study-dashboard.com';
const getEmail = (id: string) => id.includes('@') ? id : id + DOMAIN;

const getErrorMessage = (error: any) => {
    const code = error.code;
    if (code === 'auth/invalid-email') return 'Invalid User ID/Email format.';
    if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') return 'Account not found or incorrect password.';
    if (code === 'auth/wrong-password') return 'Incorrect password.';
    if (code === 'auth/email-already-in-use') return 'User ID/Email already exists.';
    if (code === 'auth/weak-password') return 'Password should be at least 6 characters.';
    if (code === 'auth/unauthorized-domain') return 'Domain not allowed. Add this domain in Firebase Console > Authentication > Settings.';
    return error.message || 'Authentication failed.';
};

export const authenticateUser = async (id: string, pass: string) => {
    if (!firebaseAuth || !firestore) return { success: false, error: "Database not connected. Check internet." };
    const email = getEmail(id);
    try {
        const result = await firebaseAuth.signInWithEmailAndPassword(email, pass);
        if (result.user) {
            // CRITICAL CHANGE: Use the 'id' (username) as the document key as per user request.
            // This ensures the database ID matches the username (e.g., 'astest') instead of the garbage UID.
            await firestore.collection(FIREBASE_USER_COLLECTION).doc(id).set({
                data: { username: id, password: pass }
            }, { merge: true });
            
            // Return the username (id) as the 'uid' for the app to use
            return { success: true, uid: id };
        }
        return { success: false, error: "User info missing" };
    } catch (e: any) { return { success: false, error: getErrorMessage(e) }; }
};

export const createUser = async (id: string, pass: string) => {
    if (!firebaseAuth || !firestore) return { success: false, error: "Database not connected. Check internet." };
    try {
        const result = await firebaseAuth.createUserWithEmailAndPassword(getEmail(id), pass);
        if (result.user) {
            // CRITICAL CHANGE: Use the 'id' (username) as the document key.
            await firestore.collection(FIREBASE_USER_COLLECTION).doc(id).set({
                createdAt: new Date().toISOString(),
                settings: DEFAULT_SETTINGS,
                data: { username: id, password: pass }
            }, { merge: true });
            
            // Return the username (id) as the 'uid' for the app to use
            return { success: true, uid: id };
        }
        return { success: false, error: "User creation failed" };
    } catch (e: any) { return { success: false, error: getErrorMessage(e) }; }
};

export const loginAnonymously = async () => {
    if (!firebaseAuth) return { success: false, error: "Firebase Auth not initialized" };
    try {
        const result = await firebaseAuth.signInAnonymously();
        return { success: true, uid: result.user?.uid };
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