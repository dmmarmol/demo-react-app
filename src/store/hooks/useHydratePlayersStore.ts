'use client';
import { Player } from '@/lib/api-handlers/players/players-types';
import { useHydrateStore } from './useHydrateStore';
import { PlayersState } from '../slices/playersSlice';

/**
 * Deprecated: Use useHydrateStore instead
 * Legacy hook for backward compatibility
 */
export function useHydratePlayersStore(payload: Partial<Omit<PlayersState, 'meta'>>) {
    const { data, season } = payload;

    useHydrateStore({
        storeId: 'players',
        data: { data: data ?? [], season: season ?? '' },
    });
}
