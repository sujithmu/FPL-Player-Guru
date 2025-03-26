import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://footballapi.pulselive.com/football/stats/ranked/players/goals?page=0&pageSize=50&compSeasons=719&comps=1&compCodeForActivePlayer=EN_PR&altIds=true',
      {
        headers: {
          'Origin': 'your-app-url' // Set the Origin header if required
        }
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    return NextResponse.json({ error: 'Failed to fetch ranked players' }, { status: 500 });
  }
}