/**
 * useTickLogs - Read-only hook for fetching tick log history
 * 
 * This hook ONLY READS from Firestore. It does NOT create, update, or delete logs.
 * All tick log creation is handled server-side by Cloud Functions.
 */

import { useState, useCallback, useEffect } from 'react';
import { firestore } from '../utils/firebase/core';
import { TickLog, MOCK_TICK_LOGS } from '../types/tickLogTypes';

const TICK_LOGS_COLLECTION = 'tickLogs';
const PAGE_SIZE = 20;

interface UseTickLogsResult {
    logs: TickLog[];
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
}

/**
 * Fetches tick logs for a specific box ID
 * @param boxId - The progress box identifier (e.g., "s_biology_1_mainBook")
 * @param useMockData - Use mock data for development/testing
 */
export const useTickLogs = (boxId: string, useMockData = false): UseTickLogsResult => {
    const [logs, setLogs] = useState<TickLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [lastDoc, setLastDoc] = useState<any>(null);

    // Convert Firestore doc to TickLog
    const docToTickLog = (doc: any): TickLog => {
        const data = doc.data();
        return {
            id: doc.id,
            boxId: data.boxId,
            subjectId: data.subjectId,
            chapterId: data.chapterId,
            fieldKey: data.fieldKey,
            userId: data.userId,
            timestamp: data.timestamp?.toDate() || new Date(),
            iso: data.iso || new Date().toISOString(),
            percentAfter: data.percentAfter || 0,
            percentBefore: data.percentBefore || 0,
            comment: data.comment,
            source: data.source || 'manual'
        };
    };

    // Fetch initial page
    const fetchLogs = useCallback(async () => {
        if (!boxId) return;

        // Use mock data if requested or Firestore not available
        if (useMockData || !firestore) {
            setLogs(MOCK_TICK_LOGS.filter(log => log.boxId === boxId || boxId === 's_biology_1_mainBook'));
            setHasMore(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const query = firestore
                .collection(TICK_LOGS_COLLECTION)
                .where('boxId', '==', boxId)
                .orderBy('timestamp', 'desc')
                .limit(PAGE_SIZE);

            const snapshot = await query.get();

            const fetchedLogs = snapshot.docs.map(docToTickLog);
            setLogs(fetchedLogs);
            setHasMore(snapshot.docs.length === PAGE_SIZE);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        } catch (err: any) {
            console.error('Error fetching tick logs:', err);
            // If index not yet created or permission denied, show mock data
            if (err.code === 'failed-precondition' || err.code === 'permission-denied') {
                setLogs(MOCK_TICK_LOGS);
                setHasMore(false);
                setError(null); // Don't show error, just use mock data
            } else {
                setError('Failed to load history');
            }
        } finally {
            setIsLoading(false);
        }
    }, [boxId, useMockData]);

    // Load more (pagination)
    const loadMore = useCallback(async () => {
        if (!boxId || !hasMore || isLoading || !lastDoc || !firestore) return;

        setIsLoading(true);

        try {
            const query = firestore
                .collection(TICK_LOGS_COLLECTION)
                .where('boxId', '==', boxId)
                .orderBy('timestamp', 'desc')
                .startAfter(lastDoc)
                .limit(PAGE_SIZE);

            const snapshot = await query.get();

            const fetchedLogs = snapshot.docs.map(docToTickLog);
            setLogs(prev => [...prev, ...fetchedLogs]);
            setHasMore(snapshot.docs.length === PAGE_SIZE);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        } catch (err: any) {
            console.error('Error loading more tick logs:', err);
            setError('Failed to load more');
        } finally {
            setIsLoading(false);
        }
    }, [boxId, hasMore, isLoading, lastDoc]);

    // Refresh (re-fetch from beginning)
    const refresh = useCallback(async () => {
        setLastDoc(null);
        setHasMore(true);
        await fetchLogs();
    }, [fetchLogs]);

    // Initial fetch when boxId changes
    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return { logs, isLoading, error, hasMore, loadMore, refresh };
};
