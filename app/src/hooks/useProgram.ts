import { Idl, Program, Provider } from "@project-serum/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { ConfirmOptions, PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { useConnection } from "../contexts/connection";
import idl from "../idl/idling.json";

const opts: ConfirmOptions = {
  preflightCommitment: "processed",
};
(window as any).asd = idl;
// LocalHost program id:
const localProgramId = "3gTqaTAKfq6h41XDSFb2iUZt8bXFKTpbU3nsxbBzipcN";

const programId = new PublicKey(localProgramId);
export function useProgram() {
  const wallet = useAnchorWallet();
  console.log("wallet", wallet);
  const connection = useConnection();

  return useMemo(() => {
    if (!wallet) return;
    const provider = new Provider(connection, wallet, opts);
    return new Program(idl as Idl, programId, provider);
  }, [connection, wallet]);
}
