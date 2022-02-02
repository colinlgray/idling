import { FC } from "react";
import Link from "next/link";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAutoConnect } from "../contexts/AutoConnectProvider";

export const AppBar: FC = (props) => {
  const { autoConnect, setAutoConnect } = useAutoConnect();

  return (
    <div className="flex justify-end p-2">
      <WalletMultiButton className="btn btn-ghost mr-2" />
    </div>
  );
};
