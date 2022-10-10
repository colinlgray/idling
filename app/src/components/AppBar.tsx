import { FC } from "react";
import { PointsDisplay } from "./PointsDisplay";
import Link from "next/link";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAutoConnect } from "../contexts/AutoConnectProvider";

export const AppBar: FC = (props) => {
  const { autoConnect, setAutoConnect } = useAutoConnect();

  return (
    <header className="header bg-gray-700 shadow py-2 px-2">
      <div className="header-content flex items-center flex-row">
        <div className="flex md:hidden"></div>
        <div className="flex justify-between w-full">
          <PointsDisplay />
          <div className="flex">
            <div className="text-yellow-500 rounded flex items-center px-4">
              Devnet ⚠️
            </div>
            <WalletMultiButton className="btn btn-ghost mr-2" />
          </div>
        </div>
      </div>
    </header>
  );
};
