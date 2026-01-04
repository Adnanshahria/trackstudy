import React from 'react';
import { Modal } from '../ui/Modal';
import { UserSettings } from '../../types';
import { getSyllabusData } from '../../constants/data';

interface Props {
    isOpen: boolean;
    onSelect: (level: 'HSC' | 'SSC') => void;
}

export const AcademicLevelModal: React.FC<Props> = ({ isOpen, onSelect }) => {
    const classOptions = [
        { label: 'Class 9', sublabel: 'নবম শ্রেণি', level: 'SSC' as const, emoji: '📗' },
        { label: 'Class 10', sublabel: 'দশম শ্রেণি', level: 'SSC' as const, emoji: '📘' },
        { label: 'Class 11', sublabel: 'একাদশ শ্রেণি', level: 'HSC' as const, emoji: '📙' },
        { label: 'Class 12', sublabel: 'দ্বাদশ শ্রেণি', level: 'HSC' as const, emoji: '📕' },
        { label: 'Admission', sublabel: 'ভর্তি পরীক্ষা', level: 'HSC' as const, emoji: '🎓' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={() => { }} title="Select Your Academic Level" hideCloseButton>
            <div className="flex flex-col gap-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                    আপনার বর্তমান শ্রেণি নির্বাচন করুন
                </p>

                <div className="grid grid-cols-2 gap-3">
                    {classOptions.map((opt) => (
                        <button
                            key={opt.label}
                            onClick={() => onSelect(opt.level)}
                            className={`p-4 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-2 ${opt.level === 'HSC'
                                    ? 'border-blue-200 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-400'
                                    : 'border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-400'
                                }`}
                        >
                            <span className="text-2xl">{opt.emoji}</span>
                            <span className="font-bold text-sm text-slate-800 dark:text-white">{opt.label}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{opt.sublabel}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${opt.level === 'HSC'
                                    ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                    : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                                }`}>
                                {opt.level}
                            </span>
                        </button>
                    ))}
                </div>

                <p className="text-[10px] text-slate-400 text-center mt-2">
                    আপনি পরে সেটিংস থেকে এটি পরিবর্তন করতে পারবেন
                </p>
            </div>
        </Modal>
    );
};
