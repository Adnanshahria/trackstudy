import { authenticateUser, createUser, resetUserPassword, changeUserPassword, loginAnonymously, signInWithGoogle } from '../utils/storage';

export const authService = {
    login: async (id: string, pass: string) => {
        return await authenticateUser(id, pass);
    },
    signup: async (id: string, pass: string, academicLevel?: 'HSC' | 'SSC') => {
        return await createUser(id, pass, academicLevel);
    },
    resetPassword: async (id: string) => {
        return await resetUserPassword(id);
    },
    changePassword: async (id: string, oldPass: string, newPass: string) => {
        return await changeUserPassword(id, oldPass, newPass);
    },
    guestLogin: async () => {
        return await loginAnonymously();
    },
    googleLogin: async () => {
        return await signInWithGoogle();
    }
};