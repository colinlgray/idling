import { PlantSource } from "models/plantSourceData";
interface SubmitProps {
  plants: PlantSource[];
  amounts: number[];
}
export const submitGoods = async ({ plants, amounts }: SubmitProps) => {
  let txs = [];
  amounts.forEach((a, idx) => {
    if (a > 0) {
      txs.push(createTransaction(a, plants[idx]));
    }
  });
  return null;
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
