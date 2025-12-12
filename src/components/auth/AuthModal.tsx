import React from 'react';
import { Modal } from '../ui/Modal';
import { AuthForm } from './AuthForm';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    modalMode: 'login' | 'create' | 'reset' | 'change';
    setModalMode: (mode: 'login' | 'create' | 'reset' | 'change') => void;
    tempUserId: string;
    setTempUserId: (val: string) => void;
    tempPassword: string;
    setTempPassword: (val: string) => void;
    confirmPassword: string;
    setConfirmPassword: (val: string) => void;
    showPassword: boolean;
    setShowPassword: (val: boolean) => void;
    handleUserAction: () => void;
    handleGuestLogin: () => void;
    isCheckingUser: boolean;
    modalError: string;
    modalSuccess: string;
    resetModalState: () => void;
    recoveredPassword: string;
}

export const AuthModal: React.FC<AuthModalProps> = (props) => {
    const isDomainError = props.modalError && props.modalError.toLowerCase().includes('domain');

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} title={props.modalMode === 'login' ? 'Sign In' : props.modalMode === 'create' ? 'Create Account' : props.modalMode === 'change' ? 'Change Password' : 'Reset Password'}>
            <div className="flex flex-col gap-6">
                <div className="flex p-1 bg-slate-200/50 dark:bg-black/40 rounded-full relative backdrop-blur-sm">
                    <button onClick={() => { props.setModalMode('login'); props.resetModalState(); }} className={`flex-1 py-2 text-xs font-bold rounded-full transition-all duration-300 z-10 ${props.modalMode === 'login' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>Sign In</button>
                    <button onClick={() => { props.setModalMode('create'); props.resetModalState(); }} className={`flex-1 py-2 text-xs font-bold rounded-full transition-all duration-300 z-10 relative overflow-hidden ${props.modalMode === 'create' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>
                        <span className="relative z-10">Create Account</span>
                        {props.modalMode !== 'create' && <span className="absolute inset-0 rounded-full bg-rose-500/20 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.6)] border border-rose-500/50"></span>}
                    </button>
                </div>
                <AuthForm
                    modalMode={props.modalMode} setModalMode={(m) => { props.setModalMode(m); props.resetModalState(); }}
                    tempUserId={props.tempUserId} setTempUserId={props.setTempUserId}
                    tempPass={props.tempPassword} setTempPass={props.setTempPassword}
                    confirmPass={props.confirmPassword} setConfirmPass={props.setConfirmPassword}
                    showPass={props.showPassword} setShowPass={props.setShowPassword}
                    handleUserAction={props.handleUserAction} handleGuestLogin={props.handleGuestLogin}
                    isChecking={props.isCheckingUser} error={props.modalError} success={props.modalSuccess}
                    recoveredPassword={props.recoveredPassword}
                />

                {/* Helpful Hint for Database Deletion Scenario */}
                {props.modalError && (props.modalError.toLowerCase().includes('not found') || props.modalError.toLowerCase().includes('no user')) && (
                    <div className="text-[10px] text-center text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700/50 animate-fade-in">
                        <p className="mb-2">This User ID doesn't exist yet.</p>
                        <button onClick={() => { props.setModalMode('create'); props.resetModalState(); }} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Create Account</button> first to get started!
                    </div>
                )}

                {/* Helpful Hint for Domain Authorization Scenario */}
                {isDomainError && (
                    <div className="text-[10px] p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg text-amber-800 dark:text-amber-200 animate-fade-in">
                        <strong>Deployment Issue:</strong> This domain is not authorized.
                        <br />
                        Go to <a href="https://console.firebase.google.com" target="_blank" className="underline font-bold">Firebase Console</a> &gt; Authentication &gt; Settings &gt; Authorized Domains and add: <br />
                        <code className="bg-amber-100 dark:bg-black/30 px-1 py-0.5 rounded mt-1 block w-fit">{window.location.hostname}</code>
                    </div>
                )}
            </div>
        </Modal>
    );
};