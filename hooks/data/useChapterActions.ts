
import { UserSettings, Chapter } from '../../types';

export const useChapterActions = (settings: UserSettings, handleSettingsUpdate: (s: UserSettings) => void) => {

    const onDeleteChapter = (subjectKey: string, chapterId: number | string) => {
        if (!subjectKey || chapterId === undefined || chapterId === null) return;

        const currentSub = settings.syllabus[subjectKey];
        if (!currentSub || !Array.isArray(currentSub.chapters)) return;

        const newSyllabus = { ...settings.syllabus };
        newSyllabus[subjectKey] = {
            ...newSyllabus[subjectKey],
            chapters: newSyllabus[subjectKey].chapters.filter((c: Chapter) => String(c.id) !== String(chapterId))
        };
        handleSettingsUpdate({ ...settings, syllabus: newSyllabus });
    };

    const onDeletePaper = (subjectKey: string, paperId: number) => {
        if (!subjectKey || !paperId) return;

        const currentSub = settings.syllabus[subjectKey];
        if (!currentSub || !Array.isArray(currentSub.chapters)) return;

        const newSyllabus = { ...settings.syllabus };
        newSyllabus[subjectKey] = {
            ...newSyllabus[subjectKey],
            chapters: newSyllabus[subjectKey].chapters.filter((c: Chapter) => c.paper !== paperId)
        };
        handleSettingsUpdate({ ...settings, syllabus: newSyllabus });
    };

    const handleRenameChapter = (subjectKey: string, chapterId: number | string, newName: string) => {
        if (!subjectKey || chapterId === undefined || chapterId === null) return;
        const trimmedName = typeof newName === 'string' ? newName.trim() : '';
        if (!trimmedName || trimmedName.length > 200) return;

        const currentSub = settings.syllabus[subjectKey];
        if (!currentSub) return;

        const chapterIndex = currentSub.chapters.findIndex((c: Chapter) => c.id === chapterId);

        if (chapterIndex !== -1) {
            const newChapters = [...currentSub.chapters];
            newChapters[chapterIndex] = { ...newChapters[chapterIndex], name: trimmedName };
            const newSyllabus = { ...settings.syllabus };
            newSyllabus[subjectKey] = { ...currentSub, chapters: newChapters };
            handleSettingsUpdate({ ...settings, syllabus: newSyllabus });
        }
    };

    const onAddChapter = (subjectKey: string, paper: number, name: string) => {
        if (!subjectKey || !paper) return;
        const trimmedName = typeof name === 'string' ? name.trim() : '';
        if (!trimmedName || trimmedName.length > 200) return;

        const currentSub = settings.syllabus[subjectKey];
        if (!currentSub) return;

        const uniqueId = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
        const newChapter: Chapter = { id: uniqueId, name: trimmedName, paper };
        const newSyllabus = { ...settings.syllabus };
        newSyllabus[subjectKey] = {
            ...currentSub,
            chapters: [...currentSub.chapters, newChapter]
        };
        handleSettingsUpdate({ ...settings, syllabus: newSyllabus });
    };

    return { onDeleteChapter, handleRenameChapter, onAddChapter, onDeletePaper };
};
