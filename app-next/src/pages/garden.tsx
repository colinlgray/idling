import type { NextPage } from "next";
import Head from "next/head";
import { GardenView } from "../views";

const Garden: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta name="description" content="Solana Scaffold" />
      </Head>
      <GardenView />
    </div>
  );
};

export default Garden;
