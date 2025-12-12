import { UserSettings } from '../../types';

export const useSubjectActions = (
    settings: UserSettings, 
    handleSettingsUpdate: (s: UserSettings) => void,
    activeSubject: string,
    setActiveSubject: (s: string) => void
) => {
    const handleDeleteSubject = (key: string) => {
        if (!key || typeof key !== 'string') return;
        if (!settings?.syllabus || !settings.syllabus[key]) return;
        
        try {
            const newSettings = JSON.parse(JSON.stringify(settings)) as UserSettings;
            delete newSettings.syllabus[key];
            
            if (newSettings.subjectConfigs?.[key]) delete newSettings.subjectConfigs[key];
            if (newSettings.subjectWeights?.[key]) delete newSettings.subjectWeights[key];
            if (newSettings.customNames?.[key]) delete newSettings.customNames[key];
            if (newSettings.syllabusOpenState?.[key]) delete newSettings.syllabusOpenState[key];
            
            if (Array.isArray(newSettings.subjectOrder)) {
                newSettings.subjectOrder = newSettings.subjectOrder.filter(s => s !== key);
            }

            handleSettingsUpdate(newSettings);
            
            if (activeSubject === key) {
                const remaining = Object.keys(newSettings.syllabus);
                setActiveSubject(remaining.length > 0 ? remaining[0] : '');
            }
        } catch (error) {
            console.error('Failed to delete subject:', error);
        }
    };

    return { handleDeleteSubject };
};