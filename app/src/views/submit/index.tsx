// Next, React
import { FC, useState, useEffect } from "react";
import { plantSourceData, PlantSource } from "models/plantSourceData";
import { usePlanterAddresses, useAddresses, useProgram } from "hooks";
import { useConnection } from "@solana/wallet-adapter-react";
import { programs } from "@metaplex/js";

const EntryItem: FC<{ source: PlantSource }> = ({ source }) => {
  const { connection } = useConnection();
  const [inputVal, setVal] = useState("0");
  const [amount, setAmount] = useState(0);
  const plantAddresses = usePlanterAddresses(source.plantMintPubKey);
  const program = useProgram();
  useEffect(() => {
    const fetch = async () => {
      if (!plantAddresses) return;
      const amt = await connection.getAccountInfo(
        plantAddresses.playerPlantRewardDest
      );
      if (amt) {
        const parsed = programs.core.deserialize(amt.data);
        setAmount(parsed.amount.toNumber());
      }
    };
    fetch();
  }, [plantAddresses]);

  return (
    <div className="grid grid-cols-3 cursor-pointer p-1 m-1">
      <div>
        <div className="flex justify-center text-3xl border-2 border-gray-300 rounded-xl p-3 cursor-pointer relative">
          <span className="absolute text-xs top-1 right-1">{amount || 0}</span>
          {source.emojiIcon}
        </div>
      </div>
      <div className="flex px-2 justify-center">
        <input
          value={inputVal}
          min="0"
          max={amount}
          type="range"
          className="w-24 border-2 border-gray-100 rounded text-center text-xl"
          onChange={(i) => console.log(setVal(i.target.value))}
          onFocus={(evt) => {
            evt.target.select();
          }}
        />
      </div>
      <div className="flex px-2 justify-center items-center">
        {inputVal}/{amount}
        <a
          className="px-2 underline"
          onClick={() => {
            setVal(amount.toString());
          }}
        >
          max
        </a>
      </div>
    </div>
  );
};

const SubmitModal: FC<{}> = () => {
  const addresses = useAddresses();
  return (
    <>
      <div className="bg-gray-500 rounded">
        <div className="flex flex-col items-center">
          {plantSourceData.map((p) => (
            <EntryItem key={p.name} source={p} />
          ))}
        </div>
        <div className="flex justify-end p-2">
          <label className="btn btn-primary">Submit</label>
        </div>
      </div>
    </>
  );
};

export const SubmitView: FC = ({}) => {
  return (
    <>
      <div className="hero mx-auto h-60">
        <div className="hero-content flex flex-col max-w-lg justify-center">
          <h2 className="text-xl">Show me what you got</h2>
          <div className="container mx-auto ">
            <div className="flex justify-center py-2 md:hidden">
              <img src="/images/show_me.png" className="h-40" />
            </div>

            <SubmitModal />
          </div>
        </div>
      </div>
    </>
  );
};
