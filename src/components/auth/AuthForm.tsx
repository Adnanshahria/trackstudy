import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { AuthInput } from './AuthInput';

interface Props {
    modalMode: 'login' | 'create' | 'reset' | 'change';
    setModalMode: (m: 'login' | 'create' | 'reset' | 'change') => void;
    tempUserId: string; setTempUserId: (v: string) => void;
    tempPass: string; setTempPass: (v: string) => void;
    confirmPass: string; setConfirmPass: (v: string) => void;
    showPass: boolean; setShowPass: (v: boolean) => void;
    handleUserAction: () => void; handleGuestLogin: () => void;
    handleGoogleLogin: () => void;
    isChecking: boolean; error: string; success: string;
    recoveredPassword: string;
    onSuccess?: () => void;
}

export const AuthForm: React.FC<Props> = (props) => {
    const { modalMode, setModalMode, tempUserId, setTempUserId, tempPass, setTempPass, confirmPass, setConfirmPass, showPass, setShowPass, handleUserAction, handleGuestLogin, handleGoogleLogin, isChecking, error, success, recoveredPassword } = props;
    const [showEmailLogin, setShowEmailLogin] = useState(false);

    // Display Logic
    const isLogin = modalMode === 'login';
    const isCreate = modalMode === 'create';
    const isReset = modalMode === 'reset';
    const isChange = modalMode === 'change';

    // Logic to show inputs: Always show for Reset/Change. For Login/Create, toggle.
    const showInputs = isReset || isChange || showEmailLogin;

    return (
        <div className="flex flex-col gap-4">

            {/* Email / ID Login (Toggle or Inputs) */}
            {(isLogin || isCreate) && (
                !showEmailLogin ? (
                    <button
                        onClick={() => setShowEmailLogin(true)}
                        className="w-full bg-white text-black hover:bg-slate-100 font-bold py-3 rounded-xl flex items-center justify-center gap-3 transition-colors mb-2 uppercase"
                    >
                        <span className="text-xl">✉️</span>
                        CONTINUE WITH EMAIL ID
                    </button>
                ) : (
                    <div className="flex flex-col gap-3 md:gap-5 animate-slide-down mb-2">
                        {/* Unified Input */}
                        <AuthInput
                            label="Email ID"
                            icon="👤"
                            value={tempUserId}
                            onChange={setTempUserId}
                            onEnter={handleUserAction}
                            placeholder="myname@gmail.com"
                        />

                        {recoveredPassword && (
                            <div className="relative p-0.5 md:p-1 rounded-xl md:rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-500/20 backdrop-blur-lg border border-emerald-300/30 dark:border-emerald-400/20 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-600/20">
                                <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 p-2 md:p-4 rounded-lg md:rounded-xl text-emerald-800 dark:text-emerald-200 text-xs md:text-sm">
                                    <strong>✓ Your Password:</strong><br />
                                    <code className="bg-white dark:bg-slate-800 px-2 md:px-3 py-1 md:py-2 rounded-lg mt-1 md:mt-2 inline-block font-mono font-bold text-emerald-700 dark:text-emerald-300 text-xs">{recoveredPassword}</code>
                                </div>
                            </div>
                        )}

                        {modalMode !== 'reset' && (
                            <div>
                                <div className="flex justify-between items-center ml-1.5 md:ml-2 mb-1 md:mb-1.5">
                                    <label className="text-[9px] md:text-[10px] uppercase font-bold text-slate-400">{modalMode === 'change' ? 'Old Password' : 'Password'}</label>
                                    {isLogin && (
                                        <div className="flex gap-1.5 md:gap-2">
                                            <button onClick={() => setModalMode('change')} className="px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg text-[9px] md:text-[10px] font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">Change</button>
                                            <button onClick={() => setModalMode('reset')} className="px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg text-[9px] md:text-[10px] font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg">Forgot?</button>
                                        </div>
                                    )}
                                </div>
                                <div className="relative group">
                                    <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-base md:text-lg opacity-50">🔑</span>
                                    <input
                                        type={showPass ? "text" : "password"}
                                        value={tempPass}
                                        onChange={(e) => setTempPass(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleUserAction()}
                                        className="w-full bg-transparent border border-slate-300 dark:border-white/20 rounded-xl md:rounded-2xl pl-9 md:pl-12 pr-12 md:pr-16 py-2.5 md:py-3.5 text-xs md:text-sm font-semibold focus:outline-none focus:border-blue-500 dark:text-white"
                                    />
                                    <button onClick={() => setShowPass(!showPass)} className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[9px] md:text-[10px] font-bold uppercase">{showPass ? 'Hide' : 'Show'}</button>
                                </div>
                            </div>
                        )}

                        {(isChange || isCreate) && <AuthInput label={isChange ? "New Password" : "Confirm Password"} icon="✅" type="password" value={confirmPass} onChange={setConfirmPass} onEnter={handleUserAction} />}

                        {error && <div className="text-[10px] md:text-xs text-rose-600 bg-rose-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-rose-200">⚠️ {error}</div>}
                        {success && <div className="text-[10px] md:text-xs text-emerald-600 bg-emerald-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-emerald-200">✨ {success}</div>}

                        <div className="relative group p-0.5 md:p-1 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-blue-500/20 backdrop-blur-lg border border-blue-300/30 dark:border-blue-400/20 shadow-lg shadow-blue-500/10 dark:shadow-blue-600/20">
                            <Button
                                onClick={handleUserAction}
                                disabled={!tempUserId.trim() || isChecking || (isReset && !!recoveredPassword)}
                                className="w-full py-3 md:py-4 text-xs md:text-sm rounded-lg md:rounded-xl"
                            >
                                {isChecking ? 'Processing...' : (isReset ? 'Recover Password' : isChange ? 'Change Password' : isCreate ? 'Create Account' : 'Sign In')}
                            </Button>
                        </div>
                    </div>
                )
            )}

            {/* OR Divider (between Email/Inputs and Google) */}
            {(isLogin || isCreate) && (
                <div className="flex items-center gap-4 my-2">
                    <div className="h-px flex-1 bg-white/10"></div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">OR</span>
                    <div className="h-px flex-1 bg-white/10"></div>
                </div>
            )}

            {/* Google Sign In - DISABLED */}
            {(isLogin || isCreate) && (
                <button
                    disabled
                    className="w-full bg-white/50 text-black/50 font-bold py-3 rounded-xl flex items-center justify-center gap-3 cursor-not-allowed opacity-60 pointer-events-none mb-2"
                >
                    <svg className="w-5 h-5 opacity-50" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" />
                        <path fill="#EA4335" d="M12 4.66c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google Sign In (Coming Soon)
                </button>
            )}

            {(isReset || isChange) && (
                <div className="relative group p-0.5 md:p-1 rounded-full bg-gradient-to-r from-slate-500/10 via-slate-400/5 to-slate-500/10 backdrop-blur-lg border border-slate-300/30 dark:border-slate-400/20">
                    <button onClick={() => setModalMode('login')} className="w-full px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors rounded-full">&larr; Back to Sign In</button>
                </div>
            )}
        </div>
    );
};