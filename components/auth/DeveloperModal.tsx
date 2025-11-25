import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface DeveloperModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Developer Info">
            <div className="flex flex-col gap-3">
                <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Developer</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">Mohammed Adnan Shahria</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Role</p>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Full Stack Developer</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Version</p>
                            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">v38.2 (Solid)</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Contact</p>
                        <div className="flex flex-col gap-2">
                            {/* Email - Primary Action - Clickable */}
                            <a 
                                href="mailto:adnanshahria2006@gmail.com"
                                className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-white transition-all border border-blue-500/20 group cursor-pointer"
                            >
                                <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg group-hover:bg-white/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold">Send Email</span>
                                    <span className="text-[10px] opacity-70">Compose to Adnan</span>
                                </div>
                            </a>

                            <div className="flex gap-2">
                                {/* Telegram */}
                                <a 
                                    href="https://t.me/adnanshahria" 
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-sky-500/10 text-sky-600 hover:bg-sky-500 hover:text-white transition-all border border-sky-500/20 cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>
                                    <span className="text-xs font-bold">Telegram</span>
                                </a>

                                {/* WhatsApp */}
                                <a 
                                    href="https://wa.me/8801853452264" 
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20 cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" /> 
                                         <path strokeLinecap="round" strokeLinejoin="round" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z" /> 
                                    </svg>
                                    <span className="text-xs font-bold">WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <Button onClick={onClose} className="w-full py-3 rounded-xl">Close</Button>
            </div>
        </Modal>
    );
};