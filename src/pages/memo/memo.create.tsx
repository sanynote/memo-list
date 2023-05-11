import React from 'react';
import {collection, addDoc} from "firebase/firestore";
import {db} from "../../firebase";
import './memo.create.css'

function MemoCreate() {
  const uid = localStorage.getItem('uid')!

  const createMemo = async () => {
    try {
      const docRef = await addDoc(collection(db, uid), {
        title: "룰루",
        contents: "룰루의 킹받는 첫 게시글",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  return (
    <div>

      <div onClick={() => createMemo()}>
        메모 등록하기
      </div>
    </div>

  );
}

export default MemoCreate;
