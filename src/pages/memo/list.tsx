import React, {useContext, useState} from 'react';
import {authFire} from "../../firebase";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../auth.context.provider";
import MemoCreate from "./memo.create";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../firebase";

function List() {
  const isLoggedIn = useContext(AuthContext);
  React.useEffect(() => {
    getMemos().then()
  }, [])

  // React.useEffect(()=>{
  //   if(!isLoggedIn){
  //     alert('로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.')
  //     navigate('/signin')
  //   }
  //   // isLoggedIn true 일때도 이 훅 안에서는 false 로 읽혀서
  //   // -> 로그인 하라는 알림과 함께 로그인페이지로 돌아감
  //   // -> 전역관리가 안되어있어서 일어난 일인줄알고 context api 적용했는데도 false로 먼저 읽힘
  //
  // },[])

  const navigate = useNavigate()
  const signOutButton = async () => {
    await signOut(authFire)
    localStorage.removeItem('uid')
    navigate('/signin')
  }

  const getMemos = async () => {
    const querySnapshot = await getDocs(collection(db, "memos"));
    // querySnapshot.forEach((doc) => {
    //   // 가져온 모든 문서들을 확인
    //   console.log(doc.id, " => ", doc.data());
    // });

    console.log(querySnapshot,'ffff')
  }

  return (
    <>
      {isLoggedIn ? (
        <>
          <div>
            {authFire.currentUser?.uid} 메모리스트입니다.


            <div onClick={() => signOutButton()}>로그아웃</div>
          </div>
          <MemoCreate/>
        </>
      ) : (
        <div>로그인 해주세요</div>
      )
      }

    </>
  );
}

export default List;
