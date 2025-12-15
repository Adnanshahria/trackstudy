import { UserSettings } from '../../types';

// Use callback pattern to avoid stale closure issues
export const useWeightActions = (
    settings: UserSettings,
    handleSettingsUpdate: (s: UserSettings | ((prev: UserSettings) => UserSettings)) => void
) => {
    const handleWeightUpdate = (newWeights: Record<string, number>, subjectKey?: string) => {
        handleSettingsUpdate((currentSettings: UserSettings) => {
            if (subjectKey) {
                const updated = { ...(currentSettings.subjectWeights || {}) };
                updated[subjectKey] = newWeights;
                return { ...currentSettings, subjectWeights: updated };
            } else {
                return { ...currentSettings, weights: newWeights };
            }
        });
    };

    return { handleWeightUpdate };
};
