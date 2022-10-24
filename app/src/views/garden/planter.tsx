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
  const [loading, setLoading] = useState<boolean>(false);

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

      setLoading(true);
      await refreshPlanter(
        program.idlePlants.account.planter,
        program.idlePlants.account.plant,
        planterAddresses
      );

      setLoading(false);
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
  if (loading) {
    return (
      <div>
        <div className="flex justify-center border-2 border-gray-300 rounded-xl p-6 relative loading">
          <div role="status">
            <svg
              aria-hidden="true"
              className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
                data-darkreader-inline-fill=""
              ></path>
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              ></path>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
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
