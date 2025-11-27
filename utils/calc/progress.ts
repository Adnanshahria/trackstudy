import { SyllabusData, TrackableItem, UserData } from '../../types';
import { TRACKABLE_ITEMS } from '../../constants';
import { getPercent, normalize } from './helpers';

export const calculateProgress = (
    subjectKey: string, 
    itemIdentifiers: string[], 
    userData: UserData,
    weights: Record<string, number> | undefined,
    allItems: TrackableItem[] = TRACKABLE_ITEMS,
    syllabus: SyllabusData
) => {
    const subject = syllabus[subjectKey];
    if (!subject) return { overall: 0, p1: 0, p2: 0 };

    const allChapters = subject.chapters;
    let totalWeight = 0;
    let isWeighted = false;
    
    if (weights && Object.keys(weights).length > 0) {
        isWeighted = true;
        itemIdentifiers.forEach(id => {
             if (allItems.find(t => t.key === id)) totalWeight += (weights[id] || 0);
        });
    }
    
    if (totalWeight === 0) isWeighted = false;

    let p1Total = 0, p1Count = 0, p2Total = 0, p2Count = 0;

    allChapters.forEach(ch => {
        let chapterSum = 0;
        let chapterDivisor = 0;

        itemIdentifiers.forEach(itemId => {
            // FIX: Use itemId directly in the key construction instead of finding its index.
            // This decouples data from column position.
            const key = `s_${subjectKey}_${ch.id}_${itemId}`;
            const score = getPercent(userData[key] ?? 0);

            if (isWeighted) {
                const w = weights![itemId] || 0;
                chapterSum += score * w;
                chapterDivisor += w;
            } else {
                chapterSum += score;
                chapterDivisor += 1;
            }
        });

        const chAvg = chapterDivisor > 0 ? normalize(chapterSum / chapterDivisor) : 0;
        if (ch.paper === 1) { p1Total += chAvg; p1Count++; } 
        else { p2Total += chAvg; p2Count++; }
    });

    return {
        p1: p1Count ? p1Total / p1Count : 0,
        p2: p2Count ? p2Total / p2Count : 0,
        overall: (p1Count + p2Count) ? (p1Total + p2Total) / (p1Count + p2Count) : 0
    };
};