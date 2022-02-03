import { FC } from "react";
import Link from "next/link";

export const Footer: FC = () => {
  return (
    <footer className="footer px-4 py-6">
      <div className="flex md:hidden">
        <div className="my-px">
          <Link href="/">
            <a className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-100 bg-gray-700">
              <span className="flex items-center justify-center text-lg text-gray-400">
                💐
              </span>
            </a>
          </Link>
        </div>
        <div className="my-px">
          <Link href="/shop">
            <div className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-100 bg-gray-700">
              <span className="flex items-center justify-center text-lg text-gray-400">
                💰
              </span>
            </div>
          </Link>
        </div>
        <div className="my-px">
          <Link href="/profile">
            <div className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-100 bg-gray-700">
              <span className="flex items-center justify-center text-lg text-gray-400">
                👨‍🌾
              </span>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  );
};
