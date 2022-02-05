import fs from "fs";
import { workspace, web3, Program, Provider } from "@project-serum/anchor";
import { Idling } from "../target/types/idling";

export function loadKeypair(path: string): web3.Keypair {
  return web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(require("fs").readFileSync(path, "utf8")))
  );
}

export const plantMintKeypairs = [
  loadKeypair("./plant-mint-keypair-1.json"),
  loadKeypair("./plant-mint-keypair-2.json"),
  loadKeypair("./plant-mint-keypair-3.json"),
  loadKeypair("./plant-mint-keypair-4.json"),
];
export const treasuryKeypair = loadKeypair("./testkey.json");
export const playerKeypair = loadKeypair("./player-keypair.json");

export const airdrop = async (address: web3.PublicKey, amount: number) => {
  const provider = Provider.env();
  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(
      address,
      amount * web3.LAMPORTS_PER_SOL
    ),
    "confirmed"
  );
};

export const sleep = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
