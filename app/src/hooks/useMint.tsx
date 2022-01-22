import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { AccountLayout, u64, MintInfo, MintLayout } from "@solana/spl-token";

export function useMint(key?: string | PublicKey) {
  const connection = useConnection();
  const [mint, setMint] = useState<MintInfo>();

  const id = typeof key === "string" ? key : key?.toBase58();

  useEffect(() => {
    console.log("would do something here with", id);
    if (!id) {
      return;
    }

    // cache
    //   .query(connection, id, MintParser)
    //   .then((acc) => setMint(acc.info as any))
    //   .catch((err) => console.log(err));

    // const dispose = cache.emitter.onCache((e) => {
    //   const event = e;
    //   if (event.id === id) {
    //     cache
    //       .query(connection, id, MintParser)
    //       .then((mint) => setMint(mint.info as any));
    //   }
    // });
  }, [connection, id]);

  return mint;
}
