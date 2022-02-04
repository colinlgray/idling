import { useAddresses } from "../hooks/useAddresses";
import { useConnection } from "@solana/wallet-adapter-react";
import { deserializeAccount } from "../utils/deserialize";
import { useEffect, useState, FC } from "react";

interface Props {}

export const PointsDisplay: FC<Props> = (props) => {
  const { connection } = useConnection();
  const addresses = useAddresses();
  const [currentTokens, setCurrentTokens] = useState<null | number>(null);
  const [currentRewardTokens, setCurrentRewardTokens] = useState<null | number>(
    null
  );

  useEffect(() => {
    const requestPoints = async () => {
      if (!addresses?.playerRewardDest || !addresses) {
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

      const playerRewardDestData = await connection.getAccountInfo(
        addresses.playerPlantRewardDest
      );
      if (playerRewardDestData?.data) {
        setCurrentRewardTokens(
          deserializeAccount(playerRewardDestData.data).amount.toNumber()
        );
      } else {
        setCurrentTokens(-1);
      }
    };

    requestPoints();
  }, [connection, addresses]);

  return (
    <div>
      <div className="">Tokens: {currentTokens}</div>
      <div className="">Reward Tokens: {currentRewardTokens}</div>
    </div>
  );
};
