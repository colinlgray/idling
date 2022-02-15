import { FC } from "react";
import Head from "next/head";

export const AppTitle: FC = () => {
  return (
    <Head>
      <title>Idling</title>
      <meta name="description" content="Idling shop" />
    </Head>
  );
};
