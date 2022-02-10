import type { NextPage } from "next";
import { FurnaceView } from "../views";
import { AppTitle } from "../components/AppTitle";

const Furnace: NextPage = (props) => {
  return (
    <div>
      <AppTitle />
      <FurnaceView />
    </div>
  );
};

export default Furnace;
