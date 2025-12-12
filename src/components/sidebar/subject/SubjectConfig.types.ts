import { TrackableItem } from '../../../types';

export interface SubjectConfigProps {
    currentItems: string[];
    currentWeights: Record<string, number>;
    allItems: TrackableItem[];
    onSave: (items: string[], weights: Record<string, number>) => void;
    onClose: () => void;
}