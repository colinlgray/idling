import { FC } from "react";
import Link from "next/link";
import { useRouter, NextRouter } from "next/router";

interface ListElementProps {
  label: string;
  path: string;
  emoji: string;
  router: NextRouter;
}

const ListElement: FC<ListElementProps> = (props) => {
  let linkClassName =
    "flex flex-row items-center h-10 px-3 rounded-lg text-gray-100 bg-gray-700 border border-2";
  if (props.router.pathname === props.path) {
    linkClassName += " border-gray-100";
  } else {
    linkClassName += " border-gray-700";
  }
  return (
    <div className="my-px">
      <Link href={props.path}>
        <a className={linkClassName}>
          <span className="flex items-center justify-center text-lg text-gray-400">
            {props.emoji}
          </span>
        </a>
      </Link>
    </div>
  );
};

export const Footer: FC = () => {
  const router = useRouter();
  return (
    <footer className="footer px-4 py-6">
      <div className="flex md:hidden">
        <ListElement label="Home" emoji="🏠" path="/" router={router} />
        <ListElement label="Faucet" emoji="🚰" path="/faucet" router={router} />
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
    </footer>
  );
};
