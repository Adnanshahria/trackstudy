
import React from 'react';
import { UserData, UserSettings, TrackableItem } from '../../types';
import { PaperHeader } from './paper/PaperHeader';
import { PaperTable } from './paper/PaperTable';

interface Props {
    paper: number; activeSubject: string; userData: UserData; settings: UserSettings;
    allItems: TrackableItem[]; allChapters: any[]; pVal: number; isOpen: boolean; editMode: boolean; actions: any;
}

export const PaperSection: React.FC<Props> = ({ paper, activeSubject, userData, settings, allItems, allChapters, pVal, isOpen, editMode, actions }) => {
    const chapters = allChapters.filter(c => c.paper === paper);
    const { onTogglePaper, setRenameModal, onDeleteColumn, setAddColumnModal, setAddChapterModal, toggleEdit, onDeletePaper } = actions;

    return (
        <div className="group glass-panel rounded-3xl overflow-hidden shadow-sm print:border print:shadow-none print:rounded-lg">
            <PaperHeader
                paper={paper} pVal={pVal} isOpen={isOpen} activeSubject={activeSubject}
                onTogglePaper={onTogglePaper} editMode={editMode} onToggleEdit={toggleEdit}
                onDeletePaper={onDeletePaper}
            />
            {isOpen && (
                <PaperTable
                    paper={paper} chapters={chapters} allItems={allItems} userData={userData}
                    activeSubject={activeSubject} editMode={editMode} actions={actions}
                    setRenameModal={setRenameModal} onDeleteColumn={onDeleteColumn}
                    setAddColumnModal={setAddColumnModal} setAddChapterModal={setAddChapterModal}
                />
            )}
        </div>
    );
};