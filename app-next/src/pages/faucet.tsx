import type { NextPage } from "next";
import Head from "next/head";
import { FaucetView } from "../views";

const Faucet: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Idling</title>
        <meta name="description" content="Idling faucet" />
      </Head>
      <FaucetView />
    </div>
  );
};

export default Faucet;
