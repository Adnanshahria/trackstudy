import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    isDanger?: boolean;
}

export const ConfirmModal: React.FC<Props> = ({ 
    isOpen, onClose, onConfirm, title, message, 
    confirmText = "Yes, Delete", isDanger = false 
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
            <div className="flex flex-col gap-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {message}
                </p>
                <div className="flex justify-end gap-3 mt-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button 
                        variant={isDanger ? "danger" : "primary"} 
                        onClick={() => { onConfirm(); onClose(); }}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};