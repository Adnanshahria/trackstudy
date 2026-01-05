import { useState } from 'react';

export const useSyllabusUI = () => {
    const [modals, setModals] = useState({
        note: null as any,
        rename: null as any,
        addCol: false,
        addCh: null as any
    });
    const [editMode, setEditMode] = useState(false);

    const setNoteModal = (v: any) => setModals(m => ({ ...m, note: v }));
    const setRenameModal = (v: any) => setModals(m => ({ ...m, rename: v }));
    const setAddColumnModal = (v: boolean) => setModals(m => ({ ...m, addCol: v }));
    const setAddChapterModal = (v: any) => setModals(m => ({ ...m, addCh: v }));
    const toggleEdit = () => setEditMode(prev => !prev);

    const closeNote = () => setModals(m => ({ ...m, note: null }));
    const closeRename = () => setModals(m => ({ ...m, rename: null }));
    const closeAddCol = () => setModals(m => ({ ...m, addCol: false }));
    const closeAddCh = () => setModals(m => ({ ...m, addCh: null }));

    return {
        modals, setModals, editMode, setEditMode,
        setNoteModal, setRenameModal, setAddColumnModal, setAddChapterModal, toggleEdit,
        closeNote, closeRename, closeAddCol, closeAddCh
    };
};