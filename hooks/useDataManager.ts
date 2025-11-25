import { UserSettings, Chapter } from '../types';

export const useDataManager = (
    settings: UserSettings, 
    handleSettingsUpdate: (s: UserSettings) => void,
    activeSubject: string,
    setActiveSubject: (s: string) => void
) => {

    const handleWeightUpdate = (newWeights: any, subjectKey?: string) => {
        if (subjectKey) {
            const updated = { ...(settings.subjectWeights || {}) };
            updated[subjectKey] = newWeights;
            handleSettingsUpdate({ ...settings, subjectWeights: updated });
        } else {
            handleSettingsUpdate({ ...settings, weights: newWeights });
        }
    };

    const handleDeleteSubject = (key: string) => {
        if(!settings.syllabus[key]) return;
        
        const newSettings = JSON.parse(JSON.stringify(settings));
        delete newSettings.syllabus[key];
        
        // Cleanup associated config data
        if (newSettings.subjectConfigs?.[key]) delete newSettings.subjectConfigs[key];
        if (newSettings.subjectWeights?.[key]) delete newSettings.subjectWeights[key];
        if (newSettings.customNames?.[key]) delete newSettings.customNames[key];

        handleSettingsUpdate(newSettings);
        
        if (activeSubject === key) {
            const remaining = Object.keys(newSettings.syllabus);
            setActiveSubject(remaining.length > 0 ? remaining[0] : '');
        }
    };

    const onDeleteChapter = (subjectKey: string, chapterId: number | string) => {
        const currentSub = settings.syllabus[subjectKey];
        if(!currentSub) return;
        
        if(window.confirm(`Are you sure you want to delete this chapter? This cannot be undone.`)) {
            const newSyllabus = JSON.parse(JSON.stringify(settings.syllabus));
            newSyllabus[subjectKey].chapters = newSyllabus[subjectKey].chapters.filter((c: Chapter) => c.id !== chapterId);
            handleSettingsUpdate({ ...settings, syllabus: newSyllabus });
        }
    };

    const handleRenameChapter = (subjectKey: string, chapterId: number | string, newName: string) => {
        const currentSub = settings.syllabus[subjectKey];
        if(!currentSub) return;

        const newSyllabus = JSON.parse(JSON.stringify(settings.syllabus));
        const chapterIndex = newSyllabus[subjectKey].chapters.findIndex((c: Chapter) => c.id === chapterId);
        
        if (chapterIndex !== -1) {
            newSyllabus[subjectKey].chapters[chapterIndex].name = newName;
            handleSettingsUpdate({ ...settings, syllabus: newSyllabus });
        }
    };

    const onDeleteColumn = (subjectKey: string, itemKey: string) => {
        if(window.confirm(`Are you sure you want to delete this column? Data associated with it will be lost.`)) {
            let currentItems = settings.subjectConfigs && settings.subjectConfigs[subjectKey] 
                ? JSON.parse(JSON.stringify(settings.subjectConfigs[subjectKey]))
                : JSON.parse(JSON.stringify(settings.trackableItems));

            currentItems = currentItems.filter((t: any) => t.key !== itemKey);
            const newConfigs = { ...(settings.subjectConfigs || {}) };
            newConfigs[subjectKey] = currentItems;
            handleSettingsUpdate({ ...settings, subjectConfigs: newConfigs });
        }
    };

    const onRenameColumn = (subjectKey: string, itemKey: string, newName: string) => {
        let currentItems = settings.subjectConfigs && settings.subjectConfigs[subjectKey] 
            ? JSON.parse(JSON.stringify(settings.subjectConfigs[subjectKey]))
            : JSON.parse(JSON.stringify(settings.trackableItems));

        const itemIndex = currentItems.findIndex((t: any) => t.key === itemKey);
        if (itemIndex !== -1) {
            currentItems[itemIndex].name = newName;
            const newConfigs = { ...(settings.subjectConfigs || {}) };
            newConfigs[subjectKey] = currentItems;
            handleSettingsUpdate({ ...settings, subjectConfigs: newConfigs });
        }
    };

    const onAddColumn = (subjectKey: string, name: string, color: string) => {
        const newKey = `custom_col_${Date.now()}_${Math.floor(Math.random()*1000)}`;
        const newItem = { name, color, key: newKey };
        
        let currentItems = settings.subjectConfigs && settings.subjectConfigs[subjectKey] 
            ? JSON.parse(JSON.stringify(settings.subjectConfigs[subjectKey]))
            : JSON.parse(JSON.stringify(settings.trackableItems));

        currentItems.push(newItem);
        const newConfigs = { ...(settings.subjectConfigs || {}) };
        newConfigs[subjectKey] = currentItems;
        handleSettingsUpdate({ ...settings, subjectConfigs: newConfigs });
    };

    const onAddChapter = (subjectKey: string, paper: 1 | 2, name: string) => {
        const currentSub = settings.syllabus[subjectKey];
        if(!currentSub) return;
        const newChapter: Chapter = { id: `custom_${Date.now()}`, name, paper };
        const newSyllabus = JSON.parse(JSON.stringify(settings.syllabus));
        newSyllabus[subjectKey].chapters.push(newChapter);
        handleSettingsUpdate({ ...settings, syllabus: newSyllabus });
    };

    return {
        handleWeightUpdate,
        handleDeleteSubject,
        onDeleteChapter,
        handleRenameChapter,
        onDeleteColumn,
        onRenameColumn,
        onAddColumn,
        onAddChapter
    };
};