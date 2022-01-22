import { FC, useState } from "react";
import { useProgram, useNotify, useMint } from "../hooks";
import { web3 } from "@project-serum/anchor";
import * as splToken from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

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

const deserializeAccount = (data: Buffer) => {
  const accountInfo = splToken.AccountLayout.decode(data);
  accountInfo.mint = new PublicKey(accountInfo.mint);
  accountInfo.owner = new PublicKey(accountInfo.owner);
  accountInfo.amount = splToken.u64.fromBuffer(accountInfo.amount);

  if (accountInfo.delegateOption === 0) {
    accountInfo.delegate = null;
    accountInfo.delegatedAmount = new splToken.u64(0);
  } else {
    accountInfo.delegate = new PublicKey(accountInfo.delegate);
    accountInfo.delegatedAmount = splToken.u64.fromBuffer(
      accountInfo.delegatedAmount
    );
  }

  accountInfo.isInitialized = accountInfo.state !== 0;
  accountInfo.isFrozen = accountInfo.state === 2;

  if (accountInfo.isNativeOption === 1) {
    accountInfo.rentExemptReserve = splToken.u64.fromBuffer(
      accountInfo.isNative
    );
    accountInfo.isNative = true;
  } else {
    accountInfo.rentExemptReserve = null;
    accountInfo.isNative = false;
  }

  if (accountInfo.closeAuthorityOption === 0) {
    accountInfo.closeAuthority = null;
  } else {
    accountInfo.closeAuthority = new PublicKey(accountInfo.closeAuthority);
  }

  return accountInfo;
};

interface Props {}
export const ClickerInterface: FC<Props> = () => {
  const program = useProgram();
  const { connection } = useConnection();
  const { publicKey, ...remainingWallet } = useWallet();
  const [mintId, setMintId] = useState();
  const mint = useMint(mintId);

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

      const mintData = await connection.getAccountInfo(data.mint);

      if (!mintData?.data) {
        throw new Error("No mint data");
      }

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
      // const mintInfo = splToken.MintLayout.decode(mintData.data);
      // (window as any).asd;
      const playerDestData = await connection.getAccountInfo(playerRewardDest);
      if (!playerDestData?.data) {
        throw new Error("missing data!");
      }
      const destData = deserializeAccount(playerDestData.data);
      console.log("maybe this is the number?", destData.amount.toNumber());

      // await program.account.treasury.fetchNullable(playerRewardDest);
      // const treasuryMint = new splToken.Token(
      //   connection,
      //   data.mint,
      //   splToken.TOKEN_PROGRAM_ID,
      //   publicKey
      // );
      notify("success", "SUCCESS!");
    } catch (e) {
      if ((e as any).message) {
        console.error(e);
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
