import { UserData, UserSettings, CompositeData } from '../../types';
import { calculateProgress } from './progress';

export const calculateGlobalComposite = (userData: UserData, settings: UserSettings): CompositeData => {
    const globalWeights = settings.weights || {};
    const syllabus = settings.syllabus;
    const subjects = Object.keys(syllabus);

    if (subjects.length === 0) {
        return { composite: 0, breakdown: {}, totalWeight: 0 };
    }

    const getItems = (k: string) => settings.subjectConfigs?.[k] || settings.trackableItems;
    const getWeights = (k: string) => settings.subjectWeights?.[k] || globalWeights;

    let totalSubjectProgress = 0;
    subjects.forEach(s => {
        const items = getItems(s);
        const p = calculateProgress(s, items.map(i => i.key), userData, getWeights(s), items, syllabus);
        totalSubjectProgress += p.overall;
    });

    const composite = totalSubjectProgress / subjects.length;
    const allGlobalKeys = new Set<string>();
    settings.trackableItems.forEach(i => allGlobalKeys.add(i.key));
    if (settings.subjectConfigs) Object.values(settings.subjectConfigs).forEach(its => its.forEach(i => allGlobalKeys.add(i.key)));

    let breakdown: any = {};
    let totalWeight = 0;
    
    Array.from(allGlobalKeys).forEach(key => {
        let meta = settings.trackableItems.find(t => t.key === key);
        if (!meta && settings.subjectConfigs) {
            for (const conf of Object.values(settings.subjectConfigs)) {
                meta = conf.find(t => t.key === key);
                if (meta) break;
            }
        }
        if (!meta) return;

        let itemSum = 0;
        let subjectCount = 0;
        subjects.forEach(s => {
            const items = getItems(s);
            if (items.find(i => i.key === key)) {
                const p = calculateProgress(s, [key], userData, undefined, items, syllabus);
                itemSum += p.overall;
                subjectCount++;
            }
        });

        const avg = subjectCount > 0 ? itemSum / subjectCount : 0;
        const weight = globalWeights[key] || 0; 
        breakdown[key] = { name: meta.name, val: avg, weight, color: meta.color };
        if (weight > 0) totalWeight += weight;
    });

    return { composite, breakdown, totalWeight };
};