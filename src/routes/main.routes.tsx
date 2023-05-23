import {Navigate, createBrowserRouter} from "react-router-dom";
import NotFound from "../pages/not.found";
import AuthPage from "../pages/auth/auth.page";
import MemoList from "../pages/memo/memo.list";
import React from "react";
import MemoDetail from "../pages/memo/memo.detail";
import MemoCreate from "../pages/memo/memo.create";

const routes = [
  {
    path: '*',
    element: <NotFound/>,
  },
  {
    path: '/',
    element: <Navigate to='signin'/>,
  },
  {
    path: '/signin',
    name: '로그인/회원가입',
    element: <AuthPage/>
  },
  {
    path: '/list',
    name: '메모리스트',
    element: <MemoList/>,
    children: [
      {
        path: "detail/:id",
        element: <MemoDetail/>
      },
      {
        path: "write/write",
        element: <MemoCreate/>
      },
    ]
  }
]


export const router = createBrowserRouter(routes);
