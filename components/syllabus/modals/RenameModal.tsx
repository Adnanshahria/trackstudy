import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';

export const RenameModal = ({ isOpen, onClose, currentName, type, onSave, setName }: { isOpen: boolean, onClose: () => void, currentName: string, type: 'column' | 'chapter', onSave: () => void, setName: (s: string) => void }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={type === 'chapter' ? "Rename Chapter" : "Rename Column"}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">New Name</label>
                    <input 
                        type="text"
                        value={currentName}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white transition-colors"
                        autoFocus
                    />
                </div>
                 <div className="flex justify-end gap-3 mt-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={onSave}>Save Changes</Button>
                </div>
            </div>
        </Modal>
    );
};