// Next, React
import { FC } from "react";
// import Link from "next/link";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

export const ProfileView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  return (
    <div className="hero mx-auto p-4 min-h-16 py-4">
      <div className="hero-content flex flex-col max-w-lg">
        Content about your farmer goes here
      </div>
    </div>
  );
};
