import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    modalMode: 'login' | 'create' | 'reset';
    setModalMode: (mode: 'login' | 'create' | 'reset') => void;
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
}

export const AuthModal: React.FC<AuthModalProps> = ({
    isOpen, onClose, modalMode, setModalMode,
    tempUserId, setTempUserId,
    tempPassword, setTempPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    handleUserAction, handleGuestLogin,
    isCheckingUser, modalError, modalSuccess, resetModalState
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={modalMode === 'login' ? 'Sign In' : modalMode === 'create' ? 'Create Account' : 'Reset Password'}>
            <div className="flex flex-col gap-6">
                {/* Modern Pill Tabs */}
                <div className="flex p-1 bg-slate-200/50 dark:bg-black/40 rounded-full relative backdrop-blur-sm">
                    <button 
                        onClick={() => { setModalMode('login'); resetModalState(); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-full transition-all duration-300 z-10 ${modalMode === 'login' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => { setModalMode('create'); resetModalState(); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-full transition-all duration-300 z-10 relative overflow-hidden ${modalMode === 'create' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                    >
                        <span className="relative z-10">Create Account</span>
                        {/* Intense Red Glow when not active */}
                        {modalMode !== 'create' && <span className="absolute inset-0 rounded-full bg-rose-500/20 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.6)] border border-rose-500/50"></span>}
                    </button>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider ml-2">User ID</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-50 group-focus-within:opacity-100 transition-opacity">👤</span>
                            <input 
                                type="text" 
                                value={tempUserId}
                                onChange={(e) => setTempUserId(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUserAction()}
                                placeholder="Enter your username"
                                className="w-full bg-transparent border border-slate-300 dark:border-white/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-2">
                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                {modalMode === 'reset' ? 'New Password' : 'Password'} 
                                {(modalMode === 'create' || modalMode === 'reset') && ' (Min 6 chars)'}
                            </label>
                            {modalMode === 'login' && (
                                <button onClick={() => { setModalMode('reset'); resetModalState(); }} className="text-[10px] font-bold text-blue-500 hover:text-blue-600 hover:underline">
                                    Forgot Password?
                                </button>
                            )}
                        </div>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-50 group-focus-within:opacity-100 transition-opacity">🔑</span>
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={tempPassword}
                                onChange={(e) => setTempPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUserAction()}
                                placeholder="••••••••"
                                className="w-full bg-transparent border border-slate-300 dark:border-white/20 rounded-2xl pl-12 pr-16 py-3.5 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white transition-all placeholder:text-slate-400"
                            />
                            <button 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 p-1.5 text-[10px] font-bold uppercase transition-colors"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    {(modalMode === 'create' || modalMode === 'reset') && (
                        <div className="space-y-1.5 animate-fade-in">
                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider ml-2">Confirm {modalMode === 'reset' ? 'New ' : ''}Password</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-50 group-focus-within:opacity-100 transition-opacity">✅</span>
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleUserAction()}
                                    placeholder="••••••••"
                                    className="w-full bg-transparent border border-slate-300 dark:border-white/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    )}

                    {modalError && <div className="text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-500/10 p-3 rounded-xl border border-rose-200 dark:border-rose-500/20 flex items-center gap-2 animate-fade-in">⚠️ {modalError}</div>}
                    {modalSuccess && <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2 animate-fade-in">✨ {modalSuccess}</div>}
                </div>

                <div className="flex flex-col gap-3 mt-4">
                    <Button 
                        onClick={handleUserAction} 
                        disabled={!tempUserId.trim() || isCheckingUser} 
                        className={`w-full py-4 text-sm rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 ${modalMode === 'create' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-600/20' : modalMode === 'reset' ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-orange-500/20' : 'shadow-blue-600/20'}`}
                    >
                        {isCheckingUser ? 'Processing...' : (modalMode === 'login' ? 'Sign In' : modalMode === 'create' ? 'Create Account' : 'Update Password')}
                    </Button>
                    
                    {modalMode === 'login' && (
                        <button 
                            onClick={handleGuestLogin}
                            className="w-full py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                        >
                            <span>👤 Continue as Guest</span>
                        </button>
                    )}
                    
                    {modalMode === 'reset' && (
                        <button onClick={() => setModalMode('login')} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white mt-2 font-medium">
                            &larr; Back to Sign In
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};