
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase/client';
import { ResourceDefault, DEFAULT_RESOURCES, CustomLabels, resolveLabel } from '../types/resourceDefaults';

const RESOURCE_DEFAULTS_TABLE = 'resource_defaults';
const CACHE_TTL_MS = 5 * 60 * 1000;

interface UseResourceDefaultsResult {
    resources: ResourceDefault[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    getLabel: (id: number, customLabels?: CustomLabels) => string;
    getColor: (id: number) => string;
}

let cachedResources: ResourceDefault[] | null = null;
let cacheTimestamp: number = 0;

export const useResourceDefaults = (): UseResourceDefaultsResult => {
    const [resources, setResources] = useState<ResourceDefault[]>(cachedResources || DEFAULT_RESOURCES);
    const [isLoading, setIsLoading] = useState(!cachedResources);
    const [error, setError] = useState<string | null>(null);

    const fetchResources = useCallback(async (force = false) => {
        const now = Date.now();
        if (!force && cachedResources && (now - cacheTimestamp) < CACHE_TTL_MS) {
            setResources(cachedResources);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from(RESOURCE_DEFAULTS_TABLE)
                .select('*')
                .order('order', { ascending: true });

            if (error) throw error;

            if (!data || data.length === 0) {
                setResources(DEFAULT_RESOURCES);
                cachedResources = DEFAULT_RESOURCES;
            } else {
                const fetchedResources: ResourceDefault[] = data.map(d => ({
                    id: d.id,
                    order: d.order,
                    key: d.key,
                    label: d.label,
                    color: d.color,
                    createdAt: d.created_at, // Mapping from snake_case if standard Supabase
                    updatedAt: d.updated_at,
                    updatedBy: d.updated_by
                }));
                // Fallback for snake_case if fields missing? assuming standard
                setResources(fetchedResources);
                cachedResources = fetchedResources;
            }
            cacheTimestamp = now;
        } catch (err: any) {
            console.error('Error fetching resource defaults:', err);
            setResources(DEFAULT_RESOURCES);
            cachedResources = DEFAULT_RESOURCES;
            setError('Failed to load column settings');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchResources(); }, [fetchResources]);

    const getLabel = useCallback((id: number, customLabels?: CustomLabels): string => {
        return resolveLabel(id, customLabels, resources);
    }, [resources]);

    const getColor = useCallback((id: number): string => {
        const resource = resources.find(r => r.id === id);
        return resource?.color || 'bg-slate-500';
    }, [resources]);

    const refresh = useCallback(async () => { await fetchResources(true); }, [fetchResources]);

    return { resources, isLoading, error, refresh, getLabel, getColor };
};

export const clearResourceDefaultsCache = () => {
    cachedResources = null;
    cacheTimestamp = 0;
};
