import { FC } from "react";
import { useRouter, NextRouter } from "next/router";
import Link from "next/link";

interface ListElementProps {
  label: string;
  path: string;
  emoji: string;
  router: NextRouter;
}

const ListElement: FC<ListElementProps> = (props) => {
  let linkClassName =
    "flex flex-row items-center h-10 px-3 rounded-lg text-gray-100 bg-gray-600 ";
  if (props.router.pathname === props.path) {
    linkClassName += " border border-gray-400";
  } else {
    linkClassName += "";
  }
  return (
    <div className="my-px">
      <Link href={props.path}>
        <a className={linkClassName}>
          <span className="flex items-center justify-center text-lg text-gray-400">
            {props.emoji}
          </span>
          <span className="ml-3">{props.label}</span>
        </a>
      </Link>
    </div>
  );
};

export const Sidebar: FC = () => {
  const router = useRouter();
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
          <ListElement label="Home" emoji="🏠" path="/" router={router} />
          <ListElement
            label="Faucet"
            emoji="🚰"
            path="/faucet"
            router={router}
          />
          <ListElement
            label="Your Garden"
            emoji="💐"
            path="/garden"
            router={router}
          />
          <ListElement
            label="Your Farmer"
            emoji="👨‍🌾"
            path="/profile"
            router={router}
          />
          <ListElement
            label="Item Shop"
            emoji="💰"
            path="/shop"
            router={router}
          />
        </div>
      </div>
    </aside>
  );
};
