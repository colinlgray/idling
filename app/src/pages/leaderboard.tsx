import type { NextPage } from "next";
import { LeaderboardView } from "../views";
import { AppTitle } from "../components/AppTitle";

const Leaderboard: NextPage = (props) => {
  return (
    <div>
      <AppTitle />
      <LeaderboardView />
    </div>
  );
};

export default Leaderboard;
