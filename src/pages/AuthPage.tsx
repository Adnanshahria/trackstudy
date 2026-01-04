import React, { useEffect } from 'react';
import { AuthForm } from '../components/auth/AuthForm';
import { useNavigate } from 'react-router-dom';

interface AuthPageProps {
    // Props matching useAuthHandlers return type, flattened
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
    modalError: string;
    modalSuccess: string;
    resetModalState: () => void;
    recoveredPassword: string;
    academicLevel: 'HSC' | 'SSC';
    setAcademicLevel: (val: 'HSC' | 'SSC') => void;

    // Additional
    userId: string | null;
}

export const AuthPage: React.FC<AuthPageProps> = (props) => {
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (props.userId) {
            navigate('/dashboard');
        }
    }, [props.userId, navigate]);

    // Ensure we start with a clean slate specific to page view if needed, 
    // but props are controlled by App parent currently.

    const isDomainError = props.modalError && props.modalError.toLowerCase().includes('domain');

    return (
        <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4 animate-fade-in relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md flex flex-col gap-6 md:gap-8 p-6 md:p-8 rounded-2xl border-2 border-blue-600/50 shadow-[0_0_50px_-10px_rgba(37,99,235,0.3)] bg-black/80 backdrop-blur-xl z-10">
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

            <button onClick={() => navigate('/')} className="mt-8 text-slate-500 hover:text-white text-sm relative z-10 transition-colors">
                &larr; Back to Home
            </button>
        </div>
    );
};
