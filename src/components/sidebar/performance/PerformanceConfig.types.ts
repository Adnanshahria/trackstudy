import { ProgressBarConfig, TrackableItem } from '../../../types';

export interface PerformanceConfigProps {
    currentConfig: ProgressBarConfig[];
    allItems: TrackableItem[];
    onSave: (c: ProgressBarConfig[]) => void;
    onClose: () => void;
}

export interface TitleEditState {
    idx: number;
    val: string;
}