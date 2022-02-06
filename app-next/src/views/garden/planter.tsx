import { useAddresses, useProgram } from "../../hooks";
import { Addresses } from "../../hooks/useAddresses";
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
  label: string;
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

export const PlanterInterface: FC<Props> = (props) => {
  const addresses = useAddresses();
  const program = useProgram();
  const { connection } = useConnection();
  const playerWallet = useAnchorWallet();
  const [planterData, setPlanterData] = useState<Planter | null>(null);
  const [plantData, setPlantData] = useState<Plant | null>(null);

  const refreshPlanter = async (
    planter: AccountClient,
    plant: AccountClient,
    addresses: Addresses
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

  const handleError = (e: unknown) => {
    console.error(e);
    const errAsAny = e as any;
    if (errAsAny?.message) {
      //   notify("error", errAsAny.message);
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
      if (!program || !addresses || !playerWallet) {
        throw new Error("Not connected");
      }
      let tx = await program.idlePlants.rpc.beginGrowing({
        accounts: {
          planter: addresses.planter,
          owner: playerWallet.publicKey,
          plant: addresses.plant,
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
        addresses
      );
      console.log("done!", tx);
      //   notify("success", "SUCCESS!");
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
      //   notify("success", "Plant has been watered");
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
      //   notify("success", "Plant has been harvested");
    } catch (e) {
      handleError(e);
    }
  };

  const showBeginButton = planterData === null;
  const showWaterButton = !showBeginButton && planterData?.timesWatered !== 1;
  const showNext =
    planterData && planterData?.timesWatered === plantData?.requiredWaterings;

  const buttonClassName =
    "bg-green-600 hover:bg-green-700 font-bold py-1 px-2 rounded";

  return (
    <div>
      <div className="flex justify-center text-6xl border-2 border-gray-300 rounded-xl p-6 cursor-pointer">
        {props.label}
      </div>
      <div className="flex justify-center py-2">
        {showBeginButton && (
          <button
            className={buttonClassName}
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
            className={buttonClassName}
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
            className={buttonClassName}
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
