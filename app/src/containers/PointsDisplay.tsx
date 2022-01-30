import { useAddresses } from "../hooks";
import { useConnection } from "@solana/wallet-adapter-react";
import { deserializeAccount } from "../common/util";
import { useEffect, useState, FC } from "react";

interface Props {
  count: number;
}

export const PointsDisplay: FC<Props> = (props) => {
  const { connection } = useConnection();
  const addresses = useAddresses();
  const [currentTokens, setCurrentTokens] = useState<null | number>(null);

  useEffect(() => {
    const requestPoints = async () => {
      if (!addresses?.playerRewardDest) {
        return null;
      }
      const playerDestData = await connection.getAccountInfo(
        addresses.playerRewardDest
      );
      if (playerDestData?.data) {
        const destData = deserializeAccount(playerDestData.data);
        setCurrentTokens(destData.amount.toNumber());
      } else {
        setCurrentTokens(-1);
      }
    };

    requestPoints();
  }, [connection, props.count, addresses]);

  return <div className="flex justify-end">Tokens: {currentTokens}</div>;
};
