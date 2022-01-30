import {
  useAddresses,
  usePlantAddresses,
  useProgram,
  useNotify,
} from "../hooks";
import { PlantAddresses } from "../hooks/usePlantAddresses";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState, FC } from "react";
import * as splToken from "@solana/spl-token";
import { web3, BN, AccountClient } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

const associatedTokenProgram = splToken.ASSOCIATED_TOKEN_PROGRAM_ID;
const systemProgram = web3.SystemProgram.programId;
const tokenProgram = splToken.TOKEN_PROGRAM_ID;
const rent = web3.SYSVAR_RENT_PUBKEY;

interface Props {
  onClick?: () => void;
}

export interface Planter {
  timesWatered: number;
  lastWatered: BN;
  owner: PublicKey;
  plant: PublicKey;
  createdAt: BN;
}

export interface Plant {
  cost: BN;
  maxGrowth: BN;
  requiredWaterings: number;
  timeTillThirsty: BN;
}

export const PlantsInterface: FC<Props> = (props) => {
  const addresses = usePlantAddresses();
  const treasuryAddresses = useAddresses();
  const program = useProgram();
  const { connection } = useConnection();
  const notify = useNotify();
  const playerWallet = useAnchorWallet();
  const [planterData, setPlanterData] = useState<Planter | null>(null);
  const [plantData, setPlantData] = useState<Plant | null>(null);

  const refreshPlanter = async (
    planter: AccountClient,
    plant: AccountClient,
    addresses: PlantAddresses
  ) => {
    try {
      const parsed = await planter.fetchNullable(addresses.planter);
      const parsedPlant = await plant.fetchNullable(addresses.plant);

      if (parsed) {
        setPlanterData(parsed as Planter);
      } else if (parsed === null) {
        setPlanterData(null);
      }
      if (parsedPlant?.data) {
        console.log("plant", parsedPlant);
        setPlantData(parsedPlant.data as Plant);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleError = (e: unknown) => {
    console.error(e);
    const errAsAny = e as any;
    if (errAsAny?.message) {
      notify("error", errAsAny.message);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      if (
        !addresses?.plant ||
        !program ||
        !program.idlePlants.account.planter
      ) {
        return;
      }
      refreshPlanter(
        program.idlePlants.account.planter,
        program.idlePlants.account.plant,
        addresses
      );
    };
    fetch();
  }, [addresses, program, connection]);

  const handleBeginGrowing = async () => {
    try {
      if (!program || !addresses || !playerWallet || !treasuryAddresses) {
        throw new Error("Not connected");
      }
      let tx = await program.idlePlants.rpc.beginGrowing({
        accounts: {
          planter: addresses.planter,
          owner: playerWallet.publicKey,
          plant: addresses.plant,
          treasury: treasuryAddresses.treasury,
          treasuryMint: treasuryAddresses.treasuryMint,
          treasuryTokens: treasuryAddresses.playerRewardDest,
          tokenProgram,
          systemProgram,
          rent,
        },
      });
      refreshPlanter(
        program.idlePlants.account.planter,
        program.idlePlants.account.plant,
        addresses
      );
      console.log("done!", tx);
      notify("success", "SUCCESS!");
    } catch (e) {
      handleError(e);
    }
  };

  const handleWatering = async () => {
    try {
      if (!program || !addresses || !playerWallet) {
        throw new Error("Not connected");
      }
      await program.idlePlants.rpc.waterPlanter({
        accounts: {
          planter: addresses.planter,
          plant: addresses.plant,
          owner: playerWallet.publicKey,
        },
      });
      refreshPlanter(
        program.idlePlants.account.planter,
        program.idlePlants.account.plant,
        addresses
      );
      notify("success", "Plant has been watered");
    } catch (e) {
      handleError(e);
    }
  };

  const handleHarvesting = async () => {
    try {
      if (!program || !addresses || !playerWallet) {
        throw new Error("Not connected");
      }
      await program.idlePlants.rpc.harvestPlanter({
        accounts: {
          planter: addresses.planter,
          owner: playerWallet.publicKey,
          plant: addresses.plant,
          plantMint: addresses.plantMint,
          harvestDest: addresses.playerPlantRewardDest,
          tokenProgram,
          associatedTokenProgram,
          systemProgram,
          rent,
        },
      });
      console.log("after harvest");
      refreshPlanter(
        program.idlePlants.account.planter,
        program.idlePlants.account.plant,
        addresses
      );
      notify("success", "Plant has been harvested");
    } catch (e) {
      handleError(e);
    }
  };

  const showBeginButton = planterData === null;
  const showWaterButton = !showBeginButton && planterData?.timesWatered !== 1;
  const showNext =
    planterData && planterData?.timesWatered === plantData?.requiredWaterings;

  return (
    <div>
      <div className="flex justify-center">
        Times Watered: {planterData?.timesWatered}
      </div>
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
        {showNext && (
          <button
            className="bg-blue-500 hover:bg-blue-700 font-bold py-1 px-2 rounded"
            onClick={async () => {
              await handleHarvesting();
              if (props.onClick) {
                props.onClick();
              }
            }}
          >
            Harvest
          </button>
        )}
      </div>
    </div>
  );
};
