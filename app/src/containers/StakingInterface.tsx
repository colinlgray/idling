import { FC } from "react";
import { NFTRow } from "./NFTRow";
import { programs } from "@metaplex/js";
import { UpdateFuncProps } from "./Router";
const headerClassName = "text-xl font-bold border-b-2 mb-6 py-2";
interface Props {
  walletNfts: programs.metadata.Metadata[];
  onNftUpdated: (props: UpdateFuncProps) => void;
}
export const StakingInterface: FC<Props> = ({ walletNfts, onNftUpdated }) => {
  if (walletNfts.length === 0) {
    return (
      <div>
        It looks like you don't have any NFTs. You can purchase them on
        the&nbsp;
        <a className="underline" href="https://digitaleyes.market">
          secondary market
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className={!walletNfts?.length ? "hidden" : ""}>
        <h2 className={headerClassName}>Your nfts: {walletNfts?.length}</h2>
        {walletNfts?.map((nft) => {
          return (
            <NFTRow
              key={nft.pubkey.toString()}
              nft={nft}
              isStaked={false}
              onChange={(nftMoved) => {
                onNftUpdated({ previousLocation: "wallet", nftMoved });
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
