import { getPlayersHandler } from '@/lib/api-handlers/players/get-players';
import { ApiError } from '@/lib/errors/api-error';
import { NextRequest, NextResponse } from 'next/server';

// Handle GET request
export async function GET(request: NextRequest) {
  try {
    const res = await getPlayersHandler()
    return NextResponse.json(res);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          error: {
            name: error.name,
            message: error.message,
            statusCode: error.statusCode,
          },
        }, 
        { status: error.statusCode }
      )
    }

    console.error('Unexpected error:', error)
    return NextResponse.json(
      { 
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        }
      },
      { status: 500 }
    )
  }
}

// export async function POST(request: NextRequest) {
//   // Handle POST request
//   const body = await request.json();
//   return NextResponse.json({ created: true });
// }