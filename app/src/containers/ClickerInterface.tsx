import { FC } from "react";
import { useProgram } from "../hooks";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, web3 } from "@project-serum/anchor";
import * as SplToken from "@solana/spl-token";

interface Props {}
export const ClickerInterface: FC<Props> = () => {
  const program = useProgram();
  const { publicKey } = useWallet();
  (window as any).asd = program?.account.treasury;

  const handleClick = async () => {
    if (!program || !publicKey) {
      throw new Error("Program does not exist");
    }
    const [treasury] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("treasury")],
      program.programId
    );

    const [treasuryMintAuthority, treasuryMintAuthorityBump] =
      await web3.PublicKey.findProgramAddress(
        [Buffer.from("treasury"), Buffer.from("mint")],
        program.programId
      );
    if (program?.account.treasury) {
      const data = await program.account.treasury.fetchNullable(treasury);
      console.log("data", data);
    }
    //   treasuryMint = await splToken.Token.createMint(
    //     provider.connection,
    //     treasuryAuthority,
    //     treasuryMintAuthority,
    //     null,
    //     3,
    //     splToken.TOKEN_PROGRAM_ID
    //   );

    // playerRewardDest = await treasuryMint.getOrCreateAssociatedAccountInfo(
    //     playerWallet.publicKey
    //   );

    const [playerClicker] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("clicker"), publicKey.toBuffer()],
      program.programId
    );
    console.log("playerClicker", playerClicker);
    console.log("treasury", treasury);
    console.log("treasuryMintAuthority", treasuryMintAuthority);
    console.log("treasuryMint");
    console.log("playerRewardDest");
    // await program.rpc.doClick({
    //   accounts: {
    //     owner: publicKey,
    //     clicker: playerClicker,
    //     treasury,
    //     treasuryMintAuthority,
    //     treasuryMint: treasuryMint.publicKey,
    //     rewardDest: playerRewardDest,
    //     tokenProgram,
    //     systemProgram,
    //     associatedTokenProgram,
    //     rent,
    //   },
    // });
    console.log("done");
  };

  console.log("AHHH", program);
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
