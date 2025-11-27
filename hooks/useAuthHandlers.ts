
import { useState } from 'react';
import { authService } from '../services/authService';

export const useAuthHandlers = (setUserId: (id: string) => void) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [modalMode, setModalMode] = useState<'login' | 'create' | 'reset'>('login');
    const [tempUserId, setTempUserId] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [modalError, setModalError] = useState('');
    const [modalSuccess, setModalSuccess] = useState('');
    const [isCheckingUser, setIsCheckingUser] = useState(false);

    const resetModalState = () => { setTempUserId(''); setTempPassword(''); setConfirmPassword(''); setShowPassword(false); setModalError(''); setModalSuccess(''); };

    const handleUserAction = async () => {
        if (!tempUserId.trim()) return;
        setModalError(''); setModalSuccess('');
        if (modalMode === 'create') {
            if (tempPassword !== confirmPassword) { setModalError("Passwords do not match."); return; }
            if (tempPassword.length < 6) { setModalError("Password must be at least 6 characters."); return; }
        }
        setIsCheckingUser(true);
        const inputId = tempUserId.trim();
        const inputPass = tempPassword.trim();
        try {
            if (modalMode === 'reset') {
                const result = await authService.resetPassword(inputId);
                if (result.success) { setModalSuccess('Reset link sent.'); setTimeout(() => setModalMode('login'), 4000); } 
                else { setModalError(result.error || 'Reset failed.'); }
            } else if (modalMode === 'login') {
                const result = await authService.login(inputId, inputPass);
                // FIX: Do not manually setUserId here. Let the onAuthStateChanged listener in useFirebaseSync handle it.
                // This prevents race conditions where we might have the wrong ID vs Auth Token.
                if (result.success && result.uid) { 
                    setShowLoginModal(false); 
                    resetModalState(); 
                } 
                else { setModalError(result.error || 'Login failed.'); }
            } else {
                const result = await authService.signup(inputId, inputPass);
                if (result.success && result.uid) { 
                    setShowLoginModal(false); 
                    resetModalState(); 
                } 
                else { setModalError(result.error || 'Creation failed.'); }
            }
        } catch (e) { setModalError('Network error.'); } finally { setIsCheckingUser(false); }
    };

    const handleGuestLogin = async () => {
        setModalError(''); setIsCheckingUser(true);
        try {
            const result = await authService.guestLogin();
            if (result.success && result.uid) { 
                setShowLoginModal(false); 
                // Listener will pick up state
            } 
            else { setModalError(result.error || 'Guest login failed'); }
        } catch (e) { setModalError('Network error'); } finally { setIsCheckingUser(false); }
    };

    return { showLoginModal, setShowLoginModal, modalMode, setModalMode, tempUserId, setTempUserId, tempPassword, setTempPassword, confirmPassword, setConfirmPassword, showPassword, setShowPassword, modalError, modalSuccess, isCheckingUser, handleUserAction, handleGuestLogin, resetModalState };
};
