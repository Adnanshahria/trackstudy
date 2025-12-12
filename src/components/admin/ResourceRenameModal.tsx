import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ResourceDefault } from '../../types/resourceDefaults';

interface ResourceRenameModalProps {
    isOpen: boolean;
    onClose: () => void;
    resource: ResourceDefault;
    onSave: (resourceId: number, newLabel: string) => Promise<void>;
    isAdmin: boolean;
}

export const ResourceRenameModal: React.FC<ResourceRenameModalProps> = ({
    isOpen, onClose, resource, onSave, isAdmin
}) => {
    const [newLabel, setNewLabel] = useState(resource.label);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!newLabel.trim()) {
            setError('Label cannot be empty');
            return;
        }
        if (newLabel.length > 40) {
            setError('Label must be 40 characters or less');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await onSave(resource.id, newLabel.trim());
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to update');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isAdmin) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="View Column">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Column: <span className="font-bold">{resource.label}</span>
                    </p>
                    <p className="text-xs text-amber-500">
                        Only administrators can rename column defaults.
                    </p>
                    <Button onClick={onClose}>Close</Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Rename Column">
            <div className="flex flex-col gap-4">
                {/* Info banner */}
                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                        ⓘ This updates the default column name <strong>globally</strong> for all users.
                        Existing custom labels on individual boxes are unaffected.
                    </p>
                </div>

                {/* Current value */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Current Name
                    </label>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {resource.label}
                    </p>
                </div>

                {/* New value input */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        New Name
                    </label>
                    <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        maxLength={40}
                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
                        placeholder="Enter new column name"
                        autoFocus
                    />
                    <span className="text-[10px] text-slate-400 text-right">
                        {newLabel.length}/40
                    </span>
                </div>

                {/* Error message */}
                {error && (
                    <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-500/10 p-2 rounded-lg">
                        {error}
                    </p>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || !newLabel.trim()}>
                        {isSaving ? 'Saving...' : 'Save Globally'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
