
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
            <div className="flex flex-col gap-2 md:gap-3">
                <div className="p-3 md:p-5 bg-slate-50 dark:bg-black rounded-xl md:rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 md:space-y-4 shadow-xl shadow-black/5 dark:shadow-black/20">
                    <div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-black text-xs md:text-sm shadow-[0_0_15px_rgba(0,0,0,0.3)] dark:shadow-[0_0_15px_rgba(255,255,255,0.4)] mb-1.5 md:mb-2">TS</div>
                        <h2 className="text-base md:text-xl font-bold text-slate-900 dark:text-white mb-0.5">Mohammed Adnan Shahria</h2>
                        <div className="flex gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <span>Developer</span>
                            <span>•</span>
                            <span>Founder</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <div className="p-2 md:p-4 bg-slate-50 dark:bg-black rounded-xl md:rounded-2xl border border-slate-200 dark:border-white/10">
                        <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5 md:mb-1">Role</label>
                        <div className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200">Head Of Dev Dept</div>
                    </div>
                    <div className="p-2 md:p-4 bg-slate-50 dark:bg-black rounded-xl md:rounded-2xl border border-slate-200 dark:border-white/10">
                        <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5 md:mb-1">Version</label>
                        <div className="text-xs md:text-sm font-mono text-slate-700 dark:text-slate-200">{APP_VERSION}</div>
                    </div>
                </div>

                <div className="p-3 md:p-5 bg-slate-50 dark:bg-black rounded-xl md:rounded-2xl border border-slate-200 dark:border-white/10">
                    <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 md:mb-3">Contact</label>
                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                        <a href="mailto:adnanshahria2006@gmail.com" className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 rounded-lg md:rounded-xl group transition-all">
                            <span className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform text-xs md:text-sm">✉️</span>
                            <div>
                                <div className="text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-400">Send Email</div>
                                <div className="text-[9px] md:text-[10px] text-slate-500 dark:text-slate-400">Compose to Adnan</div>
                            </div>
                        </a>
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                            <a href="https://t.me/adnanshahria" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 md:gap-2 p-2 md:p-3 bg-sky-500/5 hover:bg-sky-500/10 border border-sky-500/20 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold text-sky-600 dark:text-sky-400 transition-all hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] group">
                                <span className="group-hover:-translate-y-0.5 transition-transform">✈️</span> Telegram
                            </a>
                            <a href="https://wa.me/8801705818105" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 md:gap-2 p-2 md:p-3 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] group">
                                <span className="group-hover:-translate-y-0.5 transition-transform">💬</span> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-1 md:mt-2">
                    <Button onClick={onClose} className="w-full py-2.5 md:py-3 shadow-lg shadow-blue-500/20 text-xs md:text-sm">Close</Button>
                </div>
            </div>
        </Modal>
    );
};
