import type { NextPage } from "next";
import { GardenView } from "../views";

import { AppTitle } from "../components/AppTitle";
const Garden: NextPage = (props) => {
  return (
    <div>
      <AppTitle />
      <GardenView />
    </div>
  );
};

export default Garden;
