import Image from 'next/image'

type Team = {
  id: number;
  name: string;
  logo?: string; // URL to team's logo
};

type GoalKingProps = {
  team: Team | undefined;
};

const GoalKing = ({ team }: GoalKingProps) => {
  const getLogoUrl = (teamName: string): string => {
    const encodedTeamName = encodeURIComponent(teamName.replace(/\s+/g, '%20').toLocaleLowerCase()); //replace spaces with "%20"
    return `https://raw.githubusercontent.com/sportlogos/football.db.logos/refs/heads/master/europe/en-england/${encodedTeamName}.png`;
  };
  return (
    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 shadow rounded-lg p-6 border-2 border-yellow-700 text-white">
      <h2 className="text-xl font-semibold mb-2">Team With Most Goals</h2>
      {team ? (
        <div className="flex items-center">

          <p className="text-lg mr-2">{team.name}</p> {/* Positioned before the logo */}
          <Image
            src={getLogoUrl(team.name.toLocaleLowerCase())}
            alt={`${team.name} Logo`}
            className="w-8 h-8"
            width={100}
            height={100}
            // onError={(e: any) => {
            //   e.target.onerror = null; // Prevent infinite loop
            //   e.target.src = "/fallback-logo.png"; // Replace with your fallback logo URL.  Create a public folder and place fallback logo there to avoid any errors
            // }}
          />

        </div>
      ) : (
        <p>No team found.</p>
      )}
    </div>
  );
};

export default GoalKing;