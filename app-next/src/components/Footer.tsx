import { FC } from "react";

export const Footer: FC = () => {
  return (
    <footer className="footer px-4 py-6">
      <div className="flex md:hidden">
        <div className="my-px">
          <div className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-100 bg-gray-700">
            <span className="flex items-center justify-center text-lg text-gray-400">
              💐
            </span>
          </div>
        </div>
        <div className="my-px">
          <div className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-100 bg-gray-700">
            <span className="flex items-center justify-center text-lg text-gray-400">
              💰
            </span>
          </div>
        </div>
        <div className="my-px">
          <div className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-100 bg-gray-700">
            <span className="flex items-center justify-center text-lg text-gray-400">
              👨‍🌾
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
