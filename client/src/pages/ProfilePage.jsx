import { useContext, useState } from "react";
import { UserContext } from "../userContext";
import {  Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNavigation from "../AccountNavigation";
export default function AccountPage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  1;
  if (subpage === undefined) {
    subpage = "profile";
  }
  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }
  if (!ready) {
    return <div>loading...</div>;
  }
  // console.log(user,ready,Object.keys(user).length);

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  // console.log(subpage);
  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div>
      <AccountNavigation />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            Log out
          </button>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
}
