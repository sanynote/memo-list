import React, {createContext} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import {authFire} from "./firebase";

export const AuthContext = createContext(false);

export const AuthContextProvider = ({children}: any) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [init, setInit] = React.useState(false);
  console.log(isLoggedIn, '이게진짜로그이인')
  React.useLayoutEffect(() => {
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
