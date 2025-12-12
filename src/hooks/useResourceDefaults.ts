/**
 * useResourceDefaults - Read-only hook for global resource defaults
 * 
 * Fetches resourceDefaults from Firestore, caches locally, and provides
 * resolved labels with per-user override support.
 */

import { useState, useEffect, useCallback } from 'react';
import { firestore } from '../utils/firebase/core';
import { ResourceDefault, DEFAULT_RESOURCES, CustomLabels, resolveLabel } from '../types/resourceDefaults';

const RESOURCE_DEFAULTS_COLLECTION = 'resourceDefaults';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface UseResourceDefaultsResult {
    resources: ResourceDefault[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    getLabel: (id: number, customLabels?: CustomLabels) => string;
    getColor: (id: number) => string;
}

// In-memory cache
let cachedResources: ResourceDefault[] | null = null;
let cacheTimestamp: number = 0;

export const useResourceDefaults = (): UseResourceDefaultsResult => {
    const [resources, setResources] = useState<ResourceDefault[]>(cachedResources || DEFAULT_RESOURCES);
    const [isLoading, setIsLoading] = useState(!cachedResources);
    const [error, setError] = useState<string | null>(null);

    const fetchResources = useCallback(async (force = false) => {
        // Use cache if valid and not forced
        const now = Date.now();
        if (!force && cachedResources && (now - cacheTimestamp) < CACHE_TTL_MS) {
            setResources(cachedResources);
            setIsLoading(false);
            return;
        }

        // Check Firestore availability
        if (!firestore) {
            setResources(DEFAULT_RESOURCES);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const snapshot = await firestore
                .collection(RESOURCE_DEFAULTS_COLLECTION)
                .orderBy('order', 'asc')
                .get();

            if (snapshot.empty) {
                // Collection doesn't exist yet - use defaults
                setResources(DEFAULT_RESOURCES);
                cachedResources = DEFAULT_RESOURCES;
            } else {
                const fetchedResources: ResourceDefault[] = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: data.id || parseInt(doc.id),
                        order: data.order || parseInt(doc.id),
                        key: data.key || '',
                        label: data.label || `Resource ${doc.id}`,
                        color: data.color || 'bg-slate-500',
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                        updatedBy: data.updatedBy
                    };
                });
                setResources(fetchedResources);
                cachedResources = fetchedResources;
            }
            cacheTimestamp = now;
        } catch (err: any) {
            console.error('Error fetching resource defaults:', err);
            // Fall back to defaults on error
            setResources(DEFAULT_RESOURCES);
            cachedResources = DEFAULT_RESOURCES;
            if (err.code !== 'permission-denied') {
                setError('Failed to load column settings');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    // Get resolved label with custom override support
    const getLabel = useCallback((id: number, customLabels?: CustomLabels): string => {
        return resolveLabel(id, customLabels, resources);
    }, [resources]);

    // Get color for a resource ID
    const getColor = useCallback((id: number): string => {
        const resource = resources.find(r => r.id === id);
        return resource?.color || 'bg-slate-500';
    }, [resources]);

    // Force refresh
    const refresh = useCallback(async () => {
        await fetchResources(true);
    }, [fetchResources]);

    return { resources, isLoading, error, refresh, getLabel, getColor };
};

// Utility: Clear cache (for testing or after admin updates)
export const clearResourceDefaultsCache = () => {
    cachedResources = null;
    cacheTimestamp = 0;
};
