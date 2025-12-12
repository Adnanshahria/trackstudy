import React from 'react';
import { TickLog, MOCK_TICK_LOGS, formatRelativeTime } from '../../../types/tickLogTypes';
import { TickLogCard } from './TickLogCard';
import { useTickLogs } from '../../../hooks/useTickLogs';

interface Props {
    boxId: string;
    logs: TickLog[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    error?: string;
}

export const TickLogList: React.FC<Props> = ({ boxId, logs, isLoading, hasMore, onLoadMore, error }) => {
    // Loading skeleton
    if (isLoading && logs.length === 0) {
        return (
            <div className="flex flex-col gap-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="text-3xl mb-2">⚠️</span>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{error}</p>
                <button
                    onClick={onLoadMore}
                    className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Empty state
    if (logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="text-4xl mb-3 opacity-50">📊</span>
                <p className="text-sm text-slate-500 dark:text-slate-400">No logs yet</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Progress changes will appear here
                </p>
            </div>
        );
    }

    // Latest summary
    const latest = logs[0];

    return (
        <div className="flex flex-col gap-3">
            {/* Summary row */}
            <div className="flex items-center justify-between px-3 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Latest: {formatRelativeTime(latest.timestamp)}
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {latest.percentAfter}%
                </span>
            </div>

            {/* Log cards */}
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                {logs.map(log => (
                    <TickLogCard key={log.id} log={log} />
                ))}
            </div>

            {/* Load more button */}
            {hasMore && (
                <button
                    onClick={onLoadMore}
                    disabled={isLoading}
                    className="w-full py-2 text-xs font-medium text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Loading...' : 'Load more'}
                </button>
            )}
        </div>
    );
};

// Wrapper component that uses mock data for now
export const TickLogListWithMocks: React.FC<{ boxId: string }> = ({ boxId }) => {
    const [logs] = React.useState(MOCK_TICK_LOGS);

    return (
        <TickLogList
            boxId={boxId}
            logs={logs}
            isLoading={false}
            hasMore={false}
            onLoadMore={() => { }}
        />
    );
};

// Wrapper that uses real Firestore data via useTickLogs hook
export const TickLogListWithData: React.FC<{ boxId: string, userId: string | null }> = ({ boxId, userId }) => {
    const { logs, isLoading, error, hasMore, loadMore } = useTickLogs(boxId, userId);

    return (
        <TickLogList
            boxId={boxId}
            logs={logs}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            error={error || undefined}
        />
    );
};

