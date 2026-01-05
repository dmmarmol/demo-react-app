'use server';

import { getPlayersRepository } from '@/repository/players/get-players-repository';
import { Player } from '@/lib/api-handlers/players/players-types';
import PlayersContent from './PlayersContent';

/**
 * This component was created to separate server and client components.
 * It fetches player data on the server side and passes it to the client component.
 */
export default async function PlayersSection() {
    const result = await getPlayersRepository();
    const data: Player[] = result.results;

    return <PlayersContent data={data} season={result.season} />;
}
