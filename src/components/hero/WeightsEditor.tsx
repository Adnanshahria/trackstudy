import React from 'react';
import { UserSettings, TrackableItem, CompositeData } from '../../types';
import { WeightsForm } from './weights/WeightsForm';
import { WeightsGraph } from './weights/WeightsGraph';

interface Props {
    settings: UserSettings;
    selectedSubject: string;
    setSelectedSubject: (s: string) => void;
    weightTotal: number;
    tempWeights: Record<string, number>;
    handleWeightChange: (k: string, v: string) => void;
    saveWeights: () => void;
    currentConfigItems: TrackableItem[];
    compositeData: CompositeData;
    isEditing: boolean;
}

export const WeightsEditor: React.FC<Props> = (props) => {
    if (props.isEditing) {
        return <WeightsForm {...props} />;
    }
    return <WeightsGraph compositeData={props.compositeData} />;
};