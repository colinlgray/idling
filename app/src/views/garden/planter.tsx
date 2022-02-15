import { useAddresses, useProgram, usePlanterAddresses } from "../../hooks";
import { PlanterAddresses } from "../../hooks/usePlanterAddresses";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState, FC } from "react";
import * as splToken from "@solana/spl-token";
import { web3, BN, AccountClient } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { Plant, Planter } from "../../models/types";

import { notify } from "../../utils/notifications";

const associatedTokenProgram = splToken.ASSOCIATED_TOKEN_PROGRAM_ID;
const systemProgram = web3.SystemProgram.programId;
const tokenProgram = splToken.TOKEN_PROGRAM_ID;
const rent = web3.SYSVAR_RENT_PUBKEY;

interface Props {
  onClick?: () => void;
  label: string;
  plantMint: PublicKey;
}

export const PlanterInterface: FC<Props> = (props) => {
  const addresses = useAddresses();
  const planterAddresses = usePlanterAddresses(props.plantMint);
  const program = useProgram();
  const { connection } = useConnection();
  const playerWallet = useAnchorWallet();
  const [planterData, setPlanterData] = useState<Planter | null>(null);
  const [plantData, setPlantData] = useState<Plant | null>(null);

  const refreshPlanter = async (
    planter: AccountClient,
    plant: AccountClient,
    addresses: PlanterAddresses
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
        setPlantData(parsedPlant.data as Plant);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleError = (e: any) => {
    notify({
      type: "error",
      message: `Transaction failed!`,
      description: e?.message,
    });
  };

  useEffect(() => {
    const fetch = async () => {
      if (
        !planterAddresses?.plant ||
        !program ||
        !program.idlePlants.account.planter
      ) {
        return;
      }
      refreshPlanter(
        program.idlePlants.account.planter,
        program.idlePlants.account.plant,
        planterAddresses
      );
    };
    fetch();
  }, [planterAddresses, program, connection]);

  const handleBeginGrowing = async () => {
    try {
      if (!program || !addresses || !playerWallet) {
        throw new Error("Not connected");
      }
      let tx = await program.idlePlants.rpc.beginGrowing({
        accounts: {
          planter: planterAddresses.planter,
          owner: playerWallet.publicKey,
          plant: planterAddresses.plant,
          treasury: addresses.treasury,
          treasuryMint: addresses.treasuryMint,
          treasuryTokens: addresses.playerRewardDest,
          tokenProgram,
          systemProgram,
          rent,
        },
      });
      refreshPlanter(
        program.idlePlants.account.planter,
        program.idlePlants.account.plant,
        planterAddresses
      );
      // TODO: subtract cost from current funds
      notify({
        type: "success",
        message: "You have a new plant!",
      });
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
          planter: planterAddresses.planter,
          plant: planterAddresses.plant,
          owner: playerWallet.publicKey,
        },
      });
      refreshPlanter(
        program.idlePlants.account.planter,
        program.idlePlants.account.plant,
        planterAddresses
      );
      notify({
        type: "success",
        message: "Plant has been watered!",
      });
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
          planter: planterAddresses.planter,
          owner: playerWallet.publicKey,
          plant: planterAddresses.plant,
          plantMint: planterAddresses.plantMint,
          harvestDest: planterAddresses.playerPlantRewardDest,
          tokenProgram,
          associatedTokenProgram,
          systemProgram,
          rent,
        },
      });

      refreshPlanter(
        program.idlePlants.account.planter,
        program.idlePlants.account.plant,
        planterAddresses
      );
      notify({
        type: "success",
        message: "Plant has been harvested!",
      });
    } catch (e) {
      handleError(e);
    }
  };

  let label: string;
  let clickHandler: () => Promise<void>;
  if (planterData === null) {
    label = "Begin";
    clickHandler = handleBeginGrowing;
  } else if (
    planterData !== null &&
    planterData?.timesWatered !== plantData?.requiredWaterings
  ) {
    label = "Water Plant";
    clickHandler = handleWatering;
  } else if (
    planterData &&
    planterData?.timesWatered === plantData?.requiredWaterings
  ) {
    label = "Harvest Plant";
    clickHandler = handleHarvesting;
  }

  const buttonClassName =
    "bg-green-600 hover:bg-green-700 font-bold py-1 px-2 rounded";

  let timesWateredLabel = "";
  if (planterData && plantData) {
    timesWateredLabel = `${planterData.timesWatered}/${plantData.requiredWaterings}`;
  }

  let costLabel = "";
  if (plantData) {
    costLabel = `\$${plantData.cost}`;
  }

  return (
    <div>
      <div className="flex justify-center text-6xl border-2 border-gray-300 rounded-xl p-6 cursor-pointer relative">
        <span className="absolute left-1 text-xs top-1">
          {timesWateredLabel}
        </span>
        <span className="absolute text-xs top-1 right-1">{costLabel}</span>
        {props.label}
      </div>
      <div className="flex justify-center py-2">
        {label && (
          <button
            className={buttonClassName}
            onClick={async () => {
              await clickHandler();
              if (props.onClick) {
                props.onClick();
              }
            }}
          >
            {label}
          </button>
        )}
      </div>
    </div>
  );
};
