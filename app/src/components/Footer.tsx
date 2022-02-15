import { FC } from "react";
import Link from "next/link";
import { useRouter, NextRouter } from "next/router";
import { appRoutes } from "../models/routes";

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
    linkClassName += " border-gray-700";
  } else {
    linkClassName += " border-gray-100";
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
        {appRoutes.map((r) => (
          <ListElement
            label={r.label}
            emoji={r.emoji}
            path={r.path}
            router={router}
            key={r.label}
          />
        ))}
      </div>
    </footer>
  );
};
