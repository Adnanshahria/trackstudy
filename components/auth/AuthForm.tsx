import React from 'react';
import { Button } from '../ui/Button';
import { AuthInput } from './AuthInput';

interface Props {
    modalMode: 'login' | 'create' | 'reset';
    setModalMode: (m: 'login' | 'create' | 'reset') => void;
    tempUserId: string; setTempUserId: (v: string) => void;
    tempPass: string; setTempPass: (v: string) => void;
    confirmPass: string; setConfirmPass: (v: string) => void;
    showPass: boolean; setShowPass: (v: boolean) => void;
    handleUserAction: () => void; handleGuestLogin: () => void;
    isChecking: boolean; error: string; success: string;
}

export const AuthForm: React.FC<Props> = (props) => {
    const { modalMode, setModalMode, tempUserId, setTempUserId, tempPass, setTempPass, confirmPass, setConfirmPass, showPass, setShowPass, handleUserAction, handleGuestLogin, isChecking, error, success } = props;

    return (
        <div className="flex flex-col gap-5">
            <AuthInput label="User ID" icon="👤" value={tempUserId} onChange={setTempUserId} onEnter={handleUserAction} placeholder="Enter username" />
            
            {modalMode !== 'reset' && (
                <div>
                    <div className="flex justify-between items-center ml-2 mb-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Password</label>
                        {modalMode === 'login' && <button onClick={() => setModalMode('reset')} className="text-[10px] font-bold text-blue-500">Forgot?</button>}
                    </div>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-50">🔑</span>
                        <input type={showPass ? "text" : "password"} value={tempPass} onChange={(e) => setTempPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUserAction()} className="w-full bg-transparent border border-slate-300 dark:border-white/20 rounded-2xl pl-12 pr-16 py-3.5 text-sm font-semibold focus:outline-none focus:border-blue-500 dark:text-white" />
                        <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">{showPass ? 'Hide' : 'Show'}</button>
                    </div>
                </div>
            )}
            
            {modalMode === 'create' && <AuthInput label="Confirm Password" icon="✅" type="password" value={confirmPass} onChange={setConfirmPass} onEnter={handleUserAction} />}

            {error && <div className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">⚠️ {error}</div>}
            {success && <div className="text-xs text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">✨ {success}</div>}

            <div className="flex flex-col gap-3 mt-4">
                <Button onClick={handleUserAction} disabled={!tempUserId.trim() || isChecking} className="w-full py-4 text-sm rounded-xl shadow-lg">{isChecking ? 'Processing...' : (modalMode === 'login' ? 'Sign In' : modalMode === 'create' ? 'Create Account' : 'Send Reset Link')}</Button>
                {modalMode === 'login' && <button onClick={handleGuestLogin} className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5">👤 Continue as Guest</button>}
                {modalMode === 'reset' && <button onClick={() => setModalMode('login')} className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white mt-2 font-medium">&larr; Back to Sign In</button>}
            </div>
        </div>
    );
};