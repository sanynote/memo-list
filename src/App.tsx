import React, {createContext} from 'react';
import './App.css';
import {RouterProvider} from "react-router-dom";
import {router} from './routes/main.routes'
import {AuthContextProvider} from "./auth.context.provider";


function App() {


  return (
    <AuthContextProvider>
      <RouterProvider router={router}/>
    </AuthContextProvider>

  );
}

export default App;
