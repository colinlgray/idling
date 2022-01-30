import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useProgram } from ".";
import { PublicKey } from "@solana/web3.js";
import { web3 } from "@project-serum/anchor";
import * as splToken from "@solana/spl-token";
import { useEffect, useState } from "react";

const plantMintPubKey = new web3.PublicKey(
  "5g9NUc3A8qmez2QS7CNUSbPw7dcKM3zzj1Ld8cX2K1NQ"
);

export interface PlantAddresses {
  plantMint: PublicKey;
  plant: PublicKey;
  planter: PublicKey;
  playerPlantRewardDest: PublicKey;
  plantBump: number;
}

export function usePlantAddresses() {
  const wallet = useAnchorWallet();
  const program = useProgram();
  const [addresses, setAddresses] = useState<PlantAddresses | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!wallet || !program?.idlePlants) return;

      const [plant, plantBump] = await web3.PublicKey.findProgramAddress(
        [Buffer.from("plant"), plantMintPubKey.toBuffer()],
        program.idlePlants.programId
      );

      const [playerPlantPlanter] = await web3.PublicKey.findProgramAddress(
        [Buffer.from("planter"), plant.toBuffer(), wallet.publicKey.toBuffer()],
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
    };

    fetchAddresses();
  }, [wallet, program]);

  return addresses;
}
