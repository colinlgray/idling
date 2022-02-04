import { FC } from "react";
import { PointsDisplay } from "./PointsDisplay";
import Link from "next/link";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAutoConnect } from "../contexts/AutoConnectProvider";

export const AppBar: FC = (props) => {
  const { autoConnect, setAutoConnect } = useAutoConnect();

  return (
    <header className="header bg-gray-700 shadow py-4 px-4">
      <div className="header-content flex items-center flex-row">
        <div className="flex md:hidden"></div>
        <div className="flex justify-between w-full">
          <PointsDisplay />
          <WalletMultiButton className="btn btn-ghost mr-2" />
        </div>
      </div>
    </header>
  );
};
