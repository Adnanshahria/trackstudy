import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAdmin } from '../../hooks/useAdmin';
import { useResourceDefaults } from '../../hooks/useResourceDefaults';
import { ResourceDefault } from '../../types/resourceDefaults';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface AdminPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
    const { isAdmin, isLoading: adminLoading, userId } = useAdmin();
    const { resources, isLoading: resourcesLoading, refresh } = useResourceDefaults();
    const [editingResource, setEditingResource] = useState<ResourceDefault | null>(null);
    const [newLabel, setNewLabel] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleEdit = (resource: ResourceDefault) => {
        setEditingResource(resource);
        setNewLabel(resource.label);
        setMessage(null);
    };

    const handleSave = async () => {
        if (!editingResource || !newLabel.trim()) return;

        setIsSaving(true);
        setMessage(null);

        try {
            // Call Firebase Cloud Function
            const functions = getFunctions();
            const updateLabel = httpsCallable(functions, 'adminUpdateResourceLabel');

            await updateLabel({
                resourceId: editingResource.id,
                newLabel: newLabel.trim()
            });

            setMessage({ type: 'success', text: `Updated "${editingResource.label}" to "${newLabel.trim()}"` });
            setEditingResource(null);
            await refresh(); // Refresh the resource defaults
        } catch (error: any) {
            console.error('Error updating resource:', error);
            setMessage({
                type: 'error',
                text: error.message || 'Failed to update. Make sure Cloud Functions are deployed.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditingResource(null);
        setNewLabel('');
    };

    if (adminLoading) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Admin Panel">
                <div className="flex items-center justify-center py-10">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            </Modal>
        );
    }

    if (!isAdmin) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Access Denied">
                <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">🔒</span>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                        You don't have admin access.
                    </p>
                    <p className="text-xs text-slate-400">
                        User ID: <code className="bg-slate-100 dark:bg-white/10 px-2 py-1 rounded">{userId || 'Not logged in'}</code>
                    </p>
                    <Button onClick={onClose} className="mt-6">Close</Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="⚙️ Admin Panel">
            <div className="flex flex-col gap-6">
                {/* Admin info */}
                <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-200 dark:border-green-500/20">
                    <p className="text-xs text-green-600 dark:text-green-400">
                        ✓ Logged in as Admin
                    </p>
                </div>

                {/* Resource Defaults Section */}
                <div>
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
                        Column Label Defaults
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        These are the global default column names. Changes affect all new users.
                    </p>

                    {message && (
                        <div className={`p-3 rounded-lg mb-4 text-xs ${message.type === 'success'
                                ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {resourcesLoading ? (
                        <div className="flex items-center gap-2 py-4">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-slate-500">Loading...</span>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {resources.map(resource => (
                                <div
                                    key={resource.id}
                                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10"
                                >
                                    {editingResource?.id === resource.id ? (
                                        <div className="flex items-center gap-2 flex-1">
                                            <input
                                                type="text"
                                                value={newLabel}
                                                onChange={(e) => setNewLabel(e.target.value)}
                                                className="flex-1 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                                                maxLength={40}
                                                autoFocus
                                            />
                                            <button
                                                onClick={handleSave}
                                                disabled={isSaving || !newLabel.trim()}
                                                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg disabled:opacity-50"
                                            >
                                                {isSaving ? '...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <span className={`w-3 h-3 rounded-full ${resource.color}`} />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                    {resource.label}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    (ID: {resource.id})
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleEdit(resource)}
                                                className="text-slate-400 hover:text-blue-500 transition-colors"
                                            >
                                                ✏️
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Other admin actions */}
                <div className="border-t border-slate-200 dark:border-white/10 pt-4">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
                        Other Actions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="secondary"
                            onClick={refresh}
                            className="text-xs"
                        >
                            🔄 Refresh Defaults
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
