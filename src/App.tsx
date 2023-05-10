import React, {useState} from 'react';
import './App.css';
import {RouterProvider} from "react-router-dom";
import {router} from './routes/main.routes'
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
