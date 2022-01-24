import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useProgram } from ".";
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

interface Addresses {
  treasury: PublicKey;
}

export function usePlantAddresses() {
  const wallet = useAnchorWallet();
  const program = useProgram();
  const [addresses, setAddresses] = useState<Addresses | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!wallet || !program) return;
      const [treasury] = await web3.PublicKey.findProgramAddress(
        [Buffer.from("treasury")],
        program.idling.programId
      );

      setAddresses({
        treasury,
      });
    };

    fetchAddresses();
  }, [wallet, program]);

  return addresses;
}
