import { PlantSource } from "models/plantSourceData";
import { Addresses } from "../../hooks/useAddresses";

interface SubmitProps {
  plants: PlantSource[];
  amounts: number[];
  addresses: Addresses;
}
export const submitGoods = async ({
  plants,
  amounts,
  addresses,
}: SubmitProps) => {
  console.log("plants", plants);
  console.log("addresses", addresses);
  console.log("playerWallet.,playerWalletpublicKey");
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

  let txs = [];
  amounts.forEach((a, idx) => {
    if (a > 0) {
      txs.push(createTransaction(a, plants[idx]));
    }
  });
  return new Promise((res) => {
    setTimeout(res, 1000);
  });
};

async function createTransaction(amount: number, plant: PlantSource) {
  console.log(`create transaction for ${amount} ${plant.name}`);
  // let tx = await leaderboard.rpc.submitPlant(new anchor.BN(1), {
  //   accounts: {
  //     owner: playerWallet.publicKey,
  //     leaderboard: leaderboardPubkey,
  //     entry: playerEntryPubkey,
  //     plant: testPlant,
  //     plantMint: testPlantMint.publicKey,
  //     plantTokenAccount: playerPlantAcct.address,
  //     tokenProgram,
  //     systemProgram,
  //     rent,
  //   },
  //   signers: [playerWallet],
  // });
}
