import type { NextPage } from "next";
import { FaucetView } from "../views";

import { AppTitle } from "../components/AppTitle";
const Faucet: NextPage = (props) => {
  return (
    <div>
      <AppTitle />
      <FaucetView />
    </div>
  );
};

export default Faucet;
