'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setPlayers } from '@/store/slices/playersSlice';
import { Player } from '@/lib/api-handlers/players/players-types';

// Type mapping for store hydration - extend this as you add more slices
interface StoreTypeMap {
    players: { data: Player[]; season: string };
}

type StoreId = keyof StoreTypeMap;

interface HydrationPayload<S extends StoreId = StoreId> {
    storeId: S;
    data: StoreTypeMap[S];
}

// Action mapping - add new slice actions here as you create them
const actionMap = {
    players: setPlayers,
} as const;

/**
 * Generic hook to hydrate any slice of Redux store with server-fetched data
 *
 * Usage:
 * useHydrateStore({ storeId: 'players', data: { data: players, season: '2025-2026' } })
 */
export function useHydrateStore<S extends StoreId>({
    storeId,
    data,
}: HydrationPayload<S>) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!data) return;

        const action = actionMap[storeId];
        if (action) {
            dispatch(action(data as StoreTypeMap[S]));
        } else {
            console.warn(`Unknown storeId: ${storeId}`);
        }
    }, [data, dispatch, storeId]);
}
