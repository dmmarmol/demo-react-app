import { createAsyncThunk } from '@reduxjs/toolkit';
import { GetPlayersResponse } from '@/lib/api-handlers/players/get-players';

const GET_PLAYERS_THUNK = 'players/fetchPlayers';

// Async thunk for fetching players
export const fetchPlayers = createAsyncThunk(
    GET_PLAYERS_THUNK,
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/players');
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.error.message);
            }
            const data: GetPlayersResponse = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Failed to fetch players',
            );
        }
    },
);
