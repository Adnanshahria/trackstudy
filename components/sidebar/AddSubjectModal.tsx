import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const AddSubjectModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (name: string, emoji: string, color: string) => void }) => {
    const [name, setName] = useState('');
    const [emoji, setEmoji] = useState('📚');
    const [color, setColor] = useState('emerald');
    
    const colors = [
        { id: 'emerald', class: 'bg-emerald-500' },
        { id: 'blue', class: 'bg-blue-500' },
        { id: 'amber', class: 'bg-amber-500' },
        { id: 'rose', class: 'bg-rose-500' },
        { id: 'indigo', class: 'bg-indigo-500' }
    ];
    
    const emojis = ['📚', '🧬', '🧪', '⚛️', '📐', '🌍', '💻', '🎨', '🎵', '📝'];

    return (
        <Modal isOpen={true} onClose={onClose} title="Add New Subject">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-600 dark:text-slate-400">Subject Name</label>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
                        placeholder="e.g. Math"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-600 dark:text-slate-400">Icon</label>
                    <div className="flex gap-2 flex-wrap">
                        {emojis.map(e => (
                             <button 
                                key={e} 
                                onClick={() => setEmoji(e)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg border ${emoji === e ? 'border-blue-500 bg-blue-500/20' : 'border-slate-200 dark:border-white/10'}`}
                            >{e}</button>
                        ))}
                    </div>
                </div>
                 <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-600 dark:text-slate-400">Color Theme</label>
                    <div className="flex gap-2">
                         {colors.map(c => (
                             <button 
                                key={c.id} 
                                onClick={() => setColor(c.id)}
                                className={`w-8 h-8 rounded-full ${c.class} ${color === c.id ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => { if(name.trim()) { onAdd(name, emoji, color); onClose(); } }} disabled={!name.trim()}>Add Subject</Button>
                </div>
            </div>
        </Modal>
    );
};