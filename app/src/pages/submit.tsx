import type { NextPage } from "next";
import { SubmitView } from "../views";
import { AppTitle } from "../components/AppTitle";

const Submit: NextPage = (props) => {
  return (
    <div>
      <AppTitle />
      <SubmitView />
    </div>
  );
};

export default Submit;
