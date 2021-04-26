import { useStore } from "./../../store";

export default function Leaderboard(props) {
  const { state, dispatch } = useStore();
  let sortedScorecard = state.activeScorecard;
  if (sortedScorecard.length > 1) {
    sortedScorecard.sort((a, b) => a.total - b.total);
  }
  return (
    <ol>
      {sortedScorecard.map((player, index) => {
        return <li key={index}>{player.name}</li>;
      })}
    </ol>
  );
}
