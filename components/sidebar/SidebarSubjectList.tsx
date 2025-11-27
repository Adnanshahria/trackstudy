
import React from 'react';
import { SubjectItem } from './SubjectItem';
import { SubjectData, UserData, UserSettings } from '../../types';

interface Props {
    settings: UserSettings;
    activeSubject: string;
    isEditing: boolean;
    userData: UserData;
    onChangeSubject: (k: string) => void;
    setModals: React.Dispatch<React.SetStateAction<any>>;
    onUpdateSettings: (s: UserSettings) => void;
    onDeleteSubject: (k: string) => void;
}

export const SidebarSubjectList: React.FC<Props> = ({ settings, activeSubject, isEditing, userData, onChangeSubject, setModals, onUpdateSettings, onDeleteSubject }) => {
    return (
        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
            {(Object.entries(settings.syllabus) as [string, SubjectData][]).map(([key, data]) => (
                <SubjectItem 
                    key={key} subKey={key} data={data} 
                    isActive={activeSubject === key} isEditing={isEditing} 
                    userData={userData} settings={settings} 
                    onChangeSubject={onChangeSubject} 
                    onRename={() => setModals((m: any) => ({ ...m, rename: { key, name: settings.customNames?.[key] || data.name } }))} 
                    onDelete={() => onDeleteSubject(key)} 
                />
            ))}
        </div>
    );
};
