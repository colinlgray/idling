// Next, React
import { FC } from "react";
// import Link from "next/link";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  return (
    <div className="hero mx-auto p-4 min-h-16 py-4">
      <div className="hero-content flex flex-col max-w-lg">
        <h1 className="text-5xl pb-2 font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Idling
        </h1>
      </div>
    </div>
  );
};
