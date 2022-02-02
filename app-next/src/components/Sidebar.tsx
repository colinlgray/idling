import { FC } from "react";

export const Sidebar: FC = () => {
  return (
    <aside className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-gray-900">
      <div className="sidebar-header flex items-center justify-center py-4">
        <div className="inline-flex">
          <a href="#" className="inline-flex flex-row items-center">
            <h1 className="leading-10 text-4xl pb-2 font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
              Idling
            </h1>
          </a>
        </div>
      </div>
      <div className="sidebar-content px-4 py-6">
        <div className="flex flex-col w-full">
          <div className="my-px">
            <div className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-100 bg-gray-700">
              <span className="flex items-center justify-center text-lg text-gray-400">
                💐
              </span>
              <span className="ml-3">Available Plants</span>
            </div>
          </div>
          <div className="my-px">
            <div className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-100 bg-gray-700">
              <span className="flex items-center justify-center text-lg text-gray-400">
                💰
              </span>
              <span className="ml-3">Buff Shop</span>
            </div>
          </div>
          <div className="my-px">
            <div className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-100 bg-gray-700">
              <span className="flex items-center justify-center text-lg text-gray-400">
                👨‍🌾
              </span>
              <span className="ml-3">Profile</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
