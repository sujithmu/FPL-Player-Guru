import { NextResponse } from 'next/server';

const API_URL = 'https://fantasy.premierleague.com/api/bootstrap-static/';

type Player = {
  element_type: number; // 1: Goalkeeper, 2: Defender, 3: Midfielder, 4: Forward
  first_name: string;
  second_name: string;
  total_points: number;
  team: number; // Team ID
  goals_scored: number;
  saves?: number; //Only for Goal Keepers
  clean_sheets?: number; //Only for Goal Keepers
  code: number; // Changed from element_code to code to match API
  element: number; // Add element ID
  form: number;
  points_per_game: string;
  starts: number;
  expected_goals: number;
  expected_assists: number;
  expected_goal_involvements: number;
  minutes: number;  // Add minutes
};

type Team = {
  id: number;
  name: string;
  short_name: string;
};

type APIResponse = {
  elements: Player[];
  teams: Team[];
};

async function fetchData(): Promise<APIResponse> {
  try {
    const response = await fetch(API_URL, { cache: 'no-store' }); // Disable cache for fresh data
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    return (await response.json()) as APIResponse;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw to be caught by the caller
  }
}

export async function GET() {
  try {
    const data = await fetchData();

    //Data Analysis Logic
    const teams = data.teams;
    const players = data.elements;

    // Team with most goals
    const teamGoals: { [teamId: number]: number } = {};
    players.forEach((player) => {
      if (!teamGoals[player.team]) {
        teamGoals[player.team] = 0;
      }
      teamGoals[player.team] += player.goals_scored;
    });

    let teamWithMostGoals: Team | undefined = undefined;
    let maxGoals = 0;
    for (const teamId in teamGoals) {
      if (teamGoals[teamId] > maxGoals) {
        maxGoals = teamGoals[teamId];
        teamWithMostGoals = teams.find((team) => team.id === parseInt(teamId));
      }
    }
    // Players with more than 5 points
    const highScoringPlayers = players.filter((player) => player.total_points > 5);

    // Top goalkeeper
    const goalKeepers = players.filter((player) => player.element_type === 1);
    const topGoalKeeper = goalKeepers.reduce((prev, current) => {
      if (
        (current.clean_sheets || 0) > (prev.clean_sheets || 0) ||
        ((current.clean_sheets || 0) === (prev.clean_sheets || 0) && (current.saves || 0) > (prev.saves || 0))
      ) {
        return current;
      }
      return prev;
    });

    const analysisResults = {
      teamWithMostGoals: teamWithMostGoals,
      highScoringPlayers: highScoringPlayers,
      topGoalKeeper: topGoalKeeper,
      allPlayers: players // pass this array to dashboard
    };

    return NextResponse.json(analysisResults);
  } catch (error: unknown) {
    let errorMessage = 'An error occurred while fetching jobs.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}