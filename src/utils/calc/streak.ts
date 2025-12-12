import { UserData } from '../../types';

export const getStreak = (userData: UserData): number => {
    const dates = new Set<string>();
    for (const key in userData) {
        if (key.startsWith('timestamp_')) {
            const val = userData[key];
            if (typeof val === 'string') {
                const d = new Date(val);
                if (!isNaN(d.getTime())) dates.add(d.toISOString().split('T')[0]);
            }
        }
    }
    
    if (dates.size === 0) return 0;
    
    let streak = 0;
    const current = new Date();
    const toDateStr = (d: Date) => d.toISOString().split('T')[0];
    let dateStr = toDateStr(current);
    
    if (!dates.has(dateStr)) {
        current.setDate(current.getDate() - 1);
        dateStr = toDateStr(current);
        if (!dates.has(dateStr)) return 0;
    }
    
    while(dates.has(dateStr)) {
        streak++;
        current.setDate(current.getDate() - 1);
        dateStr = toDateStr(current);
    }
    
    return streak;
};