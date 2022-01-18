import { FC } from "react";
import { useProgram, useNotify } from "../hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { web3 } from "@project-serum/anchor";
import * as splToken from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

const associatedTokenProgram = splToken.ASSOCIATED_TOKEN_PROGRAM_ID;
const tokenProgram = splToken.TOKEN_PROGRAM_ID;
const systemProgram = web3.SystemProgram.programId;
const rent = web3.SYSVAR_RENT_PUBKEY;

interface AccountData {
  authority: PublicKey;
  mintAuthority: PublicKey;
  mint: PublicKey;
  mintAuthorityBump: number;
}

interface Props {}
export const ClickerInterface: FC<Props> = () => {
  const program = useProgram();
  const { publicKey } = useWallet();

  const notify = useNotify();
  const handleClick = async () => {
    try {
      if (!program || !publicKey) {
        throw new Error("Program does not exist");
      }
      const [treasury] = await web3.PublicKey.findProgramAddress(
        [Buffer.from("treasury")],
        program.programId
      );

      const [treasuryMintAuthority] = await web3.PublicKey.findProgramAddress(
        [Buffer.from("treasury"), Buffer.from("mint")],
        program.programId
      );
      let data: null | AccountData = null;
      if (program?.account.treasury) {
        data = (await program.account.treasury.fetchNullable(
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
        publicKey
      );

      const [playerClicker] = await web3.PublicKey.findProgramAddress(
        [Buffer.from("clicker"), publicKey.toBuffer()],
        program.programId
      );

      await program.rpc.doClick({
        accounts: {
          owner: publicKey,
          clicker: playerClicker,
          treasury,
          treasuryMintAuthority,
          treasuryMint: data.mint,
          rewardDest: playerRewardDest,
          tokenProgram,
          systemProgram,
          associatedTokenProgram,
          rent,
        },
      });

      notify("success", "SUCCESS!");
    } catch (e) {
      if ((e as any).message) {
        notify("error", `${(e as any).message}`);
      } else {
        notify("error", "something went wrong");
      }
    }
  };

  return (
    <div className="flex justify-center">
      <button
        className="bg-blue-500 hover:bg-blue-700 font-bold py-1 px-2 rounded"
        onClick={() => {
          handleClick();
        }}
      >
        ???
      </button>
    </div>
  );
};
