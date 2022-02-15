import { PublicKey } from "@solana/web3.js";

export interface PlantSource {
  plantMintPubKey: PublicKey;
  emojiIcon: string;
  name: string;
}

export const plantSourceData: PlantSource[] = [
  {
    plantMintPubKey: new PublicKey(
      "5g9NUc3A8qmez2QS7CNUSbPw7dcKM3zzj1Ld8cX2K1NQ"
    ),
    emojiIcon: "🌾",
    name: "Rice",
  },
  {
    plantMintPubKey: new PublicKey(
      "AaSSrbum5XC3yz6rE2mZoQX2d5omj3xdLK8SFw5WXhbG"
    ),
    emojiIcon: "🌳",
    name: "Branches",
  },
  {
    plantMintPubKey: new PublicKey(
      "FRrZRJBnopuT1tBe1g46AUvdffnJxA7myfmy4BYXNgxz"
    ),
    emojiIcon: "🌱",
    name: "Seedlings",
  },
  {
    plantMintPubKey: new PublicKey(
      "ARDnMCqDgMLSBBPLcgD6RsMW58efK4XNnLqGd7TMqERg"
    ),
    emojiIcon: "🌿",
    name: "Herbs",
  },
];
