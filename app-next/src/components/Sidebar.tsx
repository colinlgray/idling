import { FC } from "react";

export const Sidebar: FC = () => {
  return (
    <aside className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-indigo-500">
      <div className="sidebar-header flex items-center justify-center py-4">
        <div className="inline-flex">
          <a href="#" className="inline-flex flex-row items-center">
            🌱
            <span className="leading-10 text-gray-100 text-2xl font-bold ml-1 uppercase">
              Idling
            </span>
          </a>
        </div>
      </div>
      <div className="sidebar-content px-4 py-6">
        <div className="flex flex-col w-full">
          <div className="my-px">
            <div className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-700 bg-gray-100">
              <span className="flex items-center justify-center text-lg text-gray-400">
                💐
              </span>
              <span className="ml-3">Available Plants</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
