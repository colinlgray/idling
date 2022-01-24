import { usePlantAddresses, useProgram } from "../hooks";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, FC } from "react";

interface Props {}

export const PlantsInterface: FC<Props> = (props) => {
  const addresses = usePlantAddresses();
  const program = useProgram();
  const { connection } = useConnection();
  if (addresses !== null) {
    console.log("addresses", addresses);
  }
  useEffect(() => {
    const fetch = async () => {
      if (!addresses?.plant) {
        return;
      }
      const data = await connection.getAccountInfo(addresses.plant);
      const planterData = await connection.getAccountInfo(addresses.planter);
      const destData = await connection.getAccountInfo(
        addresses.playerPlantRewardDest
      );

      console.log("data", data);
      console.log("planterData", planterData);
      console.log("destData", destData);
    };
    fetch();
  }, [addresses, program, connection]);

  return <div className="flex justify-start">Plants</div>;
};
