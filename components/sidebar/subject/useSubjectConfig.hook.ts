import { useState, useEffect } from 'react';

export const useSubjectConfig = (
    currentItems: string[],
    currentWeights: Record<string, number>,
    onSave: (i: string[], w: Record<string, number>) => void
) => {
    const [items, setItems] = useState<string[]>(currentItems);
    const [weights, setWeights] = useState<Record<string, number>>({ ...currentWeights });

    useEffect(() => {
        setItems(currentItems);
        setWeights({ ...currentWeights });
    }, [currentItems, currentWeights]);

    const toggleItem = (key: string) => {
        if (items.includes(key)) {
            setItems(items.filter(k => k !== key));
            const newW = { ...weights }; delete newW[key]; setWeights(newW);
        } else {
            setItems([...items, key]);
            setWeights({ ...weights, [key]: 10 });
        }
    };

    const updateWeight = (key: string, val: number) => {
        setWeights({ ...weights, [key]: Math.max(0, val) });
    };

    const totalWeight = Object.values(weights).reduce((a: number, b: number) => a + b, 0);

    const handleSave = () => onSave(items, weights);

    return { items, weights, toggleItem, updateWeight, totalWeight, handleSave };
};