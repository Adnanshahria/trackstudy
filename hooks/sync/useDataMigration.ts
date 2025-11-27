import { useEffect } from 'react';
import { UserData, UserSettings } from '../../types';
import { saveUserProgress } from '../../utils/storage';

export const useDataMigration = (userData: UserData, setUserData: any, settings: UserSettings, userId: string | null) => {
    useEffect(() => {
        if (!userId || !userData || !settings) return;
        
        const migrate = async () => {
            const updates: any = {};
            let hasUpdates = false;

            Object.keys(userData).forEach(key => {
                // 1. Migrate Status Data: s_subject_chapter_INDEX -> s_subject_chapter_KEY
                const statusMatch = key.match(/^s_([^_]+)_([^_]+)_(\d+)$/);
                if (statusMatch) {
                    const [fullKey, subject, chapterId, idxStr] = statusMatch;
                    const idx = parseInt(idxStr);
                    const items = settings.subjectConfigs?.[subject] || settings.trackableItems;
                    
                    if (items && items[idx]) {
                        const newKey = `s_${subject}_${chapterId}_${items[idx].key}`;
                        // Only migrate if new key doesn't exist yet
                        if (userData[newKey] === undefined) {
                            updates[newKey] = userData[fullKey];
                            hasUpdates = true;
                        }
                    }
                }

                // 2. Migrate Note Data: note_s_subject_chapter_INDEX -> note_s_subject_chapter_KEY
                const noteMatch = key.match(/^note_s_([^_]+)_([^_]+)_(\d+)$/);
                if (noteMatch) {
                    const [fullKey, subject, chapterId, idxStr] = noteMatch;
                    const idx = parseInt(idxStr);
                    const items = settings.subjectConfigs?.[subject] || settings.trackableItems;
                    
                    if (items && items[idx]) {
                        const newKey = `note_s_${subject}_${chapterId}_${items[idx].key}`;
                        if (userData[newKey] === undefined) {
                            updates[newKey] = userData[fullKey];
                            hasUpdates = true;
                        }
                    }
                }
            });

            if (hasUpdates) {
                console.log(`%c 📦 Migrating ${Object.keys(updates).length} data fields to new format...`, 'color: #bada55');
                setUserData((prev: any) => ({ ...prev, ...updates }));
                await saveUserProgress(userId, updates);
            }
        };

        // We use a timeout to ensure this runs after initial data load
        const t = setTimeout(migrate, 2000);
        return () => clearTimeout(t);
    }, [userId, userData, settings, setUserData]);
};