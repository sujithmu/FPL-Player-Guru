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
};

type TopGoalKeeperProps = {
  goalkeeper: Player;
};

const TopGoalKeeper = ({ goalkeeper }: TopGoalKeeperProps) => {
  return (
    <div className="bg-gradient-to-br from-green-400 to-green-600 shadow rounded-lg p-6 border-2 border-green-700 text-white">
      <h2 className="text-xl font-semibold mb-2">Top Goalkeeper</h2>
      <div>
      <Image
          src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${goalkeeper.code}.png`}
          alt={`${goalkeeper.first_name} ${goalkeeper.second_name}`}
          width={100}
            height={100}
          className="w-24 h-24 rounded-full object-cover mb-2" // Styling for the image
          // onError={(e: any) => {
          //   e.target.onerror = null; // prevent infinite loop
          //   e.target.src = "/fallback-goalkeeper.png"; // Provide a fallback image - Replace with correct path!
          // }}
          onError={(e: unknown) => {
            if (e && e instanceof Event) {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/fallback-goalkeeper.png"; // Use fallback here
            }
          }}
        />
        <p className="text-lg">
          {goalkeeper.first_name} {goalkeeper.second_name}
        </p>
        <p>Saves: {goalkeeper.saves}</p>
        <p>Clean Sheets: {goalkeeper.clean_sheets}</p>
      </div>
    </div>
  );
};

export default TopGoalKeeper;