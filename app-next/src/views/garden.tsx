// Next, React
import { FC } from "react";

export const GardenView: FC = ({}) => {
  return (
    <div className="hero mx-auto p-4 min-h-16 py-4">
      <div className="hero-content flex flex-col max-w-lg justify-center">
        <h2 className="text-xl">Your Garden:</h2>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex justify-center text-6xl border-2 border-gray-300 rounded-xl p-6 ">
              1
            </div>
            <div className="flex justify-center text-6xl border-2 border-gray-300 rounded-xl p-6 ">
              2
            </div>
            <div className="flex justify-center text-6xl border-2 border-gray-300 rounded-xl p-6 ">
              3
            </div>
            <div className="flex justify-center text-6xl border-2 border-gray-300 rounded-xl p-6 ">
              4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
