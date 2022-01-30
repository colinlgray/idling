import { useAddresses, usePlantAddresses } from "../hooks";
import { useConnection } from "@solana/wallet-adapter-react";
import { deserializeAccount } from "../common/util";
import { useEffect, useState, FC } from "react";

interface Props {
  count: number;
}

export const PointsDisplay: FC<Props> = (props) => {
  const { connection } = useConnection();
  const addresses = useAddresses();
  const plantAddresses = usePlantAddresses();
  const [currentTokens, setCurrentTokens] = useState<null | number>(null);
  const [currentRewardTokens, setCurrentRewardTokens] = useState<null | number>(
    null
  );

  useEffect(() => {
    const requestPoints = async () => {
      if (!addresses?.playerRewardDest || !plantAddresses) {
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
        plantAddresses.playerPlantRewardDest
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
  }, [connection, props.count, addresses, plantAddresses]);

  return (
    <div>
      <div className="flex justify-end">Tokens: {currentTokens}</div>
      <div className="flex justify-end">
        Reward Tokens: {currentRewardTokens}
      </div>
    </div>
  );
};
