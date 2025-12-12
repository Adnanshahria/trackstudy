import { useState, useEffect } from 'react';
import { ProgressBarConfig } from '../../../types';
import { TitleEditState } from './PerformanceConfig.types';

export const usePerformanceConfig = (currentConfig: ProgressBarConfig[], onSave: (c: ProgressBarConfig[]) => void) => {
    const [config, setConfig] = useState<ProgressBarConfig[]>(JSON.parse(JSON.stringify(currentConfig)));

    useEffect(() => {
        setConfig(JSON.parse(JSON.stringify(currentConfig)));
    }, [currentConfig]);
    const [titleEdit, setTitleEdit] = useState<TitleEditState | null>(null);

    const updateConfig = (fn: (c: ProgressBarConfig[]) => void) => {
        const newC = [...config];
        fn(newC);
        setConfig(newC);
    };

    const toggleVisibility = (idx: number) => updateConfig(c => c[idx].visible = !c[idx].visible);

    const toggleItem = (confIdx: number, itemKey: string) => updateConfig(c => {
        const items = c[confIdx].items;
        if (items.includes(itemKey)) {
            c[confIdx].items = items.filter(k => k !== itemKey);
            if (c[confIdx].weights) delete c[confIdx].weights![itemKey];
        } else {
            c[confIdx].items = [...items, itemKey];
            if (!c[confIdx].weights) c[confIdx].weights = {};
            c[confIdx].weights![itemKey] = 10;
        }
    });

    const updateWeight = (confIdx: number, itemKey: string, val: number) => updateConfig(c => {
        if (!c[confIdx].weights) c[confIdx].weights = {};
        c[confIdx].weights![itemKey] = Math.max(0, val);
    });

    const updateConfigTitle = (idx: number, val: string) => updateConfig(c => c[idx].title = val);

    const deleteBar = (idx: number) => {
        if (confirm("Delete this progress bar?")) setConfig(config.filter((_, i) => i !== idx));
    };

    const addBar = () => setConfig([...config, {
        id: `p_${Date.now()}`, title: "New Progress", items: [], color: 'from-blue-400 to-blue-600', visible: true
    }]);

    const handleSave = () => onSave(config);

    return {
        config,
        titleEdit,
        setTitleEdit,
        updateConfigTitle,
        toggleVisibility,
        toggleItem,
        updateWeight,
        deleteBar,
        addBar,
        handleSave
    };
};