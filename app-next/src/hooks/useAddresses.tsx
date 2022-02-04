import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "./useProgram";
import { PublicKey } from "@solana/web3.js";
import { web3 } from "@project-serum/anchor";
import * as splToken from "@solana/spl-token";
import { useEffect, useState } from "react";

const associatedTokenProgram = splToken.ASSOCIATED_TOKEN_PROGRAM_ID;
const tokenProgram = splToken.TOKEN_PROGRAM_ID;

interface AccountData {
  authority: PublicKey;
  mintAuthority: PublicKey;
  mint: PublicKey;
  mintAuthorityBump: number;
}

const plantMintPubKey = new web3.PublicKey(
  "5g9NUc3A8qmez2QS7CNUSbPw7dcKM3zzj1Ld8cX2K1NQ"
);

export interface Addresses {
  treasury: PublicKey;
  treasuryMintAuthority: PublicKey;
  playerRewardDest: PublicKey;
  playerClicker: PublicKey;
  treasuryMint: PublicKey;
  plantMint: PublicKey;
  plant: PublicKey;
  planter: PublicKey;
  playerPlantRewardDest: PublicKey;
  plantBump: number;
}

export function useAddresses() {
  const wallet = useAnchorWallet();
  const program = useProgram();
  const [addresses, setAddresses] = useState<Addresses | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!wallet || !program) return;
      try {
        const [treasury] = await web3.PublicKey.findProgramAddress(
          [Buffer.from("treasury")],
          program.idling.programId
        );

        const [treasuryMintAuthority] = await web3.PublicKey.findProgramAddress(
          [Buffer.from("treasury"), Buffer.from("mint")],
          program.idling.programId
        );
        let data: null | AccountData = null;
        if (program?.idling.account.treasury) {
          data = (await program.idling.account.treasury.fetchNullable(
            treasury
          )) as AccountData;
        }
        console.log("data", data);
        if (!data) {
          throw new Error("Unable to gather metadata");
        }

        const playerRewardDest = await splToken.Token.getAssociatedTokenAddress(
          associatedTokenProgram,
          tokenProgram,
          data.mint,
          wallet.publicKey
        );
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
          treasury,
          treasuryMintAuthority,
          playerRewardDest,
          playerClicker,
          treasuryMint: data.mint,
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
