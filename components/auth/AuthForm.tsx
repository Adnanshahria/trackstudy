import React from 'react';
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
    isChecking: boolean; error: string; success: string;
    recoveredPassword: string;
}

export const AuthForm: React.FC<Props> = (props) => {
    const { modalMode, setModalMode, tempUserId, setTempUserId, tempPass, setTempPass, confirmPass, setConfirmPass, showPass, setShowPass, handleUserAction, handleGuestLogin, isChecking, error, success, recoveredPassword } = props;

    return (
        <div className="flex flex-col gap-5">
            <AuthInput label="User ID" icon="👤" value={tempUserId} onChange={setTempUserId} onEnter={handleUserAction} placeholder="Enter username" />
            
            {recoveredPassword && (
                <div className="relative p-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-500/20 backdrop-blur-lg border border-emerald-300/30 dark:border-emerald-400/20 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-600/20">
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 p-4 rounded-xl text-emerald-800 dark:text-emerald-200">
                        <strong>✓ Your Password:</strong><br/>
                        <code className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg mt-2 inline-block font-mono font-bold text-emerald-700 dark:text-emerald-300">{recoveredPassword}</code>
                    </div>
                </div>
            )}
            
            {modalMode !== 'reset' && (
                <div>
                    <div className="flex justify-between items-center ml-2 mb-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400">{modalMode === 'change' ? 'Old Password' : 'Password'}</label>
                        {modalMode === 'login' && (
                            <div className="flex gap-2">
                                <button onClick={() => setModalMode('change')} className="px-3 py-1 rounded-lg text-[10px] font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">Change Password</button>
                                <button onClick={() => setModalMode('reset')} className="px-3 py-1 rounded-lg text-[10px] font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg">Forgot?</button>
                            </div>
                        )}
                    </div>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-50">🔑</span>
                        <input type={showPass ? "text" : "password"} value={tempPass} onChange={(e) => setTempPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUserAction()} className="w-full bg-transparent border border-slate-300 dark:border-white/20 rounded-2xl pl-12 pr-16 py-3.5 text-sm font-semibold focus:outline-none focus:border-blue-500 dark:text-white" />
                        <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold uppercase">{showPass ? 'Hide' : 'Show'}</button>
                    </div>
                </div>
            )}
            
            {modalMode === 'change' && <AuthInput label="New Password" icon="✨" type="password" value={confirmPass} onChange={setConfirmPass} onEnter={handleUserAction} />}
            {modalMode === 'create' && <AuthInput label="Confirm Password" icon="✅" type="password" value={confirmPass} onChange={setConfirmPass} onEnter={handleUserAction} />}

            {error && <div className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">⚠️ {error}</div>}
            {success && <div className="text-xs text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">✨ {success}</div>}

            <div className="flex flex-col gap-3 mt-4">
                <div className="relative group p-1 rounded-2xl bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-blue-500/20 backdrop-blur-lg border border-blue-300/30 dark:border-blue-400/20 shadow-lg shadow-blue-500/10 dark:shadow-blue-600/20">
                    <Button onClick={handleUserAction} disabled={!tempUserId.trim() || isChecking || (modalMode === 'reset' && !!recoveredPassword)} className="w-full py-4 text-sm rounded-xl">{isChecking ? 'Processing...' : (modalMode === 'login' ? 'Sign In' : modalMode === 'create' ? 'Create Account' : modalMode === 'change' ? 'Change Password' : 'Recover Password')}</Button>
                </div>
                {modalMode === 'login' && (
                    <div className="relative group p-1 rounded-2xl bg-gradient-to-r from-slate-500/10 via-slate-400/5 to-slate-500/10 backdrop-blur-lg border border-slate-300/30 dark:border-slate-400/20 shadow-lg shadow-slate-500/10 dark:shadow-slate-600/20">
                        <button onClick={handleGuestLogin} className="w-full py-3 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-bold hover:text-slate-900 dark:hover:text-white transition-colors">👤 Continue as Guest</button>
                    </div>
                )}
                {(modalMode === 'reset' || modalMode === 'change') && (
                    <div className="relative group p-1 rounded-full bg-gradient-to-r from-slate-500/10 via-slate-400/5 to-slate-500/10 backdrop-blur-lg border border-slate-300/30 dark:border-slate-400/20">
                        <button onClick={() => setModalMode('login')} className="w-full px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors rounded-full">&larr; Back to Sign In</button>
                    </div>
                )}
            </div>
        </div>
    );
};