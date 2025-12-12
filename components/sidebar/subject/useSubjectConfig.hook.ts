import { useState, useRef, useEffect } from 'react';

export const useSubjectConfig = (
    currentItems: string[],
    currentWeights: Record<string, number>,
    onSave: (i: string[], w: Record<string, number>) => void
) => {
    // Initialize with props values directly
    const [items, setItems] = useState<string[]>(() => [...currentItems]);
    const [weights, setWeights] = useState<Record<string, number>>(() => ({ ...currentWeights }));

    // Track if we've done initial setup to prevent props from overwriting user edits
    const isInitialized = useRef(false);

    useEffect(() => {
        // Only sync on first mount or when items are truly different (not just reference)
        if (!isInitialized.current) {
            isInitialized.current = true;
            if (currentItems.length > 0 || Object.keys(currentWeights).length > 0) {
                setItems([...currentItems]);
                setWeights({ ...currentWeights });
            }
        }
    }, []);

    const toggleItem = (key: string) => {
        setItems(prev => {
            if (prev.includes(key)) {
                // Remove item and its weight
                setWeights(w => {
                    const newW = { ...w };
                    delete newW[key];
                    return newW;
                });
                return prev.filter(k => k !== key);
            } else {
                // Add item with default weight
                setWeights(w => ({ ...w, [key]: 10 }));
                return [...prev, key];
            }
        });
    };

    const updateWeight = (key: string, val: number) => {
        setWeights(prev => ({ ...prev, [key]: Math.max(0, val) }));
    };

    const totalWeight = Object.values(weights).reduce((a: number, b: number) => a + b, 0);

    const handleSave = () => onSave(items, weights);

    return { items, weights, toggleItem, updateWeight, totalWeight, handleSave };
};