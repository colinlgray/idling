import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletNfts, useNotify } from "../hooks";
import { ClickerInterface } from "../containers";
import { Spinner } from "../components";
import { programs } from "@metaplex/js";
import {
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export interface UpdateFuncProps {
  previousLocation: "wallet" | "staked";
  nftMoved: programs.metadata.Metadata;
}

export function Router() {
  const [walletNfts] = useWalletNfts();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const notify = useNotify();

  const walletNotConnected = !publicKey;
  // console.log("stake account", stakeAccount?.data?.lastClaimed?.toPrecision());

  return (
    <div className="max-w-4xl m-auto">
      {walletNotConnected && (
        <div className="border-2 rounded p-12 mx-24 my-6">
          Please connect your wallet
        </div>
      )}
      {publicKey && (
        <div className="border-2 rounded p-12 mx-24 my-6">
          <ClickerInterface />
        </div>
      )}
    </div>
  );
}
