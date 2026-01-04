
import { useState, useCallback } from 'react';
import { authService } from '../services/authService';

const MAX_INPUT_LENGTH = 100;
const MIN_PASSWORD_LENGTH = 6;

export const useAuthHandlers = (setUserId: (id: string) => void, onSuccess?: () => void) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [modalMode, setModalMode] = useState<'login' | 'create' | 'reset' | 'change'>('login');
    const [tempUserId, setTempUserId] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [modalError, setModalError] = useState('');
    const [modalSuccess, setModalSuccess] = useState('');
    const [isCheckingUser, setIsCheckingUser] = useState(false);
    const [recoveredPassword, setRecoveredPassword] = useState('');

    const resetModalState = useCallback(() => {
        setTempUserId('');
        setTempPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setModalError('');
        setModalSuccess('');
        setRecoveredPassword('');
    }, []);

    const handleUserAction = async () => {
        console.log('🚀 handleUserAction CALLED! modalMode:', modalMode, 'tempUserId:', tempUserId);
        const trimmedId = tempUserId.trim();
        const trimmedPass = tempPassword;

        if (!trimmedId) {
            setModalError('Please enter a User ID.');
            return;
        }

        // Basic Length Check
        if (trimmedId.length > MAX_INPUT_LENGTH) {
            setModalError('Input is too long.');
            return;
        }

        setModalError('');
        setModalSuccess('');

        // Validation for Create Mode
        if (modalMode === 'create') {
            if (trimmedPass !== confirmPassword) {
                setModalError("Passwords do not match.");
                return;
            }
            if (trimmedPass.length < MIN_PASSWORD_LENGTH) {
                setModalError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
                return;
            }
            if (trimmedPass.length > MAX_INPUT_LENGTH) {
                setModalError('Password is too long.');
                return;
            }
        }

        if ((modalMode === 'login' || modalMode === 'change') && !trimmedPass) {
            setModalError('Please enter a password.');
            return;
        }

        if (modalMode === 'change') {
            // ... existing change password logic ...
            if (confirmPassword.length < MIN_PASSWORD_LENGTH) {
                setModalError(`New password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
                return;
            }
        }

        setIsCheckingUser(true);

        try {
            if (modalMode === 'reset') {
                const result = await authService.resetPassword(trimmedId);
                if (result.success && result.password) {
                    setRecoveredPassword(result.password);
                    setModalSuccess('Password recovered. Use it to sign in.');
                } else {
                    setModalError(result.error || 'Reset failed.');
                }
            } else if (modalMode === 'change') {
                const result = await authService.changePassword(trimmedId, trimmedPass, confirmPassword);
                if (result.success) {
                    setModalSuccess('Password changed successfully!');
                    setTimeout(() => { setModalMode('login'); resetModalState(); }, 2000);
                } else {
                    setModalError(result.error || 'Password change failed.');
                }
            } else if (modalMode === 'login') {
                // Login
                const result = await authService.login(trimmedId, trimmedPass);
                if (result.success && result.id) {
                    onSuccess?.();
                    setShowLoginModal(false);
                    resetModalState();
                } else {
                    setModalError(result.error || 'Login failed.');
                }
            } else {
                // Sign Up (ID/Email only)
                const result = await authService.signup(trimmedId, trimmedPass);

                if (result.success) {
                    // Force reload or just let the effect handle it
                    window.location.reload();
                    return;
                } else {
                    setModalError(result.error || 'Account creation failed.');
                }
            }
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Network error. Please try again.';
            setModalError(errorMessage);
        } finally {
            setIsCheckingUser(false);
        }
    };


    const handleGuestLogin = async () => {
        setModalError('');
        setIsCheckingUser(true);
        try {
            const result = await authService.guestLogin();
            if (result.success && result.id) {
                // Force reload to ensure connection
                window.location.reload();
                return;
            } else {
                setModalError(result.error || 'Guest login failed. Please try again.');
            }
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Network error. Please try again.';
            setModalError(errorMessage);
        } finally {
            setIsCheckingUser(false);
        }
    };

    const handleGoogleLogin = async () => {
        setModalError('');
        setIsCheckingUser(true);
        try {
            const result = await authService.googleLogin();
            if (!result.success) {
                setModalError(result.error || 'Google login failed.');
                setIsCheckingUser(false);
            }
        } catch (e: any) {
            setModalError(e.message || 'Google login error.');
            setIsCheckingUser(false);
        }
    };

    return { showLoginModal, setShowLoginModal, modalMode, setModalMode, tempUserId, setTempUserId, tempPassword, setTempPassword, confirmPassword, setConfirmPassword, showPassword, setShowPassword, modalError, modalSuccess, isCheckingUser, handleUserAction, handleGuestLogin, handleGoogleLogin, resetModalState, recoveredPassword, setRecoveredPassword };
};
