import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';

export const AddColumnModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (name: string, color: string) => void }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('bg-purple-500');
    const colors = [
        { name: 'Blue', val: 'bg-blue-500' },
        { name: 'Green', val: 'bg-emerald-500' },
        { name: 'Orange', val: 'bg-amber-500' },
        { name: 'Purple', val: 'bg-purple-500' },
        { name: 'Pink', val: 'bg-pink-500' },
        { name: 'Gray', val: 'bg-slate-500' },
    ];

    return (
        <Modal isOpen={true} onClose={onClose} title="Add New Column">
             <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-500">Column Name</label>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
                        placeholder="e.g. Model Test"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-500">Color</label>
                    <div className="flex gap-2 flex-wrap">
                        {colors.map(c => (
                            <button 
                                key={c.val}
                                onClick={() => setColor(c.val)}
                                className={`w-8 h-8 rounded-full ${c.val} transition-transform ${color === c.val ? 'scale-110 ring-2 ring-offset-2 ring-slate-400' : ''}`}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => { if(name.trim()) { onAdd(name, color); onClose(); } }} disabled={!name.trim()}>Add Column</Button>
                </div>
            </div>
        </Modal>
    );
};