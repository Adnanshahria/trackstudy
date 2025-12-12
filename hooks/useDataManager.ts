import { UserSettings } from '../types';
import { useChapterActions } from './data/useChapterActions';
import { useColumnActions } from './data/useColumnActions';
import { useSubjectActions } from './data/useSubjectActions';
import { useWeightActions } from './data/useWeightActions';

export const useDataManager = (
    settings: UserSettings,
    handleSettingsUpdate: (s: UserSettings) => void,
    activeSubject: string,
    setActiveSubject: (s: string) => void
) => {
    const { handleWeightUpdate } = useWeightActions(settings, handleSettingsUpdate);
    const { handleDeleteSubject } = useSubjectActions(settings, handleSettingsUpdate, activeSubject, setActiveSubject);
    const { onDeleteChapter, handleRenameChapter, onAddChapter, onDeletePaper } = useChapterActions(settings, handleSettingsUpdate);
    const { onDeleteColumn, onRenameColumn, onAddColumn } = useColumnActions(settings, handleSettingsUpdate);

    return {
        handleWeightUpdate,
        handleDeleteSubject,
        onDeleteChapter,
        handleRenameChapter,
        onDeleteColumn,
        onRenameColumn,
        onAddColumn,
        onAddChapter,
        onDeletePaper
    };
};