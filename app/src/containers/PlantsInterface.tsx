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
import { PublicKey } from "@solana/web3.js";

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

  const planter = useState();

  useEffect(() => {
    const fetch = async () => {
      if (!addresses?.plant) {
        return;
      }
      const planterData = await connection.getAccountInfo(addresses.planter);
      setPlanterData(planterData);
    };
    fetch();
  }, [addresses, program, connection]);

  useEffect(() => {
    const getData = async () => {
      if (addresses && program) {
        try {
          const parsed = await program.idlePlants.account.planter.fetchNullable(
            addresses.planter
          );
          if (parsed) {
            console.log("timesWatered", parsed.timesWatered);
          }
        } catch (error) {
          console.error("error", error);
        }
      }
    };

    getData();
  }, [planterData, program]);

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
    if (!program || !addresses || !playerWallet || !treasuryAddresses) {
      throw new Error("Not connected");
    }
    try {
      await program.idlePlants.rpc.waterPlanter({
        accounts: {
          planter: addresses.planter,
          plant: addresses.plant,
          owner: playerWallet.publicKey,
        },
      });
      notify("success", "Plant has been watered");
    } catch (e) {
      console.error(e);
      const errAsAny = e as any;
      if (errAsAny?.message) {
        notify("error", errAsAny.message);
      }
    }
  };

  const showBeginButton = planterData === null;
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
