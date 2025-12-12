import React from 'react';
import { AddColumnModal } from './modals/AddColumnModal';
import { AddChapterModal } from './modals/AddChapterModal';
import { NoteModal } from './modals/NoteModal';
import { RenameModal } from './modals/RenameModal';
import { UserSettings } from '../../types';

interface Props {
    modals: any;
    setModals: React.Dispatch<React.SetStateAction<any>>;
    handlers: any;
    ui: any;
    activeSubject: string;
    settings: UserSettings;
    userId: string | null;
}

export const SyllabusModals: React.FC<Props> = ({ modals, setModals, handlers, ui, activeSubject, settings, userId }) => {
    return (
        <>
            {modals.note && <NoteModal isOpen={true} onClose={ui.closeNote} noteKey={modals.note.key} text={modals.note.text} onSave={() => { handlers.onUpdateNote(modals.note.key, modals.note.text); ui.closeNote(); }} setText={(s) => setModals((m: any) => ({ ...m, note: { ...m.note, text: s } }))} settings={settings} activeSubject={activeSubject} userId={userId} />}
            {modals.rename && <RenameModal isOpen={true} onClose={ui.closeRename} currentName={modals.rename.currentName} type={modals.rename.type} onSave={() => { if (modals.rename.type === 'column') handlers.onRenameColumn(activeSubject, modals.rename.key, modals.rename.currentName); else handlers.onRenameChapter(activeSubject, modals.rename.key, modals.rename.currentName); ui.closeRename(); }} setName={(s) => setModals((m: any) => ({ ...m, rename: { ...m.rename, currentName: s } }))} />}
            {modals.addCol && <AddColumnModal onClose={ui.closeAddCol} onAdd={(n, c) => handlers.onAddColumn(activeSubject, n, c)} />}
            {modals.addCh && <AddChapterModal paper={modals.addCh.paper} onClose={ui.closeAddCh} onAdd={(n) => handlers.onAddChapter(activeSubject, modals.addCh.paper, n)} />}
        </>
    );
};