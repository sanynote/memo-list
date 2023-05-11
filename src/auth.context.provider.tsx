import React, {createContext, useContext} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import {authFire} from "./firebase";

export const AuthContext = createContext(false);

export const AuthContextProvider = ({children}: any) => {
  const uidCheck = localStorage.getItem('uid') ? true : false
  const [isLoggedIn, setIsLoggedIn] = React.useState(uidCheck);
  const [init, setInit] = React.useState(false);
  React.useEffect(() => {
    onAuthStateChanged(authFire, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });

  }, [])

  return (
    <AuthContext.Provider value={isLoggedIn}>{children}</AuthContext.Provider>
  );
}
