import type { NextPage } from "next";
import Head from "next/head";
import { ShopView } from "../views";

const Shop: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Idling</title>
        <meta name="description" content="Idling shop" />
      </Head>
      <ShopView />
    </div>
  );
};

export default Shop;
