import React from 'react';
import { PerformanceConfigProps } from './performance/PerformanceConfig.types';
import { usePerformanceConfig } from './performance/usePerformanceConfig.hook';
import { PerformanceConfigView } from './performance/PerformanceConfig.view';

export const PerformanceConfigModal: React.FC<PerformanceConfigProps> = (props) => {
    const logic = usePerformanceConfig(props.currentConfig, props.onSave);
    
    return (
        <PerformanceConfigView 
            {...logic} 
            allItems={props.allItems} 
            onClose={props.onClose} 
        />
    );
};