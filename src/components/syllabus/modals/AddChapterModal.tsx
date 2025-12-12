import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';

export const AddChapterModal = ({ paper, onClose, onAdd }: { paper: number, onClose: () => void, onAdd: (name: string) => void }) => {
    const [name, setName] = useState('');
    return (
        <Modal isOpen={true} onClose={onClose} title={`Add Chapter to Paper ${paper}`}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-500">Chapter Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
                        placeholder="e.g. New Chapter"
                    />
                </div>
                <div className="flex justify-end gap-3 mt-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => { if (name.trim()) { onAdd(name); onClose(); } }} disabled={!name.trim()}>Add Chapter</Button>
                </div>
            </div>
        </Modal>
    );
};