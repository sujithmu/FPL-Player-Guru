import React, { useState, useEffect } from 'react';
import Image from 'next/image'

type Player = {
  element_type: number;
  first_name: string;
  second_name: string;
  total_points: number;
  team: number;
  goals_scored: number;
  saves?: number;
  clean_sheets?: number;
  code: number;
  form: number;
  points_per_game: string;
  starts: number;
  expected_goals: number;
  expected_assists: number;
  expected_goal_involvements: number;
  minutes: number; // Ensure `minutes` is included
  opta_code?: number; // Add opta_code to Player type
};

type RankedPlayer = {
  owner: {
    altIds: {
      opta: string;
    };
    birth: {
      country: {
        isoCode: string;
      };
    };
  };
};

type InFormPlayersProps = {
  players: Player[];
};

const InFormPlayers = ({ players }: InFormPlayersProps) => {
  const [rankedPlayers, setRankedPlayers] = useState<RankedPlayer[] | undefined>(undefined);
  const [flagMap, setFlagMap] = useState<Record<string, string>>({});
  const [isFlagMapReady, setIsFlagMapReady] = useState(false);

  // Fetch ranked player data
  useEffect(() => {
    const fetchRankedPlayers = async () => {
      try {
        const response = await fetch('/api/ranked-players'); // Updated URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRankedPlayers(data.stats.content); // Or data, depending on the structure
      } catch (error) {
        console.error('Error fetching ranked players:', error);
      }
    };

    fetchRankedPlayers();
  }, []);

  //Create flagMap
  useEffect(() => {
    if (rankedPlayers && rankedPlayers.length > 0) {
      const newFlagMap: Record<string, string> = {};
      rankedPlayers.forEach(rankedPlayer => {
        const optaCode = rankedPlayer.owner.altIds.opta;
        const isoCode = rankedPlayer.owner.birth.country.isoCode;
        newFlagMap[optaCode] = `https://resources.premierleague.com/premierleague/flags/${isoCode}.png`;
      });
      setFlagMap(newFlagMap);
      setIsFlagMapReady(true);
    }
  }, [rankedPlayers]);

  // Calculate a combined "form" score
  const calculateInFormScore = (player: Player): number => {
    const pointsPerGame = parseFloat(player.points_per_game);
    const form = player.form;
    const expectedGoals = player.expected_goals;
    const expectedAssists = player.expected_assists;
    const expectedGoalInvolvements = player.expected_goal_involvements;

    const starts = player.starts;

    // Define weights for each factor.  Adjust as needed.
    const formWeight = 0.2;
    const pointsPerGameWeight = 0.2;
    const startsWeight = 0.1;
    const expectedGoalsWeight = 0.15;
    const expectedAssistsWeight = 0.15;
    const expectedGoalInvolvementsWeight = 0.2;

    // Calculate the score
    const score =
      (form * formWeight) +
      (pointsPerGame * pointsPerGameWeight) +
      (starts > 10 ? (startsWeight * 100) : 0) +  // Check for minimum starts and apply weight or 0
      (expectedGoals * expectedGoalsWeight) +
      (expectedAssists * expectedAssistsWeight) +
      (expectedGoalInvolvements * expectedGoalInvolvementsWeight);

    return score;
  };

  const inFormPlayers = players
    .filter(
      (player) =>
        player.goals_scored > 5 &&
        player.form >= 4 &&
        parseFloat(player.points_per_game) >= 5 && // Updated points_per_game
        player.starts >= 5 && // Updated starts
        player.expected_goals >= 2 && // Updated expected_goals
        player.expected_assists >= 2 && // Updated expected_assists
        player.expected_goal_involvements >= 3 // Updated expected_goal_involvements
        
    )
    .sort((a, b) => calculateInFormScore(b) - calculateInFormScore(a))
    .slice(0, 10); // Get top 10

  return (
    <div className="bg-gradient-to-br from-purple-400 to-purple-600 shadow rounded-lg p-6 border-2 border-purple-700 text-white">
      <h2 className="text-xl font-semibold mb-2">Top 10 In-Form Players (Last 10 Match Weeks)</h2>
      {inFormPlayers.length > 0 && isFlagMapReady ? (
        <ol className="list-decimal pl-5">
          {inFormPlayers.map((player) => {
            const optaCode = player.code.toString();
            const flagUrl = flagMap['p'+optaCode];

            return (
              <li key={`${player.first_name}-${player.second_name}`} className="py-1 flex items-center">
                {flagUrl && (
                  <Image
                  src={flagUrl}
                  alt={`${player.first_name} ${player.second_name} Flag`}
                  className="w-6 h-4 mr-2"
                  width={100}
                  height={100}
                  onError={(e: unknown) => {
                    if (e && e instanceof Event && e.target instanceof HTMLImageElement) {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/fallback-flag.png"; // Use fallback here
                    }
                  }}
                />
                )}
                {player.first_name} {player.second_name} - Form Score: {calculateInFormScore(player).toFixed(2)}
              </li>
            );
          })}
        </ol>
      ) : (
        <p>No players meet the in-form criteria.</p>
      )}
    </div>
  );
};

export default InFormPlayers;