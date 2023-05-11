import React, {useContext, useState} from 'react';
import {authFire} from "../../firebase";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../auth.context.provider";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../firebase";
import './list.css'
import MemoCreate from "./memo.create";

type MemoListType = {
  title:string,
  contents:string
}[];

function List() {
  const isLoggedIn = useContext(AuthContext);
  const uid = localStorage.getItem('uid')!
  const [memoList, setMemoList] = React.useState<MemoListType>([])
  React.useEffect(() => {
    getMemos().then()
  }, [])

  React.useEffect(() => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.')
      navigate('/signin')
    }
  }, [])

  const navigate = useNavigate()
  const signOutButton = async () => {
    await signOut(authFire)
    localStorage.removeItem('uid')
    navigate('/signin')
  }

  const getMemos = async () => {
    const memoData = await getDocs(collection(db, uid));
    const newMemoData = memoData.docs.map((doc) => {
      const data = doc.data()
      return {
        title:data.title,
        contents:data.contents
      }
    })
    console.log(newMemoData, '121212')
    setMemoList(newMemoData)

  }

  return (
    <>
      {isLoggedIn ? (
        <>
          <div className='listMemoArea'>
            {memoList.map((item,index)=>{
              return(
                <div key={index} className='listMemoEachLine'>
                  {item.title}
                </div>
              )
            })}
            <div className='listMemoSignout' onClick={() => signOutButton()}>로그아웃</div>
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
