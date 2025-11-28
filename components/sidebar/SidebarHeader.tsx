
import React from 'react';

interface Props {
    isEditing: boolean;
    setIsEditing: (v: boolean) => void;
    setModals: React.Dispatch<React.SetStateAction<any>>;
}

export const SidebarHeader: React.FC<Props> = ({ isEditing, setIsEditing, setModals }) => (
    <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xs text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span> Subjects
        </h3>
        <div className="flex gap-1">
             <button 
                onClick={() => setModals((m: any) => ({ ...m, addSub: true }))} 
                className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 p-1 rounded-lg font-bold text-lg leading-none transition-colors"
                title="Add New Subject"
             >
                +
             </button>
             <button
                              onClick={() => setIsEditing(!isEditing)}
                              className={`p-1 rounded-lg transition-colors ${isEditing ? 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                              title="Edit Subjects"
                         >
                ✏️
             </button>
            <button 
                onClick={() => setModals((m: any) => ({ ...m, subConfig: true }))} 
                className="text-slate-500 hover:text-blue-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                title="Configure Progress Logic"
            >
                ⚙️
            </button>
        </div>
    </div>
);
