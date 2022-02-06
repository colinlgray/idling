// Next, React
import { FC } from "react";

interface ElementProps {
  label: string;
}

const GardenElement: FC<ElementProps> = (props) => {
  return (
    <div className="flex justify-center text-6xl border-2 border-gray-300 rounded-xl p-6 ">
      {props.label}
    </div>
  );
};

export const GardenView: FC = ({}) => {
  return (
    <div className="hero mx-auto min-h-16">
      <div className="hero-content flex flex-col max-w-lg justify-center">
        <h2 className="text-xl">Your Garden:</h2>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <GardenElement label={"🌾"} />
            <GardenElement label={"🌿"} />
            <GardenElement label={"🌱"} />
            <GardenElement label={"🌳"} />
          </div>
        </div>
      </div>
    </div>
  );
};
