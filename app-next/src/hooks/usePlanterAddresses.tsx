import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "./useProgram";
import { PublicKey } from "@solana/web3.js";
import { web3 } from "@project-serum/anchor";
import * as splToken from "@solana/spl-token";
import { useEffect, useState } from "react";

export interface PlanterAddresses {
  plantMint: PublicKey;
  plant: PublicKey;
  planter: PublicKey;
  playerPlantRewardDest: PublicKey;
  plantBump: number;
}

export function usePlanterAddresses(
  plantMintPubKey: PublicKey
): PlanterAddresses | null {
  const wallet = useAnchorWallet();
  const program = useProgram();
  const [addresses, setAddresses] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!wallet || !program) return;
      try {
        const [playerClicker] = await web3.PublicKey.findProgramAddress(
          [Buffer.from("clicker"), wallet.publicKey.toBuffer()],
          program.idling.programId
        );

        const [plant, plantBump] = await web3.PublicKey.findProgramAddress(
          [Buffer.from("plant"), plantMintPubKey.toBuffer()],
          program.idlePlants.programId
        );

        const [playerPlantPlanter] = await web3.PublicKey.findProgramAddress(
          [
            Buffer.from("planter"),
            plant.toBuffer(),
            wallet.publicKey.toBuffer(),
          ],
          program.idlePlants.programId
        );

        const playerPlantRewardDest =
          await splToken.Token.getAssociatedTokenAddress(
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
            splToken.TOKEN_PROGRAM_ID,
            plantMintPubKey,
            wallet.publicKey
          );

        setAddresses({
          plantMint: plantMintPubKey,
          plant,
          plantBump,
          planter: playerPlantPlanter,
          playerPlantRewardDest,
        });
      } catch (e) {
        console.error(e);
      }
    };

    fetchAddresses();
  }, [wallet, program]);

  return addresses;
}
