import { FC } from "react";
import { useProgram, useAddresses } from "../hooks";
import { web3 } from "@project-serum/anchor";
import * as splToken from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { notify } from "../utils/notifications";
import useUserTokenBalanceStore from "../stores/useUserTokenBalanceStore";

const associatedTokenProgram = splToken.ASSOCIATED_TOKEN_PROGRAM_ID;
const tokenProgram = splToken.TOKEN_PROGRAM_ID;
const systemProgram = web3.SystemProgram.programId;
const rent = web3.SYSVAR_RENT_PUBKEY;

interface Props {
  onClick?: () => void;
}
export const TokenFaucet: FC<Props> = (props) => {
  const addresses = useAddresses();
  const program = useProgram();
  const { publicKey } = useWallet();
  const balance = useUserTokenBalanceStore((s) => s.balance);
  const { update } = useUserTokenBalanceStore();

  let txId: string;
  const handleClick = async () => {
    try {
      if (!program || !publicKey || !addresses) {
        throw new Error("Program does not exist");
      }

      const data = await program.idling.account.treasury.fetchNullable(
        addresses.treasury
      );
      if (!data) {
        throw new Error("Unable to gather metadata");
      }

      txId = await program.idling.rpc.doClick({
        accounts: {
          owner: publicKey,
          clicker: addresses.playerClicker,
          treasury: addresses.treasury,
          treasuryMintAuthority: addresses.treasuryMintAuthority,
          treasuryMint: data.mint,
          rewardDest: addresses.playerRewardDest,
          tokenProgram,
          systemProgram,
          associatedTokenProgram,
          rent,
        },
      });
      notify({
        type: "success",
        message: "You received some tokens!",
        txid: txId,
      });
    } catch (e: any) {
      notify({
        type: "error",
        message: `Transaction failed!`,
        description: e?.message,
        txid: txId,
      });
    }
  };
  return (
    <div>
      <div className="flex justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-700 font-bold py-1 px-2 rounded"
          onClick={async () => {
            await handleClick();
            if (props.onClick) {
              props.onClick();
            }
            update({ balance: balance + 50 });
          }}
        >
          Get tokens
        </button>
      </div>
    </div>
  );
};
