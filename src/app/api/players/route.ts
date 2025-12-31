import { getPlayersHandler } from '@/lib/api-handlers/players/get-players';
import { NextRequest, NextResponse } from 'next/server';

// Handle GET request
export async function GET(request: NextRequest) {
  try {
    const res = await getPlayersHandler()
    return NextResponse.json(res);    
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred while fetching players.');
  }
}

// export async function POST(request: NextRequest) {
//   // Handle POST request
//   const body = await request.json();
//   return NextResponse.json({ created: true });
// }