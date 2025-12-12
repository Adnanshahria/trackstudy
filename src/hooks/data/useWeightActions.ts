import { UserSettings } from '../../types';

export const useWeightActions = (settings: UserSettings, handleSettingsUpdate: (s: UserSettings) => void) => {
    const handleWeightUpdate = (newWeights: Record<string, number>, subjectKey?: string) => {
        if (subjectKey) {
            const updated = { ...(settings.subjectWeights || {}) };
            updated[subjectKey] = newWeights;
            handleSettingsUpdate({ ...settings, subjectWeights: updated });
        } else {
            handleSettingsUpdate({ ...settings, weights: newWeights });
        }
    };

    return { handleWeightUpdate };
};