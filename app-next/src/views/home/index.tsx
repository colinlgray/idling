import { FC } from "react";
import { TokenFaucet } from "../../components/TokenFaucet";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

export const HomeView: FC = ({}) => {
  return (
    <div className="hero mx-auto p-4 min-h-16 py-4">
      <div className="hero-content flex flex-col max-w-lg">
        <TokenFaucet />
      </div>
    </div>
  );
};
