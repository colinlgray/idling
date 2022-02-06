// Next, React
import { FC } from "react";
import { TokenFaucet } from "../../components/TokenFaucet";
import { useAddresses } from "../../hooks";
import { PlanterInterface } from "./planter";
import { plantSourceData } from "../../models/plantSourceData";

export const GardenView: FC = ({}) => {
  const addresses = useAddresses();
  let content;
  if (!addresses) {
    content = "loading";
  } else {
    content = [];
  }
  return (
    <div className="hero mx-auto min-h-16">
      <div className="hero-content flex flex-col max-w-lg justify-center">
        <h2 className="text-xl">Your Garden:</h2>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {plantSourceData.map((p) => (
              <PlanterInterface
                plantMint={p.plantMintPubKey}
                label={p.emojiIcon}
              />
            ))}
          </div>
        </div>
        <div className="py-4">
          <TokenFaucet />
        </div>
      </div>
    </div>
  );
};
