'use client';

import { useState, useEffect } from 'react';
import GoalKing from './GoalKing';
import HighScoringPlayers from './HighScoringPlayers';
import TopGoalKeeper from './TopGoalKeeper';
import InFormPlayers from './InFormPlayers';
import Loading from './Loading';
import Error from './Error';
import footballImg from '../../public/assets/football_field.jpeg';
import Image from 'next/image';

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
  form: number;
  points_per_game: string;
  starts: number;
  expected_goals: number;
  expected_assists: number;
  expected_goal_involvements: number;
  minutes: number; //Ensure to include it here
};

type Team = {
  id: number;
  name: string;
};

type AnalysisResults = {
  teamWithMostGoals: Team | undefined;
  highScoringPlayers: Player[];
  topGoalKeeper: Player;
  allPlayers: Player[];
};

const Dashboard = () => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          // throw new Error(`Failed to fetch data: ${response.status}`);
          
        }
        const data: AnalysisResults = await response.json();
        setAnalysisResults(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError((err as Error).message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-700 text-white py-12 relative">
      {/* Image Component for Background */}
      <Image
        src={footballImg}
        alt="Football Field"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0" // Position behind other content
      />
      <div className="absolute inset-0 bg-black opacity-20 z-1"></div> {/*Optional overlay*/}
      <div className="container mx-auto p-4 relative z-10"> {/* Relative Z-index to be on top of background*/}
        <h1 className="text-4xl font-bold mb-6 text-shadow">EPL Fantasy Dashboard</h1>
        {analysisResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-cols-fr"> {/*Responsive Grid*/}
            <GoalKing team={analysisResults.teamWithMostGoals} />
            <HighScoringPlayers players={analysisResults.highScoringPlayers} />
            <TopGoalKeeper goalkeeper={analysisResults.topGoalKeeper} />
            <InFormPlayers players={analysisResults.allPlayers} />
          </div>)
        }
      </div>
    </div>
  );
};

export default Dashboard;