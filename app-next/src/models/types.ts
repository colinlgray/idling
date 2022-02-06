import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";

export type EndpointTypes = "mainnet" | "devnet" | "localnet";

export interface Planter {
  timesWatered: number;
  lastWatered: BN;
  owner: PublicKey;
  plant: PublicKey;
  createdAt: BN;
}

export interface Plant {
  cost: BN;
  maxGrowth: BN;
  requiredWaterings: number;
  timeTillThirsty: BN;
}
