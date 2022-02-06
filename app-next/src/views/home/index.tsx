import { FC } from "react";

export const HomeView: FC = ({}) => {
  return (
    <div className="hero mx-auto p-4 min-h-16 py-4">
      <div className="hero-content flex flex-col max-w-lg">
        Welcome to the world of tomorrow!
        <img src="/images/farm.jpg" className="h-40" />
      </div>
    </div>
  );
};
