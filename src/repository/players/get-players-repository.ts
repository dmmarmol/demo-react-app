import { GetPlayersResponse } from "@/lib/api-handlers/players/get-players";
import { getBaseUrl } from "../get-baseurl";

export async function getPlayersRepository(): Promise<GetPlayersResponse> {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/players`, {
        next: { revalidate: 60 }
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch players');
    }
    
    return response.json();
}