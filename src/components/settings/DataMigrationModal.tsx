/**
 * DataMigrationModal - Export/Import user data for account migration
 * 
 * Allows users to:
 * 1. Export their data as a shareable code
 * 2. Import data from another account using the code
 */

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { UserData, UserSettings } from '../../types';
import { saveUserProgress, saveSettings } from '../../utils/storage';

interface DataMigrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
    userData: UserData;
    settings: UserSettings;
    onImportComplete: () => void; // Called after successful import to refresh UI
}

// Simple encoding/decoding for migration codes
const encodeData = (userData: UserData, settings: UserSettings): string => {
    const payload = {
        v: 1, // Version for future compatibility
        t: Date.now(), // Timestamp
        d: userData,
        s: settings
    };
    // Use base64 encoding
    const jsonStr = JSON.stringify(payload);
    return btoa(unescape(encodeURIComponent(jsonStr)));
};

const decodeData = (code: string): { userData: UserData; settings: UserSettings; timestamp: number } | null => {
    try {
        const jsonStr = decodeURIComponent(escape(atob(code.trim())));
        const payload = JSON.parse(jsonStr);

        if (!payload.d || !payload.s) {
            throw new Error('Invalid data structure');
        }

        return {
            userData: payload.d,
            settings: payload.s,
            timestamp: payload.t || Date.now()
        };
    } catch (error) {
        console.error('Failed to decode migration data:', error);
        return null;
    }
};

export const DataMigrationModal: React.FC<DataMigrationModalProps> = ({
    isOpen,
    onClose,
    userId,
    userData,
    settings,
    onImportComplete
}) => {
    const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
    const [exportCode, setExportCode] = useState('');
    const [importCode, setImportCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
    const [previewData, setPreviewData] = useState<{ userData: UserData; settings: UserSettings; timestamp: number } | null>(null);

    // Generate export code
    const handleGenerateCode = () => {
        setMessage(null);
        try {
            const code = encodeData(userData, settings);
            setExportCode(code);
            setMessage({ type: 'success', text: 'Migration code generated! Copy and save it securely.' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to generate code. Please try again.' });
        }
    };

    // Copy code to clipboard
    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(exportCode);
            setMessage({ type: 'success', text: 'Copied to clipboard! ✓' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Copy failed. Please select and copy manually.' });
        }
    };

    // Preview import data
    const handlePreviewImport = () => {
        setMessage(null);
        setPreviewData(null);

        if (!importCode.trim()) {
            setMessage({ type: 'error', text: 'Please paste a migration code first.' });
            return;
        }

        const decoded = decodeData(importCode);
        if (!decoded) {
            setMessage({ type: 'error', text: 'Invalid migration code. Check if it was copied correctly.' });
            return;
        }

        setPreviewData(decoded);

        // Count items
        const progressKeys = Object.keys(decoded.userData).filter(k => k.startsWith('s_')).length;
        const noteKeys = Object.keys(decoded.userData).filter(k => k.startsWith('note_')).length;
        const date = new Date(decoded.timestamp).toLocaleString();

        setMessage({
            type: 'info',
            text: `Found: ${progressKeys} progress items, ${noteKeys} notes. Created: ${date}`
        });
    };

    // Confirm import
    const handleConfirmImport = async () => {
        if (!previewData || !userId) return;

        setIsProcessing(true);
        setMessage(null);

        try {
            // 1. Save all progress data to Firestore
            const progressUpdates: Record<string, any> = {};
            for (const [key, value] of Object.entries(previewData.userData)) {
                progressUpdates[key] = value;
            }
            await saveUserProgress(userId, progressUpdates);

            // 2. Save settings
            const mergedSettings = { ...settings, ...previewData.settings };
            await saveSettings(userId, mergedSettings);

            setMessage({ type: 'success', text: '✅ Data imported successfully! Refreshing...' });
            setImportCode('');
            setPreviewData(null);

            // 3. Notify parent to refresh UI
            setTimeout(() => {
                onImportComplete();
                onClose();
            }, 1500);
        } catch (error: any) {
            console.error('Import error:', error);
            setMessage({ type: 'error', text: error.message || 'Import failed. Please try again.' });
        } finally {
            setIsProcessing(false);
        }
    };

    // Count current data
    const currentProgressCount = Object.keys(userData).filter(k => k.startsWith('s_')).length;
    const currentNoteCount = Object.keys(userData).filter(k => k.startsWith('note_')).length;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="🔄 Data Migration">
            <div className="flex flex-col gap-4">
                {/* Tab buttons */}
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
                    <button
                        onClick={() => { setActiveTab('export'); setMessage(null); }}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'export'
                            ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-lg'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        📤 Export Data
                    </button>
                    <button
                        onClick={() => { setActiveTab('import'); setMessage(null); }}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'import'
                            ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-lg'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        📥 Import Data
                    </button>
                </div>

                {/* Message display */}
                {message && (
                    <div className={`p-3 rounded-lg text-xs ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        message.type === 'error' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                            'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Export Tab */}
                {activeTab === 'export' && (
                    <div className="flex flex-col gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
                            <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                                <strong>Your Current Data:</strong>
                            </p>
                            <div className="flex gap-4 text-xs text-slate-600 dark:text-slate-300">
                                <span>📊 {currentProgressCount} progress items</span>
                                <span>📝 {currentNoteCount} notes</span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Generate a migration code to transfer your data to a new account.
                            <strong> Keep this code secret</strong> - anyone with it can import your data.
                        </p>

                        {!exportCode ? (
                            <Button onClick={handleGenerateCode} className="w-full">
                                🔑 Generate Migration Code
                            </Button>
                        ) : (
                            <>
                                <div className="relative">
                                    <textarea
                                        readOnly
                                        value={exportCode}
                                        className="w-full h-24 p-3 text-xs font-mono bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg resize-none"
                                    />
                                    <button
                                        onClick={handleCopyCode}
                                        className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        📋 Copy
                                    </button>
                                </div>
                                <p className="text-[10px] text-amber-600 dark:text-amber-400">
                                    ⚠️ This code contains ALL your progress and settings. Don't share publicly!
                                </p>
                            </>
                        )}
                    </div>
                )}

                {/* Import Tab */}
                {activeTab === 'import' && (
                    <div className="flex flex-col gap-4">
                        <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/20">
                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                ⚠️ <strong>Warning:</strong> Importing will <strong>merge</strong> with your current data.
                                Existing progress values will be overwritten by the imported data.
                            </p>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Paste the migration code from your old account to restore your progress.
                        </p>

                        <textarea
                            value={importCode}
                            onChange={(e) => { setImportCode(e.target.value); setPreviewData(null); }}
                            placeholder="Paste migration code here..."
                            className="w-full h-24 p-3 text-xs font-mono bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {!previewData ? (
                            <Button
                                onClick={handlePreviewImport}
                                variant="secondary"
                                className="w-full"
                            >
                                🔍 Preview Import
                            </Button>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                                        ✓ Valid migration code detected!
                                    </p>
                                    <div className="flex gap-4 text-xs text-slate-600 dark:text-slate-300">
                                        <span>📊 {Object.keys(previewData.userData).filter(k => k.startsWith('s_')).length} progress</span>
                                        <span>📝 {Object.keys(previewData.userData).filter(k => k.startsWith('note_')).length} notes</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleConfirmImport}
                                    disabled={isProcessing}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                                >
                                    {isProcessing ? '⏳ Importing...' : '✅ Confirm Import'}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Close button */}
                <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                    <Button onClick={onClose} variant="secondary" className="w-full">
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
