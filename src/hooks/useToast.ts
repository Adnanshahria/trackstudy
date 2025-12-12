import { useState, useCallback, createContext, useContext } from 'react';

export interface ToastState {
    isVisible: boolean;
    message: string;
    type: 'success' | 'error';
}

export interface ToastContextValue {
    toast: ToastState;
    showToast: (type: 'success' | 'error', message?: string) => void;
    hideToast: () => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
    const [toast, setToast] = useState<ToastState>({
        isVisible: false,
        message: '',
        type: 'success'
    });

    const showToast = useCallback((type: 'success' | 'error', message?: string) => {
        setToast({
            isVisible: true,
            message: message || (type === 'success' ? 'Synced' : 'Failed to sync'),
            type
        });
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, isVisible: false }));
    }, []);

    return { toast, showToast, hideToast };
};

export const useToastContext = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within ToastProvider');
    }
    return context;
};
