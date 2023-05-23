import React, {createContext, ReactNode} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import {authFire} from "./firebase";

export const AuthContext = createContext(false);

interface Props {
  children:ReactNode
}

export const AuthContextProvider = ({children} : Props) => {
  const uidCheck = localStorage.getItem('uid') ? true : false
  const [isLoggedIn, setIsLoggedIn] = React.useState(uidCheck);
  React.useEffect(() => {
    onAuthStateChanged(authFire, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

  }, [])

  return (
    <AuthContext.Provider value={isLoggedIn}>{children}</AuthContext.Provider>
  );
}
