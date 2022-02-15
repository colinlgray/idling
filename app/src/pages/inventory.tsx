import type { NextPage } from "next";
import { InventoryView } from "../views";

import { AppTitle } from "../components/AppTitle";
const Inventory: NextPage = (props) => {
  return (
    <div>
      <AppTitle />
      <InventoryView />
    </div>
  );
};

export default Inventory;
