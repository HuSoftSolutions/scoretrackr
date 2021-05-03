import { useStore } from "./../../store";

export default function Leaderboard(props) {
  const { state, dispatch } = useStore();
  let sortedScorecard = [...state.activeScorecard];
  if (sortedScorecard.length > 1) {
    sortedScorecard.sort((a, b) => a.total - b.total);
  }
  return (
    <div className="leaderboard">
        {sortedScorecard.map((player, index) => {
          let totalColor = index == 0 ? "Gold" : index == 1 ? "Silver" : index == 2 ? "bronze" : "red";
          return (
            <div className="leaderboardDiv" key={index}>
              <span>{player.name}</span>
              <span className="leaderboardTotalSpan Bold" style={{color: totalColor}}>{player.total}</span>
            </div>
          );
        })}
    </div>
  );
}
