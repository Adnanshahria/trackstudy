import { UserSettings, TrackableItem } from '../../types';

export const useColumnActions = (settings: UserSettings, handleSettingsUpdate: (s: UserSettings | ((prev: UserSettings) => UserSettings)) => void) => {

    const getItems = (currentSettings: UserSettings, subjectKey: string) =>
        currentSettings.subjectConfigs && currentSettings.subjectConfigs[subjectKey]
            ? JSON.parse(JSON.stringify(currentSettings.subjectConfigs[subjectKey]))
            : JSON.parse(JSON.stringify(currentSettings.trackableItems));

    const onDeleteColumn = (subjectKey: string, itemKey: string) => {
        if (!subjectKey || !itemKey || typeof itemKey !== 'string') return;
        // Use callback pattern to avoid stale closure
        handleSettingsUpdate((currentSettings: UserSettings) => {
            const currentItems = getItems(currentSettings, subjectKey).filter((t: TrackableItem) => t.key !== itemKey);
            const newConfigs = { ...(currentSettings.subjectConfigs || {}) };
            newConfigs[subjectKey] = currentItems;
            return { ...currentSettings, subjectConfigs: newConfigs };
        });
    };

    const onRenameColumn = (subjectKey: string, itemKey: string, newName: string) => {
        if (!subjectKey || !itemKey) return;
        const trimmedName = typeof newName === 'string' ? newName.trim() : '';
        if (!trimmedName || trimmedName.length > 100) return;

        // Use callback pattern to avoid stale closure
        handleSettingsUpdate((currentSettings: UserSettings) => {
            const currentItems = getItems(currentSettings, subjectKey);
            const itemIndex = currentItems.findIndex((t: TrackableItem) => t.key === itemKey);
            if (itemIndex === -1) return currentSettings;

            currentItems[itemIndex].name = trimmedName;
            const newConfigs = { ...(currentSettings.subjectConfigs || {}) };
            newConfigs[subjectKey] = currentItems;
            return { ...currentSettings, subjectConfigs: newConfigs };
        });
    };

    const onAddColumn = (subjectKey: string, name: string, color: string) => {
        if (!subjectKey) return;
        const trimmedName = typeof name === 'string' ? name.trim() : '';
        if (!trimmedName || trimmedName.length > 100) return;

        const safeColor = typeof color === 'string' && color.trim() ? color.trim() : '#3b82f6';
        const newKey = `custom_col_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const newItem: TrackableItem = { name: trimmedName, color: safeColor, key: newKey };

        // Use callback pattern to avoid stale closure
        handleSettingsUpdate((currentSettings: UserSettings) => {
            const currentItems = getItems(currentSettings, subjectKey);
            currentItems.push(newItem);
            const newConfigs = { ...(currentSettings.subjectConfigs || {}) };
            newConfigs[subjectKey] = currentItems;
            return { ...currentSettings, subjectConfigs: newConfigs };
        });
    };

    return { onDeleteColumn, onRenameColumn, onAddColumn };
};
