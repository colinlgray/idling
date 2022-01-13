import { Idl, Program, Provider } from "@project-serum/anchor";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { ConfirmOptions, PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import idl from "../idl/idling.json";

const opts: ConfirmOptions = {
  preflightCommitment: "processed",
};

// LocalHost program id:
const localProgramId = "GS4dQdangqbtGJDJecgGscv6m5wmq7wYC6Q8DzCWXMxh";

const programId = new PublicKey(localProgramId);
export function useProgram() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  return useMemo(() => {
    if (!wallet) return;
    const provider = new Provider(connection, wallet, opts);
    return new Program(idl as Idl, programId, provider);
  }, [connection, wallet]);
}
