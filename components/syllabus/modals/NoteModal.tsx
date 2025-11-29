import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { UserSettings } from '../../../types';

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    noteKey: string;
    text: string;
    onSave: () => void;
    setText: (s: string) => void;
    settings: UserSettings;
    activeSubject: string;
}

const parseNoteId = (noteKey: string, settings: UserSettings, activeSubject: string): string => {
    if (!settings?.syllabus || !activeSubject) return noteKey;
    
    const parts = noteKey.replace('s_', '').split('_');
    if (parts.length < 3) return noteKey;
    
    const [subjectKey, chapterId, columnKey] = parts;
    
    const subject = settings.syllabus[subjectKey];
    if (!subject) return noteKey;
    
    const subjectName = settings.customNames?.[subjectKey] || subject.name;
    
    const chapter = subject.chapters.find(ch => String(ch.id) === chapterId);
    const chapterName = chapter?.name || `Chapter ${chapterId}`;
    
    const items = settings.subjectConfigs?.[subjectKey] || settings.trackableItems;
    const column = items.find(item => item.key === columnKey);
    const columnName = column?.name || columnKey;
    
    return `${subjectName} / ${chapterName} / ${columnName}`;
};

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, noteKey, text, onSave, setText, settings, activeSubject }) => {
    const displayId = parseNoteId(noteKey, settings, activeSubject);
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Study Note">
            <div className="flex flex-col gap-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-black/20 px-3 py-2 rounded-lg">
                    <span className="font-medium">ID:</span> {displayId}
                </p>
                <textarea 
                    className="w-full h-40 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200 resize-none"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add details or reminders..."
                />
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={onSave}>Save Note</Button>
                </div>
            </div>
        </Modal>
    );
};