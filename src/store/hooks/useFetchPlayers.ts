'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPlayers } from '@/store/slices/playersThunk';

/**
 * Hook for fetching and accessing player data from Redux store
 * Use this in client components that need fresh data or don't have SSR data
 * If the store already has data (from server hydration), it won't refetch
 *
 * Usage:
 * const { players, season, loading, error } = useFetchPlayers();
 */
export function useFetchPlayers() {
    const dispatch = useAppDispatch();
    const { data, season, meta } = useAppSelector((state) => state.players);

    useEffect(() => {
        // Only fetch if:
        // 1. Data is empty (not yet fetched or hydrated)
        // 2. Not already loading
        if (data.length === 0 && !meta.loading) {
            dispatch(fetchPlayers());
        }
    }, [dispatch, data.length, meta.loading]);

    return {
        players: data,
        season,
        loading: meta.loading,
        error: meta.error,
    };
}
