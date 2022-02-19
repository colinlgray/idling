import create, { State } from "zustand";
import { deserializeAccount } from "../utils/deserialize";
import { Connection } from "@solana/web3.js";

interface UserTokenBalanceStore extends State {
  balance: number;
  getUserTokenBalance: (connection: Connection, addresses: any) => void;
  update: (s: Partial<UserTokenBalanceStore>) => void;
}

const useUserTokenBalanceStore = create<UserTokenBalanceStore>((set, _get) => ({
  balance: 0,
  update: (newBalance) => {
    set((s) => {
      s.balance = newBalance.balance;
    });
  },
  getUserTokenBalance: async (connection, addresses) => {
    let balance = 0;
    if (addresses) {
      try {
        const playerDestData = await connection.getAccountInfo(
          addresses.playerRewardDest
        );
        if (playerDestData?.data) {
          const destData = deserializeAccount(playerDestData.data);
          balance = destData.amount.toNumber();
        }
      } catch (e) {
        console.log(`error getting balance: `, e);
      }
    }

    set((s) => {
      s.balance = balance;
    });
  },
}));

export default useUserTokenBalanceStore;
