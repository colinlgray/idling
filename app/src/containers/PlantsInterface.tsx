import { usePlantAddresses } from "../hooks";
import { useConnection } from "@solana/wallet-adapter-react";
import { deserializeAccount } from "../common/util";
import { useEffect, useState, FC } from "react";

interface Props {}

export const PlantsInterface: FC<Props> = (props) => {
  // Check for plants
  // If no plant option to create one
  // otherwise show plant
  const addresses = usePlantAddresses();
  if (addresses !== null) {
    console.log("addresses", addresses);
  }

  return <div className="flex justify-start">Plants</div>;
};
