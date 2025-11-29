import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
    onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onHide }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onHide, 50);
            }, 350);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onHide]);

    if (!isVisible && !show) return null;

    const bgColor = type === 'success' 
        ? 'bg-emerald-500/90 border-emerald-400' 
        : 'bg-rose-500/90 border-rose-400';

    return (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] ${show ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`px-4 py-2 rounded-full ${bgColor} border text-white text-sm font-medium shadow-lg backdrop-blur-sm flex items-center gap-2`}>
                {type === 'success' ? (
                    <span className="text-white">Synced</span>
                ) : (
                    <span className="text-white text-xs">Failed to sync - try force sync in settings</span>
                )}
                <span>{type === 'success' ? '✔' : '✕'}</span>
            </div>
        </div>
    );
};
