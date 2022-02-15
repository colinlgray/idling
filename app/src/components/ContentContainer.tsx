import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export const ContentContainer: FC = (props) => {
  const { publicKey } = useWallet();
  let content = props.children;
  if (!publicKey) {
    content = "Please connect your wallet";
  }
  return (
    <div className="flex-1 drawer h-52">
      <input id="my-drawer" type="checkbox" className="grow drawer-toggle" />
      <div className="flex flex-col items-center  drawer-content">
        {content}
      </div>
    </div>
  );
};
