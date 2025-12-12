import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { UserSettings } from '../../../types';
import { TickLogListWithData } from './TickLogList';

interface StudyDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    noteKey: string;
    text: string;
    onSave: () => void;
    setText: (s: string) => void;
    settings: UserSettings;
    activeSubject: string;
    userId: string | null;
}

type TabType = 'note' | 'history';

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

export const StudyDetailModal: React.FC<StudyDetailModalProps> = ({
    isOpen, onClose, noteKey, text, onSave, setText, settings, activeSubject, userId
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('note');
    const displayId = parseNoteId(noteKey, settings, activeSubject);

    // Get boxId from noteKey (remove 'note_' prefix if present, or use as-is)
    const boxId = noteKey.startsWith('note_') ? noteKey.replace('note_', '') : noteKey;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Study Details">
            <div className="flex flex-col gap-4">
                {/* Context ID */}
                <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-black/20 px-3 py-2 rounded-lg">
                    <span className="font-medium">ID:</span> {displayId}
                </p>

                {/* Tab Buttons */}
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-black/20 rounded-xl">
                    <button
                        onClick={() => setActiveTab('note')}
                        className={`flex-1 px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'note'
                            ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        aria-selected={activeTab === 'note'}
                        role="tab"
                    >
                        📝 Note
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'history'
                            ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        aria-selected={activeTab === 'history'}
                        role="tab"
                    >
                        📊 History
                    </button>
                </div>

                {/* Tab Content */}
                <div role="tabpanel" className="min-h-[200px]">
                    {activeTab === 'note' ? (
                        <div className="flex flex-col gap-4">
                            <textarea
                                className="w-full h-40 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200 resize-none"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Add details or reminders..."
                                aria-label="Study note"
                            />
                            <div className="flex justify-end gap-3">
                                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                                <Button onClick={onSave}>Save Note</Button>
                            </div>
                        </div>
                    ) : (
                        <TickLogListWithData boxId={boxId} userId={userId} />
                    )}
                </div>
            </div>
        </Modal>
    );
};

// Re-export as NoteModal for backward compatibility
export const NoteModal = StudyDetailModal;