import React from 'react';
import {authFire} from "../../firebase";
import {signOut} from "firebase/auth";

function List() {
  const signOutButton = async () => {
    await signOut(authFire)
  }
  return (
    <>
    <div>메모 리스트 페이지</div>
      <div onClick={()=>signOutButton()}>로그아웃</div>
  {authFire.currentUser && authFire.currentUser.email}
    </>
  );
}

export default List;
