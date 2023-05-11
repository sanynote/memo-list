import React from 'react';
  import { collection, addDoc } from "firebase/firestore";
import {db} from "../../firebase";
function MemoCreate() {

  const createMemo = async () => {
    try {
      const docRef = await addDoc(collection(db, "memos"), {
        title: "hello",
        contents: "hihihi",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  return (
    <div onClick={()=>createMemo()}>
      메모 등록하기
    </div>
  );
}

export default MemoCreate;
