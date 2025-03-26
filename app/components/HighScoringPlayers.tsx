import React from 'react';

type Player = {
  element_type: number;
  first_name: string;
  second_name: string;
  total_points: number;
  team: number;
  goals_scored: number;
  saves?: number;
  clean_sheets?: number;
  code: number; // changed to code from element_code
  element: number;
};

type HighScoringPlayersProps = {
  players: Player[];
};

const HighScoringPlayers = ({ players }: HighScoringPlayersProps) => {
  const sortedPlayers = [...players].sort((a, b) => b.total_points - a.total_points);
  const top10Players = sortedPlayers.slice(0, 10);
  const firstPlayer = top10Players.length > 0 ? top10Players[0] : null;

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 shadow rounded-lg p-6 border-2 border-blue-700 text-white">
      <h2 className="text-xl font-semibold mb-2">Top 10 Scoring Players</h2>
      {firstPlayer && (
        <div className="mb-4">
          <h3 className="font-semibold">#1 Player:</h3>
          <img
            src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${firstPlayer.code}.png`}
            alt={`${firstPlayer.first_name} ${firstPlayer.second_name}`}
            className="w-24 h-24 rounded-full object-cover mb-2"
            onError={(e: any) => {
              e.target.onerror = null; // prevent infinite loop
              e.target.src = "/path/to/default/image.png" // Provide a fallback image
            }}
          />
          <p>
            {firstPlayer.first_name} {firstPlayer.second_name} - Points: {firstPlayer.total_points}
          </p>
        </div>
      )}
      <ul>
        {top10Players.slice(1).map((player) => (
          <li key={`${player.first_name}-${player.second_name}`} className="py-1">
            {player.first_name} {player.second_name} - Points: {player.total_points}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighScoringPlayers;