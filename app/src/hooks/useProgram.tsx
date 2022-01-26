import { Idl, Program, Provider } from "@project-serum/anchor";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { ConfirmOptions, PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import idl from "../idl/idling.json";
import plantsIdl from "../idl/idle_plants.json";

const opts: ConfirmOptions = {
  preflightCommitment: "processed",
};
// LocalHost program id:
const localProgramId = "3gTqaTAKfq6h41XDSFb2iUZt8bXFKTpbU3nsxbBzipcN";

const programId = new PublicKey(localProgramId);
export function useProgram() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  // console.log("idling", workspace.Idling);
  // console.log("IdlePlants", workspace.IdlePlants);

  return useMemo(() => {
    if (!wallet) return;
    const provider = new Provider(connection, wallet, opts);
    return {
      idling: new Program(idl as Idl, programId, provider),
      idlePlants: new Program(plantsIdl as Idl, programId, provider),
    };
  }, [connection, wallet]);
}
