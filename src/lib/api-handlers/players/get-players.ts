import { getServerFirestore } from '@/firebase/server'
import { NotFoundError } from '@/lib/errors/api-error';
import { Player } from './players-types';

export interface GetPlayersResponse {
    count: number;
    results: Player[];
}

function sortPlayers(a: Player, b: Player): number {
    return a.team.localeCompare(b.team);
}

export async function getPlayersHandler(): Promise<GetPlayersResponse> {
    const db = getServerFirestore()
    const docRef = db.collection('EXAMPLE_REACT_APP').doc('collections')
    const docSnap = await docRef.get()
    
    if (!docSnap.exists) {
        throw new NotFoundError('No players were found');
    }
    
    const data = docSnap.data()
    const playersMap = data?.players || {}
    
    // Transform the GUID-indexed object into an array
    const results: Player[] = Object.entries(playersMap).map(([guid, playerData]) => ({
        id: guid,
        ...(playerData as Omit<Player, 'id'>),
    }))
    
    return {
        count: results.length,
        results: results.sort(sortPlayers),
    }
}