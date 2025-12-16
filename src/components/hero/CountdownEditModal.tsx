import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialTarget: string;
    initialLabel: string;
    onSave: (target: string, label: string) => void;
}

export const CountdownEditModal: React.FC<Props> = ({ isOpen, onClose, initialTarget, initialLabel, onSave }) => {
    const [tempTarget, setTempTarget] = useState(initialTarget);
    const [tempLabel, setTempLabel] = useState(initialLabel);

    // CRITICAL FIX: Update local state when the modal is opened or props change.
    // This ensures the modal always shows the current saved settings, not stale defaults.
    useEffect(() => {
        if (isOpen) {
            // Ensure we only take the YYYY-MM-DDTHH:mm part for the input
            const safeTarget = initialTarget ? initialTarget.substring(0, 16) : '';
            setTempTarget(safeTarget);
            setTempLabel(initialLabel);
        }
    }, [isOpen, initialTarget, initialLabel]);

    const handleSave = () => {
        // Ensure format is full ISO-like string for consistency if needed, 
        // but the input value is fine to save as is for this app's logic.
        onSave(tempTarget, tempLabel);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Countdown Settings">
            <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event Label</label>
                    <input
                        type="text"
                        value={tempLabel}
                        onChange={(e) => setTempLabel(e.target.value)}
                        className="bg-slate-50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-lg md:rounded-xl p-2 md:p-3 text-xs md:text-sm dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="e.g. Final Exam"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Date & Time</label>
                    <input
                        type="datetime-local"
                        value={tempTarget}
                        onChange={(e) => setTempTarget(e.target.value)}
                        className="bg-slate-50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-lg md:rounded-xl p-2 md:p-3 text-xs md:text-sm dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="flex justify-end gap-2 md:gap-3 pt-1 md:pt-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Timer</Button>
                </div>
            </div>
        </Modal>
    );
};