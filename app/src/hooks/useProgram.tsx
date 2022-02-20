import { Idl, Program, Provider } from "@project-serum/anchor";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { ConfirmOptions } from "@solana/web3.js";
import { useMemo } from "react";
import idl from "../idl/idling.json";
import plantsIdl from "../idl/idle_plants.json";
import leaderboardIdl from "../idl/leaderboard.json";

const opts: ConfirmOptions = {
  preflightCommitment: "processed",
};

const idlingProgramId = "3gTqaTAKfq6h41XDSFb2iUZt8bXFKTpbU3nsxbBzipcN";
const plantsProgramId = "4H8FuFgabDNba1S8KPLjcni2zBGV2GK8DeffDwtU535f";
const leaderboardProgramId = "4TytLcPefVMwAtTwDwMXBDQQKn1gG8CjejbVVqSouQQ2";

export function useProgram() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  return useMemo(() => {
    if (!wallet) return;
    const provider = new Provider(connection, wallet, opts);
    return {
      idling: new Program(idl as Idl, idlingProgramId, provider),
      idlePlants: new Program(plantsIdl as Idl, plantsProgramId, provider),
      leaderboard: new Program(
        leaderboardIdl as Idl,
        leaderboardProgramId,
        provider
      ),
    };
  }, [connection, wallet]);
}
``;
