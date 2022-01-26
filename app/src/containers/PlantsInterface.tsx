import { usePlantAddresses, useProgram } from "../hooks";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, FC } from "react";

interface Props {
  onClick?: () => void;
}

export const PlantsInterface: FC<Props> = (props) => {
  const addresses = usePlantAddresses();
  const program = useProgram();
  const { connection } = useConnection();
  (window as any).asd = program;
  (window as any).asdf = addresses;
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
      try {
        console.log("planter address:", addresses.planter.toBase58());
        let planter = await program?.idlePlants.account.planter.fetch(
          addresses.planter
        );
        console.log("planter", planter);
      } catch (e) {
        console.error(e);
      }

      console.log("data", data);
      console.log("planterData", planterData);
      console.log("destData", destData);
    };
    fetch();
  }, [addresses, program, connection]);

  const handleBeginGrowing = async () => {
    console.log("click begin");
    // let tx = await idlePlants.rpc.beginGrowing({
    //   accounts: {
    //     planter: playerTestPlantPlanter,
    //     owner: playerWallet.publicKey,
    //     plant: testPlant,
    //     treasury,
    //     treasuryMint: treasuryMint.publicKey,
    //     treasuryTokens: playerRewardDest,
    //     tokenProgram,
    //     systemProgram,
    //     rent,
    //   },
    //   signers: [playerWallet],
    // });
  };

  const handleWatering = async () => {
    console.log("click water");
    // let tx = await idlePlants.rpc.waterPlanter({
    //   accounts: {
    //     planter: playerTestPlantPlanter,
    //     plant: testPlant,
    //     owner: playerWallet.publicKey,
    //   },
    //   signers: [playerWallet],
    // });
  };

  const showBeginButton = true;
  const showWaterButton = !showBeginButton;

  return (
    <div className="flex justify-center">
      {showBeginButton && (
        <button
          className="bg-blue-500 hover:bg-blue-700 font-bold py-1 px-2 rounded"
          onClick={async () => {
            await handleBeginGrowing();
            if (props.onClick) {
              props.onClick();
            }
          }}
        >
          Begin
        </button>
      )}
      {showWaterButton && (
        <button
          className="bg-blue-500 hover:bg-blue-700 font-bold py-1 px-2 rounded"
          onClick={async () => {
            await handleWatering();
            if (props.onClick) {
              props.onClick();
            }
          }}
        >
          Water Plant
        </button>
      )}
    </div>
  );
};
