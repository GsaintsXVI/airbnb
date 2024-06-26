/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        console.log('profile', data)
        setUser(data);
        setReady(true);
      });
    }
  });
  return (

    <UserContext.Provider value={{ user, setUser, ready, setReady }}>
      {children}
    </UserContext.Provider>
  );
}
