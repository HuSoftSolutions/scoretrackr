import { useStore } from "./../../store";

export default function Leaderboard(props) {
  const { state, dispatch } = useStore();
  let sortedScorecard = [...state.activeScorecard];

  const NassauPlayBoard = () => {
    return <div className="leaderboard"></div>;
  };

  const MatchPlayBoard = () => {
    let scorecard = [];
    let x = state;
    for (let i = 1; i <= state.activeLayout; i++) {
      for (let j = 0; j < state.activeScorecard.length; j++) {
        for (let k = j + 1; k < state.activeScorecard.length; k++) {
          if (
            state.activeScorecard[j].holes[i] &&
            state.activeScorecard[k].holes[i]
          ) {
            let comparison =
              state.activeScorecard[j].holes[i] -
              state.activeScorecard[k].holes[i];
            let matchName =
              state.activeScorecard[j].name +
              " vs. " +
              state.activeScorecard[k].name;
            let existingEntryIndex = scorecard.findIndex(
              (sc) => sc.name === matchName
            );
            switch (true) {
              case comparison < 0:
                if (existingEntryIndex === -1) {
                  scorecard.push({ name: matchName, score: 1 });
                } else {
                  scorecard[existingEntryIndex].score += 1;
                }
                break;
              case comparison > 0:
                if (existingEntryIndex === -1) {
                  scorecard.push({ name: matchName, score: -1 });
                } else {
                  scorecard[existingEntryIndex].score -= 1;
                }
                break;
              default:
                if (existingEntryIndex === -1) {
                  scorecard.push({ name: matchName, score: 0 });
                }
                break;
            }
          }
        }
      }
    }
    return (
      <div className="leaderboard">
        {scorecard.map((matchup, index) => {
          let scoreColor =
            matchup.score > 0 ? "green" : matchup.score < 0 ? "red" : "";
          return (
            <div className="leaderboardDiv" key={index}>
              <span>{matchup.name}</span>
              <span
                className="leaderboardTotalSpan Bold"
                style={{ color: scoreColor }}
              >
                {matchup.score > 0
                  ? "+" + matchup.score
                  : matchup.score < 0
                  ? matchup.score
                  : "AS"}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const StrokePlayBoard = () => {
    if (sortedScorecard.length > 1) {
      sortedScorecard.sort((a, b) => a.total - b.total);
    }
    return (
      <div className="leaderboard stroke">
        {sortedScorecard.map((player, index) => {
          let totalColor =
            index == 0
              ? "Gold"
              : index == 1
              ? "Silver"
              : index == 2
              ? "bronze"
              : "red";
          return (
            <div
              className={`leaderboardDiv ${
                index === sortedScorecard.length - 1 ? "extraPadding" : ""
              }`}
              key={index}
            >
              <span>{player.name}</span>
              <span
                className="leaderboardTotalSpan Bold"
                style={{ color: totalColor }}
              >
                {player.total}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <StrokePlayBoard />
      {state.matchType === "Match" ? <MatchPlayBoard /> : null}
      {state.matchType === "Nassau" ? <NassauPlayBoard /> : null}
    </div>
  );
}
