
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { TickLog, MOCK_TICK_LOGS } from '../types/tickLogTypes';

const TICK_LOGS_TABLE = 'tick_logs';
const PAGE_SIZE = 20;

interface UseTickLogsResult {
    logs: TickLog[];
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
}

export const useTickLogs = (boxId: string, userId: string | null, useMockData = false): UseTickLogsResult => {
    const [logs, setLogs] = useState<TickLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const docToTickLog = (data: any): TickLog => {
        return {
            id: data.id,
            boxId: data.box_id,
            subjectId: data.subject_id,
            chapterId: data.chapter_id,
            fieldKey: data.field_key,
            userId: data.user_id,
            timestamp: new Date(data.timestamp),
            iso: data.timestamp, // Use timestamp as iso if iso column removed
            percentAfter: data.percent_after,
            percentBefore: data.percent_before,
            comment: data.comment,
            source: data.source
        };
    };

    const fetchLogs = useCallback(async () => {
        if (!boxId) return;
        if (useMockData || !userId) {
            setLogs(MOCK_TICK_LOGS.filter(log => log.boxId === boxId));
            setHasMore(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from(TICK_LOGS_TABLE)
                .select('*')
                .eq('box_id', boxId)
                .eq('user_id', userId)
                .order('timestamp', { ascending: false })
                .range(0, PAGE_SIZE - 1);

            if (error) throw error;

            const fetchedLogs = (data || []).map(docToTickLog);
            setLogs(fetchedLogs);
            setHasMore(fetchedLogs.length === PAGE_SIZE);
            setPage(1);
        } catch (err: any) {
            console.error('Error fetching tick logs:', err);
            setError('Failed to load history');
        } finally {
            setIsLoading(false);
        }
    }, [boxId, userId, useMockData]);

    const loadMore = useCallback(async () => {
        if (!boxId || !userId || !hasMore || isLoading) return;

        setIsLoading(true);
        try {
            const from = page * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            const { data, error } = await supabase
                .from(TICK_LOGS_TABLE)
                .select('*')
                .eq('box_id', boxId)
                .eq('user_id', userId)
                .order('timestamp', { ascending: false })
                .range(from, to);

            if (error) throw error;

            const fetchedLogs = (data || []).map(docToTickLog);
            setLogs(prev => [...prev, ...fetchedLogs]);
            setHasMore(fetchedLogs.length === PAGE_SIZE);
            setPage(prev => prev + 1);
        } catch (err: any) {
            console.error('Error loading more tick logs:', err);
            setError('Failed to load more');
        } finally {
            setIsLoading(false);
        }
    }, [boxId, userId, hasMore, isLoading, page]);

    const refresh = useCallback(async () => {
        setPage(0);
        setHasMore(true);
        await fetchLogs();
    }, [fetchLogs]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    return { logs, isLoading, error, hasMore, loadMore, refresh };
};
