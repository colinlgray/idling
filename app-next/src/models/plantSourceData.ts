import { PublicKey } from "@solana/web3.js";

interface Source {
  plantMintPubKey: PublicKey;
  emojiIcon: string;
}
export const plantSourceData: Source[] = [
  {
    plantMintPubKey: new PublicKey(
      "5g9NUc3A8qmez2QS7CNUSbPw7dcKM3zzj1Ld8cX2K1NQ"
    ),
    emojiIcon: "🌾",
  },
  {
    plantMintPubKey: new PublicKey(
      "AaSSrbum5XC3yz6rE2mZoQX2d5omj3xdLK8SFw5WXhbG"
    ),
    emojiIcon: "🌳",
  },
  {
    plantMintPubKey: new PublicKey(
      "FRrZRJBnopuT1tBe1g46AUvdffnJxA7myfmy4BYXNgxz"
    ),
    emojiIcon: "🌱",
  },
  {
    plantMintPubKey: new PublicKey(
      "ARDnMCqDgMLSBBPLcgD6RsMW58efK4XNnLqGd7TMqERg"
    ),
    emojiIcon: "🌿",
  },
];
