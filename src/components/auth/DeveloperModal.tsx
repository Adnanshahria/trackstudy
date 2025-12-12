
import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { APP_VERSION } from '../../constants/version';

interface DeveloperModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Developer Info">
            <div className="flex flex-col gap-3">
                <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-xl shadow-black/5 dark:shadow-black/20">
                    <div>
                        <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-black shadow-[0_0_15px_rgba(0,0,0,0.3)] dark:shadow-[0_0_15px_rgba(255,255,255,0.4)] mb-2">TS</div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-0.5">Mohammed Adnan Shahria</h2>
                        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <span>Developer</span>
                            <span>•</span>
                            <span>Founder</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Role</label>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">Head Of Dev Department</div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Version</label>
                        <div className="text-sm font-mono text-slate-700 dark:text-slate-200">{APP_VERSION}</div>
                    </div>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Contact</label>
                    <div className="grid grid-cols-1 gap-3">
                        <a href="mailto:adnanshahria2006@gmail.com" className="flex items-center gap-3 p-3 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 rounded-xl group transition-all">
                            <span className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform">✉️</span>
                            <div>
                                <div className="text-xs font-bold text-blue-600 dark:text-blue-400">Send Email</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">Compose to Adnan</div>
                            </div>
                        </a>
                        <div className="grid grid-cols-2 gap-3">
                            <a href="https://t.me/adnanshahria" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 bg-sky-500/5 hover:bg-sky-500/10 border border-sky-500/20 rounded-xl text-xs font-bold text-sky-600 dark:text-sky-400 transition-all hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] group">
                                <span className="group-hover:-translate-y-0.5 transition-transform">✈️</span> Telegram
                            </a>
                            <a href="https://wa.me/8801998529362" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] group">
                                <span className="group-hover:-translate-y-0.5 transition-transform">💬</span> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-2">
                    <Button onClick={onClose} className="w-full py-3 shadow-lg shadow-blue-500/20">Close</Button>
                </div>
            </div>
        </Modal>
    );
};
