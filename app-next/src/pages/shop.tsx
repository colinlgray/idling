import type { NextPage } from "next";
import Head from "next/head";
import { ShopView } from "../views";

const Shop: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta name="description" content="Solana Scaffold" />
      </Head>
      <ShopView />
    </div>
  );
};

export default Shop;
