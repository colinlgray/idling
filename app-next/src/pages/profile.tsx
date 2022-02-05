import type { NextPage } from "next";
import { ProfileView } from "../views";

import { AppTitle } from "../components/AppTitle";
const Profile: NextPage = (props) => {
  return (
    <div>
      <AppTitle />
      <ProfileView />
    </div>
  );
};

export default Profile;
