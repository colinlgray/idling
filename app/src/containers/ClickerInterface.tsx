import { FC } from "react";
import { useProgram } from "../hooks";

interface Props {}
export const ClickerInterface: FC<Props> = () => {
  const program = useProgram();
  console.log("AHHH", program);
  return (
    <div className="flex justify-center">
      <button
        className="bg-blue-500 hover:bg-blue-700 font-bold py-1 px-2 rounded"
        onClick={() => {
          console.log("something");
        }}
      >
        ???
      </button>
    </div>
  );
};
