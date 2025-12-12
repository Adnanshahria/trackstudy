import React, { ReactNode } from 'react';
import { logger } from '../utils/logger';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error) {
        logger.error('Error caught by boundary:', error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#1A1A1C]">
                    <div className="text-center px-4">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Something went wrong</h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">{this.state.error?.message}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
