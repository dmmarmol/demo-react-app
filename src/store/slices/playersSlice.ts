'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPlayers } from './playersThunk';
import { Player } from '@/lib/api-handlers/players/players-types';

export interface PlayersState {
    data: Player[];
    season: string;
    meta: {
        loading: boolean;
        error: string | null;
    };
}

const initialState: PlayersState = {
    data: [],
    season: '',
    meta: {
        loading: false,
        error: null,
    },
};

const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        setPlayers: (
            state,
            action: PayloadAction<{ data: Player[]; season: string }>,
        ) => {
            state.data = action.payload.data;
            state.season = action.payload.season;
            state.meta.error = null;
        },
        clearError: (state) => {
            state.meta.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlayers.pending, (state) => {
                state.meta.loading = true;
                state.meta.error = null;
            })
            .addCase(fetchPlayers.fulfilled, (state, action) => {
                state.meta.loading = false;
                state.data = action.payload.results;
                state.season = action.payload.season;
                state.meta.error = null;
            })
            .addCase(fetchPlayers.rejected, (state, action) => {
                state.meta.loading = false;
                state.meta.error = action.payload as string;
            });
    },
});

export const { setPlayers, clearError } = playersSlice.actions;
export default playersSlice.reducer;
