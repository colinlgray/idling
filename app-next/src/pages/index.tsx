import type { NextPage } from "next";
import { HomeView } from "../views";

import { AppTitle } from "../components/AppTitle";
const Home: NextPage = (props) => {
  return (
    <div>
      <AppTitle />
      <HomeView />
    </div>
  );
};

export default Home;
