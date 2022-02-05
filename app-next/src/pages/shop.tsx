import type { NextPage } from "next";
import { ShopView } from "../views";
import { AppTitle } from "../components/AppTitle";

const Shop: NextPage = (props) => {
  return (
    <div>
      <AppTitle />
      <ShopView />
    </div>
  );
};

export default Shop;
