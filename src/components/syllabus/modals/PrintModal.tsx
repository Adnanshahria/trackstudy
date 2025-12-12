
import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onPrint: (mode: 'p1' | 'p2' | 'both') => void;
}

export const PrintModal: React.FC<Props> = ({ isOpen, onClose, onPrint }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Print Syllabus">
            <div className="flex flex-col gap-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">Select which papers you want to include in the print view.</p>
                
                <div className="grid grid-cols-1 gap-3">
                    <button onClick={() => onPrint('p1')} className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 transition-all flex items-center gap-3 group">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">P1</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">Print Paper 1 Only</span>
                    </button>
                    
                    <button onClick={() => onPrint('p2')} className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 transition-all flex items-center gap-3 group">
                        <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">P2</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">Print Paper 2 Only</span>
                    </button>
                    
                    <button onClick={() => onPrint('both')} className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 transition-all flex items-center gap-3 group">
                        <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">ALL</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">Print Both Papers</span>
                    </button>
                </div>

                <div className="flex justify-end mt-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                </div>
            </div>
        </Modal>
    );
};
