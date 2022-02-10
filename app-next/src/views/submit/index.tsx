// Next, React
import { FC } from "react";

export const SubmitView: FC = ({}) => {
  return (
    <div className="hero mx-auto min-h-16">
      <div className="hero-content flex flex-col max-w-lg justify-center">
        <h2 className="text-xl">Show me what you got</h2>
        <div className="container mx-auto ">
          <div className="flex justify-center">
            <img src="/images/show_me.png" className="h-40" />
          </div>
          <button className="btn px-8 m-2 bg-blue-600 hover:bg-blue-800">
            Submit tokens for judging
          </button>
        </div>
      </div>
    </div>
  );
};
