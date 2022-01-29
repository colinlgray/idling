import {
  useAddresses,
  usePlantAddresses,
  useProgram,
  useNotify,
} from "../hooks";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState, FC } from "react";
import * as splToken from "@solana/spl-token";
import { web3 } from "@project-serum/anchor";

const systemProgram = web3.SystemProgram.programId;
const tokenProgram = splToken.TOKEN_PROGRAM_ID;
const rent = web3.SYSVAR_RENT_PUBKEY;

interface Props {
  onClick?: () => void;
}

export const PlantsInterface: FC<Props> = (props) => {
  const addresses = usePlantAddresses();
  const treasuryAddresses = useAddresses();
  const program = useProgram();
  const { connection } = useConnection();
  const notify = useNotify();
  const playerWallet = useAnchorWallet();
  const [planterData, setPlanterData] =
    useState<web3.AccountInfo<Buffer> | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (!addresses?.plant) {
        return;
      }
      const planterData = await connection.getAccountInfo(addresses.planter);
      setPlanterData(planterData);
      console.log("planterData", planterData);
    };
    fetch();
  }, [addresses, program, connection]);

  const handleBeginGrowing = async () => {
    if (!program || !addresses || !playerWallet || !treasuryAddresses) {
      throw new Error("Not connected");
    }
    try {
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
      console.log("done!", tx);
      const planterData = await connection.getAccountInfo(addresses.planter);
      setPlanterData(planterData);
      notify("success", "SUCCESS!");
    } catch (e) {
      console.error(e);
      const errAsAny = e as any;
      if (errAsAny?.message) {
        notify("error", errAsAny.message);
      }
    }
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

  const showBeginButton = planterData === null;
  const showWaterButton = !showBeginButton;

  // if (planterData === null) {
  //   return <div className="flex justify-center">loading</div>;
  // }

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
