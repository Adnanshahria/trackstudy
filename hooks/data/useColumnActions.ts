import { UserSettings, TrackableItem } from '../../types';

export const useColumnActions = (settings: UserSettings, handleSettingsUpdate: (s: UserSettings) => void) => {

    const getItems = (subjectKey: string) => settings.subjectConfigs && settings.subjectConfigs[subjectKey] 
        ? JSON.parse(JSON.stringify(settings.subjectConfigs[subjectKey]))
        : JSON.parse(JSON.stringify(settings.trackableItems));

    const updateConfig = (subjectKey: string, items: TrackableItem[]) => {
        const newConfigs = { ...(settings.subjectConfigs || {}) };
        newConfigs[subjectKey] = items;
        handleSettingsUpdate({ ...settings, subjectConfigs: newConfigs });
    };

    // Removed window.confirm logic. Confirmation is now handled by the UI (Modal).
    const onDeleteColumn = (subjectKey: string, itemKey: string) => {
        const currentItems = getItems(subjectKey).filter((t: TrackableItem) => t.key !== itemKey);
        updateConfig(subjectKey, currentItems);
    };

    const onRenameColumn = (subjectKey: string, itemKey: string, newName: string) => {
        const currentItems = getItems(subjectKey);
        const itemIndex = currentItems.findIndex((t: TrackableItem) => t.key === itemKey);
        if (itemIndex !== -1) {
            currentItems[itemIndex].name = newName;
            updateConfig(subjectKey, currentItems);
        }
    };

    const onAddColumn = (subjectKey: string, name: string, color: string) => {
        const newKey = `custom_col_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const newItem = { name, color, key: newKey };
        const currentItems = getItems(subjectKey);
        currentItems.push(newItem);
        updateConfig(subjectKey, currentItems);
    };

    return { onDeleteColumn, onRenameColumn, onAddColumn };
};