import { PlantSource } from "models/plantSourceData";
import { Addresses } from "../../hooks/useAddresses";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Idl, Program, BN } from "@project-serum/anchor";
import { leaderboardIdlTwo } from "../../hooks/useProgram";

const systemProgram = SystemProgram.programId;
// const tokenProgram = splToken.TOKEN_PROGRAM_ID;

interface SubmitProps {
  plants: PlantSource[];
  amounts: number[];
  addresses: Addresses;
  owner: PublicKey;
  leaderboard: Program;
}
export const submitGoods = async ({
  plants,
  amounts,
  addresses,
  owner,
  leaderboard,
}: SubmitProps) => {
  console.log("plants", plants);
  console.log("addresses", addresses.leaderboard);
  console.log("leaderboard", leaderboard);
  // const playerPlantAcct = await connection.getAccountInfo(
  //   addresses.playerRewardDest
  // );
  // console.log("leaderboardPubkey", leaderboardPubkey);
  // console.log("playerEntryPubkey", playerEntryPubkey);
  // console.log("testPlant", testPlant);
  // console.log("testPlantMint.,testPlantMintpublicKey");
  // console.log("playerPlantAcct.,playerPlantAcctaddress");
  // console.log("tokenProgram", tokenProgram);
  // console.log("systemProgram", systemProgram);
  // console.log("rent", rent);

  async function createTransaction(amount: number, plant: PlantSource) {
    console.log(`create transaction for ${amount} ${plant.name}`);
    let tx = await leaderboard.rpc.submitPlant(new BN(amount), {
      accounts: {
        owner,
        leaderboard: addresses.leaderboard,
        entry: addresses.playerEntry,
        plant: plant.plantMintPubKey, // TODO: FIX THIS
        plantTokenAccount: plant.plantMintPubKey, // TODO: FIX THIS
        plantMint: plant.plantMintPubKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
    });
  }

  let txs = [];
  // amounts.forEach((a, idx) => {
  //   if (a > 0) {
  //     txs.push(createTransaction(a, plants[idx]));
  //   }
  // });
  return new Promise((res) => {
    setTimeout(res, 1000);
  });

  // TODO: Use transaction
  // let transaction = new Transaction().add(...txs);
  // return await props.wallet.sendTransaction(
  //   transaction,
  //   props.connection
  // );
};
