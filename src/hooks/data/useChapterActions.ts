
import { UserSettings, Chapter } from '../../types';

// Use callback pattern to avoid stale closure issues
export const useChapterActions = (
    settings: UserSettings,
    handleSettingsUpdate: (s: UserSettings | ((prev: UserSettings) => UserSettings)) => void
) => {

    const onDeleteChapter = (subjectKey: string, chapterId: number | string) => {
        if (!subjectKey || chapterId === undefined || chapterId === null) return;

        handleSettingsUpdate((currentSettings: UserSettings) => {
            const currentSub = currentSettings.syllabus[subjectKey];
            if (!currentSub || !Array.isArray(currentSub.chapters)) return currentSettings;

            const newSyllabus = { ...currentSettings.syllabus };
            newSyllabus[subjectKey] = {
                ...newSyllabus[subjectKey],
                chapters: newSyllabus[subjectKey].chapters.filter((c: Chapter) => String(c.id) !== String(chapterId))
            };
            return { ...currentSettings, syllabus: newSyllabus };
        });
    };

    const onDeletePaper = (subjectKey: string, paperId: number) => {
        if (!subjectKey || !paperId) return;

        handleSettingsUpdate((currentSettings: UserSettings) => {
            const currentSub = currentSettings.syllabus[subjectKey];
            if (!currentSub || !Array.isArray(currentSub.chapters)) return currentSettings;

            const newSyllabus = { ...currentSettings.syllabus };
            newSyllabus[subjectKey] = {
                ...newSyllabus[subjectKey],
                chapters: newSyllabus[subjectKey].chapters.filter((c: Chapter) => String(c.paper) !== String(paperId))
            };
            return { ...currentSettings, syllabus: newSyllabus };
        });
    };

    const handleRenameChapter = (subjectKey: string, chapterId: number | string, newName: string) => {
        if (!subjectKey || chapterId === undefined || chapterId === null) return;
        const trimmedName = typeof newName === 'string' ? newName.trim() : '';
        if (!trimmedName || trimmedName.length > 200) return;

        handleSettingsUpdate((currentSettings: UserSettings) => {
            const currentSub = currentSettings.syllabus[subjectKey];
            if (!currentSub) return currentSettings;

            const chapterIndex = currentSub.chapters.findIndex((c: Chapter) => c.id === chapterId);
            if (chapterIndex === -1) return currentSettings;

            const newChapters = [...currentSub.chapters];
            newChapters[chapterIndex] = { ...newChapters[chapterIndex], name: trimmedName };
            const newSyllabus = { ...currentSettings.syllabus };
            newSyllabus[subjectKey] = { ...currentSub, chapters: newChapters };
            return { ...currentSettings, syllabus: newSyllabus };
        });
    };

    const onAddChapter = (subjectKey: string, paper: number, name: string) => {
        if (!subjectKey || !paper) return;
        const trimmedName = typeof name === 'string' ? name.trim() : '';
        if (!trimmedName || trimmedName.length > 200) return;

        handleSettingsUpdate((currentSettings: UserSettings) => {
            const currentSub = currentSettings.syllabus[subjectKey];
            if (!currentSub) return currentSettings;

            const uniqueId = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
            const newChapter: Chapter = { id: uniqueId, name: trimmedName, paper };
            const newSyllabus = { ...currentSettings.syllabus };
            newSyllabus[subjectKey] = {
                ...currentSub,
                chapters: [...currentSub.chapters, newChapter]
            };
            return { ...currentSettings, syllabus: newSyllabus };
        });
    };

    return { onDeleteChapter, handleRenameChapter, onAddChapter, onDeletePaper };
};

