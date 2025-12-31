import { getServerFirestore } from '@/firebase/server'

interface Player {
    id: string;
    name: string;
    position: string;
    nationality: string;
    team: string;
    shirtNumber: number;
    age: number;
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    minutesPlayed: number;
}

interface GetPlayersResponse {
    count: number;
    results: Player[];
}

export async function getPlayersHandler(): Promise<GetPlayersResponse> {
    const db = getServerFirestore()
    const docRef = db.collection('EXAMPLE_REACT_APP').doc('collections')
    const docSnap = await docRef.get()
    
    if (!docSnap.exists) {
        return { count: 0, results: [] }
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
        results,
    }
}