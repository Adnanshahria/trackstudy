
import { useState, useCallback } from 'react';
import { authService } from '../services/authService';

const MAX_INPUT_LENGTH = 100;
const MIN_PASSWORD_LENGTH = 6;

export const useAuthHandlers = (setUserId: (id: string) => void, onSuccess?: () => void) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [modalMode, setModalMode] = useState<'login' | 'create' | 'reset'>('login');
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
        const trimmedId = tempUserId.trim();
        const trimmedPass = tempPassword;
        
        if (!trimmedId) {
            setModalError('Please enter a User ID.');
            return;
        }
        if (trimmedId.length > MAX_INPUT_LENGTH) {
            setModalError('User ID is too long.');
            return;
        }
        
        setModalError(''); 
        setModalSuccess('');
        
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
        
        if (modalMode === 'login' && !trimmedPass) {
            setModalError('Please enter a password.');
            return;
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
            } else if (modalMode === 'login') {
                const result = await authService.login(trimmedId, trimmedPass);
                if (result.success && result.uid) { 
                    onSuccess?.();
                    setShowLoginModal(false); 
                    resetModalState(); 
                } else { 
                    setModalError(result.error || 'Login failed.'); 
                }
            } else {
                const result = await authService.signup(trimmedId, trimmedPass);
                if (result.success && result.uid) { 
                    onSuccess?.();
                    setShowLoginModal(false); 
                    resetModalState(); 
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
            if (result.success && result.uid) { 
                onSuccess?.();
                setShowLoginModal(false); 
                resetModalState();
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

    return { showLoginModal, setShowLoginModal, modalMode, setModalMode, tempUserId, setTempUserId, tempPassword, setTempPassword, confirmPassword, setConfirmPassword, showPassword, setShowPassword, modalError, modalSuccess, isCheckingUser, handleUserAction, handleGuestLogin, resetModalState, recoveredPassword, setRecoveredPassword };
};
