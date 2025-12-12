import React from 'react';
import { SubjectConfigProps } from './subject/SubjectConfig.types';
import { useSubjectConfig } from './subject/useSubjectConfig.hook';
import { SubjectConfigView } from './subject/SubjectConfig.view';

export const SubjectConfigModal: React.FC<SubjectConfigProps> = (props) => {
    const logic = useSubjectConfig(props.currentItems, props.currentWeights, props.onSave);

    return (
        <SubjectConfigView 
            {...logic} 
            allItems={props.allItems} 
            onClose={props.onClose} 
        />
    );
};