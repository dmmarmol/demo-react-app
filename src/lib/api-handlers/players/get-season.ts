import { getServerFirestore } from '@/firebase/server'
import { NotFoundError } from '@/lib/errors/api-error';

export interface GetSeasonResponse {
    value: string
}

export async function getSeasonsHandler(): Promise<GetSeasonResponse> {
    const db = getServerFirestore()
    const docRef = db.collection('EXAMPLE_REACT_APP').doc('season')
    const docSnap = await docRef.get()
    
    if (!docSnap.exists) {
        throw new NotFoundError('No season information was found');
    }
    
    const data = docSnap.data()
    
    return {
        value: data?.value,
    } as GetSeasonResponse
}