import { UserSettings, Chapter } from '../../types';

export const useChapterActions = (settings: UserSettings, handleSettingsUpdate: (s: UserSettings) => void) => {
    
    // Removed window.confirm logic. Confirmation is now handled by the UI (Modal).
    const onDeleteChapter = (subjectKey: string, chapterId: number | string) => {
        const currentSub = settings.syllabus[subjectKey];
        if (!currentSub) return;
        
        const newSyllabus = JSON.parse(JSON.stringify(settings.syllabus));
        newSyllabus[subjectKey].chapters = newSyllabus[subjectKey].chapters.filter((c: Chapter) => c.id !== chapterId);
        handleSettingsUpdate({ ...settings, syllabus: newSyllabus });
    };

    const handleRenameChapter = (subjectKey: string, chapterId: number | string, newName: string) => {
        const currentSub = settings.syllabus[subjectKey];
        if (!currentSub) return;

        const newSyllabus = JSON.parse(JSON.stringify(settings.syllabus));
        const chapterIndex = newSyllabus[subjectKey].chapters.findIndex((c: Chapter) => c.id === chapterId);
        
        if (chapterIndex !== -1) {
            newSyllabus[subjectKey].chapters[chapterIndex].name = newName;
            handleSettingsUpdate({ ...settings, syllabus: newSyllabus });
        }
    };

    const onAddChapter = (subjectKey: string, paper: 1 | 2, name: string) => {
        const currentSub = settings.syllabus[subjectKey];
        if (!currentSub) return;
        const newChapter: Chapter = { id: `custom_${Date.now()}`, name, paper };
        const newSyllabus = JSON.parse(JSON.stringify(settings.syllabus));
        newSyllabus[subjectKey].chapters.push(newChapter);
        handleSettingsUpdate({ ...settings, syllabus: newSyllabus });
    };

    return { onDeleteChapter, handleRenameChapter, onAddChapter };
};