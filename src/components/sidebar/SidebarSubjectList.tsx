
import React, { useState, useRef } from 'react';
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
    const [draggedKey, setDraggedKey] = useState<string | null>(null);
    const [dragOverKey, setDragOverKey] = useState<string | null>(null);
    const dragCounter = useRef(0);

    const syllabusKeys = Object.keys(settings.syllabus || {});
    const existingOrder = settings.subjectOrder || [];

    // Compute display order without auto-saving - prevents re-saving old cached data
    const validOrder = existingOrder.filter(key => settings.syllabus?.[key]);
    const newKeys = syllabusKeys.filter(key => !validOrder.includes(key));
    const finalOrder = [...validOrder, ...newKeys];

    // NOTE: Removed auto-save useEffect that was causing data overwrites
    // Subject order is now only saved explicitly when user drag-and-drops

    const orderedSubjects = finalOrder
        .map(key => [key, settings.syllabus?.[key]] as [string, SubjectData])
        .filter(([_, data]) => data !== undefined);

    const handleDragStart = (e: React.DragEvent, key: string) => {
        setDraggedKey(key);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', key);
    };

    const handleDragEnter = (e: React.DragEvent, key: string) => {
        e.preventDefault();
        dragCounter.current++;
        if (key !== draggedKey) {
            setDragOverKey(key);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setDragOverKey(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetKey: string) => {
        e.preventDefault();
        dragCounter.current = 0;

        if (!draggedKey || draggedKey === targetKey) {
            setDraggedKey(null);
            setDragOverKey(null);
            return;
        }

        const currentOrder = [...orderedSubjects.map(([k]) => k)];
        const draggedIndex = currentOrder.indexOf(draggedKey);
        const targetIndex = currentOrder.indexOf(targetKey);

        currentOrder.splice(draggedIndex, 1);
        currentOrder.splice(targetIndex, 0, draggedKey);

        onUpdateSettings({ ...settings, subjectOrder: currentOrder });
        setDraggedKey(null);
        setDragOverKey(null);
    };

    const handleDragEnd = () => {
        setDraggedKey(null);
        setDragOverKey(null);
        dragCounter.current = 0;
    };

    return (
        <div className="flex flex-col gap-3 pr-1">
            {orderedSubjects.map(([key, data]) => (
                <div
                    key={key}
                    draggable={isEditing}
                    onDragStart={(e) => handleDragStart(e, key)}
                    onDragEnter={(e) => handleDragEnter(e, key)}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, key)}
                    onDragEnd={handleDragEnd}
                    className={`transition-all duration-200 ${draggedKey === key ? 'opacity-50 scale-95' : ''
                        } ${dragOverKey === key ? 'transform translate-y-2' : ''
                        } ${isEditing ? 'cursor-grab active:cursor-grabbing' : ''
                        }`}
                >
                    {dragOverKey === key && draggedKey !== key && (
                        <div className="h-1 bg-blue-500 rounded-full mb-2 animate-pulse" />
                    )}
                    <SubjectItem
                        subKey={key} data={data}
                        isActive={activeSubject === key} isEditing={isEditing}
                        userData={userData} settings={settings}
                        onChangeSubject={onChangeSubject}
                        onRename={() => setModals((m: any) => ({ ...m, rename: { key, name: settings.customNames?.[key] || data.name } }))}
                        onDelete={() => onDeleteSubject(key)}
                    />
                </div>
            ))}
        </div>
    );
};
