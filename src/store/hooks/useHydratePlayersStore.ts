'use client';

import { useHydrateStore } from './useHydrateStore';
import { PlayersState } from '../slices/playersSlice';

type Payload = Partial<Omit<PlayersState, 'meta'>>;

/**
 * Deprecated: Use useHydrateStore instead
 * Legacy hook for backward compatibility
 */
export function useHydratePlayersStore(payload: Payload) {
    const { data, season } = payload;

    useHydrateStore({
        storeId: 'players',
        data: { data: data ?? [], season: season ?? '' },
    });
}
