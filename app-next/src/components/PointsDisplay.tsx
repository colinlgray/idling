import { useAddresses } from "../hooks/useAddresses";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, FC } from "react";
import useUserTokenBalanceStore from "../stores/useUserTokenBalanceStore";

interface Props {}

export const PointsDisplay: FC<Props> = (props) => {
  const { connection } = useConnection();
  const addresses = useAddresses();
  const { publicKey } = useWallet();

  const balance = useUserTokenBalanceStore((s) => s.balance);
  const { getUserTokenBalance } = useUserTokenBalanceStore();

  useEffect(() => {
    if (publicKey) {
      getUserTokenBalance(connection, addresses);
    }
  }, [publicKey, connection, getUserTokenBalance, addresses]);

  if (!publicKey || balance === -1) {
    return <div />;
  }

  return (
    <div>
      <div className="">Tokens: {balance}</div>
      <div className="">Your rank: 133545</div>
    </div>
  );
};
