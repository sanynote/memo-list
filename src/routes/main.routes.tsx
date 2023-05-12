import {Navigate,createBrowserRouter} from "react-router-dom";
import NotFound from "../pages/not.found";
import AuthPage from "../pages/auth/auth.page";
import List from "../pages/memo/list";
import React from "react";
import MemoDetail from "../pages/memo/memo.detail";

const routes = [
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: '/',
    element: <Navigate to= 'signin'/>,
  },
  {
    path:'/signin',
    name:'로그인/회원가입',
    element:<AuthPage/>
  },
  {
    path:'/list',
    name:'메모리스트',
    element:<List/>,
    children:[
      {
        path: "detail/:id",
        element:<MemoDetail/>
      },
    ]
  }
  ]


export const router = createBrowserRouter(routes);
