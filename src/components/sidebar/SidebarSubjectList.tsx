
import React, { useState, useRef, useCallback } from 'react';
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

const SidebarSubjectListBase: React.FC<Props> = ({ settings, activeSubject, isEditing, userData, onChangeSubject, setModals, onUpdateSettings, onDeleteSubject }) => {
    const [draggedKey, setDraggedKey] = useState<string | null>(null);
    const [dragOverKey, setDragOverKey] = useState<string | null>(null);
    const dragCounter = useRef(0);

    const syllabusKeys = Object.keys(settings.syllabus || {});
    const existingOrder = settings.subjectOrder || [];

    // Debug: Warn if syllabus is empty
    if (syllabusKeys.length === 0) {
        console.warn('⚠️ SidebarSubjectList: settings.syllabus is empty!', settings);
    }

    // Compute display order without auto-saving - prevents re-saving old cached data
    const validOrder = existingOrder.filter(key => settings.syllabus?.[key]);
    const newKeys = syllabusKeys.filter(key => !validOrder.includes(key));
    const finalOrder = [...validOrder, ...newKeys];

    // NOTE: Removed auto-save useEffect that was causing data overwrites
    // Subject order is now only saved explicitly when user drag-and-drops

    const orderedSubjects = finalOrder
        .map(key => [key, settings.syllabus?.[key]] as [string, SubjectData])
        .filter(([_, data]) => data !== undefined);

    const handleDragStart = useCallback((e: React.DragEvent, key: string) => {
        setDraggedKey(key);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', key);
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent, key: string) => {
        e.preventDefault();
        dragCounter.current++;
        setDragOverKey(prevKey => key !== draggedKey ? key : prevKey);
    }, [draggedKey]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setDragOverKey(null);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, targetKey: string) => {
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
    }, [draggedKey, orderedSubjects, settings, onUpdateSettings]);

    const handleDragEnd = useCallback(() => {
        setDraggedKey(null);
        setDragOverKey(null);
        dragCounter.current = 0;
    }, []);

    // Stable callbacks for SubjectItem
    const handleRename = useCallback((key: string, name: string) => {
        setModals((m: any) => ({ ...m, rename: { key, name } }));
    }, [setModals]);

    const handleDelete = useCallback((key: string) => {
        onDeleteSubject(key);
    }, [onDeleteSubject]);

    return (
        <div className="flex flex-col gap-4 pr-1">
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
                        onRename={() => handleRename(key, settings.customNames?.[key] || data.name)}
                        onDelete={() => handleDelete(key)}
                    />
                </div>
            ))}
        </div>
    );
};

// Memoize the entire list to prevent re-renders when parent state changes
export const SidebarSubjectList = React.memo(SidebarSubjectListBase);
