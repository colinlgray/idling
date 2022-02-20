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

export interface Addresses {
  treasury: PublicKey;
  treasuryMintAuthority: PublicKey;
  playerRewardDest: PublicKey;
  playerClicker: PublicKey;
  treasuryMint: PublicKey;
  leaderboard: PublicKey;
  playerEntry: PublicKey;
}

export function useAddresses(): Addresses | null {
  const wallet = useAnchorWallet();
  const program = useProgram();
  const [addresses, setAddresses] = useState<Addresses | null>(null);
  const week = "0";
  const year = "2022";

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!wallet || !program) return;
      try {
        const [treasury] = await web3.PublicKey.findProgramAddress(
          [Buffer.from("treasury")],
          program.idling.programId
        );

        const [leaderboard] = await web3.PublicKey.findProgramAddress(
          [Buffer.from(week), Buffer.from(year)],
          program.leaderboard.programId
        );

        const [playerEntry] = await web3.PublicKey.findProgramAddress(
          [leaderboard.toBuffer(), wallet.publicKey.toBuffer()],
          program.leaderboard.programId
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

        setAddresses({
          treasury,
          treasuryMintAuthority,
          playerRewardDest,
          playerClicker,
          treasuryMint: data.mint,
          leaderboard,
          playerEntry,
        });
      } catch (e) {
        console.error(e);
      }
    };

    fetchAddresses();
  }, [wallet, program]);

  return addresses;
}
