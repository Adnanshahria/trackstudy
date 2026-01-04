import React from 'react';
import { AuthForm } from './AuthForm';

interface AuthPageProps {
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
    handleGoogleLogin: () => void;
    isCheckingUser: boolean;
    modalSuccess: string;
    resetModalState: () => void;
    recoveredPassword: string;
    academicLevel: 'HSC' | 'SSC';
    setAcademicLevel: (val: 'HSC' | 'SSC') => void;
}

export const AuthPage: React.FC<AuthPageProps> = (props) => {
    if (!props.isOpen) return null;

    const isDomainError = props.modalError && props.modalError.toLowerCase().includes('domain');

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 animate-fade-in">
            {/* Close Button */}
            <button
                onClick={props.onClose}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="w-full max-w-md flex flex-col gap-6 md:gap-8 p-6 md:p-8 rounded-2xl border-2 border-blue-600/50 shadow-[0_0_50px_-10px_rgba(37,99,235,0.3)] bg-black">
                {/* Header / Title */}
                <div className="text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {props.modalMode === 'login' ? 'Welcome Back' : props.modalMode === 'create' ? 'Join TrackStudy' : props.modalMode === 'change' ? 'Change Password' : 'Reset Password'}
                    </h1>
                    <p className="text-slate-400 text-sm">
                        {props.modalMode === 'login' ? 'Log in to sync your progress' : 'Create an account to start tracking'}
                    </p>
                </div>

                {/* Login/Signup Toggle */}
                {(props.modalMode === 'login' || props.modalMode === 'create') && (
                    <div className="flex p-1 bg-neutral-900 rounded-full border border-white/10">
                        <button onClick={() => { props.setModalMode('login'); props.resetModalState(); }} className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-colors duration-200 ${props.modalMode === 'login' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-white'}`}>Log In</button>
                        <button onClick={() => { props.setModalMode('create'); props.resetModalState(); }} className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-colors duration-200 ${props.modalMode === 'create' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-white'}`}>
                            Create Account
                        </button>
                    </div>
                )}

                {/* Form */}
                <AuthForm
                    modalMode={props.modalMode} setModalMode={(m) => { props.setModalMode(m); props.resetModalState(); }}
                    tempUserId={props.tempUserId} setTempUserId={props.setTempUserId}
                    tempPass={props.tempPassword} setTempPass={props.setTempPassword}
                    confirmPass={props.confirmPassword} setConfirmPass={props.setConfirmPassword}
                    showPass={props.showPassword} setShowPass={props.setShowPassword}
                    handleUserAction={props.handleUserAction} handleGuestLogin={props.handleGuestLogin}
                    handleGoogleLogin={props.handleGoogleLogin}
                    isChecking={props.isCheckingUser} error={props.modalError} success={props.modalSuccess}
                    recoveredPassword={props.recoveredPassword}
                    academicLevel={props.academicLevel} setAcademicLevel={props.setAcademicLevel}
                />

                {/* Hints */}
                {props.modalError && (props.modalError.toLowerCase().includes('not found') || props.modalError.toLowerCase().includes('no user')) && (
                    <div className="text-xs text-center text-slate-400 bg-blue-900/20 p-3 rounded-lg border border-blue-700/50">
                        <p className="mb-2">This User ID doesn't exist yet.</p>
                        <button onClick={() => { props.setModalMode('create'); props.resetModalState(); }} className="text-blue-400 font-bold hover:underline">Create Account</button> first to get started!
                    </div>
                )}

                {isDomainError && (
                    <div className="text-xs p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg text-amber-200">
                        <strong>Deployment Issue:</strong> This domain is not authorized.
                        <br />
                        Go to <a href="https://supabase.com/dashboard" target="_blank" className="underline font-bold">Supabase Dashboard</a> and add:
                        <code className="bg-black/30 px-1 py-0.5 rounded mt-1 block w-fit">{window.location.hostname}</code>
                    </div>
                )}
            </div>
        </div>
    );
};