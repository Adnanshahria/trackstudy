import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { PerformanceBarCard } from '../PerformanceBarCard';
import { TrackableItem, ProgressBarConfig } from '../../../types';
import { TitleEditState } from './PerformanceConfig.types';

interface ViewProps {
    config: ProgressBarConfig[];
    allItems: TrackableItem[];
    titleEdit: TitleEditState | null;
    setTitleEdit: (val: TitleEditState | null) => void;
    updateConfigTitle: (idx: number, val: string) => void;
    toggleVisibility: (idx: number) => void;
    deleteBar: (idx: number) => void;
    toggleItem: (confIdx: number, itemKey: string) => void;
    updateWeight: (confIdx: number, itemKey: string, val: number) => void;
    addBar: () => void;
    handleSave: () => void;
    onClose: () => void;
}

export const PerformanceConfigView: React.FC<ViewProps> = (props) => {
    return (
        <Modal isOpen={true} onClose={props.onClose} title="Configure Progress Bars">
            <div className="flex flex-col gap-6">
                {props.config.map((conf, idx) => (
                    <PerformanceBarCard 
                        key={conf.id} conf={conf} idx={idx} allItems={props.allItems}
                        titleEdit={props.titleEdit} setTitleEdit={props.setTitleEdit}
                        updateConfigTitle={props.updateConfigTitle} toggleVisibility={props.toggleVisibility}
                        deleteBar={props.deleteBar} toggleItem={props.toggleItem} updateWeight={props.updateWeight}
                    />
                ))}
                <button onClick={props.addBar} className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl text-slate-500 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/5 transition-all font-bold text-xs flex items-center justify-center gap-2">
                    + Add New Progress Bar
                </button>
                <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-white/10">
                     <Button onClick={props.handleSave}>Save Changes</Button>
                </div>
            </div>
        </Modal>
    );
};